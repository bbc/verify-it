const ScenarioBuilder = function () {
  this.build = (body, generators) => {
    const scenario = (...args) => {
      const inputs = generators.map((generator) => generator())
      body(...inputs, ...args)
    }

    return scenario
  }
}

module.exports = ScenarioBuilder
