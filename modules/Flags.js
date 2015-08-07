/**
 * The flag system management
 */
module.exports.register = function({commandsProcessor, commandFiltersProcessor, state}) {
    if(!state.persistent.flags) state.persistent.flags = {};
    state.temp.flags = {};

    commandsProcessor.registerCommand('SetFlag', createNewFlag);

    commandsProcessor.registerCommand('TempFlag', createNewTemporaryFlag);

    commandsProcessor.registerCommand('DeleteFlag', deleteFlag);

    commandsProcessor.registerCommand('CheckFlag', checkFlag);

    commandFiltersProcessor.registerFilter('Flag', filterFlag);
};

function createNewFlag({ui, state}, params) {
    if(params.length === 1) {
        var flagName = params[0];
        state.persistent.flags[flagName] = 1;
    } else {
        ui.debug("Missing mandatory argument for @SetFlag");
    }
}

function createNewTemporaryFlag({ui, state}, params) {
    if(params.length === 1) {
        state.temp.flags[params[0]] = 1;
    } else {
        ui.debug("Missing mandatory argument for @TempFlag");
    }
}

function deleteFlag({uiDispatcher, state}, params) {
    if(params.length === 1) {
        if(params[0] in state.temp.flags) {
            delete state.temp.flags[params[0]];
        }
        if(params[0] in state.persistent.flags) {
            delete state.persistent.flags[params[0]];
        }
    } else {
        uiDispatcher.debug("Missing mandatory argument for @DeleteFlag");
    }
}

function checkFlag({parser, uiDispatcher, state}, params) {
    if(params.length > 0) {
        for(let i = params.length-1;i>=0;i--) {
            let value = params[i];
            if(value in state.temp.flags) {
                parser.goto(value);
                return true;
            }
            if(value in state.persistent.flags) {
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
    if(params.length == 1) {
        return params[0] in state.persistent.flags
            || params[0] in state.temp.flags;
    } else {
        console.log('Filter flag needs only one argument');
    }
}