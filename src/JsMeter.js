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
        _CreatePolyfillPerformanceObject.call(this);
        this._trackingCollection = [];
        this._totalElapsedTime = 0;
    };

    
    var _CreatePolyfillPerformanceObject = function () {
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

    var _standardDeviation = function (values, precision) {
        if (!precision) precision = 2;

        var avg = _average(values);
        
        var squareDiffs = values.map(function (value) {
            var diff = value - avg;
            var sqrDiff = diff * diff;
            return sqrDiff;
        });
        
        var avgSquareDiff = _average(squareDiffs);
        
        var stdDev = Math.sqrt(avgSquareDiff);
        return stdDev.toFixed(precision);
    }
    
    var _average = function (data, precision) {
        if (!precision) precision = 2;
        var sum = data.reduce(function (sum, value) {
            return sum + value;
        }, 0);
        
        var avg = sum / data.length;
        return avg.toFixed(precision);
    }

    JsMeter.prototype = {
        constructor: JsMeter,

        getExecutionTime: function (testFunction, iterations) {
            var start,
                end,
                lapseTime,
                resultsArray = [],
                executionTime,
                deviation,
                precision = 4;
            
            if (!iterations) iterations = 6;

            for (var i = 0; i < iterations; i++) {
                start = performance.now();

                testFunction();

                end = performance.now();

                lapseTime = end - start;

                resultsArray.push(lapseTime);
            }            ;
            
            executionTime = _average.call(this, resultsArray, precision);
            deviation = _standardDeviation.call(this, resultsArray, precision);


            return {
                ExecutionTime: executionTime,
                Deviation: deviation,
                DeviationPerCent: (deviation*100) / executionTime
            };
            
        },

        StartTracking: function (id) {
            var tracking = {
                id: id,
                startTime: performance.now(),
                endTime: 0,
                elapsedTime: 0,
                percentOverTotal: 0
            };
            
            this._trackingCollection.push(tracking);
        },
        EndTracking: function () {
            var tracking = this._trackingCollection.pop();
            tracking.endTime = performance.now();
            tracking.elapsedTime = tracking.endTime - tracking.startTime;
            this._totalElapsedTime += tracking.elapsedTime
            this._trackingCollection.push(tracking);
        },

        GetTrackings: function () {
            var len = this._trackingCollection.length,
                tracking;

            for (var i = 0; i < len; i++) {
                tracking = this._trackingCollection[i];
                tracking.percentOverTotal = (tracking.elapsedTime / this._totalElapsedTime) * 100;
            }
            return this._trackingCollection;
        }
    };

    //Publish object in namespace
    ns.JsMeter = new JsMeter();

}(window));