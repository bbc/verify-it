const ScenarioBuilder = function () {
  const createFunctionWithCorrectArgsLength = (numberOfArgs, fn) => {
    switch (numberOfArgs) {
      case 0 : return function () { return fn.apply(this, arguments) }
      case 1 : return function (a) { return fn.apply(this, arguments) }
      default : throw new Error('Use of more than 1 non-generated scenario arguments is currently unsupported')
    }
  }

  this.build = (body, generators) => {
    const numberOfScenarioArgs = Math.max(body.length - generators.length, 0)

    const scenario = function (...args) {
      const inputs = generators.map((generator) => generator())
      return body(...inputs, ...args)
    }

    return createFunctionWithCorrectArgsLength(numberOfScenarioArgs, scenario)
  }
}

module.exports = ScenarioBuilder
