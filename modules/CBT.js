import {ListParser} from '../core/parsers/ListParser';
import {RandomUtil} from '../utils/RandomUtil';

var path = require('path');

/**
 * CBT management
 */
module.exports.register = function({commandsProcessor, commandFiltersProcessor, vocabularyProcessor}) {
    commandsProcessor.registerCommand("CBT", createCBTCommand(commandFiltersProcessor, vocabularyProcessor));
    commandsProcessor.registerCommand("CBTCock", createCBTCockCommand(commandFiltersProcessor, vocabularyProcessor));
    commandsProcessor.registerCommand("CBTBalls", createCBTBallsCommand(commandFiltersProcessor, vocabularyProcessor));

    for(var i = 1;i<=5;i++) {
        commandFiltersProcessor.registerFilter(`CBTLevel${i}`,createCBTLevelFilter(i));
    }
};

function createCBTLevelFilter(level) {
    return function({settings}) {
        return settings.sub.cbt.level == level;
    };
}

function createCBTCommand(commandFiltersProcessor, vocabularyProcessor) {
    return function({parser,uiDispatcher, settings, state}) {
        if(settings.sub.cbt.allowBallsTorture && settings.sub.cbt.allowBallsTorture) {
            if(RandomUtil.isLucky(50)) {
                doCBTCock(parser, uiDispatcher, commandFiltersProcessor, vocabularyProcessor, settings, state);
                return true;
            } else {
                doCBTBalls(parser, uiDispatcher, commandFiltersProcessor, vocabularyProcessor, settings, state);
                return true;
            }
        } else if(settings.sub.cbt.allowBallsTorture) {
            doCBTBalls(parser, uiDispatcher, commandFiltersProcessor, vocabularyProcessor, settings, state);
            return true;
        } else if(settings.sub.cbt.allowCockTorture) {
            doCBTCock(parser, uiDispatcher, commandFiltersProcessor, vocabularyProcessor, settings, state);
            return true;
        } else {
            uiDispatcher.debug("No CBT allowed :(");
        }
    };
}

function createCBTCockCommand(commandFiltersProcessor, vocabularyProcessor) {
    return function ({parser,uiDispatcher, settings, state}) {
        if(settings.sub.cbt.allowCockTorture) {
            doCBTCock(parser, uiDispatcher, commandFiltersProcessor, vocabularyProcessor, settings, state);
            return true;
        } else {
            uiDispatcher.debug("No CBT Cock allowed :(");
        }
    };
}

function createCBTBallsCommand(commandFiltersProcessor, vocabularyProcessor) {
    return function ({parser,uiDispatcher, settings, state}) {
        if(settings.sub.cbt.allowBallsTorture) {
            doCBTBalls(parser, uiDispatcher, commandFiltersProcessor, vocabularyProcessor, settings, state);
            return true;
        } else {
            uiDispatcher.debug("No CBT Balls allowed :(");
        }
    };
}

function doCBTCock(parser, uiDispatcher, commandFiltersProcessor, vocabularyProcessor, settings, state) {
    doCBT('CBTCock', parser, uiDispatcher, commandFiltersProcessor, vocabularyProcessor, settings, state);
}

function doCBTBalls(parser, uiDispatcher, commandFiltersProcessor, vocabularyProcessor, settings, state) {
    doCBT('CBTBalls', parser, uiDispatcher, commandFiltersProcessor, vocabularyProcessor, settings, state);
}

function doCBT(cbtFileBaseName, parser, uiDispatcher, commandFiltersProcessor, vocabularyProcessor, settings, state) {
    parser.wait();

    var cbtFirstTauntsParserPromise = createCBTParserPromise(cbtFileBaseName + '_First',commandFiltersProcessor, vocabularyProcessor, uiDispatcher, settings);
    var cbtTauntsParserPromise = createCBTParserPromise(cbtFileBaseName,commandFiltersProcessor, vocabularyProcessor, uiDispatcher, settings);

    state.temp.cbt = {
        round: 0,
        awaitAnswer: false
    };

    Promise.all([cbtFirstTauntsParserPromise,cbtTauntsParserPromise]).then((parsers)=>{
        var cbtFirstTauntsParser = parsers[0];
        var cbtTauntsParser = parsers[1];
        uiDispatcher.registerInputListener("CBT", "", 10, () => {
            if(state.temp.cbt.awaitAnswer && state.temp.cbt.round <= settings.domme.level) {
                state.temp.cbt.awaitAnswer = false;
                uiDispatcher.displayText(cbtTauntsParser.readRandomLine(),()=>{
                    state.temp.cbt.awaitAnswer = true;
                    state.temp.cbt.round++;
                });
            } else if(state.temp.cbt.round > settings.domme.level) {
                uiDispatcher.unregisterInputListener('CBT');
                parser.resume();
            }
        });

        parser.queue(cbtFirstTauntsParser.readRandomLine(),()=>{
            state.temp.cbt.awaitAnswer = true;
            state.temp.cbt.round++;
        });
    }).catch((e)=>{console.log(e)});
}

function createCBTParserPromise(cbtFileBaseName,commandFiltersProcessor, vocabularyProcessor, uiDispatcher, settings) {
    return new Promise((resolve,reject) => {
        var cbtTauntsParser = new ListParser(commandFiltersProcessor, vocabularyProcessor, uiDispatcher);
        cbtTauntsParser.loadFile(path.join(settings.appPath, 'Scripts/', settings.domme.directory ,'/CBT/',`${cbtFileBaseName}.txt`),()=>{
            resolve(cbtTauntsParser);
        });
    });
}