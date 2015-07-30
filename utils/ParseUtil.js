/**
 * Useful methods for the parsers
 */
export class ParseUtil {
    /**
     * Cleanup the chariot returns and line feeds from a string
     * @param line The line to clean up
     * @returns {string} The line without any line return
     */
    static clearCRLF(line) {
        return line.replace(/[\n\r]/g, '');
    }

    /**
     * CHeck if the current line is a target for a goto instruction
     * @param line The line to check
     * @returns {boolean} True if the line is a target
     */
    static isTargetLine(line) {
        return line.startsWith('(') && line.endsWith(')');
    }

    /**
     * Check if the line match the given target
     * @param line The line to check
     * @param target The target to match
     * @returns {boolean} true if the line matches the target
     */
    static doesLineContainsTarget(line, target) {
        var regexp = /\(([^\)]*)\)/g;
        var matches;
        while ((matches = regexp.exec(line)) !== null) {
            if(matches[1] === target) {
                return true;
            }
        }
        return false;
    }
}