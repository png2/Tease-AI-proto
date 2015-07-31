import {RandomUtil} from '../utils/RandomUtil';

/**
 * All the misc commands and filters, mostly system stuff like @End, @Wait, etc.
 */
module.exports.register = function(commandsProcessor, vocabularyProcessor, uiDispatcher, settings, state) {
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

function ignoreLine(scriptParser, ui, settings, state, params) {
    scriptParser.doNotDisplayLineText();
}

function waitForSeconds(scriptParser, ui, settings, state, params) {
    if(params.length === 1) {
        let seconds = parseInt(params[0],10);
        if(!isNaN(seconds)) {
            scriptParser.wait();
            setTimeout(()=>{
                scriptParser.resume();
            },seconds*1000);
        } else {
            ui.debug(`Invalid number of seconds : ${params[0]}`)
        }
    } else {
        ui.debug('Invalid number of parameters for @WAit');
    }
}

function endScript(scriptParser, ui, settings, state, params) {
    scriptParser.endScript();
}

function goToTeaseEnding(scriptParser, ui, settings, state, params) {
    scriptParser.endTease();
}

function endTease(scriptParser, ui, settings, state, params) {
    scriptParser.endSession();
}

function decideOrgasm(scriptParser, ui, settings, state, params) {
    if(RandomUtil.isLucky(settings.ranges.orgasmChance[settings.domme.orgasmChance])) {
        if(RandomUtil.isLucky(settings.ranges.ruinChance[settings.domme.ruinChance])) {
            scriptParser.goto("Orgasm Ruin");
        }else {
            scriptParser.goto("Orgasm Allow");
        }
    } else {
        scriptParser.goto("Orgasm Deny")
    }
}

function activateAFKMode(scriptParser, ui, settings, state, params) {
    scriptParser.wait();
    ui.registerInputListener("AFK","",999,() => {});
}

function deactivateAFKMode(scriptParser, ui, settings, state, params) {
    ui.unregisterInputListener("AFK");
    scriptParser.resume();
}

function activateRapidText(scriptParser, ui, settings, state, params) {
    state.temp.rapidText = true;
}

function deactivateRapidText(scriptParser, ui, settings, state, params) {
    state.temp.rapidText = false;
}

function getGeneralTime(vocabularyProcessor, settings,state,params) {
    var currentHour = new Date().getHours();
    if(currentHour > 3 && currentHour < 11) return "this morning";
    if(currentHour < 18) return "today";
    return "tonight";
}

function getGreetSub(vocabularyProcessor, settings,state,params) {
    var currentHour = new Date().getHours();
    if(currentHour > 3 && currentHour < 11) return vocabularyProcessor.processVocabularyFilters("#GoodMorningSub");
    if(currentHour < 18) return vocabularyProcessor.processVocabularyFilters("#GoodAftenoonSub");
    return vocabularyProcessor.processVocabularyFilters("#GoodEveningSub");
}