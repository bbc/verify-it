'use strict'

const hasFunction = require('./function/hasFunction')

const buildDelegatingFunction = (it, scenarioBuilder) => {
  return function () {
    const args = [].slice.call(arguments)

    if (args.length < 2) {
      throw new Error('A description and a body function are required.')
    }

    const description = args[0]
    const generators = args.slice(1, args.length - 1)
    const body = args[args.length - 1]

    const scenario = scenarioBuilder.build(body, generators)
    it(description, scenario)
  }
}

const ScenarioRunnerFactory = {
  create: (it, scenarioBuilder, additionalFunctionNames = []) => {
    const verifyItFunction = buildDelegatingFunction(it, scenarioBuilder)
    additionalFunctionNames.filter((key) => hasFunction(it, key))
      .forEach((key) => {
        const additionalFunction = it[key]
        verifyItFunction[key] = buildDelegatingFunction(additionalFunction, scenarioBuilder)
      })
    return verifyItFunction
  }
}

module.exports = ScenarioRunnerFactory
