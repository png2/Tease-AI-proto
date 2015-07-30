/**
 * This class is the link between the Core and the UI so they can stay separated
 * It allows the UI to register listeners to listen from events triggered by the session going on
 * It allows the session going on to register listeners triggered when the user input text
 */
export class UIDispatcher {
    constructor(settings) {
        this.settings = settings;

        this.eventsListeners = new Map();
        this.inputListeners = {};
        this.temporaryInputListeners = [];
    }

    /**
     * Register a listener on a type of event triggered by the core or its modules
     * @param event The type of event
     * @param listener A function that will be called when the event is triggered
     */
    on(event,listener) {
        if(this.eventsListeners.has(event)) {
            this.eventsListeners.get(event).push(listener);
        } else {
            this.eventsListeners.set(event,[listener]);
        }
    }

    /**
     * Trigger synchronously a type of event. All the listeners registered for this event will be called with the given parameters
     * @param event The type of events
     * @param params The params to pass to the listener
     */
    trigger(event,...params) {
        if(this.eventsListeners.has(event)) {
            this.eventsListeners.get(event).forEach((listener)=>{
                listener(...params);
            });
        }
    }

    /**
     * Trigger asynchronously a type of event. All the listeners registered for this event will be called with the given parameters
     * @param event The type of event
     * @param callback The callback that will be called when ALL the listeners have finished their execution
     * @param params The params to pass to the listener
     */
    triggerAsync(event,callback,...params) {
        if(this.eventsListeners.has(event)) {
            var arrayOfPromisedListeners = [];
            this.eventsListeners.get(event).forEach((listener)=> {
                var promisedListener = new Promise(function (resolve, reject) {
                    listener(...params, () => {
                        resolve();
                    });
                });
                arrayOfPromisedListeners.push(promisedListener);
            });
            Promise
                .all(arrayOfPromisedListeners)
                .then(callback)
                .catch((reason) => {
                    console.log(reason);
                });
        }
    }

    /**
     * Register a listener for displaying the text said by the domme
     * Shortcut for on("displayText",listener) for convenience purposes
     * @param listener
     */
    registerTextToDisplayListener(listener) {
        this.on("displayText",listener);
    }

    /**
     * Send text said by the domme to be displayed
     * Shortcut for triggerAsync("displayText",onDisplayDoneCallback, message)
     * @param message The text
     * @param onDisplayDoneCallback The callback to call once the text has been displayed
     */
    displayText(message, onDisplayDoneCallback) {
        this.triggerAsync("displayText",onDisplayDoneCallback, message);
    }

    /**
     * Register a listener for processing debug text
     * Shortcut for on("debug",listener) for convenience purposes
     * @param listener
     */
    registerDebugListener(listener) {
        this.on("debug",listener);
    }

    /**
     * Display a debug message
     * Shortcut for trigger("debug",message)
     * @param message The debug message
     */
    debug(message) {
        this.trigger("debug",message);
    }

    /**
     * Register a listener for user input.
     * Each listener has a pattern and a priority attached.
     * The pattern is a string that will be matched against the input text. The listener will be called only if the input matches the pattern
     * You can pass several patterns by passing an array or a string with patterns separated by a comma ("pattern1,pattern2,pattern3")
     * Some patterns are "specials" as they can match user specified values and/or require the domme honorific to be attached to match. These patterns are automatically processed
     * The special patterns are "yes", "no", "greetings" and "thank you"
     * All the patterns are matched without considering the case (except the domme honorific for special patterns if the option is set)
     * If the pattern is an empty string it will match all the inputs
     * If the listener returns <code>false</code> then the following listeners will not be called even if they match the input
     * @param listenerName The name of the listener to be able to remove it later
     * @param pattern The pattern that will trigger this listener
     * @param priority The priority of this listener (0 being the lowest and 999 the highest)
     * @param listener The listener
     */
    registerInputListener(listenerName,pattern, priority, listener) {
        this.inputListeners[listenerName] = InputListener.buildInputListeners(pattern, priority, listener, this.settings);
    }

    /**
     * Unregister a listener for user input
     * @param listenerName The name of the listener to remove
     */
    unregisterInputListener(listenerName) {
        delete this.inputListeners[listenerName];
    }

