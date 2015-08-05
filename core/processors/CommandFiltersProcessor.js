import {CommandsProcessor} from './CommandsProcessor';

/**
 * Manage the commands and Commands filters used in all the list files : taunts, cbt, edging, etc.
 */
export class CommandFiltersProcessor extends CommandsProcessor{

    constructor(ui,settings, state) {
        super(ui,settings,state);

        this.filterProcessor = new CommandsProcessor(ui,settings,state);
    }

    registerFilter(filterName,filter) {
        this.filterProcessor.registerCommand(filterName,({parser, settings, state}, params)=>{
            if(!filter({settings:settings, state:state}, params)) {
                this.uiDispatcher.debug(`ignore : ${filterName}`);
                parser.ignoreLine();
                return true;
            }
        });

        this.filterProcessor.registerCommand(`Not${filterName}`,({parser, settings, state}, params)=>{
            if(filter({settings:settings, state:state}, params)) {
                this.uiDispatcher.debug(`ignore : Not${filterName}`);
                parser.ignoreLine();
                return true;
            }
        });
    }

    processFilters(line, parser) {
        return this.filterProcessor.processCommands(line,parser,false);
    }

}