import {ListParser} from '../core/parsers/ListParser';
import {RandomUtil} from '../utils/RandomUtil';

var path = require('path');

/**
 * Edging management
 */
module.exports.register = function({commandsProcessor, commandFiltersProcessor, vocabularyProcessor}) {
    commandsProcessor.registerCommand("Edge", createEdgeCommand(commandFiltersProcessor, vocabularyProcessor));
    commandsProcessor.registerCommand("EdgeNoHold", createEdgeNoHoldCommand(commandFiltersProcessor, vocabularyProcessor));
    commandsProcessor.registerCommand("EdgeHold", createEdgeHoldCommand(commandFiltersProcessor, vocabularyProcessor));
};

function createEdgeCommand(commandFiltersProcessor, vocabularyProcessor) {
    return function({parser,uiDispatcher, settings}) {
        var holdChance = calculateHoldingChance(settings);

        if(RandomUtil.isLucky(holdChance)) {
            edge(parser, commandFiltersProcessor, vocabularyProcessor, uiDispatcher, settings, true);
        } else {
            edge(parser, commandFiltersProcessor, vocabularyProcessor, uiDispatcher, settings);
        }
    };
}
function createEdgeNoHoldCommand(commandFiltersProcessor, vocabularyProcessor) {
    return function edgeNoHold({parser,uiDispatcher, settings}) {
        edge(parser, commandFiltersProcessor, vocabularyProcessor, uiDispatcher, settings);
    };
}

function createEdgeHoldCommand(commandFiltersProcessor, vocabularyProcessor) {
    return function edgeHold({parser,uiDispatcher, settings}) {
        edge(parser, commandFiltersProcessor, vocabularyProcessor, uiDispatcher, settings, true);
    };
}

/**
 * Make the user edge
 * @param parser
 * @param commandFiltersProcessor
 * @param vocabularyProcessor
 * @param uiDispatcher
 * @param settings
 * @param hold true if he has to hold the edge once he reaches it
 */
function edge(parser, commandFiltersProcessor, vocabularyProcessor, uiDispatcher, settings, hold = false) {
    parser.wait();

    var edgeTauntsParser = createEdgeTauntingParser(commandFiltersProcessor, vocabularyProcessor, uiDispatcher, settings);

    uiDispatcher.registerInputListener("edging", "on edge", 100, () => {
        edgeTauntsParser.stop(() => {
            uiDispatcher.unregisterInputListener("edging");
            if(hold) {
                uiDispatcher.displayText(vocabularyProcessor.processVocabularyFilters('#HoldTheEdge'),()=>{
                    holdTheEdge(commandFiltersProcessor, vocabularyProcessor, uiDispatcher, settings, parser);
                });
            } else {
                stopStroking(uiDispatcher, vocabularyProcessor, parser);
            }
        });
    });
}

/**
 * Make the user hold the edge
 * @param commandFiltersProcessor
 * @param vocabularyProcessor
 * @param uiDispatcher
 * @param settings
 * @param parser
 */
function holdTheEdge(commandFiltersProcessor, vocabularyProcessor, uiDispatcher, settings, parser) {
    var holdTheEdgeParser = createHoldTheEdgeTauntingParser(commandFiltersProcessor, vocabularyProcessor, uiDispatcher, settings);
    var holdingTime = calculateHoldingTime(settings);

    setTimeout(()=> {
        holdTheEdgeParser.stop(() => {
            stopStroking(uiDispatcher, vocabularyProcessor, parser);
        });
    }, holdingTime * 1000);
}
/**
 * Create the parser for the edging taunts
 * @param commandFiltersProcessor
 * @param vocabularyProcessor
 * @param uiDispatcher
 * @param settings
 * @returns {ListParser}
 */
function createEdgeTauntingParser(commandFiltersProcessor, vocabularyProcessor, uiDispatcher, settings) {
    var edgeTauntsParser = new ListParser(commandFiltersProcessor, vocabularyProcessor, uiDispatcher);
    edgeTauntsParser.loadFile(path.join(settings.appPath, 'Scripts/', settings.domme.directory ,'/Stroke/Edge/Edge.txt'));
    return edgeTauntsParser;
}
/**
 * Create the parser for the hold the edge taunts
 * @param commandFiltersProcessor
 * @param vocabularyProcessor
 * @param uiDispatcher
 * @param settings
 * @returns {ListParser}
 */
function createHoldTheEdgeTauntingParser(commandFiltersProcessor, vocabularyProcessor, uiDispatcher, settings) {
    var edgeTauntsParser = new ListParser(commandFiltersProcessor, vocabularyProcessor, uiDispatcher);
    edgeTauntsParser.loadFile(path.join(settings.appPath, 'Scripts/', settings.domme.directory ,'/Stroke/HoldTheEdge/holdTheEdge.txt'));
    return edgeTauntsParser;
}
/**
 * Calculate the time in seconds the user has to hold the edge
 * @param settings
 * @returns {number}
 */
function calculateHoldingTime(settings) {
    var level = settings.domme.level;
    var holdingMax = settings.sub.holdingEdgeMax;
    var holdingTime = 0;
    if (level == 1) holdingTime = RandomUtil.getRandomInteger(10, 30);
    if (level == 2) holdingTime = RandomUtil.getRandomInteger(15, 45);
    if (level == 3) holdingTime = RandomUtil.getRandomInteger(20, 60);
    if (level == 4) holdingTime = RandomUtil.getRandomInteger(45, 120);
    if (level == 5) holdingTime = RandomUtil.getRandomInteger(60, 300);

    if (settings.domme.crazy) {
        holdingTime *= 2;
    }

    if (holdingMax > 0) {
        holdingTime = Math.max(holdingTime, holdingMax);
    }

    return holdingTime;
}
/**
 * Calculate the chance in percent to ask the user to hold the edge
 * @param settings
 * @returns {number}
 */
function calculateHoldingChance(settings) {
    var level = settings.domme.level;
    var holdChance = 20;
    if (level == 2) holdChance = 25;
    if (level == 3) holdChance = 30;
    if (level == 4) holdChance = 40;
    if (level == 5) holdChance = 50;
    return holdChance;
}

/**
 * Make the user stop stroking once on the edge
 * @param uiDispatcher
 * @param vocabularyProcessor
 * @param parser
 */
function stopStroking(uiDispatcher, vocabularyProcessor, parser) {
    uiDispatcher.displayText(vocabularyProcessor.processVocabularyFilters('#StopStrokingEdge'), ()=> {
        parser.resume();
    });
}
