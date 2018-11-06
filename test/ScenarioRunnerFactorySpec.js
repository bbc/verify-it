'use strict'

const testdouble = require('testdouble')
const Chai = require('chai')
const TestData = require('./TestData')
const ScenarioRunnerFactory = require('../src/ScenarioRunnerFactory')

const expect = Chai.expect

describe('ScenarioRunnerFactory', () => {
  describe('run', () => {
    it('should throw an exception if no arguments are provided', () => {
      const runFunction = ScenarioRunnerFactory.create()
      expect(runFunction).to.throw(Error, 'A description and a body function are required.')
    })

    it('should throw an exception if no body function is provided', () => {
      const runFunction = ScenarioRunnerFactory.create()
      expect(
        () => runFunction(TestData.string())
      ).to.throw(Error, 'A description and a body function are required.')
    })

    it('should call the scenario builder with the body and no generator functions if none are supplied', () => {
      const body = TestData.object()
      const fakeScenarioBuilder = {
        build: testdouble.constructor(() => null)
      }
      const runFunction = ScenarioRunnerFactory.create(() => null, fakeScenarioBuilder)

      runFunction(TestData.string(), body)
      testdouble.verify(
        fakeScenarioBuilder.build(body, []),
        { times: 1 }
      )
    })

    it('should call the scenario builder with a single element array if one generator function is provided', () => {
      const body = TestData.object()
      const gen = TestData.object()

      const fakeScenarioBuilder = {
        build: testdouble.constructor(() => null)
      }
      const runFunction = ScenarioRunnerFactory.create(() => null, fakeScenarioBuilder)

      runFunction(TestData.string(), gen, body)
      testdouble.verify(
        fakeScenarioBuilder.build(body, [gen]),
        { times: 1 }
      )
    })

    it('should call the scenario builder with a multiple element array if multiple generator functions are provided', () => {
      const body = TestData.object()
      const gen1 = TestData.object()
      const gen2 = TestData.object()
      const gen3 = TestData.object()

      const fakeScenarioBuilder = {
        build: testdouble.constructor(() => null)
      }
      const runFunction = ScenarioRunnerFactory.create(() => null, fakeScenarioBuilder)

      runFunction(TestData.string(), gen1, gen2, gen3, body)
      testdouble.verify(
        fakeScenarioBuilder.build(body, [gen1, gen2, gen3]),
        { times: 1 }
      )
    })

    it('should call the it function with the correct description', () => {
      const fakeIt = testdouble.constructor(() => null)
      const runFunction = ScenarioRunnerFactory.create(fakeIt, { build: () => null })
      const description = TestData.string()
      runFunction(description, () => null)
      testdouble.verify(
        fakeIt(description, testdouble.matchers.anything()),
        { times: 1 }
      )
    })

    it('should call the it function with the result of the scenario builder', () => {
      const fakeIt = testdouble.constructor(() => null)
      const scenario = TestData.object()
      const fakeScenarioBuilder = {
        build: () => scenario
      }
      const runFunction = ScenarioRunnerFactory.create(fakeIt, fakeScenarioBuilder)
      runFunction(TestData.string(), () => null)
      testdouble.verify(
        fakeIt(testdouble.matchers.anything(), scenario),
        { times: 1 }
      )
    })
  })
})
