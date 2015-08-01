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

function levelUp({settings}) {
    if(settings.domme.level < 5) {
        settings.domme.level++;
    }
}

function getDommeLevel({settings}) {
    return settings.domme.level;
}

function levelDown({settings}) {
    if(settings.domme.level > 0) {
        settings.domme.level--;
    }
}

function getDommeOrgasmRate({settings}) {
    return settings.domme.orgasmChance + ' Allows';
}

function getDommeRuinRate({settings}) {
    return settings.domme.ruinChance + ' Allows';
}

function getDommeHonorific({settings}) {
    return settings.sub.honorific;
}