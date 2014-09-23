JsMeter v0.1
=======

Simple Medidor de Rendimiento JS

getExecutionTime -> Devuelve los milisegundos que tarda en ejecutarse la función. Ver: https://github.com/nikeyes/JsMeter/tree/master/samples/JsMeterSampleGetExecutionTime.html
getOperationsPerSecond -> Devuleve las veces por segundo que se ha podido ejecutar la función pasada como parámetro. Ver: https://github.com/nikeyes/JsMeter/tree/master/samples/JsMeterSampleGetOperationPerSecond.html
startTracking/endTracking -> Calculan el tiempo transcurrido entre la llamada a start y la llamada a end. Para ver el resultad hay que llamar a JsMeter.getTrackings(); Ver: https://github.com/nikeyes/JsMeter/tree/master/samples/JsMeterSampleTracking.html


Estructura devuelta por getExecutionTime:
{
    ExecutionTime: executionTime,
    Deviation: deviation,
    DeviationPerCent: deviationPerCent,
    MinExecutionTime: minExecutionTime,
    MaxExecutionTime: maxExecutionTime,
};

Estructura devuelta por getOperationsPerSecond:
{
    OperPerSecond: operPerSecond,
    Deviation: deviation,
    DeviationPerCent: deviationPerCent,
    MinOperPerSecond: minOperPerSecond,
    MaxOperPerSecond: maxOperPerSecond,
};

Estructura devuelta por getTrackings:
[{
    id: ,
    startTime: ,
    endTime: ,
    elapsedTime: ,
    percentOverTotal: 
}, ......]