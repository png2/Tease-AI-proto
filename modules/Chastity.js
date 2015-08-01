/**
 * All Chastity related things
 */
module.exports.register = function({commandsProcessor}) {
    commandsProcessor.registerCommand('ChastityOn', chastityOn);

    commandsProcessor.registerCommand('ChastityOff', chastityOff);
};

function chastityOn(scriptParser, ui, settings, state, params) {
    state.chastity = true;
}

function chastityOff(scriptParser, ui, settings, state, params) {
    state.chastity = false;
}