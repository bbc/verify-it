'use strict'

const ScenarioBuilder = require('./src/ScenarioBuilder')
const ScenarioRunnerFactory = require('./src/ScenarioRunnerFactory')
const Generators = require('./src/Generators')
const getFunction = require('./src/function/getFunction')

const findTestFunction = (options) => {
  const itFunction = getFunction(options, 'it')

  if (itFunction) {
    return itFunction
  }

  const testFunction = getFunction(options, 'test')

  if (testFunction) {
    return testFunction
  }

  throw new Error('An it or test function is required')
}

const init = (options) => {
  const testFunction = findTestFunction(options ?? global)

  const verifyItFunction = ScenarioRunnerFactory.create(
    testFunction,
    ScenarioBuilder,
    ['only', 'skip']
  )

  const verify = {
    it: verifyItFunction,
    test: verifyItFunction
  }

  const describeFunction = getFunction(options, 'describe')
  if (describeFunction) {
    const verifyDescribeFunction = ScenarioRunnerFactory.create(
      describeFunction,
      ScenarioBuilder,
      ['only', 'skip']
    )
    verify.describe = verifyDescribeFunction
  }

  return verify
}

global.verify = new Proxy(
  {},
  {
    get: (_, prop) => {
      if (prop === 'it' || prop === 'test' || prop === 'describe') {
        const verify = init(global)
        return verify[prop]
      }
    }
  }
)

module.exports = {
  Gen: Generators,
  init
}
