var path = require('path');
var fs = require('fs');
var observed = require('observed');

/**
 * The current state of the session
 * It contains predefined states used by the core
 * But you can also add your own states in the properties <code>persistent</code> and <code>temp</code>
 * All the properties added to <code>persistent</code> will be kept from one session to another even if you close the app (not implemented yet...)
 * All the properties added to <code>temp</code> will be lost once the session ends
 */
export class State {
    constructor(settings) {
        this.settings = settings;

        /**
         * Activate rapidText mode
         * @type {boolean}
         */
        this.rapidText = false;
        /**
         * The sub is in chastiry
         * @type {boolean}
         */
        this.chastity = false;
        /**
         * All the persistent custom states
         * @type {{}}
         */
        this.persistent = {};
        /**
         * All the temporary custom states
         * @type {{}}
         */
        this.temp = {};

        this._loadSavedState();
    }

    _createSaveStateCallback() {
        var state = this;
        return function(event) {
            console.log(state.persistent,event);
            var file = path.join(state.settings.appPath, 'Scripts', state.settings.domme.directory, 'System/state.json');
            fs.writeFile(file, JSON.stringify(state.persistent, null, 4), function (err) {
                if (err) {
                    console.log(`Error while saving the state : ${err}`);
                }
            });
        };
    }

    _loadSavedState() {
        var file = path.join(this.settings.appPath, 'Scripts', this.settings.domme.directory, 'System/state.json');
        var content = fs.readFileSync(file).toString();
        this.persistent = JSON.parse(content);

        //noinspection JSUnresolvedFunction
        observed(this.persistent).on('change', this._createSaveStateCallback());
    }
}
