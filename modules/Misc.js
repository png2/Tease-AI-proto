import {RandomUtil} from '../utils/RandomUtil';

/**
 * All the misc commands and filters, mostly system stuff like @End, @Wait, etc.
 */
module.exports.register = function({commandsProcessor, commandFiltersProcessor, vocabularyProcessor, state}) {

    state.temp.rapidText = false;

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

    vocabularyProcessor.registerVocabularyFilter('PetName',petNameVocab);

    vocabularyProcessor.registerVocabularyFilter('RANDNumberLow',({settings})=>{
        var value = RandomUtil.getRandomInteger(1,5) * settings.domme.level;
        if(value > 10) value = 5 * Math.round(value/5);
        if(value < 3) value = 3;
        return value;
    });

    vocabularyProcessor.registerVocabularyFilter('RANDNumberHigh',({settings})=>{
        var value = RandomUtil.getRandomInteger(5,20) * settings.domme.level;
        if(value > 10) value = 5 * Math.round(value/5);
        return value;
    });

    vocabularyProcessor.registerVocabularyFilter('RANDNumber',({settings})=>{
        var value = RandomUtil.getRandomInteger(1,10) * settings.domme.level;
        if(value > 10) value = 5 * Math.round(value/5);
        return value;
    });

    commandFiltersProcessor.registerFilter('BeforeTease',({state}) => {
        return state.temp.cycler && state.temp.cycler.round == 0;
    });

    commandFiltersProcessor.registerFilter('FirstRound',({state}) => {
        return state.temp.cycler && state.temp.cycler.round == 1;
    });

    commandsProcessor.registerCommand('BookmarkModule', ({parser,state}) => {
        state.temp.cycler.bookmarkModule = parser;
    });

    commandsProcessor.registerCommand('BookmarkLink', ({parser,state}) => {
        state.temp.cycler.bookmarkLink = parser;
    });

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
    uiDispatcher.registerInputListener("AFK","",999,() => {});
}

function deactivateAFKMode({parser, uiDispatcher}) {
    uiDispatcher.unregisterInputListener("AFK");
}

function activateRapidText({state}) {
    state.temp.rapidText = true;
}

function deactivateRapidText({state}) {
    state.temp.rapidText = false;
}

function petNameVocab({settings}) {
    return settings.sub.petNames[RandomUtil.getRandomInteger(0,3)];
}