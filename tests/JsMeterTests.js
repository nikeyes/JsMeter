/// <reference path="../lib/mocha/mocha.js" />
/// <reference path="../lib/chai/chai.js" />
/// <reference path="../JsMeter.js" />
mocha.setup('bdd');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();


describe('Dado JsMeter', function () {
    it('Cuando llamamos a getExecutionTime devuelve una estructura correcta', function () {
        //Arrange
        var sut,
			actual;

        sut = JsMeter;

        //Act
        actual = sut.getExecutionTime(function () { var a = 1; });

        //Assert
        expect(actual).to.be.an('object');
        expect(actual, 'Propiedad ExecutionTime no existe').to.have.property('ExecutionTime');
        expect(actual, 'Propiedad Deviation no existe').to.have.property('Deviation');
        expect(actual, 'Propiedad DeviationPerCent no existe').to.have.property('DeviationPerCent');
        expect(actual, 'Propiedad MinExecutionTime no existe').to.have.property('MinExecutionTime');
        expect(actual, 'Propiedad MaxExecutionTime no existe').to.have.property('MaxExecutionTime');

    });

    it('Cuando llamamos a getOperationPerSecond devuelve una estructura correcta', function () {
        //Arrange

        var sut,
            actual;

        /*El método hace 5 ejecucuiones de 1000 milisegundos*/
        this.timeout(5001);

        sut = JsMeter;
        
        //Act
        actual = sut.getOperationPerSecond(function () { var a = 1; });

        //Assert
        expect(actual).to.be.an('object');
        expect(actual, 'Propiedad ExecutionTime no existe').to.have.property('OperPerSecond');
        expect(actual, 'Propiedad Deviation no existe').to.have.property('Deviation');
        expect(actual, 'Propiedad DeviationPerCent no existe').to.have.property('DeviationPerCent');
        expect(actual, 'Propiedad MinExecutionTime no existe').to.have.property('MinOperPerSecond');
        expect(actual, 'Propiedad MaxExecutionTime no existe').to.have.property('MinOperPerSecond');

    });
})