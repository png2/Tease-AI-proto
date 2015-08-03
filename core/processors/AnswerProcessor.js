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
     * @param parser The parser used to fetch this line
     */
    processAnswers(line,parser) {
        if (line.startsWith("[")) {
            this._processAnswerPattern(line, parser);
            parser._readNextLine();
        } else if (line.startsWith("@DifferentAnswer")) {
            this._processDifferentAnswer(line,parser);
        } else if (line.startsWith("@AcceptAnswer")) {
            this._processAcceptAnswer(line, parser);
        }
    }

    /**
     * Process the answers with a pattern
     * Ex : [yes]Oh you agree...
     * @private
     */
    _processAnswerPattern(line, parser) {
        line.replace(/^\[([^\]]+)\](.*)/, (match, patterns, endOfLine) => {
            if (endOfLine.match("@LoopAnswer")) {
                this._processAnswerWithLoopAnswer(patterns, endOfLine, parser);
            } else {
                this._processAnswer(patterns, endOfLine, parser);
            }
        });
    }

    /**
     * Process the answer line if the line does not contain a @LoopAnswer command
     * @private
     */
    _processAnswer(patterns,endOfLine,parser) {
        ((scriptParser,uiDispatcher, patterns, endOfLine) => {
            this.uiDispatcher.registerTemporaryInputListener(patterns, 100, (text) => {
                uiDispatcher.cleanUpTemporaryInputListeners();
                scriptParser._parseLine(endOfLine);
                return false;
            });
        })(parser, this.uiDispatcher, patterns, endOfLine);
    }

    /**
     * Process the answer line if the line contains a @loopAnswer command
     * @private
     */
    _processAnswerWithLoopAnswer(patterns, endOfLine, parser) {
        ((scriptParser, patterns, endOfLine) => {
            this.uiDispatcher.registerTemporaryInputListener(patterns, 100, (text) => {
                scriptParser._currentLine--;
                scriptParser._parseLine(endOfLine);
                return false;
            });
        })(parser, patterns, endOfLine.replace("@LoopAnswer", ""));
    }

    /**
     * Process the lines starting with @DifferentAnswer
     * @private
     */
    _processDifferentAnswer(line, parser) {
        ((scriptParser, endOfLine) => {
            this.uiDispatcher.registerTemporaryInputListener("", 99, (text) => {
                scriptParser._currentLine--;
                scriptParser._parseLine(endOfLine);
                return false;
            });
        })(parser, line.replace("@DifferentAnswer ", ""));
    }

    /**
     * Process the lines starting with @AcceptAnswer
     * @private
     */
    _processAcceptAnswer(line, parser) {
        ((scriptParser,uiDispatcher, endOfLine) => {
            this.uiDispatcher.registerTemporaryInputListener("", 99, (text) => {
                uiDispatcher.cleanUpTemporaryInputListeners();
                scriptParser._parseLine(endOfLine);
                return false;
            });
        })(parser,this.uiDispatcher, line.replace("@AcceptAnswer ", ""));
    }
}