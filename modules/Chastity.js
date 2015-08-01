/**
 * All Chastity related things
 */
module.exports.register = function({commandsProcessor, commandFiltersProcessor}) {
    commandsProcessor.registerCommand('ChastityOn', chastityOn);

    commandsProcessor.registerCommand('ChastityOff', chastityOff);

    commandFiltersProcessor.registerFilter('HasChastity', filterHasChastity);

    commandFiltersProcessor.registerFilter('InChastity', filterInChastity);

    commandFiltersProcessor.registerFilter('ChastityPA', filterChastityPrinceAlbert);

    commandFiltersProcessor.registerFilter('ChastitySpikes', filterChastitySpikes);
};

function chastityOn({state}) {
    state.chastity = true;
}

function chastityOff({state}) {
    state.chastity = false;
}

function filterHasChastity({settings}) {
    return settings.sub.hasChastity;
}

function filterInChastity({state}) {
    return state.chastity;
}

function filterChastityPrinceAlbert({settings}) {
    return settings.sub.hasChastityPA;
}

function filterChastitySpikes({settings}) {
    return settings.sub.hasChastitySpikes;
}