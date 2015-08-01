/**
 * All Chastity related things
 */
module.exports.register = function({commandsProcessor}) {
    commandsProcessor.registerCommand('ChastityOn', chastityOn);

    commandsProcessor.registerCommand('ChastityOff', chastityOff);
};

function chastityOn({state}) {
    state.chastity = true;
}

function chastityOff({state}) {
    state.chastity = false;
}