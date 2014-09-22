/// <reference path="../lib/mocha/mocha.js" />
/// <reference path="../lib/chai/chai.js" />
/// <reference path="../JsMeter.js" />
mocha.setup('bdd');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();


describe('Dado JsMeter', function () {
	it('Cuando llamamos a GetExecutionTime devuelve una estructura correcta', function(){
		//Arrange
		var sut,
			actual,
			expected;
		
		sut = null;
		expected = {
						ExecutionTime: 0,
						Deviation: 0,
						DeviationPerCent: 0,
					};
			
		//Act
		actual = JsMeter.getExecutionTime(function () { var a = 1; });
		
		//Assert
        expect(actual).to.be.an('object');
        //.isObject(expected, actual, 'Assert Style -> Valor esperado incorrecto')    ;
		expect(actual, 'Expect Style -> Valor esperado incorrecto').to.have.property('ExecutionTime');

	})
})