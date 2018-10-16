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

const addAdditionalFunction = (globalTestFunction, functionName) => {
  const additionalFunction = globalTestFunction[functionName]
  if (additionalFunction && typeof additionalFunction === 'function') {
    const scenarioRunner = new ScenarioRunner(additionalFunction, scenarioBuilder)
    global.verify.it[functionName] = scenarioRunner.run
    global.verify.test[functionName] = scenarioRunner.run
  }
}

const testFunction = findTestFunction()
const scenarioRunner = new ScenarioRunner(testFunction, scenarioBuilder)
global.verify = {}
global.verify.it = scenarioRunner.run
global.verify.test = global.verify.it

addAdditionalFunction(testFunction, 'only')
addAdditionalFunction(testFunction, 'skip')

module.exports = {
  Gen: Generators
}
