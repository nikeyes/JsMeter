/**
 * JsMeter. Simple performance Meter for JS
 * Returns the milliseconds it takes to execute a function
 *
 * Version 1.0.0, 2014-09-14
 * By Jorge Castro
 * https://github.com/nikeyes/JsMeter
 * 
 */
(function (ns) {
    "use strict";
    var JsMeter = function () {
        /*Compatibility with < IE10 Chome20, Firefox15 : https://developer.mozilla.org/en-US/docs/Web/API/Performance.now
         * Based on: http://gent.ilcore.com/2012/06/better-timer-for-javascript.html
        */
        ns.performance = window.performance || {};
        ns.performance.now = performance.now ||
                   performance.mozNow ||
                   performance.msNow ||
                   performance.oNow ||
                   performance.webkitNow ||
                   function () { return new Date().getTime(); };
    };

    JsMeter.prototype = {
        constructor: JsMeter,

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