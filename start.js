/**
 * Hook to have ES6 in node js...
 * The real stuff starts in startES6.js
 */
require("babel/register");

var startEs6 = require("./startES6");

startEs6();