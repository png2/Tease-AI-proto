/**
 * Useful methods for randomization
 */
export class RandomUtil {
    /**
     * Generate a random integer between min and max included
     * @param min The minimum value
     * @param max The maximum value
     * @returns {number} A random integer
     */
    static getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Resolve a percent chance to do something.
     * Per exemple : isLucky(80) return true 80% of the time and false 20%
     * @param chanceInPercent The percent considered to be "lucky"
     * @returns {boolean}
     */
    static isLucky(chanceInPercent) {
        return chanceInPercent >= RandomUtil.getRandomInteger(1,100);
    }
}