import {FileUtil} from '../utils/FileUtil';
var path = require('path');
var fs = require('fs');

/**
 * All the things managing the images, videos or audio
 */
module.exports = function(commandsProcessor, vocabularyProcessor, uiDispatcher, settings, state) {

    uiDispatcher.on("displayImage",(path,callback) => {
        state.temp.lastDisplayedImage = path;
        if(callback) callback();
    });

    commandsProcessor.registerCommand('ShowImage', (scriptParser, ui, settings, state, params)=> {
        if(params.length == 0) {
            ui.trigger("displayImage", FileUtil.getRandomImageFromDirectory(settings.images.general));
        } else if(params.length === 1) {
            ui.trigger("displayImage",path.join(settings.appPath,"Images",params[0]));
        } else {
            ui.debug(`Invalid parameters for @ShowImage`);
        }
    });

    commandsProcessor.registerCommand('PlayVideo', (scriptParser, ui, settings, state, params)=> {
        if(params.length === 1) {
            triggerAndWaitForCompletion(scriptParser,ui,"playVideo",path.join(settings.appPath,"Video",params[0]));
        } else {
            ui.debug(`Invalid parameters for @PlayVideo`);
        }
    });

    commandsProcessor.registerCommand('PlayAudio', (scriptParser, ui, settings, state, params)=> {
        if(params.length === 1) {
            triggerAndWaitForCompletion(scriptParser,ui,"playAudio",path.join(settings.appPath,"Audio",params[0]));
        } else {
            ui.debug(`Invalid parameters for @PlayAudio`);
        }
    });

    commandsProcessor.registerCommand('LockImage', (scriptParser, ui, settings, state, params)=> {
        state.temp.lockImage = true;
    });

    commandsProcessor.registerCommand('UnlockImage', (scriptParser, ui, settings, state, params)=> {
        state.temp.lockImage = false;
    });

    commandsProcessor.registerCommand('DeleteLocalImage',(scriptParser, ui, settings, state, params)=> {
        if(state.temp.lastDisplayedImage) {
            fs.unlink(state.temp.lastDisplayedImage,function(){});
        } else {
            console.log("damn nothing to delete!!");
        }
    });

    var imagesCommands = [
        ['ShowLocalImage','general'],
        ['ShowButtImage','butt'],
        ['ShowBoobImage','boob'],
        ['ShowHardcoreImage','hardcore'],
        ['ShowSoftcoreImage','softcore'],
        ['ShowLesbianImage','lesbian'],
        ['ShowBlowjobImage','blowjob'],
        ['ShowFemdomImage','femdom'],
        ['ShowLezdomImage','lezdom'],
        ['ShowHentaiImage','hentai'],
        ['ShowGayImage','gay'],
        ['ShowCaptionsImage','captions'],
        ['ShowGeneralImage','general']
    ];

    imagesCommands.forEach((imageCommand)=>{
        commandsProcessor.registerCommand(imageCommand[0], (scriptParser, ui, settings, state, params)=> {
            if(params.length === 0) {
                ui.on("displayImage",FileUtil.getRandomImageFromDirectory(settings.images[imageCommand[1]]));
            } else {
                ui.debug(`Invalid parameters for @${imageCommand[0]}`);
            }
        });
    });

    var videosCommands = [
        ['PlayJOIVideo','joi'],
        ['PlayCHVideo','cockhero']
    ];

    videosCommands.forEach((videoCommand)=>{
        commandsProcessor.registerCommand(videoCommand[0], (scriptParser, ui, settings, state, params)=> {
            if(params.length === 0) {
                triggerAndWaitForCompletion(scriptParser,ui,"playVideo", FileUtil.getRandomVideoFromDirectory(settings.videos[videoCommand[1]]));
            } else {
                ui.debug(`Invalid parameters for @${videoCommand[0]}`);
            }
        });
    });
};

function triggerAndWaitForCompletion(scriptParser,ui,event, file) {
    scriptParser.wait();
    ui.triggerAsync(event,() => {
        scriptParser.resume();
    },file);
}