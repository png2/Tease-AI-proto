/**
 * The flag system management
 */
module.exports.register = function({commandsProcessor, commandFiltersProcessor, state}) {
    state.persistent.flags = new Set();
    state.temp.flags = new Set();

    commandsProcessor.registerCommand('SetFlag', createNewFlag);

    commandsProcessor.registerCommand('TempFlag', createNewTemporaryFlag);

    commandsProcessor.registerCommand('DeleteFlag', deleteFlag);

    commandsProcessor.registerCommand('CheckFlag', checkFlag);

    commandFiltersProcessor.registerFilter('Flag', filterFlag);
};

function createNewFlag({ui, state}, params) {
    if(params.length === 1) {
        state.persistent.flags.add(params[0]);
    } else {
        ui.debug("Missing mandatory argument for @SetFlag");
    }
}

function createNewTemporaryFlag({ui, state}, params) {
    if(params.length === 1) {
        state.temp.flags.add(params[0]);
    } else {
        ui.debug("Missing mandatory argument for @TempFlag");
    }
}

function deleteFlag({uiDispatcher, state}, params) {
    if(params.length === 1) {
        if(state.temp.flags.has(params[0])) {
            state.temp.flags.delete(params[0])
        }
        if(state.persistent.flags.has(params[0])) {
            state.persistent.flags.delete(params[0])
        }
    } else {
        uiDispatcher.debug("Missing mandatory argument for @DeleteFlag");
    }
}

function checkFlag({parser, uiDispatcher, state}, params) {
    if(params.length > 0) {
        for(let i = params.length-1;i>0;i--) {
            let value = params[i];
            if(state.temp.flags.has(value)) {
                parser.goto(value);
                return true;
            }
            if(state.persistent.flags.has(value)) {
                parser.goto(value);
                return true;
            }
        }
        return false;
    } else {
        uiDispatcher.debug("Missing mandatory argument(s) for @CheckFlag");
    }
}

function filterFlag({state},params) {
    if(params.length == 0) {
        return state.persistent.flags.has(params[0])
            || state.temp.flags.has(params[0]);
    } else {
        console.log('Filter flag needs only one argument');
    }
}