'use strict'

const ScenarioBuilder = require('./src/ScenarioBuilder')
const ScenarioRunnerFactory = require('./src/ScenarioRunnerFactory')
const Generators = require('./src/Generators')
const hasFunction = require('./src/function/hasFunction')

const findTestFunction = () => {
  if (!hasFunction(global, 'it') && !hasFunction(global, 'test')) {
    throw new Error('A global it or test function is required')
  }

  return global.it || global.test
}

const testFunction = findTestFunction()
const verifyItFunction = ScenarioRunnerFactory.create(testFunction, ScenarioBuilder, ['only', 'skip'])
global.verify = {
  it: verifyItFunction,
  test: verifyItFunction
}

if (hasFunction(global, 'describe')) {
  const verifyDescribeFunction = ScenarioRunnerFactory.create(global.describe, ScenarioBuilder, ['only', 'skip'])
  global.verify.describe = verifyDescribeFunction
}

module.exports = {
  Gen: Generators
}
