import {ParseUtil} from '../../utils/ParseUtil';
import {RandomUtil} from '../../utils/RandomUtil';

var lineReader = require('line-reader');

/**
 * Parse a list file like taunts, edge taunts, CBT instructions, etc.
 *
 */
export class ListParser {
    constructor(commandFiltersProcessor, vocabularyProcessor, uiDispatcher) {
        this.commandFiltersProcessor = commandFiltersProcessor;
        this.vocabularyProcessor = vocabularyProcessor;
        this.uiDispatcher = uiDispatcher;
        this._ignoredLine = false;
    }

    loadFile(file,callback) {
        this.loadFiles([file],callback);
    }

    /**
     * Parse the list of files. The files will be loaded in memory while they are parsed.
     * @param files The files to parse
     * @param callback The function called once the loading is done. If none is given, the loader will call startTaunting(). The callback doesn't take any parameter
     */
    loadFiles(files,callback) {
        this._lines = [];

        if(!callback) {
            callback = ()=> {
                this.startTaunting();
            }
        }

        var promisedFileParsers = this._createPromisedFileParsers(files);
        Promise.all(promisedFileParsers).then((allFilesLines)=>{
            allFilesLines.forEach((fileLines) => {
                this._lines.push(...fileLines);
            });
            callback();
        }).catch((e)=>{console.log(e);});
    }

    /**
     * Start taunting the user using random lines from the files loaded in this parser
     */
    startTaunting() {
        this.uiDispatcher.debug('-- Start taunting --');
        this._next();
    }

    /**
     * Stop the taunting
     * @param stoppedCallback
     */
    stop(stoppedCallback = function(){}) {
        this._stopCallback = stoppedCallback;
    }

    /**
     * Ignore the current line
     */
    ignoreLine() {
        this._ignoredLine = true;
    }

    _next() {
        if(this._stopCallback) {
            this.uiDispatcher.debug('-- Stop taunting --');
            this._stopCallback();
            return;
        }

        console.log("-------");
        setTimeout(()=>{
            this._displayLines(this.readRandomLineGroup());
        },5000);
    }

    /**
     * Read a random line from the files loaded by this parser
     * @returns {string} a line from the files
     */
    readRandomLine() {
        return this.readRandomLineGroup()[0];
    }

    /**
     * Read a randome line group from the files loaded by this parser
     * It's used for files containing several lines linked together like stroking_2 or stroking_3
     * @returns {array} An array of lines from the files
     */
    readRandomLineGroup() {
        var lines = this._lines[RandomUtil.getRandomInteger(0,this._lines.length-1)];
        return this._parseLineGroup(lines);
    }

    _parseLineGroup(lines) {
        var processedLines = [];
        lines.forEach((line) => {
            line = this.vocabularyProcessor.processVocabularyFilters(line, this);
            processedLines.push(this.commandFiltersProcessor.processFilters(line,this));
        });

        if(!this._ignoredLine) {
            return processedLines;
        } else {
            this._ignoredLine = false;
            return this.readRandomLineGroup();
        }
    }

    _displayLines(lines) {
        var line = lines.shift();
        line = this.commandFiltersProcessor.processCommands(line,this);
        this.uiDispatcher.displayText(line, ()=> {
            if(lines.length > 0) {
                this._displayLines(lines);
            } else {
                this._next();
            }
        });
    }

    _createPromisedFileParsers(files) {
        var promises = [];

        files.forEach((file)=>{
            (function(file) {
                promises.push(new Promise((resolve, reject) => {
                    var lineCounter = 0;
                    var lines = [];
                    var modulo = 1;
                    if (file.endsWith("_2.txt")) modulo = 2;
                    if (file.endsWith("_3.txt")) modulo = 3;

                    lineReader.eachLine(file, (line) => {
                        if (lineCounter % modulo == 0) {
                            lines.push([ParseUtil.clearCRLF(line)]);
                        } else {
                            lines[lines.length - 1].push(ParseUtil.clearCRLF(line));
                        }
                        lineCounter++;
                    }).then(()=> {
                        resolve(lines);
                    });
                }));
            })(file)
        });

        return promises;
    }
}