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
        ns.performance.now = window.performance.now ||
                   window.performance.mozNow ||
                   window.performance.msNow ||
                   window.performance.oNow ||
                   window.performance.webkitNow ||
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
    };
    
    var _average = function (data, precision) {
        if (!precision) precision = 2;
        var sum = data.reduce(function (sum, value) {
            return sum + value;
        }, 0);
        
        var avg = sum / data.length;
        return avg.toFixed(precision);
    };

    var _minValueOfArray = function (elements) {
        return Math.min.apply(Math, elements);
    };

    var _maxValueOfArray = function (elements) {
        return Math.max.apply(Math, elements);
    };

    var _getOperationsPerSecond = function (testFunction)
    {
        var hz, 
                period, 
                startTime = new Date(), 
                runs = 0,
                totalTime; 
            
        do {

            testFunction();

            runs++;
            totalTime = new Date() - startTime;

        } while (totalTime < 1000);

        // convert ms to seconds 
        totalTime /= 1000;

        // period → how long per operation 
        period = totalTime / runs;

        // hz → the number of operations per second 
        hz = 1 / period;
            
        return hz;
    };
    
    var _getTrackingById = function (id) {
        var i=0,
            found = false,
            lengthCollection,
            tracking;
        
        lengthCollection = this._trackingCollection.length;
        while (!found && i < lengthCollection) {
            tracking = this._trackingCollection[i];
            if (tracking.id === id) {
                found = true;
            }
            i++;
        }

        if (!found) {
            throw Error("Tracking Id no existe: " + id);
        }

        return tracking;
    };


    JsMeter.prototype = {
        constructor: JsMeter,

        getExecutionTime: function (testFunction, iterations) {
            var start,
                end,
                lapseTime,
                resultsArray = [],
                executionTime,
                deviation,
                deviationPerCent,
                minExecutionTime,
                maxExecutionTime,
                precision = 4;
            
            if (!iterations) iterations = 6;

            for (var i = 0; i < iterations; i++) {
                start = ns.performance.now();

                testFunction();

                end = ns.performance.now();

                lapseTime = end - start;

                resultsArray.push(lapseTime);
            }
            
            executionTime = _average.call(this, resultsArray, precision);
            deviation = _standardDeviation.call(this, resultsArray, precision);
            deviationPerCent = (deviation * 100) / executionTime;
            deviationPerCent = deviationPerCent.toFixed(0);
            minExecutionTime = _minValueOfArray(resultsArray).toFixed(precision);
            maxExecutionTime = _maxValueOfArray(resultsArray).toFixed(precision);

            return {
                ExecutionTime: executionTime,
                Deviation: deviation,
                DeviationPerCent: deviationPerCent,
                MinExecutionTime: minExecutionTime,
                MaxExecutionTime: maxExecutionTime,
            };
            
        },
        
        getOperationsPerSecond: function (testFunction) {
            var operPerSeconds,
                resultsArray = [],
                operPerSecond,
                deviation,
                deviationPerCent,
                minOperPerSecond,
                maxOperPerSecond,
                precision = 0;

            for (var i = 0; i < 5; i++) {
                operPerSeconds = _getOperationsPerSecond.call(this, testFunction);
                resultsArray.push(operPerSeconds);
            }

            operPerSecond = _average.call(this, resultsArray, precision);
            deviation = _standardDeviation.call(this, resultsArray, precision);
            deviationPerCent = (deviation * 100) / operPerSecond;
            deviationPerCent = deviationPerCent.toFixed(0);
            minOperPerSecond = _minValueOfArray(resultsArray).toFixed(precision);
            maxOperPerSecond = _maxValueOfArray(resultsArray).toFixed(precision);

            return {
                OperPerSecond: operPerSecond,
                Deviation: deviation,
                DeviationPerCent: deviationPerCent,
                MinOperPerSecond: minOperPerSecond,
                MaxOperPerSecond: maxOperPerSecond,
            };
        },

        startTracking: function (id) {
            var tracking = {
                id: id,
                startTime: ns.performance.now(),
                endTime: 0,
                elapsedTime: 0,
                percentOverTotal: 0
            };
            
            this._trackingCollection.push(tracking);
        },

        endTracking: function (id) {
            var tracking = _getTrackingById.call(this, id);
            tracking.endTime = ns.performance.now();
            tracking.elapsedTime = tracking.endTime - tracking.startTime;
            this._totalElapsedTime += tracking.elapsedTime;
        },

        getTrackings: function () {
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