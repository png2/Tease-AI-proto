import {ListParser} from '../parsers/ListParser';
import {RandomUtil} from '../../utils/RandomUtil';

var fs = require('fs');
var path = require('path');

/**
 * Process all the vocabulary filters related things
 * A vocabulary filter is in the form #Filter or #Filter(param,param,...)
 */
export class VocabularyProcessor {
    constructor(ui, settings, state) {
        this.filters = new Map();
        this.uiDispatcher = ui;
        this.settings = settings;
        this.state = state;
        this._cachedVocabulary = new Map();
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
    applyVocabularyFilter(filterName, parser, params = []) {
        if(this.filters.has(filterName)) {
            this.uiDispatcher.debug(`Applying Filter '${filterName}' with params : ${params.length==0?'no params':params.join(",")}`);
            var filteredLine = "" + this.filters.get(filterName)({
                parser:parser,
                settings:this.settings,
                state:this.state
            }, params);
            if(filteredLine.indexOf('#')>=0) {
                return this.processVocabularyFilters(filteredLine,parser);
            }
            return filteredLine;
        } else {
            if(this._cachedVocabulary.has(`${filterName}`)) {
                var vocabParser = this._cachedVocabulary.get(`${filterName}`);
                return vocabParser.readRandomLine();
            } else {
                return `${filterName}`;
                // apply default filter when its done
                //throw `Unknown filter : ${filterName}`;
            }
        }
    }

    /**
     * Process all the filters in the line
     * @param line The line to process
     * @param parser The parser used to fetch this line
     * @returns {string} The line with all the filters replaced by their filtered values
     */
    processVocabularyFilters(line, parser) {
        line = this._processVocabularyFiltersWithParams(line, parser);
        line = this._processVocabularyFiltersWithoutParams(line, parser);
        return line;
    }

    /**
     * process filters with parameters : #Filter(param)
     * @private
     */
    _processVocabularyFiltersWithParams(line, parser) {
        return line.replace(/#([\w-]+)\(([^\)]+)\)/g,(match,filterName,filterParameters) => {
            return this.applyVocabularyFilter(filterName,parser, filterParameters.split(','));
        });
    }

    /**
     * Process filters without parameters #Filter
     * @private
     */
    _processVocabularyFiltersWithoutParams(line, parser) {
        return line.replace(/#([\w-]+)/g,(match,filterName) => {
            return this.applyVocabularyFilter(filterName, parser);
        });
    }

    preloadVocabulary(commandFilterProcessor, preloadingDone) {
        var vocabFilesDir = path.join(this.settings.appPath, 'Scripts/', this.settings.domme.directory  ,'/Vocabulary/');
        var promisedLoaders = [];
        fs.readdirSync(vocabFilesDir).forEach((file)=>{
            file = path.join(vocabFilesDir,file);
            var stat = fs.statSync(file);
            if (stat.isFile()) {
                promisedLoaders.push(new Promise((resolve,reject) =>{
                    var listParser = new ListParser(commandFilterProcessor, this, this.settings);
                    this._cachedVocabulary.set(path.basename(file).slice(1,-4),listParser);
                    listParser.loadFile(file,()=>{
                        resolve();
                    });
                }));
            }
        });
        Promise.all(promisedLoaders).then(preloadingDone).catch((e)=>{console.log(e);});
    }
}