'use strict'

const testdouble = require('testdouble')
const Chai = require('chai')
const ScenarioBuilder = require('../src/ScenarioBuilder')
const TestData = require('./TestData')

const expect = Chai.expect

describe('ScenarioBuilder', () => {
  describe('build', () => {
    it('should not call the body function', () => {
      const builder = new ScenarioBuilder()
      const body = testdouble.constructor(() => null)
      builder.build(body, [])
      testdouble.verify(
        body(),
        { times: 0 }
      )
    })

    it('should produce a function that will call the the body function with no arguments if no generators are supplied', () => {
      const builder = new ScenarioBuilder()
      const body = testdouble.constructor(() => null)
      const result = builder.build(body, [])
      result()
      testdouble.verify(
        body(),
        { times: 1 }
      )
    })

    it('should produce a function that will call the body function with values from the supplied generators', () => {
      const builder = new ScenarioBuilder()
      const value1 = TestData.string()
      const value2 = TestData.string()
      const value3 = TestData.string()

      const gen1 = () => value1
      const gen2 = () => value2
      const gen3 = () => value3

      const body = testdouble.constructor(() => null)

      const result = builder.build(body, [gen1, gen2, gen3])
      result()
      testdouble.verify(
        body(value1, value2, value3),
        { times: 1 }
      )
    })

    it('should create a scenario function with length 1 when the body has a single non-generated argument', () => {
      const builder = new ScenarioBuilder()
      const body = (generated1, generated2, arg) => null
      const result = builder.build(body, [() => 1, () => 2])
      result.length.should.eql(1)
    })

    it('should create a scenario function with length 0 when only generated arguments are used', () => {
      const builder = new ScenarioBuilder()
      const body = (generated1, generated2) => null
      const result = builder.build(body, [() => 1, () => 2])
      result.length.should.eql(0)
    })

    it('should throw an error if more than one non-generated argument is required', () => {
      const builder = new ScenarioBuilder()
      const body = (generated1, generated2, first, second) => null
      expect(
        () => builder.build(body, [() => 1, () => 2])
      ).to.throw(Error, 'Use of more than 1 non-generated scenario arguments is currently unsupported')
    })

    it('should call the body function with any additional parameters supplied to the produced scenario function', () => {
      const builder = new ScenarioBuilder()
      const generatedValue = TestData.string()
      const gen = () => generatedValue
      const runtimeValue1 = TestData.object()
      const runtimeValue2 = TestData.object()

      const body = testdouble.constructor(() => null)

      const result = builder.build(body, [gen])
      result(runtimeValue1, runtimeValue2)
      testdouble.verify(
        body(generatedValue, runtimeValue1, runtimeValue2),
        { times: 1 }
      )
    })

    it('should create a scenario that returns the result of the body function', () => {
      const builder = new ScenarioBuilder()
      const bodyResult = TestData.string()
      const body = () => bodyResult

      const result = builder.build(body, [])
      result().should.eql(bodyResult)
    })
  })
})
