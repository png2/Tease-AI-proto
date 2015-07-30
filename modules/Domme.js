/**
 * All the things directly related to the Domme
 */
module.exports = function(commandsProcessor, vocabularyProcessor, uiDispatcher, settings, state) {

    commandsProcessor.registerCommand('DommeLevelUp', (scriptParser, ui, settings, state, params)=> {
        if(settings.domme.level < 5) {
            settings.domme.level++;
        }
    });

    commandsProcessor.registerCommand('DommeLevelDown', (scriptParser, ui, settings, state, params)=> {
        if(settings.domme.level > 0) {
            settings.domme.level--;
        }
    });

    vocabularyProcessor.registerVocabularyFilter("DomLevel",(settings, state, params)=>{
        return settings.domme.level;
    });

    vocabularyProcessor.registerVocabularyFilter("DomOrgasmRate",(settings,state,params)=>{
       return settings.domme.orgasmChance + ' Allows';
    });

    vocabularyProcessor.registerVocabularyFilter("DomRuinRate",(settings,state,params)=>{
        return settings.domme.ruinChance + ' Allows';
    });

    vocabularyProcessor.registerVocabularyFilter("DomHonorific",(settings,state,params)=>{
        return settings.sub.honorific;
    });

};