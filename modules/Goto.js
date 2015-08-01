import {RandomUtil} from '../utils/RandomUtil';

/**
 * All the commands to go to another part of the file
 */
module.exports.register = function({commandsProcessor}) {
    commandsProcessor.registerCommand('Goto', goToTarget);

    // Create all the @ChanceXX
    for(let i=1;i<=99;i++) {
        commandsProcessor.registerCommand(`Chance${i>9?i:'0'+i}`, createGoToTargetIfLucky(i));
    }

    commandsProcessor.registerCommand('GotoDommeLevel', goToDommeLevel);

    commandsProcessor.registerCommand('GotoDommeApathy', goToDommeApathy);

    commandsProcessor.registerCommand('GotoDommeOrgasm', goToDommeOrgasm);

    commandsProcessor.registerCommand('GotoDommeRuin', goToDommeRuin);
};

function goToTarget({scriptParser, uiDispatcher}, params) {
    if (params.length > 0) {
        scriptParser.goto(params[0]);
    } else {
        uiDispatcher.debug("Goto command without any parameter, ignored...")
    }
}

function createGoToTargetIfLucky(chance) {
    return function goToTargetIfLucky({scriptParser, ui}, params) {
        if (params.length > 0) {
            if(RandomUtil.isLucky(chance)) {
                scriptParser.goto(params[0]);
            }
        } else {
            ui.debug("Chance command without any parameter, ignored...")
        }
    }
}

function goToDommeLevel({parser, settings}) {
    parser.goto(`DommeLevel${settings.domme.level}`);
}

function goToDommeApathy({parser, settings}) {
    parser.goto(`ApathyLevel${settings.domme.apathy}`);
}

function goToDommeOrgasm({parser, settings}) {
    parser.goto(`${settings.domme.orgasmChance} Allows`);
}

function goToDommeRuin({parser, settings}) {
    parser.goto(`${settings.domme.ruinChance} Allows`);
}