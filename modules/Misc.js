/**
 * All the misc commands and filters, mostly system stuff like @End, @Wait, etc.
 */
module.exports.register = function({commandsProcessor, vocabularyProcessor}) {
    commandsProcessor.registerCommand('NullResponse', ignoreLine);

    commandsProcessor.registerCommand('Info', ignoreLine);

    commandsProcessor.registerCommand('Wait', waitForSeconds);

    commandsProcessor.registerCommand('End', endScript);

    commandsProcessor.registerCommand('EndTease', goToTeaseEnding);

    commandsProcessor.registerCommand('FinishTease', endTease);

    commandsProcessor.registerCommand('AFKOn', activateAFKMode);

    commandsProcessor.registerCommand('AFKOff', deactivateAFKMode);

    commandsProcessor.registerCommand('RapidTextOn', activateRapidText);

    commandsProcessor.registerCommand('RapidTextOff', deactivateRapidText);
};

function ignoreLine({parser}) {
    parser.doNotDisplayLineText();
}

function waitForSeconds({parser, ui}, params) {
    if(params.length === 1) {
        let seconds = parseInt(params[0],10);
        if(!isNaN(seconds)) {
            parser.wait();
            setTimeout(()=>{
                parser.resume();
            },seconds*1000);
        } else {
            ui.debug(`Invalid number of seconds : ${params[0]}`)
        }
    } else {
        ui.debug('Invalid number of parameters for @WAit');
    }
}

function endScript({parser}) {
    parser.endScript();
}

function goToTeaseEnding({parser}) {
    parser.endTease();
}

function endTease({parser}) {
    parser.endSession();
}

function activateAFKMode({parser, uiDispatcher}) {
    parser.wait();
    uiDispatcher.registerInputListener("AFK","",999,() => {});
}

function deactivateAFKMode({parser, uiDispatcher}) {
    uiDispatcher.unregisterInputListener("AFK");
    parser.resume();
}

function activateRapidText({state}) {
    state.temp.rapidText = true;
}

function deactivateRapidText({state}) {
    state.temp.rapidText = false;
}