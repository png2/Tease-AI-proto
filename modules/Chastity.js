/**
 * All Chastity related things
 */
module.exports = function(commandsProcessor, vocabularyProcessor, uiDispatcher, settings, state) {
    commandsProcessor.registerCommand('ChastityOn', (scriptParser, ui, settings, state, params)=> {
        state.chastity = true;
    });

    commandsProcessor.registerCommand('ChastityOff', (scriptParser, ui, settings, state, params)=> {
        state.chastity = false;
    });
};