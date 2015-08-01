/**
 * All the things directly related to the Domme
 */
module.exports.register = function({commandsProcessor, vocabularyProcessor}) {

    commandsProcessor.registerCommand('DommeLevelUp', levelUp);

    commandsProcessor.registerCommand('DommeLevelDown', levelDown);

    vocabularyProcessor.registerVocabularyFilter("DomLevel", getDommeLevel);

    vocabularyProcessor.registerVocabularyFilter("DomOrgasmRate", getDommeOrgasmRate);

    vocabularyProcessor.registerVocabularyFilter("DomRuinRate", getDommeRuinRate);

    vocabularyProcessor.registerVocabularyFilter("DomHonorific", getDommeHonorific);

};

function levelUp(scriptParser, ui, settings, state, params) {
    if(settings.domme.level < 5) {
        settings.domme.level++;
    }
}

function getDommeLevel(settings, state, params) {
    return settings.domme.level;
}

function levelDown(scriptParser, ui, settings, state, params) {
    if(settings.domme.level > 0) {
        settings.domme.level--;
    }
}

function getDommeOrgasmRate(vocabularyProcessor, settings,state,params) {
    return settings.domme.orgasmChance + ' Allows';
}

function getDommeRuinRate(vocabularyProcessor, settings,state,params) {
    return settings.domme.ruinChance + ' Allows';
}

function getDommeHonorific(vocabularyProcessor, settings,state,params) {
    return settings.sub.honorific;
}