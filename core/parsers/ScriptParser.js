var lineReader = require('line-reader');
import {ParseUtil} from '../../utils/ParseUtil';

/**
 * Script parser for starting scripts, modules, links and endings
 */
export class ScriptParser  {
    constructor(commandsProcessor,variablesProcessor,vocabularyProcessor, answerProcessor, cycler,uiDispatcher,state) {
        this.commandsProcessor = commandsProcessor;
        this.variablesProcesor = variablesProcessor;
        this.vocabularyProcessor = vocabularyProcessor;
        this.answerProcessor = answerProcessor;
        this.cycler = cycler;
        this.uiDispatcher = uiDispatcher;
        this.state = state;

        this.temporaryInputListeners = [];
    }

    /**
     * Parse the given file. The file will be loaded in memory while it's parsed.
     * @param file The fil to parse
     */
    parseFile(file) {
        this._lines = [];
        this._currentLine = -1;
        this._resetStates();

        lineReader.eachLine(file, (line) => {
            this._lines.push(ParseUtil.clearCRLF(line));
        }).then(()=>{
            this._linesGenerator = this.lineReader();
            this._readNextLine();
        });
    }

    /**
     * Go to the next step of the parsing
     * It could be the next line, waiting for something or going to the next step of the cycler
     * @private
     */
    _next() {
        if(this._endScript) {
            this.cycler.next();
        } else if(this._nextTarget != null) {
            this._readUntilNextTarget()
        } else if(!this._wait) {
            this._readNextLine();
        }
    }

    /**
     * Read the next line of the file
     * @private
     */
    _readNextLine() {
        var nextLine = this._linesGenerator.next();
        if(!nextLine.done) {
            this._parseLine(nextLine.value);
        }
    }

    /**
     * Read from the start of the file until it finds the Goto target that matches this._nextTarget
     * @private
     */
    _readUntilNextTarget() {
        this._lines.forEach((line,index) => {
            if(ParseUtil.isTargetLine(line)
            && ParseUtil.doesLineContainsTarget(line,this._nextTarget)) {
                this._currentLine = index;
                this._readNextLine();
            }
        });
    }

    /**
     * Parse a line
     * @param line The line to parse
     * @private
     */
    _parseLine(line) {
        this._resetStates();

        if(ParseUtil.isTargetLine(line)) {
            this.doNotDisplayLineText();
            this._next();
            return;
        }

        if(this.answerProcessor.isAnswerLine(line)) {
            this.wait();
            this.doNotDisplayLineText();
            this.answerProcessor.processAnswers(line);
            return;
        }

        line = this.vocabularyProcessor.processVocabularyFilters(line, this);
        line = this.variablesProcesor.processVariables(line, this);
        line = this.commandsProcessor.cleanupRemainingSquareBrackets(line);
        line = this.commandsProcessor.processCommands(line, this);

        line = line.trim();
        if(this._shouldDisplayLine(line)) {
            this.uiDispatcher.displayText(line,()=> {
                this._next();
            });
        } else {
            this._next();
        }
    }

    /**
     * Block the parser until <code>resume()</code> is called
     */
    wait() {
        this._wait = true;
    }

    /**
     * Resume the parsing
     */
    resume() {
        this._wait = false;
        this._next();
    }

    /**
     * Do not display the current line if it contains texte
     */
    doNotDisplayLineText() {
        this._ignoredLine = true;
    }

    /**
     * Skip into the file until it meets the target
     * @param target The target to skip to
     */
    goto(target) {
        this._nextTarget = target;
        this.uiDispatcher.debug(`Goto : ${target}`);
    }

    /**
     * End the parsing of this file and resume the cycle
     */
    endScript() {
        this._endScript = true;
    }

    /**
     * End the parsing of this file and skip the cycle to an ending file
     */
    endTease() {
        this.endScript();
        this.cycler.end();
    }

    /**
     * End the parsing of this file and force the cycle to the end without playing an ending file
     */
    endSession() {
        this.endScript();
        this.cycler.endSession();
    }

    /**
     * Clean up the states of the last line
     * @private
     */
    _resetStates() {
        this._ignoredLine = false;
        this._nextTarget = null;
        this._wait = false;
    }

    /**
     * Check if the line should be sent to the UI to be displayed
     * @private
     */
    _shouldDisplayLine(line) {
        return line.length > 0 && !this._ignoredLine;
    }

    /**
     * Generator that read the file line by line
     */
    * lineReader() {
        this._currentLine = -1;
        while(this._currentLine < this._lines.length-1) {
            this._currentLine++;
            yield this._lines[this._currentLine];
        }
        return '';
    }
}