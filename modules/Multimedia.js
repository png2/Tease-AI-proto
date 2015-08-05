import {FileUtil} from '../utils/FileUtil';
var path = require('path');
var fs = require('fs');

/**
 * All the things managing the images, videos or audio
 */
module.exports.register = function({commandsProcessor, commandFiltersProcessor, uiDispatcher}) {

    uiDispatcher.on("displayImage", storeLastDisplayedImage);

    commandsProcessor.registerCommand('ShowImage', showImage);

    commandsProcessor.registerCommand('PlayVideo', playVideo);

    commandsProcessor.registerCommand('PlayAudio', playAudio);

    commandsProcessor.registerCommand('LockImage', activateLockImage);

    commandsProcessor.registerCommand('UnlockImage', deactivateLockImage);

    commandsProcessor.registerCommand('DeleteLocalImage',deleteLastDisplayedImage);

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
        commandsProcessor.registerCommand(imageCommand[0], createImageCommand(imageCommand));
        commandFiltersProcessor.registerCommand(imageCommand[0], createImageCommandFilter(imageCommand));
    });

    var videoCommands = [
        ['VideoBlowjob', 'bowjob'],
        ['VideoFemdom', 'femdom'],
        ['VideoFemsub', 'femsub'],
        ['VideoGeneral', 'general'],
        ['VideoHardcore', 'hardcore'],
        ['VideoLesbian', 'lesbian'],
        ['VideoSoftcore', 'softcore']
    ];

    videoCommands.forEach((videoCommand) => {
        commandFiltersProcessor.registerCommand(videoCommand[0], createVideoCommandFilter(videoCommand));
    });

    var dommeVideoCommands = [
        ['VideoBlowjobDomme', 'blowjob'],
        ['VideoFemdomDomme', 'femdom'],
        ['VideoHardcoreDomme', 'hardcore'],
        ['VideoLesbianDomme', 'lesbian'],
        ['VideoSoftcoreDomme', 'softcore']
    ];

    dommeVideoCommands.forEach((videoCommand) => {
        commandFiltersProcessor.registerCommand(videoCommand[0], createVideoCommandFilter(videoCommand));
    });

    var videosCommands = [
        ['PlayJOIVideo','joi'],
        ['PlayCHVideo','cockhero']
    ];

    videosCommands.forEach((videoCommand)=>{
        commandsProcessor.registerCommand(videoCommand[0], createVideoCommand(videoCommand));
    });
};

function storeLastDisplayedImage(path,callback) {
    state.temp.lastDisplayedImage = path;
    if(callback) callback();
}

function showImage({uiDispatcher, settings}, params) {
    if(params.length == 0) {
        uiDispatcher.trigger("displayImage", FileUtil.getRandomImageFromDirectory(settings.images.general));
    } else if(params.length === 1) {
        uiDispatcher.trigger("displayImage",path.join(settings.appPath,"Images",params[0]));
    } else {
        uiDispatcher.debug(`Invalid parameters for @ShowImage`);
    }
}

function playVideo({parser, uiDispatcher, settings,state}, params) {
    if(params.length === 1) {
        triggerAndWaitForCompletion(parser,uiDispatcher,state,"playVideo",path.join(settings.appPath,"Video",params[0]));
        return true;
    } else {
        uiDispatcher.debug(`Invalid parameters for @PlayVideo`);
    }
}

function playAudio({parser, uiDispatcher, settings,state}, params) {
    if(params.length === 1) {
        triggerAndWaitForCompletion(parser,uiDispatcher,state,"playAudio",path.join(settings.appPath,"Audio",params[0]));
        return true;
    } else {
        uiDispatcher.debug(`Invalid parameters for @PlayAudio`);
    }
}

function deleteLastDisplayedImage({state}) {
    if(state.temp.lastDisplayedImage) {
        fs.unlink(state.temp.lastDisplayedImage,function(){});
    } else {
        console.log("damn nothing to delete!!");
    }
}

function activateLockImage({state}) {
    state.temp.lockImage = true;
}

function deactivateLockImage({state}) {
    state.temp.lockImage = false;
}

function createImageCommand(imageCommand) {
    return function ({uiDispatcher, settings}, params) {
        if(params.length === 0) {
            var imgPath = settings.images[imageCommand[1]];
            if(imgPath && imgPath != "") {
                uiDispatcher.on("displayImage", FileUtil.getRandomImageFromDirectory(imgPath));
            } else {
                uiDispatcher.debug(`No path set for @${imageCommand[0]}`);
            }
            return true;
        } else {
            uiDispatcher.debug(`Invalid parameters for @${imageCommand[0]}`);
        }
    };
}

function createImageCommandFilter(imageCommand) {
    return function ({parser,uiDispatcher, settings}) {
        var imgPath = settings.images[imageCommand[1]];
        if(imgPath && imgPath != "") {
            uiDispatcher.on("displayImage", FileUtil.getRandomImageFromDirectory(imgPath));
        } else {
            parser.ignoreLine();
        }
    };
}

function createVideoCommand(videoCommand) {
    return function({parser, uiDispatcher, settings, state}, params) {
        if(params.length === 0) {
            state.temp.videoType = videoCommand[1];
            triggerAndWaitForCompletion(parser,uiDispatcher,state,"playVideo", FileUtil.getRandomVideoFromDirectory(settings.videos[videoCommand[1]]));
            return true;
        } else {
            uiDispatcher.debug(`Invalid parameters for @${videoCommand[0]}`);
        }
    };
}

function createVideoCommandFilter(videoCommand) {
    return function({state}) {
        return state.temp.videoType == videoCommand[1];
    };
}

function triggerAndWaitForCompletion(parser,uiDispatcher,state,event, file) {
    parser.wait();
    uiDispatcher.triggerAsync(event,() => {
        delete state.temp.videoType;
        parser.resume();
    },file);
}
