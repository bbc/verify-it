'use strict'

const { describe, it, mock } = require('node:test')
const TestData = require('./TestData')
const ScenarioRunnerFactory = require('../src/ScenarioRunnerFactory')

describe('ScenarioRunnerFactory', () => {
  describe('run', () => {
    it('should throw an exception if no arguments are provided', (t) => {
      const runFunction = ScenarioRunnerFactory.create()
      t.assert.throws(
        runFunction,
        new Error('A description and a body function are required.')
      )
    })

    it('should throw an exception if no body function is provided', (t) => {
      const runFunction = ScenarioRunnerFactory.create()
      t.assert.throws(
        () => runFunction(TestData.string()),
        new Error('A description and a body function are required.')
      )
    })

    it('should call the scenario builder with the body and no generator functions if none are supplied', (t) => {
      const body = TestData.object()
      const fakeScenarioBuilder = {
        build: mock.fn(() => null)
      }
      const runFunction = ScenarioRunnerFactory.create(
        () => null,
        fakeScenarioBuilder
      )

      runFunction(TestData.string(), body)
      t.assert.strictEqual(fakeScenarioBuilder.build.mock.calls.length, 1)
      t.assert.deepEqual(fakeScenarioBuilder.build.mock.calls[0].arguments, [
        body,
        []
      ])
    })

    it('should call the scenario builder with a single element array if one generator function is provided', (t) => {
      const body = TestData.object()
      const gen = TestData.object()

      const fakeScenarioBuilder = {
        build: mock.fn(() => null)
      }
      const runFunction = ScenarioRunnerFactory.create(
        () => null,
        fakeScenarioBuilder
      )

      runFunction(TestData.string(), gen, body)
      t.assert.strictEqual(fakeScenarioBuilder.build.mock.calls.length, 1)
      t.assert.deepEqual(fakeScenarioBuilder.build.mock.calls[0].arguments, [
        body,
        [gen]
      ])
    })

    it('should call the scenario builder with a multiple element array if multiple generator functions are provided', (t) => {
      const body = TestData.object()
      const gen1 = TestData.object()
      const gen2 = TestData.object()
      const gen3 = TestData.object()

      const fakeScenarioBuilder = {
        build: mock.fn(() => null)
      }
      const runFunction = ScenarioRunnerFactory.create(
        () => null,
        fakeScenarioBuilder
      )

      runFunction(TestData.string(), gen1, gen2, gen3, body)
      t.assert.strictEqual(fakeScenarioBuilder.build.mock.calls.length, 1)
      t.assert.deepEqual(fakeScenarioBuilder.build.mock.calls[0].arguments, [
        body,
        [gen1, gen2, gen3]
      ])
    })

    it('should call the it function with the correct description', (t) => {
      const fakeIt = mock.fn(() => null)
      const runFunction = ScenarioRunnerFactory.create(fakeIt, {
        build: () => null
      })
      const description = TestData.string()
      runFunction(description, () => null)
      t.assert.strictEqual(fakeIt.mock.calls.length, 1)
      t.assert.strictEqual(fakeIt.mock.calls[0].arguments.length, 2)
      t.assert.strictEqual(fakeIt.mock.calls[0].arguments[0], description)
    })

    it('should call the it function with the result of the scenario builder', (t) => {
      const fakeIt = mock.fn(() => null)
      const scenario = TestData.object()
      const fakeScenarioBuilder = {
        build: () => scenario
      }
      const runFunction = ScenarioRunnerFactory.create(
        fakeIt,
        fakeScenarioBuilder
      )
      runFunction(TestData.string(), () => null)
      t.assert.strictEqual(fakeIt.mock.calls.length, 1)
      t.assert.strictEqual(fakeIt.mock.calls[0].arguments.length, 2)
      t.assert.strictEqual(fakeIt.mock.calls[0].arguments[1], scenario)
    })
  })
})
