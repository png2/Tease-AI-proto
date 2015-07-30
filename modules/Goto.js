import {RandomUtil} from '../utils/RandomUtil';

/**
 * All the commands to go to another part of the file
 */
module.exports = function(commandsProcessor, vocabularyProcessor, uiDispatcher, settings, state) {
    commandsProcessor.registerCommand('Goto', (scriptParser, ui, settings, state, params)=> {
        if (params.length > 0) {
            scriptParser.goto(params[0]);
        } else {
           ui.debug("Goto command without any parameter, ignored...")
        }
    });

    for(let i=1;i<=99;i++) {
        (function(chance) {
            commandsProcessor.registerCommand(`Chance${chance>9?chance:'0'+chance}`, (scriptParser, ui, settings, state, params)=> {
                if (params.length > 0) {
                    if(RandomUtil.isLucky(chance)) {
                        scriptParser.goto(params[0]);
                    }
                } else {
                    ui.debug("Chance command without any parameter, ignored...")
                }
            });
        })(i);
    }

    commandsProcessor.registerCommand('GotoDommeLevel', (scriptParser, ui, settings, state, params)=> {
        scriptParser.goto(`DommeLevel${settings.domme.level}`);
    });

    commandsProcessor.registerCommand('GotoDommeApathy', (scriptParser, ui, settings, state, params)=> {
        scriptParser.goto(`ApathyLevel${settings.domme.apathy}`);
    });

    commandsProcessor.registerCommand('GotoDommeOrgasm', (scriptParser, ui, settings, state, params)=> {
        scriptParser.goto(`${settings.domme.orgasmChance} Allows`);
    });

    commandsProcessor.registerCommand('GotoDommeRuin', (scriptParser, ui, settings, state, params)=> {
        scriptParser.goto(`${settings.domme.ruinChance} Allows`);
    });
};