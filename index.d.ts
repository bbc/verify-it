declare var verify: VerifyIt.IVerify;

type VerifyFunction = {
  (description: string, callback: (done: VerifyIt.TestDone) => any): any;
  <T1>(
    description: string,
    gen1: () => T1,
    callback: (value1: T1, done: VerifyIt.TestDone) => any
  ): any;
  <T1, T2>(
    description: string,
    gen1: () => T1,
    gen2: () => T2,
    callback: (value1: T1, value2: T2, done: VerifyIt.TestDone) => any
  ): any;
  <T1, T2, T3>(
    description: string,
    gen1: () => T1,
    gen2: () => T2,
    gen3: () => T3,
    callback: (
      value1: T1,
      value2: T2,
      value3: T3,
      done: VerifyIt.TestDone
    ) => any
  ): any;
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
      done: VerifyIt.TestDone
    ) => any
  ): any;
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
      done: VerifyIt.TestDone
    ) => any
  ): any;
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
      done: VerifyIt.TestDone
    ) => any
  ): any;
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
      done: VerifyIt.TestDone
    ) => any
  ): any;
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
      done: VerifyIt.TestDone
    ) => any
  ): any;
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
      done: VerifyIt.TestDone
    ) => any
  ): any;
};

type VerifyItObject = VerifyFunction & {
  only: VerifyFunction;
  skip: VerifyFunction;
};

declare namespace VerifyIt {
  type TestDone = (error?: any) => any;

  interface IVerify {
    it: VerifyItObject;
    test: VerifyItObject;
    describe: VerifyItObject;
  }

  const Gen: {
    string: () => string;
    stringWithLength: (length: number) => () => string;
    stringNonNumeric: () => string;
    integer: () => number;
    integerBetween(min: number, max: number): () => number;
    float: () => number;
    floatBetween(min: number, max: number): () => number;
    object: () => object;
    objectWith(...keys: string[]): () => object;
    error: () => Error;
    array<T>(generator: () => T, length: number): () => T[];
    distinct<T>(generator: () => T, length: number): () => T[];
    pick<T>(values: T[]): () => T;
    word: () => string;
    boolean: () => boolean;
    date: () => date;
    dateBetween: (start: date, end: date) => date;
    dateAfter: (start: date) => date;
    dateBefore: (end: date) => date;
  };
}

declare module "verify-it" {
  export = VerifyIt;
}
