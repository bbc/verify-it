# `verify-it`

_Randomised test property/data generation for NodeJS._

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.org/bbc/verify-it.svg?branch=master)](https://travis-ci.org/bbc/verify-it)
[![dependencies Status](https://david-dm.org/bbc/verify-it/status.svg)](https://david-dm.org/bbc/verify-it)
[![devDependencies Status](https://david-dm.org/bbc/verify-it/dev-status.svg)](https://david-dm.org/bbc/verify-it?type=dev)

This module provides:

- Randomised property inputs for testing (delegating the actual testing to a global `it` or `test` function).
- Global `verify.it` and `verify.test` functions (which are synonyms).
- A global `verify.describe` function (delegating the actual testing to a global `describe` function).
- A series of generator functions that can be used to generate properties.
- Generators are simply functions that produce a value so custom generators are simple to create.

What it is not:

- A property-based testing framework - each test scenario is only run once with the requested randomised inputs.

## Usage

A global `it` or `test` function is required for `verify-it` to delegate testing to (`it` is used in preference to `test`). This could be provided by [mocha](https://www.npmjs.com/package/mocha), [jest](https://www.npmjs.com/package/jest), [jasmine](https://www.npmjs.com/package/jasmine) or a similar testing framework.

A simple `mocha` example would be:

```javascript
require('mocha')
const { Gen } = require('verify-it')

const myGenerator = () => `My custom generated value: ${Math.random()}`

describe('The verify-it library', () => {
  verify.it('should inject randomised properties',
    Gen.string, Gen.object, myGenerator,
    (someString, someObject, someCustomValue) => {
      // Write your tests here in the usual way using the supplied randomised values...
    }
  )

  verify.it('should allow testing of asynchronous callbacks if the test framework supports it', () => {
    Gen.string, Gen.object, myGenerator,
    (someString, someObject, someCustomValue, done) => {
      // Write some more tests here but call the done function when finished
      done()
    }
  )

  verify.describe('when verify.describe is used', Gen.object, (someObject) => {
    verify.it('allows the same generated value to be shared across multiple tests',
      Gen.object, (someOtherObject) => {
        // Write your tests here using both someObject and someOtherObject
      }
    )
  })
})
```

If your test framework has `test.only` or `it.only` and `test.skip` or `test.skip` then `verify.it.only`, `verify.test.only`, `verify.it.skip`, and `verify.it.skip` will also be available. Similarly, if `describe.only` or `describe.skip` exist, `verify.describe.only` and `verify.describe.skip` will be available.

## Generators

Generators are simply functions that produce a value. Several built-in generators are supplied:

```javascript
const { Gen } = require("verify-it");
```

| Function                          | Produces  | Notes                                                                                                                                                                                                            |
| --------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Gen.word`                        | `string`  | Produces an english word picked at random from a word list.                                                                                                                                                      |
| `Gen.string`                      | `string`  | Produces a random string between 1 and 100 characters in length.                                                                                                                                                 |
| `Gen.stringWithLength(length)`    | `string`  | Produces a random string with a fixed length.                                                                                                                                                                    |
| `Gen.stringNonNumeric`            | `string`  | Produces a random string that does not contain numeric characters between 1 and 100 characters in length.                                                                                                        |
| `Gen.integer`                     | `number`  | Produces a random integer in the inclusive range between `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`.                                                                                                |
| `Gen.integerBetween(min, max)`    | `number`  | Produces a random integer in the inclusive range between `min` and `max`.                                                                                                                                        |
| `Gen.float`                       | `number`  | Produces a random number in the inclusive range between `-1E10` and `1E10`                                                                                                                                       |
| `Gen.floatBetween(min, max)`      | `number`  | Produces a random number in the inclusive range between `min` and `max`                                                                                                                                          |
| `Gen.object`                      | `Object`  | Produces an object with random word keys and randomised string values.                                                                                                                                           |
| `Gen.objectWith(...keys)`         | `Object`  | Produces an object with the supplied keys and randomised string values.                                                                                                                                          |
| `Gen.error`                       | `Error`   | Produces an `Error` with a random message string.                                                                                                                                                                |
| `Gen.boolean`                     | `boolean` | Produces a random boolean value                                                                                                                                                                                  |
| `Gen.date`                        | `date`    | Produces a random date in the inclusive range between 01/01/1970 and the maximum permitted date (using `Number.MAX_SAFE_INTEGER`).                                                                               |
| `Gen.dateBetween`                 | `date`    | Produces a random date in the inclusive range between `start` and `end`.                                                                                                                                         |
| `Gen.dateAfter`                   | `date`    | Produces a random date in the inclusive range between `start` and the maximum permitted date (using `Number.MAX_SAFE_INTEGER`).                                                                                  |
| `Gen.dateBefore`                  | `date`    | Produces a random date in the inclusive range between 01/01/1970 and `end`.                                                                                                                                      |
| `Gen.array(generator, length)`    | `Array`   | Produces an array with `length` elements (or between 1 and 100 elements if `length` is omitted) generated using `generator`. e.g. `Gen.array(Gen.string)` will produce an array of strings.                      |
| `Gen.distinct(generator, length)` | `Array`   | Produces an array of length `length` with distinct values generated using `generator`. Equality is based on `===`. If distinct values cannot be generated after 10 generation attempts, an error will be thrown. |
| `Gen.pick(values)`                | `any`     | Picks a random element from the supplied `values` array.                                                                                                                                                         |

## Development

- Install dependencies: `yarn install`.
- Run all tests: `yarn test`.
- Check dependencies for security vulnerabilities and licensing issues: `yarn check-dependencies`.

## Contributing

See [these notes](./.github/CONTRIBUTING.md) for information for contributors.

## License

`verify-it` is available to all via the [Apache-2.0](./LICENSE) license.

Copyright &copy; 2017 BBC
