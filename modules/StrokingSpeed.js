/**
 * All the stroking speed management
 */
module.exports.register = function({commandFiltersProcessor, state}) {

    state.temp.strokingSpeed = 3;

    commandFiltersProcessor.registerCommand('StrokeFaster',strokeFaster);
    commandFiltersProcessor.registerCommand('StrokeSlower',strokeSlower);
    commandFiltersProcessor.registerCommand('StrokeSlowest',strokeSlowest);
    commandFiltersProcessor.registerCommand('StrokeFastest',strokeFastest);

    commandFiltersProcessor.registerFilter('StrokeSpeedMin',filterStrokeSpeedMin);
    commandFiltersProcessor.registerFilter('StrokeSpeedMax',filterStrokeSpeedMax);
};

function strokeFaster({state, settings}) {
    if(state.temp.strokingSpeed < (settings.ranges.strokingSpeeds.length+1)) {
        state.temp.strokingSpeed++;
    }
}

function strokeSlower({state}) {
    if(state.temp.strokingSpeed > 0) {
        state.temp.strokingSpeed--;
    }
}

function strokeSlowest({state,}) {
    state.temp.strokingSpeed = 0;
}

function strokeFastest({state,settings}) {
    state.temp.strokingSpeed = settings.ranges.strokingSpeeds.length-1;
}

function filterStrokeSpeedMin({state}) {
    return state.temp.strokingSpeed == 0;

}

function filterStrokeSpeedMax({state, settings}) {
    return state.temp.strokingSpeed == (settings.ranges.strokingSpeeds.length-1);
}