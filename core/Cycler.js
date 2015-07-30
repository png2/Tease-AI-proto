/**
 * The class that cycle throught the files
 * The cycle is Start->taunts->module->link->taunt
 * After each module the cycler check if it should start a new cycle of link->taunt->module of end the session
 */
export class Cycler {

    /**
     * Start the cycle
     * Choose a random Start file to play
     */
    start() {

    }

    /**
     * Go to the next step of the cycle
     */
    next() {

    }

    /**
     * Force the cycle to move to taunts
     */
    skipToTaunts() {

    }

    /**
     * Force the cycle to move to a random starting script
     */
    skipToStart() {

    }

    /**
     * Force the cycle to move to a random module
     */
    skipToModule() {

    }

    /**
     * Force the cycle to move to a random link
     */
    skipToLink() {

    }

    /**
     * Force the cycle to move to a random ending script
     */
    skipToEnd() {

    }

    /**
     * Force the end the cycle (without calling an ending script)
     */
    end() {

    }
}