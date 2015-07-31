import {Cycler} from './Cycler';
import {State} from './State';
import {ScriptParser} from './parsers/ScriptParser';
import {ListParser} from './parsers/ListParser';
import {CommandsProcessor} from './processors/CommandsProcessor';
import {VariablesProcessor} from './processors/VariablesProcessor';
import {VocabularyProcessor} from './processors/VocabularyProcessor';
import {AnswerProcessor} from './processors/AnswerProcessor';
import {FileUtil} from '../utils/FileUtil';

/**
 * Manage a session of play by the user
 */
export class Session {

    /**
     * Start the session
     * @param uiDispatcher The uiDispatcher to communicate with the UI
     * @param settings The settings
     * @param file temporary until we have a working cycler...
     * @returns {State} Return the state of the session so that the UI can use it
     */
    static start(uiDispatcher,settings,file) {
        var state = new State();
        var cycler = new Cycler();

        var commandsProcessor = new CommandsProcessor(uiDispatcher,settings,state);
        var vocabularyProcessor = new VocabularyProcessor(uiDispatcher,settings,state);
        var variablesProcessor = new VariablesProcessor();
        var answerProcessor = new AnswerProcessor(uiDispatcher, settings);

        var scriptParser = new ScriptParser(
                                commandsProcessor,
                                variablesProcessor,
                                vocabularyProcessor,
                                answerProcessor,
                                cycler,
                                uiDispatcher,
                                state);

        var listParser = new ListParser(uiDispatcher);

        Session._loadModules(commandsProcessor, vocabularyProcessor, uiDispatcher, settings, state);

        //scriptParser.parseFile(file);
        listParser.parseFiles([
           'D:/milo/Tease AI Open Beta/Scripts/png Wicked Tease/Stroke/StrokeTaunts_1.txt',
           'D:/milo/Tease AI Open Beta/Scripts/png Wicked Tease/Stroke/StrokeTaunts_2.txt',
           'D:/milo/Tease AI Open Beta/Scripts/png Wicked Tease/Stroke/StrokeTaunts_3.txt'
        ]);

        return state;
    }

    /**
     * Dynamically load all the modules in the ../modules directory
     * @private
     */
    static _loadModules(commandsProcessor, vocabularyProcessor, uiDispatcher, settings, state) {
        FileUtil.walk('./modules',filePath => {
            var module = require(filePath);
            if(module && module.register) {
                module.register(commandsProcessor, vocabularyProcessor, uiDispatcher, settings, state)
            } else {
                console.log(`the module ${filePath} is not valid or do not have a 'register' export`)
            }
        });
    }
}