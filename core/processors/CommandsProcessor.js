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

    /**
     * Execute the code attached to a command
     * @param commandName The name of the command
     * @param params The params to give to the command if any
     */
    applyCommand(commandName,parser, params = []) {
        if(this.commands.has(commandName)) {
            this.uiDispatcher.debug(`Applying commmand '${commandName}' with params : ${params.length==0?'no params':params.join(",")}`);
            return this.commands.get(commandName)({
                parser:parser,
                uiDispatcher:this.uiDispatcher,
                settings:this.settings,
                state:this.state
            }, params);
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
     * @param parser The parser used to fetch this line
     * @returns {String} the line cleaned up without the command. If the command is preceded by a space, it is deleted, if it is followed by a space it is kept in the returning string
     */
    processCommands(line, parser) {
        var ignoreFollowingCommands = false;
        return line.replace(/( ?)@([\w-]+)($| |\(([^\)]+)\)?)( ?)/g,(match,
                                                                     precedingSpace,
                                                                     commandName,
                                                                     commandParametersWithParenthesis,
                                                                     commandParameters="",
                                                                     followingSpace = commandParametersWithParenthesis
        ) => {
            if(!ignoreFollowingCommands) {
                if (commandParameters.trim() !== "") {
                    ignoreFollowingCommands = this.applyCommand(commandName, parser, commandParameters.split(','));
                } else {
                    ignoreFollowingCommands = this.applyCommand(commandName, parser);
                }
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