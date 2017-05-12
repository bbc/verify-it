# `verify-it`

_Test property generation for NodeJS._

This module provides:

* Randomised property inputs for testing (delegating the actual testing to a global `it` or `test` function).
* Global `verify.it` and `verify.test` functions (which are synonyms).
* A series of generator functions that can be used to generate properties.
* Generators are simply functions that produce a value so custom generators are simple to create.

What it is not:

* A property-based testing framework - each test scenario is only run once with the requested randomised inputs.

## Usage

A global `it` or `test` function is required for `verify-it` to delegate testing to (`it` is used in preference to `test`). This could be provided by [mocha](https://www.npmjs.com/package/mocha), [jest](https://www.npmjs.com/package/jest), [jasmine](https://www.npmjs.com/package/jasmine) or a similar testing framework.

A simple `mocha` example would be:

```javascript
require('mocha')
const { Gen } = require('verify-it')

const myGenerator = () => `My custom generated value: ${Math.random()}`

describe('verify-it', () => {
  verify.it('should inject randomised properties',
    Gen.string, Gen.object, myGenerator,
    (someString, someObject, someCustomValue) => {
      // Write your tests here in the usual way using the supplied randomised values...
    }
  )
})
```

## Generators

Generators are simply functions that produce a value. Several built-in generators are supplied:

```javascript
const { Gen } = require('verify-it')
```

| Function                          | Produces  | Notes |
|-----------------------------------|-----------|-------|
| `Gen.string`                      | `String`  | Produces a random string between 1 and 100 characters in length. |
| `Gen.stringWithLength(length)`    | `String`  | Produces a random string with a fixed length. |
| `Gen.integer`                     | `Number`  | Produces a random integer between `Number.MIN_SAFE_INTEGER` and `Number.MAX_SAFE_INTEGER`. |
| `Gen.float`                       | `Number`  | Produces a random number between `-1E10` and `1E10` |
| `Gen.object`                      | `Object`  | Produces an object with randomised string keys and values. |
| `Gen.objectWith(...keys)`         | `Object`  | Produces an object with the supplied keys and randomised string values. |
| `Gen.error`                       | `Error`   | Produces an `Error` with a random message string. |
| `Gen.array(generator, length)`    | `Array`   | Produces an array with `length` elements (or between 1 and 100 elements if `length` is omitted) generated using `generator`. e.g. `Gen.array(Gen.string)` will produce an array of strings. |
| `Gen.distinct(generator, length)` | `Array`   | Produces an array of length `length` with distinct values generated using `generator`. Equality is based on `===`. If distinct values cannot be generated after 10 generation attempts, an error will be thrown. |
