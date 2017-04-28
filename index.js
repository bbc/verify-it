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
const createRunner = () => {
  const testFunction = findTestFunction()
  return new ScenarioRunner(testFunction, scenarioBuilder)
}

const scenarioRunner = createRunner()
global.verify = {}
global.verify.it = scenarioRunner.run
global.verify.test = global.verify.it

module.exports = {
  Gen: Generators
}
