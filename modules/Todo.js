/**
 * Just to keep track of unimplemented things and make sure the programm doesn't crash when it encounter a valid but not implemented instruction
 */
module.exports = function(commandsProcessor, vocabularyProcessor, uiDispatcher, settings, state) {
    var todoCommands = [
        'ShowBlogImage',
        'LikeBlogImage',
        'DislikeBlogImage',
        'ShowLikedImage',
        'ShowDislikedImage',
        'ShowTaggedImage',
        'StartStroking',
        'StartTaunts',
        'StopStroking',
        'StopTaunts',
        'Edge',
        'EdgeHold',
        'EdgeNoHold',
        'EdgeToRuin',
        'EdgeToRuinHold',
        'EdgeToRuinNoHold',
        'EdgingDecide',
        'CBT',
        'CBTCock',
        'CBTBalls',
        'BookmarkModule',
        'BookmarkLink',
        'PlayCensorshipSucks',
        'PlayAvoidTheEdge',
        'ResumeAvoidTheEdge',
        'PlayRedLightGreenLight',
        'VitalSubAssignment'
    ];

    todoCommands.forEach((value)=>{
        commandsProcessor.registerCommand(value, (scriptParser, ui, settings, state, params)=> {
            ui.debug(`Should do ${value} but not implemented yet...`);
        });
    });
    
    var todoVocab = [
        'DomAge',
        'DomAvgCockMax',
        'DomAvgCockMin',
        'DomCup',
        'DomEyes',
        'DomHair',
        'DomLargeCockMin',
        'DomMood',
        'DomName',
        'DomSelfAgeMax',
        'DomSelfAgeMin',
        'DomSubAgeMax',
        'DomSubAgeMin',
        'GlitterContact1',
        'GlitterContact2',
        'GlitterContact3',
        'OrgasmLimitDate',
        'RANDNumberHigh',
        'RANDNumberLow',
        'ShorName',
        'SubAge',
        'SubBirthdayDay',
        'SubBirthdayMonth',
        'SubCockSize',
        'SubEyes',
        'SubHair',
        'SubName',
        'SubWritingTaskMax',
        'SubWritingTaskMin',
        'TagFurniture',
        'TagGarment',
        'TagSexToy',
        'TagTattoo',
        'TagUnderwear'
    ];

    todoVocab.forEach((value)=>{
        vocabularyProcessor.registerVocabularyFilter(value, (settings, state, params)=> {
            return `${value}`;
        });
    });
    
};