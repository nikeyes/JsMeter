/**
 * JsMeter. Simple performance Meter for JS
 * Returns the milliseconds it takes to execute a function
 *
 * Version 1.0.0, 2014-09-14
 * By Jorge Castro
 * https://github.com/nikeyes/JsMeter
 * Use Execute for modern browsers
 * Use ExecuteOldSchool for compatibility with < IE10 Chome20, Firefox15 : https://developer.mozilla.org/en-US/docs/Web/API/Performance.now
 * 
 */
(function (ns) {
    "use strict";
    var JsMeter = function () {
    };

    JsMeter.prototype = {
        constructor: JsMeter,

        ExecuteOldSchool: function (testFunction, iterations) {
            var start,
                end,
                lapseTime;

            start = new Date().getTime();

            for (var i = 0; i < iterations; i++) {
                testFunction();
            }

            end = new Date().getTime();

            lapseTime = end - start;

            return lapseTime;
        },
        Execute: function (testFunction, iterations) {
            var start,
                end,
                lapseTime;

            start = performance.now();

            for (var i = 0; i < iterations; i++) {
                testFunction();
            }

            end = performance.now();

            lapseTime = end - start;

            return lapseTime;
        }
    };

    //Publish object in namespace
    ns.JsMeter = new JsMeter();

}(window));