const ScenarioBuilder = function () {
  const createFunctionWithCorrectArgsLength = (numberOfArgs, fn) => {
    switch (numberOfArgs) {
      case 0 : return function () { return fn.apply(this, arguments) }
      case 1 : return function (a) { return fn.apply(this, arguments) }
      case 2 : return function (a, b) { return fn.apply(this, arguments) }
      case 3 : return function (a, b, c) { return fn.apply(this, arguments) }
      case 4 : return function (a, b, c, d) { fn.apply(this, arguments) }
      case 5 : return function (a, b, c, d, e) { fn.apply(this, arguments) }
      default : throw new Error('More than 5 non-generated scenario arguments are currently unsupported')
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
