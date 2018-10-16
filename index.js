'use strict'

const ScenarioBuilder = require('./src/ScenarioBuilder')
const ScenarioRunner = require('./src/ScenarioRunner')
const Generators = require('./src/Generators')

const scenarioBuilder = new ScenarioBuilder()

const findTestFunction = () => {
  if (!global || (!global.it && !global.test)) {
    throw new Error('A global it or test function is required')
  }

  return global.it || global.test
}

const testFunction = findTestFunction()
const scenarioRunner = new ScenarioRunner(testFunction, scenarioBuilder)
global.verify = {}
global.verify.it = scenarioRunner.run
global.verify.test = global.verify.it

if (testFunction.only && typeof testFunction.only === 'function') {
  const onlyScenarioRunner = new ScenarioRunner(testFunction.only, scenarioBuilder)
  global.verify.it.only = onlyScenarioRunner.run
  global.verify.test.only = onlyScenarioRunner.run
}

module.exports = {
  Gen: Generators
}
