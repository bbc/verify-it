type Generator = () => any

const createFunctionWithCorrectArgsLength = (numberOfArgs: number, fn: Function) => {
  switch (numberOfArgs) {
    case 0 : return function (this: any) { return fn.apply(this, arguments) }
    case 1 : return function (this: any, _: any) { return fn.apply(this, arguments) }
    default : throw new Error('Use of more than 1 non-generated scenario arguments is currently unsupported')
  }
}

export class ScenarioBuilder {
  build (body: Function, generators: Generator[]) {
    const numberOfScenarioArgs = Math.max(body.length - generators.length, 0)

    const scenario = function (this: any) {
      const argumentsArray = [].slice.call(arguments)
      const inputs = generators.map((generator) => generator())
      const bodyArguments = inputs.concat(argumentsArray)
      return body.apply(this, bodyArguments)
    }

    return createFunctionWithCorrectArgsLength(numberOfScenarioArgs, scenario)
  }
}
