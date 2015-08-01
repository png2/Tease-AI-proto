import {RandomUtil} from '../utils/RandomUtil';

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

    commandsProcessor.registerCommand('DecideOrgasm', decideOrgasm);

    commandsProcessor.registerCommand('AFKOn', activateAFKMode);

    commandsProcessor.registerCommand('AFKOff', deactivateAFKMode);

    commandsProcessor.registerCommand('RapidTextOn', activateRapidText);

    commandsProcessor.registerCommand('RapidTextOff', deactivateRapidText);

    vocabularyProcessor.registerVocabularyFilter("GeneralTime", getGeneralTime);

    vocabularyProcessor.registerVocabularyFilter("GreetSub", getGreetSub);
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

function decideOrgasm({parser, settings}) {
    if(RandomUtil.isLucky(settings.ranges.orgasmChance[settings.domme.orgasmChance])) {
        if(RandomUtil.isLucky(settings.ranges.ruinChance[settings.domme.ruinChance])) {
            parser.goto("Orgasm Ruin");
        }else {
            parser.goto("Orgasm Allow");
        }
    } else {
        parser.goto("Orgasm Deny")
    }
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

function getGeneralTime() {
    var currentHour = new Date().getHours();
    if(currentHour > 3 && currentHour < 11) return "this morning";
    if(currentHour < 18) return "today";
    return "tonight";
}

function getGreetSub({vocabularyProcessor}) {
    var currentHour = new Date().getHours();
    if(currentHour > 3 && currentHour < 11) return vocabularyProcessor.processVocabularyFilters("#GoodMorningSub");
    if(currentHour < 18) return vocabularyProcessor.processVocabularyFilters("#GoodAftenoonSub");
    return vocabularyProcessor.processVocabularyFilters("#GoodEveningSub");
}