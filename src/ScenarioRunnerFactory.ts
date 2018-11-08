import { hasFunction } from './function/hasFunction'
import { ScenarioBuilder } from './ScenarioBuilder'

const buildDelegatingFunction = (it: Function, scenarioBuilder: ScenarioBuilder) => {
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

export namespace ScenarioRunnerFactory {
  export function create (it: Function, scenarioBuilder: ScenarioBuilder, additionalFunctionNames: string[] = []) {
    const verifyItFunction = buildDelegatingFunction(it, scenarioBuilder) as any
    additionalFunctionNames.filter((key) => hasFunction(it, key))
      .forEach((key) => {
        const additionalFunction = (it as any)[key]
        verifyItFunction[key] = buildDelegatingFunction(additionalFunction, scenarioBuilder)
      })
    return verifyItFunction
  }
}
