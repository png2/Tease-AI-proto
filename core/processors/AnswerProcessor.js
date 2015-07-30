/**
 * Process a line and manage the dialog answers in it
 * The dialog are lines starting with [ or a @DifferentAnswer or @AcceptAnswer command
 * Per exemple :
 * [yes]Oh you agree...
 * [no]Oh you disagree...
 * @DifferentAnswer Answer me!!
 */
export class AnswerProcessor {
    constructor(uiDispatcher) {
        this.uiDispatcher = uiDispatcher;
    }

    /**
     * Attach the current parser
     * @param scriptParser
     */
    setScriptParser(scriptParser) {
        this.scriptParser = scriptParser;
    }

    /**
     * Check if the line contains dialog related instructions
     * @param line The line to process
     * @returns {boolean} Return true if the line contains dialog related instructions
     */
    isAnswerLine(line) {
        return line.startsWith("[")
            || line.startsWith("@DifferentAnswer")
            || line.startsWith("@AcceptAnswer");
    }

    /**
     * Process the dialog instructions in the line
     * @param line The line
     */
    processAnswers(line) {
        if (line.startsWith("[")) {
            this._processAnswerPattern(line);
            this.scriptParser._readNextLine();
        } else if (line.startsWith("@DifferentAnswer")) {
            this._processDifferentAnswer(line);
        } else if (line.startsWith("@AcceptAnswer")) {
            this._processAcceptAnswer(line);
        }
    }

    /**
     * Process the answers with a pattern
     * Ex : [yes]Oh you agree...
     * @private
     */
    _processAnswerPattern(line) {
        line.replace(/^\[([^\]]+)\](.*)/, (match, patterns, endOfLine) => {
            if (endOfLine.match("@LoopAnswer")) {
                this._processAnswerWithLoopAnswer(patterns, endOfLine);
            } else {
                this._processAnswer(patterns, endOfLine);
            }
        });
    }

    /**
     * Process the answer line if the line does not contain a @LoopAnswer command
     * @private
     */
    _processAnswer(patterns,endOfLine) {
        ((scriptParser,uiDispatcher, patterns, endOfLine) => {
            this.uiDispatcher.registerTemporaryInputListener(patterns, 100, (text) => {
                uiDispatcher.cleanUpTemporaryInputListeners();
                scriptParser._parseLine(endOfLine);
                return false;
            });
        })(this.scriptParser, this.uiDispatcher, patterns, endOfLine);
    }

    /**
     * Process the answer line if the line contains a @loopAnswer command
     * @private
     */
    _processAnswerWithLoopAnswer(patterns, endOfLine) {
        ((scriptParser, patterns, endOfLine) => {
            this.uiDispatcher.registerTemporaryInputListener(patterns, 100, (text) => {
                scriptParser._currentLine--;
                scriptParser._parseLine(endOfLine);
                return false;
            });
        })(this.scriptParser, patterns, endOfLine.replace("@LoopAnswer", ""));
    }

    /**
     * Process the lines starting with @DifferentAnswer
     * @private
     */
    _processDifferentAnswer(line) {
        ((scriptParser, endOfLine) => {
            this.uiDispatcher.registerTemporaryInputListener("", 99, (text) => {
                scriptParser._currentLine--;
                scriptParser._parseLine(endOfLine);
                return false;
            });
        })(this.scriptParser, line.replace("@DifferentAnswer ", ""));
    }

    /**
     * Process the lines starting with @AcceptAnswer
     * @private
     */
    _processAcceptAnswer(line) {
        ((scriptParser,uiDispatcher, endOfLine) => {
            this.uiDispatcher.registerTemporaryInputListener("", 99, (text) => {
                uiDispatcher.cleanUpTemporaryInputListeners();
                scriptParser._parseLine(endOfLine);
                return false;
            });
        })(this.scriptParser,this.uiDispatcher, line.replace("@AcceptAnswer ", ""));
    }
}