/**
 * Manage the tokens system
 */
module.exports = function(commandsProcessor, vocabularyProcessor, uiDispatcher, settings, state) {
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
        commandsProcessor.registerCommand(tokenCommand[0], (scriptParser, ui, settings, state, params)=> {
            state.persistent.tokens += tokenCommand[1];
        });
    });


    commandsProcessor.registerCommand('AddTokens', (scriptParser, ui, settings, state, params)=> {
        if(params.length === 1) {
            let tokens = parseInt(params[0],10);
            if(!isNaN(tokens)) {
                state.persistent.tokens += tokens;
            } else {
                ui.debug(`Invalid number of tokens : ${params[0]}`)
            }
        } else {
            ui.debug('Invalid number of parameters for @AddTokens');
        }
    });
};