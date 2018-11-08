import { ScenarioBuilder } from './src/ScenarioBuilder'
import { ScenarioRunnerFactory } from './src/ScenarioRunnerFactory'
import * as Generators from './src/Generators'
import { hasFunction } from './src/function/hasFunction'

const globalAny = global as any
const scenarioBuilder = new ScenarioBuilder()

const findTestFunction = () => {
  if (!hasFunction(global, 'it') && !hasFunction(global, 'test')) {
    throw new Error('A global it or test function is required')
  }

  return globalAny.it || globalAny.test
}

const testFunction = findTestFunction()
const verifyItFunction = ScenarioRunnerFactory.create(testFunction, scenarioBuilder, ['only', 'skip'])
globalAny.verify = {
  it: verifyItFunction,
  test: verifyItFunction
}

if (hasFunction(global, 'describe')) {
  const verifyDescribeFunction = ScenarioRunnerFactory.create(globalAny.describe, scenarioBuilder, ['only', 'skip'])
  globalAny.verify.describe = verifyDescribeFunction
}

export const Gen = Generators
