/**
 * The current state of the session
 * It contains predefined states used by the core
 * But you can also add your own states in the properties <code>persistent</code> and <code>temp</code>
 * All the properties added to <code>persistent</code> will be kept from one session to another even if you close the app (not implemented yet...)
 * All the properties added to <code>temp</code> will be lost once the session ends
 */
export class State {
    constructor() {
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
    }
}