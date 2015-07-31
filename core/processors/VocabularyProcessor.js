/**
 * Process all the vocabulary filters related things
 * A vocabulary filter is in the form #Filter or #Filter(param,param,...)
 */
export class VocabularyProcessor {
    constructor(ui,settings, state) {
        this.filters = new Map();
        this.uiDispatcher = ui;
        this.settings = settings;
        this.state = state;
    }

    /**
     * Register a new vocabulary filter
     * The callback should be in the form :
     * function(settings, state, params){return filteredValue}
     * The params being an empty array if there is no parameters
     * @param filterName The name of the filter to match
     * @param callback The callback to call when a #{filterName} instruction is found
     */
    registerVocabularyFilter(filterName, callback) {
        this.filters.set(filterName,callback);
    }

    /**
     * Execute the code attached to the filter
     * @param filterName The name of the filter
     * @param params The params passed to the filter
     * @returns {string} The filtered value or #{filterName} if no filter is found
     */
    applyVocabularyFilter(filterName, params = []) {
        if(this.filters.has(filterName)) {
            this.uiDispatcher.debug(`Applying Filter '${filterName}' with params : ${params.length==0?'no params':params.join(",")}`);
            return this.filters.get(filterName)(this, this.settings, this.state, params);
        } else {
            return `#${filterName}`;
            // apply default filter when its done
            //throw `Unknown filter : ${filterName}`;
        }
    }

    /**
     * Process all the filters in the line
     * @param line The line to process
     * @returns {string} The line with all the filters replaced by their filtered values
     */
    processVocabularyFilters(line) {
        line = this._processVocabularyFiltersWithParams(line);
        line = this._processVocabularyFiltersWithoutParams(line);
        return line;
    }

    /**
     * process filters with parameters : #Filter(param)
     * @private
     */
    _processVocabularyFiltersWithParams(line) {
        return line.replace(/#([\w-]+)\(([^\)]+)\)/g,(match,filterName,filterParameters) => {
            return this.applyVocabularyFilter(filterName,filterParameters.split(','));
        });
    }

    /**
     * Process filters without parameters #Filter
     * @private
     */
    _processVocabularyFiltersWithoutParams(line) {
        return line.replace(/#([\w-]+)/g,(match,filterName) => {
            return this.applyVocabularyFilter(filterName);
        });
    }
}