import {RandomUtil} from '../utils/RandomUtil';

/**
 * Manage the Writing task system
 */
module.exports.register = function({commandsProcessor, vocabularyProcessor}) {

    /**
     * Register the main @WritingTask(line) command
     */
    commandsProcessor.registerCommand('WritingTask', createWritingTask);

    vocabularyProcessor.registerVocabularyFilter("SubWritingTaskMin", getWritingTaskMin);

    vocabularyProcessor.registerVocabularyFilter("SubWritingTaskMax", getWritingTaskMax);
};

function createWritingTask({parser, uiDispatcher, settings}, params) {
    if(params.length == 1) {
        var writingTask = generateWritingTask(settings, params[0]);

        // Stop the parser while the user is doing the task
        parser.wait();

        // Send the task info to the UI
        uiDispatcher.trigger("writingTaskStart",writingTask);

        // Listen on ALL the inputs with the higher priority to stop the program from answering to anything else than the line writing
        uiDispatcher.registerInputListener("writingTask", "", 999, generateWritingTaskProcessor(parser,uiDispatcher,writingTask));
    } else {
        uiDispatcher.debug("Wrong number of params for Writing Task");
    }
}


function getWritingTaskMin({settings}) {
    return settings.sub.writingTask.min;
}

function getWritingTaskMax({settings}) {
    return settings.sub.writingTask.max;
}

/**
 * Generate the callback to process the user input.
 * This is needed to maintain the current context in the listener.
 * @param parser
 * @param uiDispatcher
 * @param writingTask
 * @returns {Function} The listener to give to registerInputListener
 */
function generateWritingTaskProcessor(parser,uiDispatcher,writingTask) {
    return function(text) {
        // Check if the text matches the line requested
        if(text == writingTask.text) {
            writingTask.success++;
            // let the UI know it's been a correct line
            uiDispatcher.trigger("writingTaskStartCorrect",writingTask);
            // check if he is done with the task
            if(writingTask.success >= writingTask.linesToWrite) {
                // let the UI know that the task is done
                uiDispatcher.trigger("writingTaskDone",writingTask);
                // Cleanup the input listener
                uiDispatcher.unregisterInputListener("writingTask");
                // resume the parsing
                parser.resume();
            }
        } else {
            writingTask.failures++;
            // let the UI know it's been a failure
            uiDispatcher.trigger("writingTaskFailure",writingTask);
            // check if the task is failed
            if(writingTask.failures >= writingTask.failuresAllowed) {
                // le the UI know the user has failed the task
                uiDispatcher.trigger("writingTaskFailed",writingTask);
                // clean up the input listener
                uiDispatcher.unregisterInputListener("writingTask");
                // Goto the default failure target
                parser.goto("Failed Writing Task");
                // resume the parsing
                parser.resume();
            }
        }
    };
}

/**
 * Generate a writing task object containg the text to write, the number of times, the number of failures and keeping track of the progress
 * @param settings
 * @param lineToWrite
 * @returns {{text: *, linesToWrite: *, failuresAllowed: *, success: number, failures: number}}
 */
function generateWritingTask(settings, lineToWrite) {
    var linesToWrite = RandomUtil.getRandomInteger(settings.sub.writingTask.min, settings.sub.writingTask.max);
    var minFailures = Math.round((linesToWrite / 2) - settings.domme.level);
    var maxFailures = linesToWrite - settings.domme.level;
    if (minFailures < 0) {
        minFailures = 0;
    }
    if (maxFailures < 0) {
        maxFailures = 1;
    }

    return {
        text: lineToWrite,
        linesToWrite: linesToWrite,
        failuresAllowed: RandomUtil.getRandomInteger(minFailures, maxFailures),
        success: 0,
        failures: 0
    };
}


