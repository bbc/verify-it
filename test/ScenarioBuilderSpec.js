const { spy } = require('sinon')
const ScenarioBuilder = require('../src/ScenarioBuilder')
const TestData = require('./TestData')

describe('ScenarioBuilder', () => {
  describe('build', () => {
    it('should not call the body function', () => {
      const builder = new ScenarioBuilder()
      const body = spy(() => null)
      builder.build(body, [])
      return body.should.not.have.been.called
    })

    it('should produce a function that will call the the body function with no arguments if no generators are supplied', () => {
      const builder = new ScenarioBuilder()
      const body = spy(() => null)
      const result = builder.build(body, [])
      result()
      body.should.have.been.calledWithExactly()
    })

    it('should produce a function that will call the body function with values from the supplied generators', () => {
      const builder = new ScenarioBuilder()
      const value1 = TestData.string()
      const value2 = TestData.string()
      const value3 = TestData.string()

      const gen1 = () => value1
      const gen2 = () => value2
      const gen3 = () => value3

      const body = spy(() => null)

      const result = builder.build(body, [gen1, gen2, gen3])
      result()
      body.should.have.been.calledWithExactly(value1, value2, value3)
    })

    it('should call the body function with any additional parameters supplied to the produced scenario function', () => {
      const builder = new ScenarioBuilder()
      const generatedValue = TestData.string()
      const gen = () => generatedValue
      const runtimeValue1 = TestData.object()
      const runtimeValue2 = TestData.object()

      const body = spy(() => null)

      const result = builder.build(body, [gen])
      result(runtimeValue1, runtimeValue2)
      body.should.have.been.calledWithExactly(generatedValue, runtimeValue1, runtimeValue2)
    })
  })
})
