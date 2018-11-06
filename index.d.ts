declare var verifyIt: VerifyIt

declare var verify: VerifyIt.IVerify

type VerifyFunction0 = (description: string, callback: (done: TestDone) => any) => any
type VerifyFunction1 = <T1>(description: string, gen1: () => T1, callback: (done: TestDone) => any) => any
type VerifyFunction2 = <T1, T2>(description: string, gen1: () => T1, gen2: () => T2, callback: (value1: T1, value2: T2, done: TestDone) => any) => any
type VerifyFunction3 = <T1, T2, T3>(description: string, gen1: () => T1, gen2: () => T2, gen3: () => T3, callback: (value1: T1, value2: T2, value3: T3, done: TestDone) => any) => any
type VerifyFunction4 = <T1, T2, T3, T4>(description: string, gen1: () => T1, gen2: () => T2, gen3: () => T3, gen4: () => T4, callback: (value1: T1, value2: T2, value3: T3, value4: T4, done: TestDone) => any) => any
type VerifyFunction5 = <T1, T2, T3, T4, T5>(description: string, gen1: () => T1, gen2: () => T2, gen3: () => T3, gen4: () => T4, gen5: () => T5, callback: (value1: T1, value2: T2, value3: T3, value4: T4, value5: T5, done: TestDone) => any) => any
type VerifyFunction6 = <T1, T2, T3, T4, T5, T6>(description: string, gen1: () => T1, gen2: () => T2, gen3: () => T3, gen4: () => T4, gen5: () => T5, gen6: () => T6, callback: (value1: T1, value2: T2, value3: T3, value4: T4, value5: T5, value6: T6, done: TestDone) => any) => any
type VerifyFunction7 = <T1, T2, T3, T4, T5, T6, T7>(description: string, gen1: () => T1, gen2: () => T2, gen3: () => T3, gen4: () => T4, gen5: () => T5, gen6: () => T6, gen7: () => T7, callback: (value1: T1, value2: T2, value3: T3, value4: T4, value5: T5, value6: T6, value7: T7, done: TestDone) => any) => any
type VerifyFunction8 = <T1, T2, T3, T4, T5, T6, T7, T8>(description: string, gen1: () => T1, gen2: () => T2, gen3: () => T3, gen4: () => T4, gen5: () => T5, gen6: () => T6, gen7: () => T7, gen8: () => T8, callback: (value1: T1, value2: T2, value3: T3, value4: T4, value5: T5, value6: T6, value7: T7, value8: T8, done: TestDone) => any) => any
type VerifyFunction9 = <T1, T2, T3, T4, T5, T6, T7, T8, T9>(description: string, gen1: () => T1, gen2: () => T2, gen3: () => T3, gen4: () => T4, gen5: () => T5, gen6: () => T6, gen7: () => T7, gen8: () => T8, gen9: () => T9, callback: (value1: T1, value2: T2, value3: T3, value4: T4, value5: T5, value6: T6, value7: T7, value8: T8, value9: T9, done: TestDone) => any) => any

type VerifyItObject = {
  VerifyFunction0
  VerifyFunction1
  VerifyFunction2
  VerifyFunction3
  VerifyFunction4
  VerifyFunction5
  VerifyFunction6
  VerifyFunction7
  VerifyFunction8
  VerifyFunction9

  only: {
    VerifyFunction0
    VerifyFunction1
    VerifyFunction2
    VerifyFunction3
    VerifyFunction4
    VerifyFunction5
    VerifyFunction6
    VerifyFunction7
    VerifyFunction8
    VerifyFunction9
  }

  skip: {
    VerifyFunction0
    VerifyFunction1
    VerifyFunction2
    VerifyFunction3
    VerifyFunction4
    VerifyFunction5
    VerifyFunction6
    VerifyFunction7
    VerifyFunction8
    VerifyFunction9
  }
}

declare namespace VerifyIt {
  type TestDone = (error?: any) => any

  interface IVerify {
    it: VerifyItObject,
    test: VerifyItObject,
    describe: VerifyItObject
  }

  type Gen = {
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
    word: () => string
    boolean: () => boolean
  }
}

declare module 'verify-it' {
  export = VerifyIt
}
