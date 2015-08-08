var tc = require('timezonecomplete');

/**
 * All functions time related
 */
export class TimeUtil {

    static getAge(birthday) {
        var start = new tc.DateTime(birthday.year, birthday.month, birthday.day);
        var end = new tc.DateTime();

        var duration = end.diff(start);

        return duration.wholeYears() - 1;
    }

}