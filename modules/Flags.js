/**
 * The flag system management
 */
module.exports = function(commandsProcessor, vocabularyProcessor, uiDispatcher, settings, state) {
    state.persistent.flags = new Set();
    state.temp.flags = new Set();

    commandsProcessor.registerCommand('SetFlag', (scriptParser, ui, settings, state, params)=> {
        if(params.length === 1) {
            state.persistent.flags.add(params[0]);
        } else {
            ui.debug("Missing mandatory argument for @SetFlag");
        }
    });

    commandsProcessor.registerCommand('TempFlag', (scriptParser, ui, settings, state, params)=> {
        if(params.length === 1) {
            state.temp.flags.add(params[0]);
        } else {
            ui.debug("Missing mandatory argument for @TempFlag");
        }
    });

    commandsProcessor.registerCommand('DeleteFlag', (scriptParser, ui, settings, state, params)=> {
        if(params.length === 1) {
            if(state.temp.flags.has(params[0])) {
                state.temp.flags.delete(params[0])
            }
            if(state.persistent.flags.has(params[0])) {
                state.persistent.flags.delete(params[0])
            }
        } else {
            ui.debug("Missing mandatory argument for @DeleteFlag");
        }
    });

    commandsProcessor.registerCommand('CheckFlag', (scriptParser, ui, settings, state, params)=> {
        if(params.length > 0) {
            for(let i = params.length-1;i>0;i--) {
                let value = params[i];
                if(state.temp.flags.has(value)) {
                    scriptParser.goto(value);
                    break;
                }
                if(state.persistent.flags.has(value)) {
                    scriptParser.goto(value);
                    break;
                }
            }
        } else {
            ui.debug("Missing mandatory argument(s) for @CheckFlag");
        }
    });
};