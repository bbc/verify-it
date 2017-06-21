declare var verify: VerifyIt.IVerify;

declare namespace VerifyIt {
  interface TestDone {
    (error?: any): any;
  }

  interface IVerify {
    it: ITestDefinition0 | ITestDefinition1 | ITestDefinition2 | ITestDefinition3
  }

  interface ITestDefinition0 {
    (description: string, callback: (done: TestDone) => any);
  }

  interface ITestDefinition1 {
    <G1>(description: string, gen1: () => G1, callback: (val1: G1, done: TestDone) => any);
  }

  interface ITestDefinition2 {
    <G1,G2>(description: string, gen1: () => G1, gen2: () => G2, callback: (val1: G1, val2: G2, done: TestDone) => any);
  }

  interface ITestDefinition3 {
    <G1,G2,G3>(description: string, gen1: () => G1, gen2: () => G2, gen3: () => G3, callback: (val1: G1, val2: G2, val3: G3, done: TestDone) => any);
  }

  interface Gen {
    string: () => string
    stringWithLength: (length: number) => (() => string)
    stringNonNumeric: () => string
    integer: () => number
    integerBetween(min: number, max: number): () => number
    float: () => number
    floatBetween(min: number, max: number): () => number
    object: () => object
    objectWith(...keys: string[]): () => object
    error: () => Error
    array<T>(generator: () => T, length: number): (() => T[])
    distinct<T>(generator: () => T, length: number): (() => T[])
    pick<T>(values: T[]): () => T
  }
}
