const { expect } = require('chai')
const { spy } = require('sinon')
const { Gen } = require('../index.js')
const TestData = require('./TestData')

describe('Generators', () => {
  describe('string', () => {
    it('should produce a string', () => {
      Gen.string().should.be.a('String')
    })

    it('should produce different values for subsequent calls', () => {
      Gen.string().should.not.eql(Gen.string())
    })
  })

  describe('stringWithLength', () => {
    it('should throw an error if no length is provided', () => {
      const expectedMessage = 'The length of string to be generated must be provided'
      expect(() => Gen.stringWithLength()).to.throw(Error, expectedMessage)
    })

    it('should produce a string', () => {
      Gen.stringWithLength(10)().should.be.a('String')
    })

    it('should produce different values for subsequent calls', () => {
      Gen.stringWithLength(10)().should.not.eql(Gen.stringWithLength(10)())
    })

    it('should produce a string of the specified length', () => {
      const length = TestData.integer(5, 10)
      Gen.stringWithLength(length)().should.have.length(length)
    })
  })

  describe('integer', () => {
    it('should produce an integer', () => {
      const generated = Gen.integer()
      generated.should.be.a('Number')
      return Number.isInteger(generated).should.be.true
    })

    it('should produce different values for subsequent calls', () => {
      Gen.integer().should.not.eql(Gen.integer())
    })
  })

  describe('float', () => {
    it('should produce a number', () => {
      const generated = Gen.float()
      generated.should.be.a('Number')
    })

    it('should produce different values for subsequent calls', () => {
      Gen.float().should.not.eql(Gen.float())
    })
  })

  describe('array', () => {
    it('should throw an error if no generator function is provided', () => {
      const expectedMessage = 'A generator function must be provided'
      expect(() => Gen.array()).to.throw(Error, expectedMessage)
    })

    it('should generate an array if a generator function is provided', () => {
      const generator = () => 1
      Gen.array(generator)().should.be.an('Array')
    })

    it('should generate an array with a length > 0', () => {
      const generator = () => 1
      Gen.array(generator)().should.have.length.greaterThan(0)
    })

    it('should call the generator function lazily', () => {
      const generator = spy(() => 1)
      Gen.array(generator)
      return generator.should.not.have.been.called
    })

    it('should use the values from the generator function', () => {
      const value = TestData.string()
      const generator = () => value
      const generated = Gen.array(generator)()
      const elementsWithCorrectValue = generated.filter((element) => element === value)
      elementsWithCorrectValue.length.should.eql(generated.length)
    })

    it('should generate different length arrays when no length is provided', () => {
      const arrayGenerator = Gen.array(() => 1)
      const generated = new Array(10).fill(1).map(() => arrayGenerator())
      const lengthSet = new Set(generated.map((array) => array.length))
      lengthSet.size.should.be.greaterThan(1)
    })

    it('should call return the values from the generator', () => {
      const offset = TestData.integer(5, 50)
      const input = new Array(100).fill(1).map((value, index) => offset + index)
      let calls = 0
      const generator = () => {
        calls = calls + 1
        return input[calls - 1]
      }

      const array = Gen.array(generator)()
      array.should.eql(input.slice(0, array.length))
    })

    it('should generate fixed-length arrays when a length is provided', () => {
      const length = TestData.integer(5, 50)
      const arrayGenerator = Gen.array(() => 1, length)
      arrayGenerator().should.have.length(length)
    })

    it('should use the generator function when a length is provided', () => {
      const length = TestData.integer(5, 50)
      const generator = spy(() => 1)
      const arrayGenerator = Gen.array(generator, length)
      arrayGenerator()
      return generator.should.have.callCount(length)
    })
  })

  describe('distinct', () => {
    it('should throw an error if no generator function is provided', () => {
      const expectedMessage = 'A generator function must be provided'
      expect(() => Gen.distinct()).to.throw(Error, expectedMessage)
    })

    it('should throw an error if no number of values is provided', () => {
      const expectedMessage = 'A number of values greater than 1 must be provided'
      expect(() => Gen.distinct(() => null)).to.throw(Error, expectedMessage)
    })

    it('should throw an error if the number of values is not a number', () => {
      const expectedMessage = 'A number of values greater than 1 must be provided'
      expect(() => Gen.distinct(() => null, 'string')).to.throw(Error, expectedMessage)
    })

    it('should throw an error if the number of values is a negative number', () => {
      const expectedMessage = 'A number of values greater than 1 must be provided'
      expect(() => Gen.distinct(() => null, -1)).to.throw(Error, expectedMessage)
    })

    it('should return a generator that returns an array of values from the generator function', () => {
      const numberOfValues = TestData.integer(5, 10)
      const generator = () => TestData.string()
      Gen.distinct(generator, numberOfValues)().should.have.length(numberOfValues)
    })

    it('should call the generator function lazily', () => {
      const generator = spy(() => 1)
      Gen.distinct(generator, 2)
      return generator.should.not.have.been.called
    })

    it('should return the values from the generator', () => {
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

      Gen.distinct(generator, 2)().should.eql([value1, value2])
    })

    it('should continue to call the generator until distinct values are found', () => {
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

      Gen.distinct(generator, 2)().should.eql([value1, value2])
    })

    it('should limit subsequent calls to the generator to 10 if the result is always equal to the first value', () => {
      const expectedMessage = 'Could not generate distinct values using the provided generator - tried 10 times'
      const generator = spy(() => '1')

      expect(() => Gen.distinct(generator, 10)()).to.throw(Error, expectedMessage)
      generator.should.have.callCount(11)
    })
  })

  describe('object', () => {
    it('should produce an object', () => {
      Gen.object().should.be.an('Object')
    })

    it('should produce an object with some keys', () => {
      const generated = Gen.object()
      Object.getOwnPropertyNames(generated).should.have.length.greaterThan(0)
    })

    it('should produce different objects on subsequent calls', () => {
      const first = Gen.object()
      const second = Gen.object()

      first.should.not.eql(second)
    })

    it('should produce objects with different keys on subsequent calls', () => {
      const first = Gen.object()
      const second = Gen.object()

      Object.getOwnPropertyNames(first).should.not.eql(Object.getOwnPropertyNames(second))
    })

    it('should produce objects with different numbers of keys', () => {
      const generated = new Array(10).fill(0).map(() => Gen.object())
      const lengthSet = new Set(generated.map((object) => Object.getOwnPropertyNames(object).length))
      lengthSet.size.should.be.greaterThan(1)
    })

    it('should produce objects with string values', () => {
      const generated = Gen.object()
      Object.getOwnPropertyNames(generated).forEach((name) => {
        generated[name].should.be.a('String')
      })
    })
  })

  describe('objectWith', () => {
    it('should throw an error if no property names are supplied', () => {
      expect(() => Gen.objectWith()).to.throw(Error, 'At least one property name must be provided')
    })

    it('should return an Object', () => {
      Gen.objectWith('')().should.be.an('Object')
    })

    it('should return an object with the correct number of property names', () => {
      const numberOfProperties = TestData.integer(1, 10)
      const args = new Array(numberOfProperties).fill(1).map(() => TestData.string(30))
      const generated = Gen.objectWith.apply(Gen, args)()
      Object.getOwnPropertyNames(generated).length.should.eql(numberOfProperties)
    })

    it('should return an object with the required property names', () => {
      const property1 = TestData.string()
      const property2 = TestData.string()

      const generated = Gen.objectWith(property1, property2)()
      Object.getOwnPropertyNames(generated).should.contain(property1, property2)
    })

    it('should return an object with string property values', () => {
      const property1 = TestData.string()
      const property2 = TestData.string()

      const generated = Gen.objectWith(property1, property2)()
      generated[property1].should.be.a('String')
      generated[property2].should.be.a('String')
    })

    it('should return an object with randomised property values', () => {
      const property1 = TestData.string()
      const property2 = TestData.string()

      const generated = Gen.objectWith(property1, property2)()
      generated[property1].should.not.eql(generated[property2])
    })
  })

  describe('error', () => {
    it('should produce an error', () => {
      Gen.error().should.be.an('Error')
    })

    it('should produce an error with a message', () => {
      Gen.error().message.length.should.be.greaterThan(0)
    })

    it('should produce different messages on subsequent calls', () => {
      const first = Gen.error()
      const second = Gen.error()

      first.message.should.not.eql(second.message)
    })
  })

  describe('pick', () => {
    it('should throw an error if no values are supplied', () => {
      expect(Gen.pick).to.throw(Error, 'The options to be picked from must be provided')
    })

    it('should throw an error if the argument supplied is not an array', () => {
      const values = TestData.object()
      expect(() => Gen.pick(values)).to.throw(Error, 'The options to be picked from must be an array')
    })

    it('should throw an error if the argument supplied is empty', () => {
      expect(() => Gen.pick([])).to.throw(Error, 'The options array must have at least one entry')
    })

    it('should pick one of the entries from the values array', () => {
      const length = TestData.integer(5, 10)
      const values = new Array(length).fill(1).map(TestData.string)
      Gen.pick(values)().should.be.oneOf(values)
    })

    it('should pick different entries in subsequent calls', () => {
      const values = new Array(10).fill(1).map(TestData.string)
      const generated = new Array(10).fill(0).map(() => Gen.pick(values)())
      const indexSet = new Set(generated.map((value) => values.indexOf(value)))
      indexSet.size.should.be.greaterThan(1)
    })
  })
})
