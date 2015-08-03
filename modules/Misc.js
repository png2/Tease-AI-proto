/**
 * All the misc commands and filters, mostly system stuff like @End, @Wait, etc.
 */
module.exports.register = function({commandsProcessor, commandFiltersProcessor, vocabularyProcessor}) {
    commandsProcessor.registerCommand('NullResponse', ignoreLineCommand);

    commandsProcessor.registerCommand('Info', ignoreLineCommandAndStop);
    commandFiltersProcessor.registerFilter('Info', ignoreLineFilter);

    commandsProcessor.registerCommand('Wait', waitForSeconds);

    commandsProcessor.registerCommand('End', endScript);

    commandsProcessor.registerCommand('EndTease', goToTeaseEnding);

    commandsProcessor.registerCommand('FinishTease', endTease);

    commandsProcessor.registerCommand('AFKOn', activateAFKMode);

    commandsProcessor.registerCommand('AFKOff', deactivateAFKMode);

    commandsProcessor.registerCommand('RapidTextOn', activateRapidText);

    commandsProcessor.registerCommand('RapidTextOff', deactivateRapidText);
};

function ignoreLineCommand({parser}) {
    parser.doNotDisplayLineText();
}

function ignoreLineCommandAndStop(args,params) {
    ignoreLineCommand(args,params)
    return true;
}

function ignoreLineFilter() {
    return false;
}

function waitForSeconds({parser, ui}, params) {
    if(params.length === 1) {
        let seconds = parseInt(params[0],10);
        if(!isNaN(seconds)) {
            parser.wait();
            setTimeout(()=>{
                parser.resume();
            },seconds*1000);
            return true;
        } else {
            ui.debug(`Invalid number of seconds : ${params[0]}`)
        }
    } else {
        ui.debug('Invalid number of parameters for @WAit');
    }
}

function endScript({parser}) {
    parser.endScript();
    return true;
}

function goToTeaseEnding({parser}) {
    parser.endTease();
    return true;
}

function endTease({parser}) {
    parser.endSession();
    return true;
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