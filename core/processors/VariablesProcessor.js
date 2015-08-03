/**
 * Process the variables related instructions in the modules
 * That includes : @SetVar, @ChangeVar, @ShowVar and @If
 */
export class VariablesProcessor {
    constructor() {
        this.variables = {};
    }

    /**
     * Set a variable value
     * @param variableName The name of the variable
     * @param value The value of the variable
     */
    setValue(variableName,value) {
        this.variables[variableName] = value;
    }

    /**
     * Gte the value of a variable
     * @param variableName The variable name
     * @returns {number}
     */
    getValue(variableName) {
        return this.variables[variableName] || 0;
    }

    /**
     * Process the variable related instructions in the line
     * @param line The line to process
     * @returns {*} The line cleaned up from the variable instructions
     */
    processVariables(line, parser) {
        line = this._processSetVariables(line);
        line = this._processChangeVariables(line);
        line = this._processShowVariables(line);
        line = this._processIf(line, parser);
        return line;
    }

    /**
     * Process @ShowVar[var]
     * @private
     */
    _processShowVariables(line) {
        return line.replace(/@ShowVar\[([^\]]+)\]/g, (match, variableName) => {
            return getValue(variableName);
        });
    }

    /**
     * Process @SetVar[var]=[value]
     * @private
     */
    _processSetVariables(line) {
        return line.replace(/@SetVar\[([^\]]+)\]=\[([^\]]+)\]/g, (match, variableName, variableValue) => {
            setValue(variableName, this._parseVariableValue(variableValue));
            return "";
        });
    }

    /**
     * Process @ChangeVar[var]=[value](+|*|-|/)[value]
     * @private
     */
    _processChangeVariables(line) {
        return line.replace(/@ChangeVar\[([^\]]+)\]=\[([^\]]+)\](\+|\*|\/|-)\[([^\]]+)\]/g, (match,
                                                                                             variableName,
                                                                                             variableFirstValue,
                                                                                             operator,
                                                                                             variableSecondValue) => {
            var calculatedValue = this._parseVariableValue(variableFirstValue);
            switch (operator) {
                case '+':
                    calculatedValue += this._parseVariableValue(variableSecondValue);
                    break;
                case '*':
                    calculatedValue *= this._parseVariableValue(variableSecondValue);
                    break;
                case '/':
                    calculatedValue /= this._parseVariableValue(variableSecondValue);
                    break;
                case '-':
                    calculatedValue -= this._parseVariableValue(variableSecondValue);
                    break;
                default:
                    throw `Invalid operator : ${operator}`;
                    break;
            }

            setValue(variableName, calculatedValue);
            return "";
        });
    }

    /**
     * Process @If[var](=|==|<>|>|>=|<|<=)[value]Then(target)
     * @private
     */
    _processIf(line, parser) {

        return line.replace(/@If\[([^\]]+)\](=|>|<|<=|>=|==|<>)\[([^\]]+)\]Then\(([^\)]+)\)/g,(
            match,
            variableName,
            operator,
            variableExpectedValue,
            target) => {
            var currentValue = getValue(variableName);
            var expectedValue = this._parseVariableValue(variableExpectedValue);
            switch(operator) {
                case '=':
                case '==':
                    if(currentValue === expectedValue) parser.goto(target);
                    break;
                case '<>':
                    if(currentValue !== expectedValue) parser.goto(target);
                    break;
                case '>':
                    if(currentValue > expectedValue) parser.goto(target);
                    break;
                case '<':
                    if(currentValue < expectedValue) parser.goto(target);
                    break;
                case '<=':
                    if(currentValue <= expectedValue) parser.goto(target);
                    break;
                case '>=':
                    if(currentValue >= expectedValue) parser.goto(target);
                    break;
                default:
                    throw `Invalid operator : ${operator}`;
                    break;
            }
            return "";
        });
    }

    /**
     * Parse a variable value, if it's a string it' the name of another variable, if it's a number it's the value
     * @private
     */
    _parseVariableValue(value){
        var numericValue = parseFloat(value);
        if(!isNaN(numericValue)) {
            return numericValue;
        } else {
            return getValue(value);
        }
    }
}