import {RandomUtil} from '../utils/RandomUtil';

/**
 * All the misc commands and filters, mostly system stuff like @End, @Wait, etc.
 */
module.exports = function(commandsProcessor, vocabularyProcessor, uiDispatcher, settings, state) {
    commandsProcessor.registerCommand('NullResponse', (scriptParser, ui, settings, state, params)=> {
        scriptParser.doNotDisplayLineText();
    });

    commandsProcessor.registerCommand('Info', (scriptParser, ui, settings, state, params)=> {
        scriptParser.doNotDisplayLineText();
    });

    commandsProcessor.registerCommand('Wait', (scriptParser, ui, settings, state, params)=> {
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
    });

    commandsProcessor.registerCommand('End', (scriptParser, ui, settings, state, params)=> {
        scriptParser.endScript();
    });

    commandsProcessor.registerCommand('EndTease', (scriptParser, ui, settings, state, params)=> {
        scriptParser.endTease();
    });

    commandsProcessor.registerCommand('FinishTease', (scriptParser, ui, settings, state, params)=> {
        scriptParser.endSession();
    });

    commandsProcessor.registerCommand('DecideOrgasm', (scriptParser, ui, settings, state, params)=> {
        if(RandomUtil.isLucky(settings.ranges.orgasmChance[settings.domme.orgasmChance])) {
            if(RandomUtil.isLucky(settings.ranges.ruinChance[settings.domme.ruinChance])) {
                scriptParser.goto("Orgasm Ruin");
            }else {
                scriptParser.goto("Orgasm Allow");
            }
        } else {
            scriptParser.goto("Orgasm Deny")
        }
    });

    commandsProcessor.registerCommand('AFKOn', (scriptParser, ui, settings, state, params)=> {
        scriptParser.wait();
        ui.registerInputListener("AFK","",999,() => {});
    });

    commandsProcessor.registerCommand('AFKOff', (scriptParser, ui, settings, state, params)=> {
        ui.unregisterInputListener("AFK");
        scriptParser.resume();
    });

    commandsProcessor.registerCommand('RapidTextOn', (scriptParser, ui, settings, state, params)=> {
        state.temp.rapidText = true;
    });

    commandsProcessor.registerCommand('RapidTextOff', (scriptParser, ui, settings, state, params)=> {
        state.temp.rapidText = false;
    });

    vocabularyProcessor.registerVocabularyFilter("GeneralTime",(settings,state,params)=>{
        var currentHour = new Date().getHours();
        if(currentHour > 3 && currentHour < 11) return "this morning";
        if(currentHour < 18) return "today";
        return "tonight";
    });

    vocabularyProcessor.registerVocabularyFilter("GreetSub",(settings,state,params)=>{
        var currentHour = new Date().getHours();
        if(currentHour > 3 && currentHour < 11) return vocabularyProcessor.processVocabularyFilters("#GoodMorningSub");
        if(currentHour < 18) return vocabularyProcessor.processVocabularyFilters("#GoodAftenoonSub");
        return vocabularyProcessor.processVocabularyFilters("#GoodEveningSub");
    });
};