    /**
     * Register a temporary listener for user input.
     * This method works like <code>registerInputListener</code> but do not take a name
     * The temporary listeners are stored separately and can be cleaned up by calling <code>cleanUpTemporaryInputListeners</code>
     * It is usefull to attach a bunch of listeners that will need to be all deleted not long after and not bother tracking the names
     * @param patterns The pattern that will trigger this listener
     * @param priority The priority of this listener (0 being the lowest and 999 the highest)
     * @param listener The listener
     */
    registerTemporaryInputListener(patterns, priority, listener) {
        this.temporaryInputListeners.push(...InputListener.buildInputListeners(patterns, priority, listener, this.settings));
    }

    /**
     * Remove ALL the temporary input listeners
     */
    cleanUpTemporaryInputListeners() {
        this.temporaryInputListeners = [];
    }

    /**
     * Called when a text has been input by the user. It calls all the listeners for user input matching the input text
     * @param text The text inputted by the user
     */
    triggerInputListeners(text) {
        var listeners = this._flattenInputListenersMap(this.inputListeners);
        listeners = listeners.concat(this.temporaryInputListeners);
        listeners.sort((a,b)=>{
            return a.priority < b.priority;
        });

        for(let index = 0; index < listeners.length; index++) {
            let listener = listeners[index];
            try {
                if (listener.matches(text, this.settings)) {
                    if(!listener.execute(text)) {
                        return;
                    }
                }
            } catch(e) {
                if(e.name === "HonorificNotMatching") {
                    this.displayText("I think you forgot a little something....");
                    return;
                } else throw e;
            }
        }
    }

    /**
     * Flatten a map of listeners into an array
     * @private
     */
    _flattenInputListenersMap(listenersMap) {
        var listeners = [];
        for (let key in this.inputListeners) {
            if(this.inputListeners.hasOwnProperty(key)) {
                listeners.push(...this.inputListeners[key]);
            }
        }
        return listeners;
    }
}

/**
 * Utility class for managing Input listeners
 */
class InputListener {
    constructor(pattern, priority, listener, keySentence = false) {
        this.pattern = pattern;
        this.priority = priority;
        this.listener = listener;
        this.keySentence = keySentence;
    }

    /**
     * Build a group of input listeners
     * @param pattern either a pattern, an array of patterns or a string with comma separated patterns
     * @param priority
     * @param listener
     * @param settings
     * @returns {Array} An array of InputListener objects
     */
    static buildInputListeners(pattern, priority, listener, settings) {
        var listeners = [];
        var patterns;
        if(Array.isArray(pattern)) {
            patterns = pattern;
        } else {
            patterns = pattern.split(',');
        }

        patterns.forEach((pattern, index, curPatterns) => {
            let specialPatterns = this._expendSpecialPatterns(pattern,settings);
            if(specialPatterns.length > 0) {
                specialPatterns.forEach((specialPattern)=>{
                    listeners.push(new InputListener(specialPattern.trim(), priority, listener, true));
                });
            } else {
                listeners.push(new InputListener(pattern, priority, listener));
            }
        });
        return listeners;
    }

    /**
     * Check if a text matches a pattern. Take into account the "special" patterns that might be followed by the dom honorific
     * @param text The text
     * @param settings The user settings
     * @returns {boolean} Return true if the patten matches the inputted text
     */
    matches(text, settings) {
        if(text.toLowerCase().match(this.pattern.toLowerCase().trim())) {
            if (this.keySentence && settings.sub.forceHonorific) {
                let honorific = settings.sub.honorific;
                if (settings.sub.forceCapitalizedHonorific) {
                    honorific = honorific.charAt(0).toUpperCase() + honorific.slice(1);
                }
                if (!text.match(honorific)) {
                    throw {name: "HonorificNotMatching", message: honorific};
                }
            }
            return true;
        }
        return false;
    }

    /**
     * Execute the listener associated to this pattern
     * @param text The inputted text
     * @returns {boolean} Return false if the chain of execution should stop after this listener
     */
    execute(text) {
        return this.listener(text);
    }

    /**
     * Detect the "special" patterns and return the actual values behind them
     * @private
     */
    static _expendSpecialPatterns(pattern, settings) {
        switch(pattern.toLowerCase()) {
            case 'yes':
                return settings.sub.keySentences.yes.split(',');
            case 'no':
                return settings.sub.keySentences.no.split(',');
            case 'hello':
                return settings.sub.keySentences.greeting.split(',');
            case 'thank you':
                return settings.sub.keySentences.thankYou.split(',');
        }
        return [];
    }
}