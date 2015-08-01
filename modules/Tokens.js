/**
 * Manage the tokens system
 */
module.exports.register = function({commandsProcessor, state}) {
    if(!state.persistent.tokens) {
        state.persistent.tokens = 0;
    }

    var tokensCommands = [
        ['Add1Token',1],
        ['Add3Token',3],
        ['Add5Token',5],
        ['Add10Token',10],
        ['Add25Token',25],
        ['Add50Token',50],
        ['Add100Token',100]
    ];

    tokensCommands.forEach((tokenCommand) => {
        commandsProcessor.registerCommand(tokenCommand[0], createTokenCommand(tokenCommand));
    });


    commandsProcessor.registerCommand('AddTokens', addToken);
};

function createTokenCommand(tokenCommand) {
    return ({state})=> {
        state.persistent.tokens += tokenCommand[1];
    };
}

function addToken({uiDispatcher, state}, params) {
    if(params.length === 1) {
        let tokens = parseInt(params[0],10);
        if(!isNaN(tokens)) {
            state.persistent.tokens += tokens;
        } else {
            uiDispatcher.debug(`Invalid number of tokens : ${params[0]}`)
        }
    } else {
        uiDispatcher.debug('Invalid number of parameters for @AddTokens');
    }
}