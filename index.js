const ScenarioBuilder = require('./src/ScenarioBuilder')
const ScenarioRunner = require('./src/ScenarioRunner')
const Generators = require('./src/Generators')

if (global && global.it) {
  const scenarioBuilder = new ScenarioBuilder()
  const scenarioRunner = new ScenarioRunner(it, scenarioBuilder)
  global.verify = {
    it: scenarioRunner.run
  }
}

module.exports = {
  Gen: Generators
}
