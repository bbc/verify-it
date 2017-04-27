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

  describe('fixedLengthString', () => {
    it('should throw an error if no length is provided', () => {
      const expectedMessage = 'The length of string to be generated must be provided'
      expect(() => Gen.fixedLengthString()).to.throw(Error, expectedMessage)
    })

    it('should produce a string', () => {
      Gen.fixedLengthString(10)().should.be.a('String')
    })

    it('should produce different values for subsequent calls', () => {
      Gen.fixedLengthString(10)().should.not.eql(Gen.fixedLengthString(10)())
    })

    it('should produce a string of the specified length', () => {
      const length = TestData.integer(5, 10)
      Gen.fixedLengthString(length)().should.have.length(length)
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

  describe('real', () => {
    it('should produce a number', () => {
      const generated = Gen.real()
      generated.should.be.a('Number')
    })

    it('should produce different values for subsequent calls', () => {
      Gen.real().should.not.eql(Gen.real())
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

    it('should generate different length arrays', () => {
      const arrayGenerator = Gen.array(() => 1)
      const generated = new Array(10).fill(0).map(() => arrayGenerator())
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
})
