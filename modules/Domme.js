import {Constants} from '../core/Constants'

/**
 * All the things directly related to the Domme
 */
module.exports.register = function({commandsProcessor, vocabularyProcessor, commandFiltersProcessor}) {

    commandsProcessor.registerCommand('DommeLevelUp', levelUp);

    commandsProcessor.registerCommand('DommeLevelDown', levelDown);

    vocabularyProcessor.registerVocabularyFilter("DomLevel", ({settings}) => {
        return settings.domme.level;
    });

    vocabularyProcessor.registerVocabularyFilter("DomOrgasmRate", getDommeOrgasmRate);

    vocabularyProcessor.registerVocabularyFilter("DomRuinRate", getDommeRuinRate);

    vocabularyProcessor.registerVocabularyFilter("DomHonorific", ({settings}) => {
        return settings.sub.honorific;
    });

    vocabularyProcessor.registerVocabularyFilter("DomAge", ({settings}) => {
        return settings.domme.age;
    });

    vocabularyProcessor.registerVocabularyFilter("DomCup", ({settings}) => {
        return settings.domme.cupSize;
    });

    vocabularyProcessor.registerVocabularyFilter("DomEyes", ({settings}) => {
        return settings.domme.eyes.color;
    });

    vocabularyProcessor.registerVocabularyFilter("DomHair", ({settings}) => {
        return settings.domme.hair.color;
    });

    vocabularyProcessor.registerVocabularyFilter("DomAvgCockMax", ({settings}) => {
        return settings.domme.avgCockSize.max;
    });

    vocabularyProcessor.registerVocabularyFilter("DomAvgCockMin", ({settings}) => {
        return settings.domme.avgCockSize.min;
    });

    vocabularyProcessor.registerVocabularyFilter("DomLargeCockMin", ({settings}) => {
        return settings.domme.avgCockSize.max + 1;
    });

    vocabularyProcessor.registerVocabularyFilter("DomSmallCockMax", ({settings}) => {
        return settings.domme.avgCockSize.min - 1;
    });

    vocabularyProcessor.registerVocabularyFilter("DomMood", ({settings}) => {
        return settings.domme.mood;
    });

    vocabularyProcessor.registerVocabularyFilter("DomSelfAgeMin", ({settings}) => {
        return settings.domme.selfAgePerception.min;
    });

    vocabularyProcessor.registerVocabularyFilter("DomSelfAgeMax", ({settings}) => {
        return settings.domme.selfAgePerception.max;
    });

    vocabularyProcessor.registerVocabularyFilter("DomSubAgeMin", ({settings}) => {
        return settings.domme.subAgePerception.min;
    });

    vocabularyProcessor.registerVocabularyFilter("DomSubAgeMax", ({settings}) => {
        return settings.domme.subAgePerception.max;
    });

    vocabularyProcessor.registerVocabularyFilter("DomName", ({settings}) => {
        return settings.domme.name;
    });

    for(let level = 1; level <= 5; level++) {
        commandFiltersProcessor.registerFilter(`DommeLevel${level}`,createDommeLevelFilter(level));
    }

    for(let apathy = 1; apathy <= 5; apathy++) {
        commandFiltersProcessor.registerFilter(`ApathyLevel${apathy}`,createDommeApathyFilter(apathy));
    }

    for(var state in Constants.ALLOW_STATES) {
        if(Constants.ALLOW_STATES.hasOwnProperty(state)) {
            var stateValue = Constants.ALLOW_STATES[state];
            commandFiltersProcessor.registerFilter(`${stateValue}AllowsOrgasm`, createOrgasmRateFilter(stateValue));
            commandFiltersProcessor.registerFilter(`${stateValue}AllowsRuin`, createRuinRateFilter(stateValue));
        }
    }

    for(var size in Constants.CUP_SIZES) {
        if(Constants.CUP_SIZES.hasOwnProperty(size)) {
            var sizeValue = Constants.CUP_SIZES[size];
            commandFiltersProcessor.registerFilter(`${sizeValue}Cup`, createCupSizeFilter(sizeValue));
        }
    }

    commandFiltersProcessor.registerFilter('Crazy', ({settings}) => {
        return settings.domme.crazy;
    });

    commandFiltersProcessor.registerFilter('Supremacist', ({settings}) => {
        return settings.domme.supremacist;
    });

    commandFiltersProcessor.registerFilter('Vulgar', ({settings}) => {
        return settings.domme.vulgar;
    });

    commandFiltersProcessor.registerFilter('SelfYoung', ({settings}) => {
        return settings.domme.age < settings.domme.selfAgePerception.min;
    });

    commandFiltersProcessor.registerFilter('SelfOld', ({settings}) => {
        return settings.domme.age > settings.domme.selfAgePerception.max;
    });
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
        return settings.domme.orgasmChance == rate;
    }
}

function createRuinRateFilter(rate) {
    return function({settings}) {
        return settings.domme.ruinChance == rate;
    }
}

function createCupSizeFilter(cupSize) {
    return function({settings}) {
        return settings.domme.cupSize == cupSize;
    }
}