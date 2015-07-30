import {UIDispatcher} from './core/UIDispatcher';
import {Settings} from './core/Settings';
import {Session} from './core/Session'
import {TextUI} from './ui/TextUI'

module.exports = function() {
    // get a file from the command line
    var file = process.argv[2];

// Create the needed objects common between the core and the UI
    var settings = new Settings(__dirname);
    var uiDispatcher = new UIDispatcher(settings);

// Instanciate a UI
    var gui = new TextUI(uiDispatcher,settings);

// Start a session
    var state = Session.start(uiDispatcher,settings,file);
// Attach the session state to the gui
    gui.attachSessionState(state);
};