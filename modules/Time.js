/**
 * All the things time related
 */
module.exports.register = function({vocabularyProcessor, commandFiltersProcessor}) {

    vocabularyProcessor.registerVocabularyFilter("GeneralTime", getGeneralTime);

    vocabularyProcessor.registerVocabularyFilter("GreetSub", getGreetSub);

    commandFiltersProcessor.registerFilter('NewYearsEve', createFilterDate(31,12));
    commandFiltersProcessor.registerFilter('NewYearsDay', createFilterDate(1,1));
    commandFiltersProcessor.registerFilter('ChristmasEve', createFilterDate(24,12));
    commandFiltersProcessor.registerFilter('ChristmasDay', createFilterDate(25,12));
    commandFiltersProcessor.registerFilter('ValentinesDay', createFilterDate(14,2));

    commandFiltersProcessor.registerFilter('SubBirthday', filterSubBirthday);
};

function getGeneralTime() {
    var currentHour = new Date().getHours();
    if(currentHour > 3 && currentHour < 11) return "this morning";
    if(currentHour < 18) return "today";
    return "tonight";
}

function getGreetSub() {
    var currentHour = new Date().getHours();
    if(currentHour > 3 && currentHour < 11) return "#GoodMorningSub";
    if(currentHour < 18) return "#GoodAftenoonSub";
    return "#GoodEveningSub";
}

function createFilterDate(day, month) {
    return function() {
        var now = new Date();
        return now.getDate() == day
            && now.getMonth() == month-1;
    };
}

function filterSubBirthday({settings}) {
    var now = new Date();
    return settings.sub.birthday.year == now.getFullYear()
        && settings.sub.birthday.month == now.getMonth()
        && settings.sub.birthday.day == now.getDate();
}
