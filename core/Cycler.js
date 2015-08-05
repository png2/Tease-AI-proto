import {ScriptParser} from './parsers/ScriptParser';
import {ListParser} from './parsers/ListParser';
import {FileUtil} from '../utils/FileUtil';

var path = require('path');

/**
 * The class that cycle throught the files
 * The cycle is Start->taunts->module->link->taunt
 * After each module the cycler check if it should start a new cycle of link->taunt->module of end the session
 */
export class Cycler {

    constructor(commandsProcessor,
                variablesProcessor,
                vocabularyProcessor,
                answerProcessor,
                commandFiltersProcessor,
                uiDispatcher,
                settings,
                state){
        this.commandsProcessor = commandsProcessor;
        this.vocabularyProcessor = vocabularyProcessor;
        this.variablesProcessor = variablesProcessor;
        this.answerProcessor = answerProcessor;
        this.commandFiltersProcessor = commandFiltersProcessor;
        this.uiDispatcher = uiDispatcher;
        this.settings = settings;
        this.state = state;
        this._currentStep = '';
    }

    /**
     * Start the cycle
     * Choose a random Start file to play
     */
    start() {
        this.skipToStart();
    }

    /**
     * Go to the next step of the cycle
     */
    next() {
        console.log('call next');
        switch(this._currentStep) {
            case 'start':
                this.skipToTaunts();
                break;
            case 'taunts':
                this.skipToModule();
                break;
            case 'module':
                this.skipToLink();
                break;
            case 'link':
                this.skipToEnd();
                break;
        }
    }

    /**
     * Force the cycle to move to taunts
     */
    skipToTaunts() {
        this._currentStep = 'taunts';
        var baseTauntsDir = path.join(this.settings.appPath,'Scripts',this.settings.domme.directory,'Stroke');
        var listParser = new ListParser(
            this.commandFiltersProcessor,
            this.vocabularyProcessor,
            this.uiDispatcher);
            if(this.state.chastity) {
                listParser.loadFiles([
                    path.join(baseTauntsDir, 'ChastityTaunts_1.txt'),
                    path.join(baseTauntsDir, 'ChastityTaunts_2.txt'),
                    path.join(baseTauntsDir, 'ChastityTaunts_3.txt')
                ]);
            } else {
                listParser.loadFiles([
                    path.join(baseTauntsDir, 'StrokeTaunts_1.txt'),
                    path.join(baseTauntsDir, 'StrokeTaunts_2.txt'),
                    path.join(baseTauntsDir, 'StrokeTaunts_3.txt')
                ]);
            }

            setTimeout(()=>{
                listParser.stop(()=>{
                    this.next();
                })
            },30000);
    }

    /**
     * Force the cycle to move to a random starting script
     */
    skipToStart() {
        this._currentStep = 'start';
        this._parseRandomScriptInDir('Stroke/Start');
    }

    /**
     * Force the cycle to move to a random module
     */
    skipToModule() {
        this._currentStep = 'module';
        this._parseRandomScriptInDir('Modules');
    }

    /**
     * Force the cycle to move to a random link
     */
    skipToLink() {
        this._currentStep = 'link';
        this._parseRandomScriptInDir('Stroke/Link');
    }

    /**
     * Force the cycle to move to a random ending script
     */
    skipToEnd() {
        this._currentStep = 'end';
        this._parseRandomScriptInDir('Stroke/End');
    }

    /**
     * Force the end the cycle (without calling an ending script)
     */
    end() {

    }

    _parseRandomScriptInDir(dir) {
        var startFile = FileUtil.getRandomFileFromDirectory(path.join(this.settings.appPath,'/Scripts/',this.settings.domme.directory,dir),FileUtil.createChastityScriptFilter(this.state),false);
        var parser = new ScriptParser(this.commandsProcessor,this.variablesProcessor, this.vocabularyProcessor, this.answerProcessor, this, this.uiDispatcher, this.state);
        parser.parseFile(startFile);
    }
}