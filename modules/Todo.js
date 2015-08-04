/**
 * Just to keep track of unimplemented things and make sure the programm doesn't crash when it encounter a valid but not implemented instruction
 */
module.exports.register = function({commandsProcessor, vocabularyProcessor, commandFiltersProcessor}) {
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
        'EdgeToRuin',
        'EdgeToRuinHold',
        'EdgeToRuinNoHold',
        'EdgeToRuinHoldSecret',
        'EdgeToRuinHoldSecret',
        'EdgeToRuinNoHoldSecret',
        'EdgeToRuinSecret',
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
        'PlayVideoTeaseCensorshipSucks',
        'PlayCensorshipSucks',
        'PauseAvoidTheEdge',
        'PauseAvoidTheEdgeNoTaunts',
        'VitalSubAssignment',
        'CheckBnB',
        'CheckJOIVideo',
        'CheckStrokingState',
        'CheckTnA',
        'CheckVideo',
        'StopTnA',
        'InterruptLongEdge',
        'SendDailyTasks'
    ];

    todoCommands.forEach((value)=>{
        commandsProcessor.registerCommand(value, ({uiDispatcher})=> {
            uiDispatcher.debug(`Should do ${value} but not implemented yet...`);
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
        'SubName'
    ];

    todoVocab.forEach((value)=>{
        vocabularyProcessor.registerVocabularyFilter(value, ()=> {
            return `${value}`;
        });
    });

    var filters = [
        '10MinuteHold',
        '15MinuteHold',
        '1MinuteHold',
        '2MinuteHold',
        '30MinuteHold',
        '3MinuteHold',
        '45MinuteHold',
        '4MinuteHold',
        '5MinuteHold',
        '60MinuteHold',
        'ACup',
        'BCup',
        'CCup',
        'DCup',
        'DDCup',
        'DDD+Cup ',
        'BeforeTease',
        'Bratty',
        'Caring',
        'CBTLevel1',
        'CBTLevel2',
        'CBTLevel3',
        'CBTLevel4',
        'CBTLevel5',
        'CockLarge',
        'CockSizeEnd',
        'CockSizeLarge',
        'CockSizeMedium',
        'CockSizeSmall',
        'CockSmall',
        'Crazy',
        'Cruel',
        'FirstRound',
        'InterruptLongEdge',
        'LongEdge',
        'NewBlogImage',
        'RuinTaunt',
        'SelfOld',
        'SelfYoung',
        'SubName',
        'SubOld',
        'SubYoung',
        'ShowBlogImage',
        'ShowDislikedImage',
        'ShowLikedImage',
        'ShowTaggedImage',
        'SubCircumcised',
        'SubNotCircumcised',
        'SubNotPierced',
        'SubPierced',
        'Supremacist',
        'Tag',
        'TagAss',
        'TagBoobs',
        'TagCloseUp',
        'TagFace',
        'TagFeet',
        'TagFullyDressed',
        'TagFurniture',
        'TagGarment',
        'TagGarmentCovering',
        'TagHalfDressed',
        'TagLegs',
        'TagMasturbating',
        'TagNaked',
        'TagNormal',
        'TagPiercing',
        'TagPussy',
        'TagSexToy',
        'TagSideView',
        'TagSucking',
        'TagTattoo',
        'TagUnderwear',
        'VitalSub',
        'VitalSubAssignment',
        'Vulgar'
    ];

    filters.forEach((filter)=>{
        commandFiltersProcessor.registerFilter(filter,({})=>{
            return false;
        });
    });

    var wtfIsThat = [
        'CountdownAvoidTheEdge',
        'Custom1',
        'Custom2',
        'EdgingHold',
        'EdginStop',
        'EmbedImage',
        'GiveUpCheck',
        'InterruptStartStroking',
        'Module',
        'NewBlowImage',
        'SearchImageBlog',
        'SearchImageBlog',
        'SearchImageBlogAgain',
        'SlowDownCheck',
        'SpeedUpCheck',
        'TnAFastSlides',
        'TnASlides',
        'TnASlowSlides',
        'VarCheck',
        'VTLength'
    ]

};