/**
 * All the things directly related to the Domme
 */
module.exports.register = function({commandsProcessor, vocabularyProcessor, commandFiltersProcessor}) {

    commandsProcessor.registerCommand('DommeLevelUp', levelUp);

    commandsProcessor.registerCommand('DommeLevelDown', levelDown);

    vocabularyProcessor.registerVocabularyFilter("DomLevel", getDommeLevel);

    vocabularyProcessor.registerVocabularyFilter("DomOrgasmRate", getDommeOrgasmRate);

    vocabularyProcessor.registerVocabularyFilter("DomRuinRate", getDommeRuinRate);

    vocabularyProcessor.registerVocabularyFilter("DomHonorific", getDommeHonorific);

    for(let level = 1; level <= 5; level++) {
        commandFiltersProcessor.registerFilter(`DommeLevel${level}`,createDommeLevelFilter(level));
    }

    for(let apathy = 1; apathy <= 5; apathy++) {
        commandFiltersProcessor.registerFilter(`ApathyLevel${apathy}`,createDommeApathyFilter(apathy));
    }

    commandFiltersProcessor.registerFilter('AlwaysAllowsOrgasm',createOrgasmRateFilter('Always'));
    commandFiltersProcessor.registerFilter('NeverAllowsOrgasm',createOrgasmRateFilter('Never'));
    commandFiltersProcessor.registerFilter('OftenAllowsOrgasm',createOrgasmRateFilter('Often'));
    commandFiltersProcessor.registerFilter('RarelyAllowsOrgasm',createOrgasmRateFilter('Rarely'));
    commandFiltersProcessor.registerFilter('SometimesAllowsOrgasm',createOrgasmRateFilter('Sometimes'));

    commandFiltersProcessor.registerFilter('AlwaysAllowsRuin',createRuinRateFilter('Always'));
    commandFiltersProcessor.registerFilter('NeverAllowsRuin',createRuinRateFilter('Never'));
    commandFiltersProcessor.registerFilter('OftenAllowsRuin',createRuinRateFilter('Often'));
    commandFiltersProcessor.registerFilter('RarelyAllowsRuin',createRuinRateFilter('Rarely'));
    commandFiltersProcessor.registerFilter('SometimesAllowsRuin',createRuinRateFilter('Sometimes'));
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

function createDommeLevelFilter(level) {
    return function({settings}) {
        return settings.domme.level == level;
    };
}

function createDommeApathyFilter(apathy) {
    return function({settings}) {
        return settings.domme.apathy == apathy;
    };
}

function createOrgasmRateFilter(rate) {
    return function({settings}) {
        return settings.domme.orgasmChance.toLowerCase() == rate.toLowerCase();
    }
}

function createRuinRateFilter(rate) {
    return function({settings}) {
        return settings.domme.ruinChance.toLowerCase() == rate.toLowerCase();
    }
}