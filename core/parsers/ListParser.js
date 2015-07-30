import {ParseUtil} from '../../utils/ParseUtil';
import {RandomUtil} from '../../utils/RandomUtil';

var lineReader = require('line-reader');

/**
 * Parse a list file like taunts, edge taunts, CBT instructions, etc.
 *
 */
export class ListParser {
    constructor(uiDispatcher) {
        this.uiDispatcher = uiDispatcher;
    }

    /**
     * Parse the list of files. The files will be loaded in memory while they are parsed.
     * @param files The files to parse
     */
    parseFiles(files) {
        this._lines = [];

        files.forEach((file)=> {
            lineReader.eachLine(file, (line) => {
                this._lines.push(ParseUtil.clearCRLF(line));
            }).then(()=>{
                this._readRandomLine();
            });
        });
    }

    _next() {
        this._readRandomLine();
    }

    /**
     * Read the next line of the file
     * @private
     */
    _readRandomLine() {
        var line = this._lines[RandomUtil.getRandomInteger(0,this._lines.length-1)];
        this._parseLine(line);
    }

    _parseLine(line) {

        line = line.trim();
        this.uiDispatcher.displayText(line,()=> {
            this._next();
        });
    }


}