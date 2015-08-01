import {CommandsProcessor} from './CommandsProcessor';

/**
 * Manage the commands and Commands filters used in all the list files : taunts, cbt, edging, etc.
 */
export class CommandFiltersProcessor extends CommandsProcessor{

    constructor(ui,settings, state) {
        super(ui,settings,state);
    }

    setListParser(listParser) {
        super.setScriptParser(listParser);
    }

    registerFilter(filterName,filter) {
        super.registerCommand(filterName,({parser, settings, state}, params)=>{
            if(!filter({settings:settings, state:state}, params)) {
                parser.ignoreLine();
            }
        });

        super.registerCommand(`Not${filterName}`,({parser, settings, state}, params)=>{
            if(filter({settings:settings, state:state}, params)) {
                parser.ignoreLine();
            }
        });
    }

}