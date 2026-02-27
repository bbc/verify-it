'use strict'

const { describe, it, mock } = require('node:test')
const VerifyIt = require('../index.js')
const TestData = require('./TestData')

const Gen = VerifyIt.Gen

describe('Generators', () => {
  describe('word', () => {
    it('should produce a string', (t) => {
      const value = Gen.word()
      t.assert.strictEqual(typeof value, 'string')
    })

    it('should produce different values for subsequent calls', (t) => {
      const a = Gen.word()
      const b = Gen.word()
      t.assert.notStrictEqual(a, b)
    })

    it('should only return a single word with no spaces', (t) => {
      new Array(1000).fill(0).forEach(() => {
        t.assert.doesNotMatch(Gen.word(), /\s/)
      })
    })

    it('should not return an empty string', (t) => {
      new Array(1000).fill(0).forEach(() => {
        t.assert.ok(Gen.word().length > 0)
      })
    })
  })

  describe('string', () => {
    it('should produce a string', (t) => {
      t.assert.strictEqual(typeof Gen.string(), 'string')
    })

    it('should produce different values for subsequent calls', (t) => {
      t.assert.notStrictEqual(Gen.string(), Gen.string())
    })

    it('should produce different length strings for subsequent calls', (t) => {
      const lengths = new Array(100).fill(0).map(() => Gen.string().length)
      const lengthSet = new Set(lengths)
      t.assert.ok(lengthSet.size > 1)
    })
  })

  describe('stringNonNumeric', () => {
    it('should produce a string', (t) => {
      t.assert.strictEqual(typeof Gen.stringNonNumeric(), 'string')
    })

    it('should produce different values for subsequent calls', (t) => {
      t.assert.notStrictEqual(Gen.stringNonNumeric(), Gen.stringNonNumeric())
    })

    it('should not include numeric characters', (t) => {
      const numerals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      new Array(100).fill(0).forEach(() => {
        const generated = Gen.stringNonNumeric()
        numerals.forEach((numeral) => t.assert.ok(!generated.includes(numeral)))
      })
    })

    it('should not return an empty string', (t) => {
      new Array(1000)
        .fill(0)
        .forEach(() => t.assert.ok(Gen.stringNonNumeric().length > 0))
    })
  })

  describe('stringWithLength', () => {
    it('should throw an error if no length is provided', (t) => {
      const expectedMessage =
        'The length of string to be generated must be provided'
      t.assert.throws(() => Gen.stringWithLength(), new Error(expectedMessage))
    })

    it('should produce a string', (t) => {
      t.assert.strictEqual(typeof Gen.stringWithLength(10)(), 'string')
    })

    it('should produce different values for subsequent calls', (t) => {
      t.assert.notStrictEqual(
        Gen.stringWithLength(10)(),
        Gen.stringWithLength(10)()
      )
    })

    it('should produce a string of the specified length', (t) => {
      const length = TestData.integer(5, 10)
      t.assert.strictEqual(Gen.stringWithLength(length)().length, length)
    })
  })

  describe('integer', () => {
    it('should produce an integer', (t) => {
      const generated = Gen.integer()
      t.assert.strictEqual(typeof generated, 'number')
      t.assert.strictEqual(Number.isInteger(generated), true)
    })

    it('should produce different values for subsequent calls', (t) => {
      t.assert.notStrictEqual(Gen.integer(), Gen.integer())
    })
  })

  describe('integerBetween', () => {
    it('should throw an error if no minimum is provided', (t) => {
      const min = undefined
      const max = TestData.integer(0, 200)
      const expectedMessage = `Both the minimum and maximum values must be integers. Provided min: ${min}, max: ${max}`
      t.assert.throws(
        () => Gen.integerBetween(min, max),
        new Error(expectedMessage)
      )
    })

    it('should throw an error if the minimum is null', (t) => {
      const min = null
      const max = TestData.integer(0, 200)
      const expectedMessage = `Both the minimum and maximum values must be integers. Provided min: ${min}, max: ${max}`
      t.assert.throws(
        () => Gen.integerBetween(min, max),
        new Error(expectedMessage)
      )
    })

    it('should throw an error if no maximum is provided', (t) => {
      const min = TestData.integer(0, 200)
      const max = undefined
      const expectedMessage = `Both the minimum and maximum values must be integers. Provided min: ${min}, max: ${max}`
      t.assert.throws(
        () => Gen.integerBetween(min, max),
        new Error(expectedMessage)
      )
    })

    it('should throw an error if the maximum is null', (t) => {
      const min = TestData.integer(0, 200)
      const max = null
      const expectedMessage = `Both the minimum and maximum values must be integers. Provided min: ${min}, max: ${max}`
      t.assert.throws(
        () => Gen.integerBetween(min, max),
        new Error(expectedMessage)
      )
    })

    it('should throw an error if the minimum is not an integer', (t) => {
      const min = TestData.string()
      const max = TestData.integer(0, 200)
      const expectedMessage = `Both the minimum and maximum values must be integers. Provided min: ${min}, max: ${max}`
      t.assert.throws(
        () => Gen.integerBetween(min, max),
        new Error(expectedMessage)
      )
    })

    it('should throw an error if the minimum value is less than Number.MIN_SAFE_INTEGER', (t) => {
      const min = Number.MIN_SAFE_INTEGER - TestData.integer(1, 5)
      const max = TestData.integer(0, 100)
      const expectedMessage = `Minimum value must be greater than ${Number.MIN_SAFE_INTEGER}. Provided min: ${min}, max: ${max}`
      t.assert.throws(
        () => Gen.integerBetween(min, max),
        new Error(expectedMessage)
      )
    })

    it('should throw an error if the maximum value is greater than Number.MAX_SAFE_INTEGER', (t) => {
      const min = TestData.integer(0, 100)
      const max = Number.MAX_SAFE_INTEGER + TestData.integer(1, 5)
      const expectedMessage = `Maximum value must be less than ${Number.MAX_SAFE_INTEGER}. Provided min: ${min}, max: ${max}`
      t.assert.throws(
        () => Gen.integerBetween(min, max),
        new Error(expectedMessage)
      )
    })

    it('should throw an error if the minimum is greater than the maximum', (t) => {
      const min = TestData.integer(10, 20)
      const max = TestData.integer(0, 9)
      const expectedMessage = `Minimum value must be less than the maximum value. Provided min: ${min}, max: ${max}`
      t.assert.throws(
        () => Gen.integerBetween(min, max),
        new Error(expectedMessage)
      )
    })

    it('should generate an integer between the minimum and maximum', (t) => {
      const min = TestData.integer(0, 100)
      const max = TestData.integer(101, 200)
      const generated = Gen.integerBetween(min, max)()
      t.assert.strictEqual(typeof generated, 'number')
      t.assert.ok(generated > min - 1)
      t.assert.ok(generated < max + 1)
      t.assert.strictEqual(Number.isInteger(generated), true)
    })

    it('should generate different integers for subsequent calls', (t) => {
      const gen = Gen.integerBetween(
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER
      )
      t.assert.notStrictEqual(gen(), gen())
    })
  })

  describe('float', () => {
    it('should produce a number', (t) => {
      const generated = Gen.float()
      t.assert.strictEqual(typeof generated, 'number')
    })

    it('should produce different values for subsequent calls', (t) => {
      t.assert.notStrictEqual(Gen.float(), Gen.float())
    })
  })

  describe('floatBetween', () => {
    it('should throw an error if no minimum is provided', (t) => {
      const min = undefined
      const max = TestData.float(0, 200)
      const expectedMessage = `Both the minimum and maximum values must be numbers. Provided min: ${min}, max: ${max}`
      t.assert.throws(
        () => Gen.floatBetween(min, max),
        new Error(expectedMessage)
      )
    })

    it('should throw an error if the minimum is null', (t) => {
      const min = null
      const max = TestData.float(0, 200)
      const expectedMessage = `Both the minimum and maximum values must be numbers. Provided min: ${min}, max: ${max}`
      t.assert.throws(
        () => Gen.floatBetween(min, max),
        new Error(expectedMessage)
      )
    })

    it('should throw an error if no maximum is provided', (t) => {
      const min = TestData.float(0, 200)
      const max = undefined
      const expectedMessage = `Both the minimum and maximum values must be numbers. Provided min: ${min}, max: ${max}`
      t.assert.throws(
        () => Gen.floatBetween(min, max),
        new Error(expectedMessage)
      )
    })

    it('should throw an error if the maximum is null', (t) => {
      const min = TestData.float(0, 200)
      const max = null
      const expectedMessage = `Both the minimum and maximum values must be numbers. Provided min: ${min}, max: ${max}`
      t.assert.throws(
        () => Gen.floatBetween(min, max),
        new Error(expectedMessage)
      )
    })

    it('should throw an error if the minimum is not a number', (t) => {
      const min = TestData.string()
      const max = TestData.float(0, 200)
      const expectedMessage = `Both the minimum and maximum values must be numbers. Provided min: ${min}, max: ${max}`
      t.assert.throws(
        () => Gen.floatBetween(min, max),
        new Error(expectedMessage)
      )
    })

    it('should throw an error if the minimum is greater than the maximum', (t) => {
      const min = TestData.float(10, 20)
      const max = TestData.float(0, 9)
      const expectedMessage = `Minimum value must be less than the maximum value. Provided min: ${min}, max: ${max}`
      t.assert.throws(
        () => Gen.floatBetween(min, max),
        new Error(expectedMessage)
      )
    })

    it('should generate a number between the minimum and maximum', (t) => {
      const min = TestData.float(0, 100)
      const max = TestData.float(101, 200)
      const generated = Gen.floatBetween(min, max)()
      t.assert.strictEqual(typeof generated, 'number')
      t.assert.ok(generated > min)
      t.assert.ok(generated < max)
    })

    it('should generate different numbers for subsequent calls', (t) => {
      const gen = Gen.floatBetween(
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER
      )
      t.assert.notStrictEqual(gen(), gen())
    })
  })

  describe('array', () => {
    it('should throw an error if no generator function is provided', (t) => {
      const expectedMessage = 'A generator function must be provided'
      t.assert.throws(() => Gen.array(), new Error(expectedMessage))
    })

    it('should generate an array if a generator function is provided', (t) => {
      const generator = () => 1
      t.assert.ok(Array.isArray(Gen.array(generator)()))
    })

    it('should generate an array with a length > 0', (t) => {
      const generator = () => 1
      t.assert.ok(Gen.array(generator)().length > 0)
    })

    it('should call the generator function lazily', (t) => {
      const generator = mock.fn(() => 1)
      Gen.array(generator)
      t.assert.strictEqual(generator.mock.calls.length, 0)
    })

    it('should use the values from the generator function', (t) => {
      const value = TestData.string()
      const generator = () => value
      const generated = Gen.array(generator)()
      const elementsWithCorrectValue = generated.filter(
        (element) => element === value
      )
      t.assert.strictEqual(elementsWithCorrectValue.length, generated.length)
    })

    it('should generate different length arrays when no length is provided', (t) => {
      const arrayGenerator = Gen.array(() => 1)
      const generated = new Array(10).fill(1).map(() => arrayGenerator())
      const lengthSet = new Set(generated.map((array) => array.length))
      t.assert.ok(lengthSet.size > 1)
    })

    it('should call return the values from the generator', (t) => {
      const offset = TestData.integer(5, 50)
      const input = new Array(100).fill(1).map((value, index) => offset + index)
      let calls = 0
      const generator = () => {
        calls = calls + 1
        return input[calls - 1]
      }

      const array = Gen.array(generator)()
      t.assert.deepStrictEqual(array, input.slice(0, array.length))
    })

    it('should generate fixed-length arrays when a length is provided', (t) => {
      const length = TestData.integer(5, 50)
      const arrayGenerator = Gen.array(() => 1, length)
      t.assert.strictEqual(arrayGenerator().length, length)
    })

    it('should use the generator function when a length is provided', (t) => {
      const length = TestData.integer(5, 50)
      const generator = mock.fn(() => 1)
      const arrayGenerator = Gen.array(generator, length)
      arrayGenerator()
      t.assert.strictEqual(generator.mock.calls.length, length)
    })
  })

  describe('distinct', () => {
    it('should throw an error if no generator function is provided', (t) => {
      const expectedMessage = 'A generator function must be provided'
      t.assert.throws(() => Gen.distinct(), new Error(expectedMessage))
    })

    it('should throw an error if no number of values is provided', (t) => {
      const expectedMessage =
        'A number of values greater than 1 must be provided'
      t.assert.throws(
        () => Gen.distinct(() => null),
        new Error(expectedMessage)
      )
    })

    it('should throw an error if the number of values is not a number', (t) => {
      const expectedMessage =
        'A number of values greater than 1 must be provided'
      t.assert.throws(
        () => Gen.distinct(() => null, 'string'),
        new Error(expectedMessage)
      )
    })

    it('should throw an error if the number of values is a negative number', (t) => {
      const expectedMessage =
        'A number of values greater than 1 must be provided'
      t.assert.throws(
        () => Gen.distinct(() => null, -1),
        new Error(expectedMessage)
      )
    })

    it('should return a generator that returns an array of values from the generator function', (t) => {
      const numberOfValues = TestData.integer(5, 10)
      const generator = () => TestData.string()
      t.assert.strictEqual(
        Gen.distinct(generator, numberOfValues)().length,
        numberOfValues
      )
    })

    it('should call the generator function lazily', (t) => {
      const generator = mock.fn(() => 1)
      Gen.distinct(generator, 2)
      t.assert.strictEqual(generator.mock.calls.length, 0)
    })

    it('should return the values from the generator', (t) => {
      const value1 = TestData.string()
      const value2 = TestData.string()

      let callCount = 0
      const generator = () => {
        if (callCount === 0) {
          callCount++
          return value1
        } else {
          return value2
        }
      }

      t.assert.deepStrictEqual(Gen.distinct(generator, 2)(), [value1, value2])
    })

    it('should continue to call the generator until distinct values are found', (t) => {
      const value1 = TestData.string()
      const value2 = TestData.string()

      let callCount = 0
      const generator = () => {
        if (callCount < 2) {
          callCount++
          return value1
        } else {
          return value2
        }
      }

      t.assert.deepStrictEqual(Gen.distinct(generator, 2)(), [value1, value2])
    })

    it('should limit subsequent calls to the generator to 10 if the result is always equal to the first value', (t) => {
      const expectedMessage =
        'Could not generate distinct values using the provided generator - tried 10 times'
      const generator = mock.fn(() => '1')

      t.assert.throws(
        () => Gen.distinct(generator, 10)(),
        new Error(expectedMessage)
      )
      t.assert.strictEqual(generator.mock.calls.length, 11)
    })
  })

  describe('object', () => {
    it('should produce an object', (t) => {
      t.assert.strictEqual(typeof Gen.object(), 'object')
    })

    it('should produce an object with some keys', (t) => {
      const generated = Gen.object()
      t.assert.ok(Object.getOwnPropertyNames(generated).length > 0)
    })

    it('should produce different objects on subsequent calls', (t) => {
      const first = Gen.object()
      const second = Gen.object()
      t.assert.notDeepStrictEqual(first, second)
    })

    it('should produce objects with different keys on subsequent calls', (t) => {
      const first = Gen.object()
      const second = Gen.object()
      t.assert.notDeepStrictEqual(
        Object.getOwnPropertyNames(first),
        Object.getOwnPropertyNames(second)
      )
    })

    it('should produce objects with different numbers of keys', (t) => {
      const generated = new Array(10).fill(0).map(() => Gen.object())
      const lengthSet = new Set(
        generated.map((object) => Object.getOwnPropertyNames(object).length)
      )
      t.assert.ok(lengthSet.size > 1)
    })

    it('should produce objects with string values', (t) => {
      const generated = Gen.object()
      Object.getOwnPropertyNames(generated).forEach((name) => {
        t.assert.strictEqual(typeof generated[name], 'string')
      })
    })
  })

  describe('objectWith', () => {
    it('should throw an error if no property names are supplied', (t) => {
      t.assert.throws(
        () => Gen.objectWith(),
        new Error('At least one property name must be provided')
      )
    })

    it('should return an Object', (t) => {
      t.assert.strictEqual(typeof Gen.objectWith('')(), 'object')
    })

    it('should return an object with the correct number of property names', (t) => {
      const numberOfProperties = TestData.integer(1, 10)
      const args = new Array(numberOfProperties)
        .fill(1)
        .map(() => TestData.string(30))
      const generated = Gen.objectWith.apply(Gen, args)()
      t.assert.strictEqual(
        Object.getOwnPropertyNames(generated).length,
        numberOfProperties
      )
    })

    it('should return an object with the required property names', (t) => {
      const property1 = TestData.string()
      const property2 = TestData.string()

      const generated = Gen.objectWith(property1, property2)()
      const keys = Object.getOwnPropertyNames(generated)
      t.assert.ok(keys.includes(property1))
      t.assert.ok(keys.includes(property2))
    })

    it('should return an object with string property values', (t) => {
      const property1 = TestData.string()
      const property2 = TestData.string()

      const generated = Gen.objectWith(property1, property2)()
      t.assert.strictEqual(typeof generated[property1], 'string')
      t.assert.strictEqual(typeof generated[property2], 'string')
    })

    it('should return an object with randomised property values', (t) => {
      const property1 = TestData.string()
      const property2 = TestData.string()

      const generated = Gen.objectWith(property1, property2)()
      t.assert.notStrictEqual(generated[property1], generated[property2])
    })
  })

  describe('error', () => {
    it('should produce an error', (t) => {
      t.assert.strictEqual(Gen.error() instanceof Error, true)
    })

    it('should produce an error with a message', (t) => {
      t.assert.ok(Gen.error().message.length > 0)
    })

    it('should produce different messages on subsequent calls', (t) => {
      const first = Gen.error()
      const second = Gen.error()
      t.assert.notStrictEqual(first.message, second.message)
    })
  })

  describe('pick', () => {
    it('should throw an error if no values are supplied', (t) => {
      t.assert.throws(
        () => Gen.pick(),
        new Error('The options to be picked from must be provided')
      )
    })

    it('should throw an error if the argument supplied is not an array', (t) => {
      const values = TestData.object()
      t.assert.throws(
        () => Gen.pick(values),
        new Error('The options to be picked from must be an array')
      )
    })

    it('should throw an error if the argument supplied is empty', (t) => {
      t.assert.throws(
        () => Gen.pick([]),
        new Error('The options array must have at least one entry')
      )
    })

    it('should pick one of the entries from the values array', (t) => {
      const length = TestData.integer(1, 10)
      const values = new Array(length).fill(1).map(TestData.string)
      t.assert.ok(values.includes(Gen.pick(values)()))
    })

    it('should pick different entries in subsequent calls', (t) => {
      const values = new Array(10).fill(1).map(TestData.string)
      const generated = new Array(10).fill(0).map(() => Gen.pick(values)())
      const indexSet = new Set(generated.map((value) => values.indexOf(value)))
      t.assert.ok(indexSet.size > 1)
    })
  })

  describe('boolean', () => {
    it('should return a boolean value', (t) => {
      t.assert.ok([true, false].includes(Gen.boolean()))
    })

    it('should pick different entries in subsequent calls', (t) => {
      const generated = new Array(10).fill(0).map(() => Gen.boolean())
      const indexSet = new Set(generated)
      t.assert.ok(indexSet.size > 1)
    })
  })
})
