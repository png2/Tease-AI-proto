import {Constants} from '../core/Constants'

var tc = require('timezonecomplete');

/**
 * All the things directly related to the Sub
 */
module.exports.register = function({commandsProcessor, vocabularyProcessor, commandFiltersProcessor}) {

    vocabularyProcessor.registerVocabularyFilter("SubName", ({settings}) => {
        return settings.sub.name;
    });

    vocabularyProcessor.registerVocabularyFilter("SubBirthdayDay", ({settings}) => {
        return settings.sub.birthday.day;
    });

    vocabularyProcessor.registerVocabularyFilter("SubBirthdayMonth", ({settings}) => {
        return settings.sub.birthday.month;
    });

    vocabularyProcessor.registerVocabularyFilter("SubAge", ({settings}) => {
        return getSubAge(settings);
    });

    vocabularyProcessor.registerVocabularyFilter("SubCockSize", ({settings}) => {
        return settings.sub.cockSize;
    });

    vocabularyProcessor.registerVocabularyFilter("SubEyes", ({settings}) => {
        return settings.sub.eyes.color;
    });

    vocabularyProcessor.registerVocabularyFilter("SubHair", ({settings}) => {
        return settings.sub.hair.color;
    });

    commandFiltersProcessor.registerFilter('CockLarge', ({settings}) => {
        return settings.sub.cockSize > settings.domme.avgCockSize.max;
    });

    commandFiltersProcessor.registerFilter('CockSmall', ({settings}) => {
        return settings.sub.cockSize < settings.domme.avgCockSize.min;
    });

    commandFiltersProcessor.registerFilter('SubYoung', ({settings}) => {
        return getSubAge(settings) < settings.domme.subAgePerception.min;
    });

    commandFiltersProcessor.registerFilter('SubOld', ({settings}) => {
        return getSubAge(settings) > settings.domme.subAgePerception.max;
    });

    commandFiltersProcessor.registerFilter('SubCircumcised', ({settings}) => {
        return settings.sub.circumcised;
    });

    commandFiltersProcessor.registerFilter('SubNotCircumcised', ({settings}) => {
        return !settings.sub.circumcised;
    });

    commandFiltersProcessor.registerFilter('SubPierced', ({settings}) => {
        return settings.sub.pierced;
    });

    commandFiltersProcessor.registerFilter('SubNotPierced', ({settings}) => {
        return !settings.sub.pierced;
    });

};
function getSubAge(settings) {
    var start = new tc.DateTime(settings.sub.birthday.year, settings.sub.birthday.month, settings.sub.birthday.day);
    var end = new tc.DateTime();

    var duration = end.diff(start);

    return duration.wholeYears() - 1;
}
