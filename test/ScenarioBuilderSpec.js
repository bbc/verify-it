const { describe, it, mock } = require('node:test')
const ScenarioBuilder = require('../src/ScenarioBuilder')
const TestData = require('./TestData')

describe('ScenarioBuilder', () => {
  describe('build', () => {
    it('should not call the body function', (t) => {
      const body = mock.fn(() => null)
      ScenarioBuilder.build(body, [])
      t.assert.strictEqual(body.mock.calls.length, 0)
    })

    it('should produce a function that will call the the body function with no arguments if no generators are supplied', (t) => {
      const body = mock.fn(() => null)
      const result = ScenarioBuilder.build(body, [])
      result()
      t.assert.strictEqual(body.mock.calls.length, 1)
      t.assert.deepStrictEqual(body.mock.calls[0].arguments, [])
    })

    it('should produce a function that will call the body function with values from the supplied generators', (t) => {
      const value1 = TestData.string()
      const value2 = TestData.string()
      const value3 = TestData.string()

      const gen1 = () => value1
      const gen2 = () => value2
      const gen3 = () => value3

      const body = mock.fn(() => null)

      const result = ScenarioBuilder.build(body, [gen1, gen2, gen3])
      result()
      t.assert.strictEqual(body.mock.calls.length, 1)
      t.assert.deepStrictEqual(body.mock.calls[0].arguments, [
        value1,
        value2,
        value3
      ])
    })

    it('should create a scenario function with length 1 when the body has a single non-generated argument', (t) => {
      const body = (generated1, generated2, arg) => null
      const result = ScenarioBuilder.build(body, [() => 1, () => 2])
      t.assert.strictEqual(result.length, 1)
    })

    it('should create a scenario function with length 2 when the body has two non-generated arguments', (t) => {
      const body = (generated1, generated2, arg1, arg2) => null
      const result = ScenarioBuilder.build(body, [() => 1, () => 2])
      t.assert.strictEqual(result.length, 2)
    })

    it('should create a scenario function with length 0 when only generated arguments are used', (t) => {
      const body = (generated1, generated2) => null
      const result = ScenarioBuilder.build(body, [() => 1, () => 2])
      t.assert.strictEqual(result.length, 0)
    })

    it('should throw an error if more than two non-generated arguments are required', () => {
      const body = (generated1, generated2, first, second, third) => null
      t.assert.throws(
        () => ScenarioBuilder.build(body, [() => 1, () => 2, () => 3]),
        new Error(
          'Use of more than 2 non-generated scenario arguments is currently unsupported'
        )
      )
    })

    it('should call the body function with any additional parameters supplied to the produced scenario function', (t) => {
      const generatedValue = TestData.string()
      const gen = () => generatedValue
      const runtimeValue1 = TestData.object()
      const runtimeValue2 = TestData.object()

      const body = mock.fn(() => null)

      const result = ScenarioBuilder.build(body, [gen])
      result(runtimeValue1, runtimeValue2)
      t.assert.strictEqual(body.mock.calls.length, 1)
      t.assert.deepStrictEqual(body.mock.calls[0].arguments, [
        generatedValue,
        runtimeValue1,
        runtimeValue2
      ])
    })

    it('should create a scenario that returns the result of the body function', (t) => {
      const bodyResult = TestData.string()
      const body = () => bodyResult

      const result = ScenarioBuilder.build(body, [])
      t.assert.strictEqual(result(), bodyResult)
    })
  })
})
