import {RandomUtil} from './RandomUtil';
var fs = require('fs'), path = require('path');

/**
 * Some useful methods to process files
 */
export class FileUtil {

    /**
     * Recursively browse a directory and call the <code>callback</code> for each file found
     * @param currentDirPath The path to browse
     * @param callback The callback to call when a file is found
     */
    static walk(currentDirPath, callback) {
        fs.readdirSync(currentDirPath).forEach(function(name) {
            var filePath = path.join(currentDirPath, name);
            var stat = fs.statSync(filePath);
            if (stat.isFile()) {
                filePath = path.join('..', filePath);
                callback(filePath);
            } else if (stat.isDirectory()) {
                FileUtil.walk(filePath, callback);
            }
        });
    }

    /**
     * Get a random image (png,jog or gif) from a given directory. Recursive by default
     * @param directory The directory to browse
     * @param recursive Should parse the content recursively (true) or not (false)
     * @returns {string} The complete path of the image
     */
    static getRandomImageFromDirectory(directory, recursive = true) {
        return FileUtil.getRandomFileFromDirectory(directory,/\.png|\.jpg|\.gif|\.jpeg/i,recursive);
    }

    /**
     * Get a random video (avi,mpeg4, mkv or wmv ) from a given directory. Recursive by default
     * @param directory The directory to browse
     * @param recursive Should parse the content recursively (true) or not (false)
     * @returns {string} The complete path of the video
     */
    static getRandomVideoFromDirectory(directory, recursive = true) {
        return FileUtil.getRandomFileFromDirectory(directory,/\.avi|\.mkv|\.mp4|\.wmv|\.m4p|\.m4v|\.mpg|\.mpeg/i,recursive);
    }

    /**
     * Get a random file from a directory. Recursive by default
     * @param directory The directory to browse
     * @param filter A filter that will be matched against the filename. only the files respecting the filter can be selected. Or a function that will be called to filter the file name
     * @param recursive Should parse the content recursively (true) or not (false)
     * @returns {string} The complete path of the video
     */
    static getRandomFileFromDirectory(directory,filter="", recursive = true) {
        var files = fs.readdirSync(directory);
        files = files.filter(function(name) {
            var filePath = path.join(directory, name);
            if(typeof(filter) == 'function') {
                return filter(filePath);
            } else {
                var extension = path.extname(filePath);
                if(extension.match(filter)) {
                    return true;
                } else if(extension === "") {
                    var stat = fs.statSync(filePath);
                    return stat.isDirectory();
                }
            }
            return false;
        });
        return findRandomFile(files,directory,filter, recursive);
    }

    static createChastityScriptFilter(state) {
        if(state.chastity) {
            return function(filepath) {
                return filepath.endsWith("_CHASTITY.txt");
            };
        } else {
            return function(filepath) {
                return !filepath.endsWith("_CHASTITY.txt");
            };
        }
    }
}

/**
 * Find a random file from a list of files
 * @param files The list of files
 * @param directory The base directory
 * @param filter The filter to match
 * @param recursive Should be recusrive or not
 * @returns {*} A random file
 */
function findRandomFile(files,directory,filter, recursive = true) {
    if(files.length === 0) return "";

    var index = RandomUtil.getRandomInteger(0,files.length-1);
    var name = files[index];
    try {
        var filePath = path.join(directory, name);
    } catch(e) {
        console.log(e,name,index);
    }
    var stat = fs.statSync(filePath);
    if (stat.isFile()) {
        return filePath;
    } else if (stat.isDirectory() && recursive) {
        let fileFound = FileUtil.getRandomFileFromDirectory(filePath,filter);
        if(fileFound === "") {
            files.splice(index,1);
            return findRandomFile(files,directory,filter);
        }
        return fileFound;
    }
}