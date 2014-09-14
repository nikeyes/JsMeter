/*Sample performance function with parameters*/

var globalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9];


function SumArrayWithFor(pArray)
{
    var total,
        arrayLength;
        
    arrayLength = pArray.length;
    for (var i = 0; i < arrayLength; i++)
    { 
        total += pArray[i];
    }
    return total;
}

function SumArrayWithForIn(pArray) {
    var total;
        
    for (value in pArray)
    { 
        total += value;
    }
    return total;
}



JsMeter.Execute(function () { SumArrayWithFor(globalArray) }, 100);

JsMeter.Execute(function () { SumArrayWithForIn(globalArray) }, 100);
