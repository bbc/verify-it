'use strict'

const Sinon = require('sinon')
const Chai = require('chai')
const TestData = require('./TestData')
const ScenarioRunner = require('../src/ScenarioRunner')

const match = Sinon.match
const spy = Sinon.spy
const expect = Chai.expect

describe('ScenarioRunner', () => {
  describe('run', () => {
    it('should throw an exception if no arguments are provided', () => {
      const runner = new ScenarioRunner()
      expect(runner.run).to.throw(Error, 'A description and a body function are required.')
    })

    it('should throw an exception if no body function is provided', () => {
      const runner = new ScenarioRunner()
      expect(
        () => runner.run(TestData.string())
      ).to.throw(Error, 'A description and a body function are required.')
    })

    it('should call the scenario builder with the body and no generator functions if none are supplied', () => {
      const body = TestData.object()
      const fakeScenarioBuilder = {
        build: spy(() => null)
      }
      const runner = new ScenarioRunner(() => null, fakeScenarioBuilder)

      runner.run(TestData.string(), body)
      fakeScenarioBuilder.build.should.have.been.calledWithExactly(body, [])
    })

    it('should call the scenario builder with a single element array if one generator function is provided', () => {
      const body = TestData.object()
      const gen = TestData.object()

      const fakeScenarioBuilder = {
        build: spy(() => null)
      }
      const runner = new ScenarioRunner(() => null, fakeScenarioBuilder)

      runner.run(TestData.string(), gen, body)
      fakeScenarioBuilder.build.should.have.been.calledWithExactly(body, [gen])
    })

    it('should call the scenario builder with a multiple element array if multiple generator functions are provided', () => {
      const body = TestData.object()
      const gen1 = TestData.object()
      const gen2 = TestData.object()
      const gen3 = TestData.object()

      const fakeScenarioBuilder = {
        build: spy(() => null)
      }
      const runner = new ScenarioRunner(() => null, fakeScenarioBuilder)

      runner.run(TestData.string(), gen1, gen2, gen3, body)
      fakeScenarioBuilder.build.should.have.been.calledWithExactly(body, [gen1, gen2, gen3])
    })

    it('should call the it function with the correct description', () => {
      const fakeIt = spy(() => null)
      const runner = new ScenarioRunner(fakeIt, { build: () => null })
      const description = TestData.string()
      runner.run(description, () => null)
      fakeIt.should.have.been.calledWith(description)
    })

    it('should call the it function with the result of the scenario builder', () => {
      const fakeIt = spy(() => null)
      const scenario = TestData.object()
      const fakeScenarioBuilder = {
        build: () => scenario
      }
      const runner = new ScenarioRunner(fakeIt, fakeScenarioBuilder)
      runner.run(TestData.string(), () => null)
      fakeIt.should.have.been.calledWith(match.string, scenario)
    })
  })
})
