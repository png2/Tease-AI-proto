import {RandomUtil} from '../utils/RandomUtil';
import {ParseUtil} from '../utils/ParseUtil'

/**
 * Very basic Text based UI for testing purposes
 */
export class TextUI {
    constructor(uiDispatcher, settings) {
        this.uiDispatcher = uiDispatcher;
        this.settings = settings;

        this._attachListeners();

        this._startInputLoop();
    }

    attachSessionState(state) {
        this.state = state;
    }

    /**
     * Start listening to user input
     * @private
     */
    _startInputLoop() {
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        process.stdin.on('data', (text) => {
            this.uiDispatcher.triggerInputListeners(ParseUtil.clearCRLF(text));
        });
    }

    /**
     * Attach all the listeners to get the core's and modules' events
     * @private
     */
    _attachListeners() {
        this.uiDispatcher.registerTextToDisplayListener((message,callback)=> {
            var minWait = 100, maxWait = 100;
            if(this.state.temp.rapidText) {
                minWait = 1000;
                maxWait = 1000;
            }
            setTimeout(()=> {
                console.log(`Domme: ${message}`);
                if (!!callback) callback();
            }, RandomUtil.getRandomInteger(minWait, maxWait));
        });
        this.uiDispatcher.registerDebugListener((message)=>{
            if(this.settings.debug) {
                console.log(`##DEBUG## : ${message}`);
            }
        });
        this.uiDispatcher.on("displayImage",(path,callback)=>{
            console.log(`IMAGE : ${path}`);
            if(!!callback) callback();
        });
        this.uiDispatcher.on("playVideo",(path,callback)=>{
            console.log(`It should play the VIDEO : ${path} so you'll wait 45seconds instead`);
            setTimeout(callback,45000);
        });
        this.uiDispatcher.on("playAudio",(path,callback)=>{
            console.log(`It should play the AUDIO : ${path} so you'll wait 45seconds instead`);
            setTimeout(callback,45000);
        });
        this.uiDispatcher.on("writingTaskStart",(writingTask)=>{
            console.log(`I want you to write "${writingTask.text}" ${writingTask.linesToWrite} times without doing more than ${writingTask.failuresAllowed} mistakes`);
        });
        this.uiDispatcher.on("writingTaskCorrect",(writingTask)=>{
            console.log(`Good! ${(writingTask.linesToWrite-writingTask.success)} left`);
        });
        this.uiDispatcher.on("writingTaskFailure",(writingTask)=>{
            console.log(`Careful... Only ${writingTask.failuresAllowed-writingTask.failures} left before you fail`)
        });
        this.uiDispatcher.on("writingTaskFailed",(writingTask)=>{
            console.log("Looks like you failed...");
        });
        this.uiDispatcher.on("writingTaskDone",(writingTask)=>{
            console.log('alright you are done!');
        });
    }
}