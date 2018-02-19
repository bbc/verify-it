'use strict'

const ScenarioRunner = function (it, scenarioBuilder) {
  this.run = function () {
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

module.exports = ScenarioRunner
