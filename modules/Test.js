/**
 * A simple sample to see how to implement a module.
 * The register method MUST be exported for the module to be valid
 * THat method takes an object as argument. The object contains the following properties :
 * @param commandsProcessor Allow you to register and process commands. See <code>core/processors/CommandsProcessor</code>
 * @param vocabularyProcessor Allow you to register and process vocabulary filters. See <code>core/processors/VocabularyProcessor</code>
 * @param commandFiltersProcessor Allow you to register and process command filters. See <code>core/processors/CommandFiltersProcessor</code>
 * @param uiDispatcher Allow you to communicate with the UI. See <code>core/UIDispatcher</code>
 * @param settings Contains all the app settings. See <code>core/Settings</code>
 * @param state Contains the state of the current session. See <code>core/State</code>
 */
module.exports.register = function({commandsProcessor, vocabularyProcessor, commandFiltersProcessor, uiDispatcher, settings, state}) {
    /* Here you can set up things like setting default values of variables or states */

    /**
     * Add a command processor that will react to @test and @test(params) instructions
     * The processor has an object with the following properties :
     * - scriptParser : the parser for the current file. See <code>core/parser/ScriptParser</code>
     * - uiDispatcher : The uiDispatcher. See above
     * - settings : the settings. See above
     * - state : the state. See above
     * It's other parameters are :
     * - params : The params of the command or an empty table if there is no parameter
     * The function returns true if the program should ignore any command after this one
     */
    commandsProcessor.registerCommand('test',testCommand);

    /**
     * Add a vocabulary filter processor that will react to #test and #test(params) and returns a filtered value
     * The  processor has an object with the following properties :
     * - settings : the settings. See above
     * - state : the state. See above
     * It's other parameters are :
     * - params : The params of the command or an empty table if there is no parameter
     */
    vocabularyProcessor.registerVocabularyFilter('test',testVocabFilter);

    /**
     * Add a command processor that will work in list files
     * Works the same as <code>commandsProcessor.registerCommand</code>
     */
    commandFiltersProcessor.registerCommand('test', testCommand);

    /**
     * Add a filter processor that will react to @test in list files and return true if the line can be displayed or false if it should be filtered
     * The processor has an object with the following properties as parameter :
     * - settings : the settings. See above
     * - state : the state. See above
     * It's other parameters are :
     * - params : The params of the command or an empty table if there is no parameter
     *
     */
    commandFiltersProcessor.registerFilter('test', testFilter);
};

function testCommand({parser,uiDispatcher,settings, state},params) {
    // Check if we have a parameter or not
    if(params.length > 0) {
        // Display some debug text
        uiDispatcher.debug("Hey I found a test command!! => " + params.join('/'));
    } else {
        uiDispatcher.debug("Hey I found a test command!!");
    }
}

function testVocabFilter({vocabularyProcessor, settings, state}, params) {
    if(params.length > 0) {
        return "TEST!!! => " + params.join("/");
    } else {
        return "TEST!!!";
    }
}

function testFilter({settings, state}, params) {
    return true;
}

/*
if (process.env.NODE_ENV === 'test') {
    module.exports._private = {
        testCommand:testCommand,
        testVocabFilter:testVocabFilter
    };
}
*/