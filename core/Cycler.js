import {ScriptParser} from './parsers/ScriptParser';
import {ListParser} from './parsers/ListParser';
import {FileUtil} from '../utils/FileUtil';
import {RandomUtil} from '../utils/RandomUtil';
import {Constants} from './Constants';

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
        this.state.temp.cycler = {
            round: 0,
            step: ''
        };

        this._sessionEndTimeTs = Date.now() + this._calculateCycleDuration();
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
        switch(this.state.temp.cycler.step) {
            case Constants.CYCLE_STATES.START:
                this.skipToTaunts();
                break;
            case Constants.CYCLE_STATES.TAUNTING:
                this.skipToModule();
                break;
            case Constants.CYCLE_STATES.MODULE:
                if(this._sessionEndTimeTs >= Date.now()) {
                    this.skipToEnd();
                } else {
                    this.skipToLink();
                }
                break;
            case Constants.CYCLE_STATES.LINK:
                this.skipToTaunts();
                break;
        }
    }

    /**
     * Force the cycle to move to taunts
     */
    skipToTaunts() {
        this.state.temp.cycler.round++;
        this.state.temp.cycler.step = Constants.CYCLE_STATES.TAUNTING;
        var baseTauntsDir = path.join(this.settings.appPath,'Scripts',this.settings.domme.directory,'Stroke');
        var listParser = new ListParser(
            this.commandFiltersProcessor,
            this.vocabularyProcessor,
            this.uiDispatcher);
            if(this.state.persistent.chastity) {
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
            },this._calculateTauntTime());
    }

    /**
     * Force the cycle to move to a random starting script
     */
    skipToStart() {
        this.state.temp.cycler.step = Constants.CYCLE_STATES.START;
        this._parseRandomScriptInDir('Stroke/Start');
    }

    /**
     * Force the cycle to move to a random module
     */
    skipToModule() {
        this.state.temp.cycler.step = Constants.CYCLE_STATES.MODULE;
        this._parseRandomScriptInDir('Modules');
    }

    /**
     * Force the cycle to move to a random link
     */
    skipToLink() {
        this.state.temp.cycler.step = Constants.CYCLE_STATES.LINK;
        this._parseRandomScriptInDir('Stroke/Link');
    }

    /**
     * Force the cycle to move to a random ending script
     */
    skipToEnd() {
        this.state.temp.cycler.step = Constants.CYCLE_STATES.END;
        this._parseRandomScriptInDir('Stroke/End');
    }

    /**
     * Force the end the cycle (without calling an ending script)
     */
    end() {

    }

    _parseRandomScriptInDir(dir) {
        var startFile = FileUtil.getRandomFileFromDirectory(
            path.join(this.settings.appPath,'/Scripts/',this.settings.domme.directory,dir),
            FileUtil.createChastityScriptFilter(this.state),
            false);
        var parser = new ScriptParser(
            this.commandsProcessor,
            this.variablesProcessor,
            this.vocabularyProcessor,
            this.answerProcessor,
            this,
            this.uiDispatcher,
            this.state);
        parser.parseFile(startFile);
    }

    _calculateTauntTime() {
        var duration = 0;
        if(this.settings.ranges.tauntLength.decideByLevel) {
            switch(this.settings.domme.level) {
                case 1:
                    duration = RandomUtil.getRandomInteger(1,2);
                    break;
                case 2:
                    duration = RandomUtil.getRandomInteger(1,3);
                    break;
                case 3:
                    duration = RandomUtil.getRandomInteger(3,5);
                    break;
                case 4:
                    duration = RandomUtil.getRandomInteger(4,7);
                    break;
                case 5:
                    duration = RandomUtil.getRandomInteger(5,10);
                    break;
            }
        } else {
            duration = RandomUtil.getRandomInteger(this.settings.ranges.tauntLength.min,this.settings.ranges.tauntLength.max);
        }
        this.uiDispatcher.debug(`Taunting duration : ${duration} minutes`);
        return duration * 60 * 1000
    }

    _calculateCycleDuration() {
        var duration = 0;
        if(this.settings.ranges.teaseLength.decideByLevel) {
            switch(this.settings.domme.level) {
                case 1:
                    duration = RandomUtil.getRandomInteger(10,15);
                    break;
                case 2:
                    duration = RandomUtil.getRandomInteger(15,20);
                    break;
                case 3:
                    duration = RandomUtil.getRandomInteger(20,30);
                    break;
                case 4:
                    duration = RandomUtil.getRandomInteger(30,45);
                    break;
                case 5:
                    duration = RandomUtil.getRandomInteger(45,60);
                    break;
            }
        } else {
            duration = RandomUtil.getRandomInteger(this.settings.ranges.teaseLength.min,this.settings.ranges.teaseLength.max);
        }
        this.uiDispatcher.debug(`Session duration : ${duration} minutes`);
        return duration * 60 * 1000
    }
}