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

        commandFiltersProcessor.setListParser(this);
    }

    parseFile(file) {
        parseFiles([file]);
    }

    /**
     * Parse the list of files. The files will be loaded in memory while they are parsed.
     * @param files The files to parse
     */
    parseFiles(files) {
        this._lines = [];

        var promisedFileParsers = this._createPromisedFileParsers(files);
        Promise.all(promisedFileParsers).then((allFilesLines)=>{
            allFilesLines.forEach((fileLines) => {
                this._lines.push(...fileLines);
            });
            this._next();
        });
    }

    /**
     * Stop the taunting
     * @param stoppedCallback
     */
    stop(stoppedCallback) {
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
            this._stopCallback();
            return;
        }

        console.log("-------");
        this._ignoredLine = false;
        this._readRandomLineGroup();
    }

    /**
     * Read the next line of the file
     * @private
     */
    _readRandomLineGroup() {
        var lines = this._lines[RandomUtil.getRandomInteger(0,this._lines.length-1)];
        this._parseLineGroup(lines);
    }

    _parseLineGroup(lines) {
        var processedLines = [];
        lines.forEach((line) => {
            line = this.vocabularyProcessor.processVocabularyFilters(line);
            processedLines.push(this.commandFiltersProcessor.processCommands(line));
        });

        if(!this._ignoredLine ) {
            this.displayLines([...processedLines]);
        } else {
            this._next();
        }
    }

    displayLines(lines) {
        var line = lines.shift();
        this.uiDispatcher.displayText(line, ()=> {
            if(lines.length > 0) {
                this.displayLines(lines);
            } else {
                this._next();
            }
        });
    }

    _createPromisedFileParsers(files) {
        var promises = [];

        files.forEach((file)=>{
            promises.push(new Promise((resolve,reject) => {
                var lineCounter = 0;
                var lines = [];
                var modulo = 1;
                if(file.endsWith("_2.txt")) modulo = 2;
                if(file.endsWith("_3.txt")) modulo = 3;

                lineReader.eachLine(file, (line) => {
                    if(lineCounter%modulo == 0) {
                        lines.push([ParseUtil.clearCRLF(line)]);
                    } else {
                        lines[lines.length-1].push(ParseUtil.clearCRLF(line));
                    }
                    lineCounter++;
                }).then(()=>{
                    resolve(lines);
                });
            }));
        });

        return promises;
    }
}