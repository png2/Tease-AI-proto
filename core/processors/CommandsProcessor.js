/**
 * Process all the commands related things in scripts
 * A command is either a @CommandName or @CommandName(param1,param2,...) instruction anywhere in the line
 * Some instructions are special and not processed here : @DifferentAnswer, @AcceptAnswer
 * The filters used in taunts file are processed in <code>FilterProcessor</code>
 * The variables are processed in <code>VariablesProcessor</code>
 */
export class CommandsProcessor {

    constructor(ui,settings, state) {
        this.commands = new Map();
        this.uiDispatcher = ui;
        this.settings = settings;
        this.state = state;
    }

    setScriptParser(scriptParser) {
        this.scriptParser = scriptParser;
    }

    /**
     * Execute the code attached to a command
     * @param commandName The name of the command
     * @param params The params to give to the command if any
     */
    applyCommand(commandName,params = []) {
        if(this.commands.has(commandName)) {
            this.uiDispatcher.debug(`Applying commmand '${commandName}' with params : ${params.length==0?'no params':params.join(",")}`);
            this.commands.get(commandName)(this.scriptParser, this.uiDispatcher, this.settings, this.state, params);
        } else {
            console.log(`Unknown command : ${commandName}`);
        }
    }

    /**
     * Register a command to execute.
     * The callback should have this signature :
     * function(scriptParser, uiDispatcher, settings, state, params){}
     * With the params being an empty array if the command doesn't have any parameter
     * @param commandName The name of the command (case sensitive)
     * @param callback The callback to execute when the command is found in a line
     */
    registerCommand(commandName,callback) {
        this.commands.set(commandName,callback);
    }

    /**
     * Process all the commands found in the line
     * @param line The line to process
     * @returns {String} the line cleaned up without the command. If the command is preceded by a space, it is deleted, if it is followed by a space it is kept in the returning string
     */
    processCommands(line) {
        return line.replace(/( ?)@([\w-]+)($| |\(([^\)]+)\)?)( ?)/g,(match,
                                                                     precedingSpace,
                                                                     commandName,
                                                                     commandParametersWithParenthesis,
                                                                     commandParameters="",
                                                                     followingSpace = commandParametersWithParenthesis
        ) => {
            if(commandParameters.trim() !== "") {
                this.applyCommand(commandName, commandParameters.split(','));
            } else {
                this.applyCommand(commandName);
            }
            return followingSpace;
        });
    }

    /**
     * Utility method to convert @Command[params] to @Command(params) to process some instructions with a different syntax
     * @param line the line to cleanup
     * @returns {string} The line with all the @Command[] replaced by @Command()
     */
    cleanupRemainingSquareBrackets(line) {
        return line.replace(/@([a-zA-Z0-9_-]+)\[([^\]]+)\]/g,"@$1($2)");
    }
}