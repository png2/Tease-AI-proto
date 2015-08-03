import {RandomUtil} from '../utils/RandomUtil';

/**
 * All the orgasm decision things
 */
module.exports.register = function({commandsProcessor, commandFiltersProcessor}) {

    commandsProcessor.registerCommand('DecideOrgasm', decideOrgasm);

    commandFiltersProcessor.registerFilter('OrgasmAllowed', filterOrgasmAllowed);
    commandFiltersProcessor.registerFilter('OrgasmRuined', filterOrgasmRuined);
    commandFiltersProcessor.registerFilter('OrgasmDenied', filterOrgasmDenied);
};

function decideOrgasm({parser, settings, state}) {
    state.temp.orgasmAllowed = false;
    state.temp.orgasmRuined = false;
    state.temp.orgasmDenied = false;

    if(RandomUtil.isLucky(settings.ranges.orgasmChance[settings.domme.orgasmChance])) {
        if(RandomUtil.isLucky(settings.ranges.ruinChance[settings.domme.ruinChance])) {
            state.temp.orgasmRuined = true;
            parser.goto("Orgasm Ruin");
            return true;
        }else {
            state.temp.orgasmAllowed  = true;
            parser.goto("Orgasm Allow");
            return true;
        }
    } else {
        state.temp.orgasmDenied = true;
        parser.goto("Orgasm Deny")
        return true;
    }
}

function filterOrgasmAllowed({state}) {
    return state.temp.orgasmAllowed;
}

function filterOrgasmDenied({state}) {
    return state.temp.orgasmDenied;
}

function filterOrgasmRuined({state}) {
    return state.temp.orgasmRuined;
}