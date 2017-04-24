const { expect } = require('chai')
const { spy } = require('sinon')
const Generators = require('../src/Generators')
const TestData = require('./TestData')

describe('Generators', () => {
  describe('string', () => {
    it('should produce a string', () => {
      Generators.string().should.be.a('String')
    })

    it('should produce different values for subsequent calls', () => {
      Generators.string().should.not.eql(Generators.string())
    })
  })

  describe('fixedLengthString', () => {
    it('should throw an error if no length is provided', () => {
      const expectedMessage = 'The length of string to be generated must be provided'
      expect(() => Generators.fixedLengthString()).to.throw(Error, expectedMessage)
    })

    it('should produce a string', () => {
      Generators.fixedLengthString(10)().should.be.a('String')
    })

    it('should produce different values for subsequent calls', () => {
      Generators.fixedLengthString(10)().should.not.eql(Generators.fixedLengthString(10)())
    })

    it('should produce a string of the specified length', () => {
      const length = TestData.integer(5, 10)
      Generators.fixedLengthString(length)().should.have.length(length)
    })
  })

  describe('integer', () => {
    it('should produce an integer', () => {
      const generated = Generators.integer()
      generated.should.be.a('Number')
      return Number.isInteger(generated).should.be.true
    })

    it('should produce different values for subsequent calls', () => {
      Generators.integer().should.not.eql(Generators.integer())
    })
  })

  describe('real', () => {
    it('should produce a number', () => {
      const generated = Generators.real()
      generated.should.be.a('Number')
    })

    it('should produce different values for subsequent calls', () => {
      Generators.real().should.not.eql(Generators.real())
    })
  })

  describe('pairOf', () => {
    it('should throw an error if no generator function is provided', () => {
      const expectedMessage = 'A generator function must be provided'
      expect(() => Generators.pairOf()).to.throw(Error, expectedMessage)
    })

    it('should return a generator that returns a pair of values from the generator function', () => {
      const value1 = TestData.string()
      const value2 = TestData.string()

      let firstTime = true
      const generator = () => {
        if (firstTime) {
          firstTime = false
          return value1
        } else {
          return value2
        }
      }

      Generators.pairOf(generator)().should.eql([value1, value2])
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

      Generators.pairOf(generator)().should.eql([value1, value2])
    })

    it('should limit subsequent calls to the generator to 10 if the result is always equal to the first value', () => {
      const expectedMessage = 'Could not generate distinct values using the provided generator - tried 10 times'
      const generator = spy(() => '1')

      expect(() => Generators.pairOf(generator)()).to.throw(Error, expectedMessage)
      generator.should.have.callCount(11)
    })
  })
})
