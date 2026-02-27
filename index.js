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
  const testFunction = findTestFunction(options)

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

let globalVerify = null

const SUPPORTED_PROPERTIES = ['it', 'test', 'describe']

global.verify = new Proxy(
  {},
  {
    has: (_, prop) => SUPPORTED_PROPERTIES.includes(prop),
    set: () => false,
    deleteProperty: () => false,
    get: (_, prop) => {
      if (SUPPORTED_PROPERTIES.includes(prop)) {
        if (!globalVerify) {
          globalVerify = init(global)
        }

        return globalVerify[prop]
      }
    }
  }
)

module.exports = {
  Gen: Generators,
  init
}
