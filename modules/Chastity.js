/**
 * All Chastity related things
 */
module.exports.register = function({commandsProcessor, commandFiltersCommand}) {
    commandsProcessor.registerCommand('ChastityOn', chastityOn);

    commandsProcessor.registerCommand('ChastityOff', chastityOff);

    commandFiltersCommand.registerFilter('HasChastity', filterHasChastity);

    commandFiltersCommand.registerFilter('InChastity', filterInChastity);

    commandFiltersCommand.registerFilter('ChastityPA', filterChastityPrinceAlbert);

    commandFiltersCommand.registerFilter('ChastitySpikes', filterChastitySpikes);
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