# `verify-it`

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![TypeScript docs verifier](https://img.shields.io/badge/checked_with_%E2%9C%93-TS_docs_verifier-blue.svg?style=flat-square)](https://github.com/bbc/typescript-docs-verifier)
<a href="https://www.npmjs.com/package/verify-it">
<img alt="npm version" src="https://img.shields.io/npm/v/verify-it.svg?style=flat-square"></a>
<a href="https://www.npmjs.com/package/verify-it">
<img alt="weekly downloads from npm" src="https://img.shields.io/npm/dw/verify-it.svg?style=flat-square"></a>
[![Apache 2.0](https://img.shields.io/hexpm/l/plug.svg?style=flat-square)](https://www.apache.org/licenses/LICENSE-2.0)

_Randomised test property/data generation for NodeJS._

This module provides:

- Randomised property inputs for testing (delegating the actual testing to a global or provided `it` or `test` function).
- `verify.it` and `verify.test` functions (which are synonyms).
- A `verify.describe` function (delegating the actual testing to a global or provided `describe` function).
- A series of generator functions that can be used to generate properties.
- Generators are simply functions that produce a value so custom generators are simple to create.

What it is not:

- A property-based testing framework - each test scenario is only run once with the requested randomised inputs.

## Usage

### Library initialisation

As of version 2.4.0, use of the global `verify` object is deprecated in favour of explicit initialisation of this library. The `verify` global will be removed in a future version of this library. Previously the preferred usage pattern was:

```ts
import { Gen } from 'verify-it'

// `verify` is still available as a global but is deprecated
verify.it('does something', Gen.string, (someValue) => {
  // Write tests here.
})
```

Now, explicit initialisation is preferred:

```ts
import { it, describe } from 'node:test'
import { init, Gen } from 'verify-it'

// Initialise with node:test, mocha, jest, vitest etc.
const verify = init({ it, describe })

verify.it('does something', Gen.string, (someValue, t) => {
  // Write tests here
})
```

This is to allow better support for the built-in [`node:test`](https://nodejs.org/api/test.html) library and other frameworks that do not automatically inject `it`, `test`, and `describe` globals.

### Examples

#### Using the built-in `node:test` library:

```ts
import test, { describe } from 'node:test'
import { init, Gen } from 'verify-it'

const verify = init(test)

const myGenerator = () => `My custom generated value: ${Math.random()}`

describe('The verify-it library', () => {
  verify.it(
    'should inject randomised properties',
    Gen.string,
    Gen.object,
    myGenerator,
    async (someString, someObject, someCustomValue, t) => {
      // Write your tests here in the usual way using the supplied randomised values...
      t.assert.equal(true, true)
    }
  )

  verify.it(
    'should allow testing of asynchronous callbacks if the test framework supports it',
    Gen.string,
    Gen.object,
    myGenerator,
    (someString, someObject, someCustomValue, t, done) => {
      // Write some more tests here but call the done function when finished
      t.assert.equal(true, true)
      done()
    }
  )

  verify.describe('when verify.describe is used', Gen.object, (someObject) => {
    verify.it(
      'allows the same generated value to be shared across multiple tests',
      Gen.object,
      (someOtherObject, t) => {
        // Write your tests here using both someObject and someOtherObject
        t.assert.equal(true, true)
      }
    )
  })
})
```

#### Other testing libraries

An `it` or `test` testing function is required for `verify-it` to delegate testing to. This could be provided by [mocha](https://www.npmjs.com/package/mocha), [jest](https://www.npmjs.com/package/jest), [jasmine](https://www.npmjs.com/package/jasmine), [vitest](https://vitest.dev/) or a similar testing framework.

A simple `mocha` example would be:

```ts
import mocha, { describe } from 'mocha'
import { Gen, init } from 'verify-it'

const verify = init(mocha)

const myGenerator = () => `My custom generated value: ${Math.random()}`

describe('The verify-it library', () => {
  verify.it(
    'should inject randomised properties',
    Gen.string,
    Gen.object,
    myGenerator,
    async (someString, someObject, someCustomValue) => {
      // Write your tests here in the usual way using the supplied randomised values...
    }
  )

  verify.it(
    'should allow testing of asynchronous callbacks if the test framework supports it',
    Gen.string,
    Gen.object,
    myGenerator,
    (someString, someObject, someCustomValue, done) => {
      // Write some more tests here but call the done function when finished
      done()
    }
  )

  verify.describe('when verify.describe is used', Gen.object, (someObject) => {
    verify.it(
      'allows the same generated value to be shared across multiple tests',
      Gen.object,
      (someOtherObject) => {
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
const { Gen } = require('verify-it')
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
| `Gen.array(generator, length)`    | `Array`   | Produces an array with `length` elements (or between 1 and 100 elements if `length` is omitted) generated using `generator`. e.g. `Gen.array(Gen.string)` will produce an array of strings.                      |
| `Gen.distinct(generator, length)` | `Array`   | Produces an array of length `length` with distinct values generated using `generator`. Equality is based on `===`. If distinct values cannot be generated after 10 generation attempts, an error will be thrown. |
| `Gen.pick(values)`                | `any`     | Picks a random element from the supplied `values` array.                                                                                                                                                         |

## Development

- Install dependencies: `npm install`.
- Run all tests: `npm test`.
- Check dependencies for security vulnerabilities and licensing issues: `npm run check-dependencies`.

## Contributing

See [these notes](./.github/CONTRIBUTING.md) for information for contributors.

## License

`verify-it` is available to all via the [Apache-2.0](./LICENSE) license.

Copyright &copy; 2017 BBC
