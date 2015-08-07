/**
 * All Chastity related things
 */
module.exports.register = function({commandsProcessor, commandFiltersProcessor, state}) {
    if(!state.persistent.chastity) state.persistent.chastity = false;

    commandsProcessor.registerCommand('ChastityOn', chastityOn);

    commandsProcessor.registerCommand('ChastityOff', chastityOff);

    commandFiltersProcessor.registerFilter('HasChastity', filterHasChastity);

    commandFiltersProcessor.registerFilter('InChastity', filterInChastity);

    commandFiltersProcessor.registerFilter('ChastityPA', filterChastityPrinceAlbert);

    commandFiltersProcessor.registerFilter('ChastitySpikes', filterChastitySpikes);
};

function chastityOn({state}) {
    state.persistent.chastity = true;
}

function chastityOff({state}) {
    state.persistent.chastity = false;
}

function filterHasChastity({settings}) {
    return settings.sub.hasChastity;
}

function filterInChastity({state}) {
    return state.persistent.chastity;
}

function filterChastityPrinceAlbert({settings}) {
    return settings.sub.hasChastityPA;
}

function filterChastitySpikes({settings}) {
    return settings.sub.hasChastitySpikes;
}