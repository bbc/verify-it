import type { TestFn as NativeTestFn } from 'node:test'

type LibraryTestFn = (done: TestDone) => any
type DescribeFn = (description: string, callback?: () => void) => void
type TestCallbackFn = NativeTestFn | LibraryTestFn

type VerifyFunction<F extends TestCallbackFn> = {
  (description: string, callback: F): any
  <T1>(
    description: string,
    gen1: () => T1,
    callback: (value1: T1, ...args: Parameters<F>) => any
  ): any
  <T1, T2>(
    description: string,
    gen1: () => T1,
    gen2: () => T2,
    callback: (value1: T1, value2: T2, ...args: Parameters<F>) => any
  ): any
  <T1, T2, T3>(
    description: string,
    gen1: () => T1,
    gen2: () => T2,
    gen3: () => T3,
    callback: (
      value1: T1,
      value2: T2,
      value3: T3,
      ...args: Parameters<F>
    ) => any
  ): any
  <T1, T2, T3, T4>(
    description: string,
    gen1: () => T1,
    gen2: () => T2,
    gen3: () => T3,
    gen4: () => T4,
    callback: (
      value1: T1,
      value2: T2,
      value3: T3,
      value4: T4,
      ...args: Parameters<F>
    ) => any
  ): any
  <T1, T2, T3, T4, T5>(
    description: string,
    gen1: () => T1,
    gen2: () => T2,
    gen3: () => T3,
    gen4: () => T4,
    gen5: () => T5,
    callback: (
      value1: T1,
      value2: T2,
      value3: T3,
      value4: T4,
      value5: T5,
      ...args: Parameters<F>
    ) => any
  ): any
  <T1, T2, T3, T4, T5, T6>(
    description: string,
    gen1: () => T1,
    gen2: () => T2,
    gen3: () => T3,
    gen4: () => T4,
    gen5: () => T5,
    gen6: () => T6,
    callback: (
      value1: T1,
      value2: T2,
      value3: T3,
      value4: T4,
      value5: T5,
      value6: T6,
      ...args: Parameters<F>
    ) => any
  ): any
  <T1, T2, T3, T4, T5, T6, T7>(
    description: string,
    gen1: () => T1,
    gen2: () => T2,
    gen3: () => T3,
    gen4: () => T4,
    gen5: () => T5,
    gen6: () => T6,
    gen7: () => T7,
    callback: (
      value1: T1,
      value2: T2,
      value3: T3,
      value4: T4,
      value5: T5,
      value6: T6,
      value7: T7,
      ...args: Parameters<F>
    ) => any
  ): any
  <T1, T2, T3, T4, T5, T6, T7, T8>(
    description: string,
    gen1: () => T1,
    gen2: () => T2,
    gen3: () => T3,
    gen4: () => T4,
    gen5: () => T5,
    gen6: () => T6,
    gen7: () => T7,
    gen8: () => T8,
    callback: (
      value1: T1,
      value2: T2,
      value3: T3,
      value4: T4,
      value5: T5,
      value6: T6,
      value7: T7,
      value8: T8,
      ...args: Parameters<F>
    ) => any
  ): any
  <T1, T2, T3, T4, T5, T6, T7, T8, T9>(
    description: string,
    gen1: () => T1,
    gen2: () => T2,
    gen3: () => T3,
    gen4: () => T4,
    gen5: () => T5,
    gen6: () => T6,
    gen7: () => T7,
    gen8: () => T8,
    gen9: () => T9,
    callback: (
      value1: T1,
      value2: T2,
      value3: T3,
      value4: T4,
      value5: T5,
      value6: T6,
      value7: T7,
      value8: T8,
      value9: T9,
      ...args: Parameters<F>
    ) => any
  ): any
}

type VerifyItObject<F extends TestCallbackFn> = VerifyFunction<F> & {
  only: VerifyFunction<F>
  skip: VerifyFunction<F>
}

type TestDone = (error?: any) => any

interface IVerify<T extends TestCallbackFn> {
  it: VerifyItObject<T>
  test: VerifyItObject<T>
  describe: VerifyItObject<() => void>
}

export const Gen: {
  string: () => string
  stringWithLength: (length: number) => () => string
  stringNonNumeric: () => string
  integer: () => number
  integerBetween(min: number, max: number): () => number
  float: () => number
  floatBetween(min: number, max: number): () => number
  object: () => Record<string, string>
  objectWith<Keys extends string[]>(
    ...keys: Keys
  ): () => Record<Keys[number], string>
  error: () => Error
  array<T>(generator: () => T, length: number): () => T[]
  distinct<T>(generator: () => T, length: number): () => T[]
  pick<T>(values: T[]): () => T
  word: () => string
  boolean: () => boolean
}

type Init<T extends TestCallbackFn> =
  | {
      it: (description: string, callback: T) => void
    }
  | {
      test: (description: string, callback: T) => void
    }

type InitDescribe = { describe: DescribeFn }

type InitFunction = {
  <T extends Init<NativeTestFn> | (Init<NativeTestFn> & InitDescribe)>(
    options: T
  ): T extends InitDescribe
    ? IVerify<NativeTestFn>
    : Omit<IVerify<NativeTestFn>, 'describe'>

  <T extends Init<LibraryTestFn> | (Init<LibraryTestFn> & InitDescribe)>(
    options: T
  ): T extends InitDescribe
    ? IVerify<LibraryTestFn>
    : Omit<IVerify<LibraryTestFn>, 'describe'>
}

export const init: InitFunction

declare global {
  /**
   * @deprecated Please use explicit initialisation using the `init()` function instead.
   *
   * The `verify` object provides a type-safe interface for defining tests with generators.
   * Only available as a global if there is a global `test` or `it` function otherwise an error
   * will be thrown at runtime.
   */
  const verify: IVerify<LibraryTestFn>
}
