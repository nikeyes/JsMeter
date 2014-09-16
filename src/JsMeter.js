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

    // Programmer: Larry Battle 
    // Date: Mar 06, 2011
    // Purpose: Calculate standard deviation, variance, and average among an array of numbers.
    var _IsArray = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    },
    _GetNumWithSetDec = function (num, numOfDec) {
        var pow10s = Math.pow(10, numOfDec || 0);
        return (numOfDec) ? Math.round(pow10s * num) / pow10s : num;
    },
    _GetAverageFromNumArr = function (numArr, numOfDec) {
        if (!_IsArray(numArr)) { return false; }
        var i = numArr.length,
            sum = 0;
        while (i--) {
            sum += numArr[i];
        }
        return _GetNumWithSetDec.call(this,(sum / numArr.length), numOfDec);
    },
    _GetVariance = function (numArr, numOfDec) {
        if (!_IsArray(numArr)) { return false; }
        var avg = _GetAverageFromNumArr(numArr, numOfDec),
            i = numArr.length,
            v = 0;

        while (i--) {
            v += Math.pow((numArr[i] - avg), 2);
        }
        v /= numArr.length;
        return _GetNumWithSetDec.call(this, v, numOfDec);
    },
    _GetStandardDeviation = function (numArr, numOfDec) {
        if (!_IsArray(numArr)) { return false; }
        var stdDev = Math.sqrt(_GetVariance(numArr, numOfDec));
        return _GetNumWithSetDec.call(this, stdDev, numOfDec);
    };

    JsMeter.prototype = {
        constructor: JsMeter,

        ExecuteOnceTime: function (testFunction, iterations) {
            var start,
                end,
                lapseTime;

            start = performance.now();

            for (var i = 0; i < iterations; i++) {
                testFunction();
            }

            end = performance.now();

            lapseTime = end - start;

            return {
                Average: lapseTime,
                Variance: 0,
                Deviation: 0
            };
        },

        ExecuteMultipleTimes: function (testFunction) {
            var start,
                end,
                lapseTime,
                resultsArray = [],
                precision = 4;

            for (var i = 0; i < 30; i++) {
                start = performance.now();

                testFunction();

                end = performance.now();

                lapseTime = end - start;

                resultsArray.push(lapseTime);
            }

            return {
                Average: _GetAverageFromNumArr.call(this, resultsArray, precision),
                Variance: _GetVariance.call(this, resultsArray, precision),
                Deviation: _GetStandardDeviation.call(this, resultsArray, precision)
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