'use-strict'

const FunctionEnumerator = require('../../src/util/FunctionEnumerator')
const TestData = require('../TestData')

describe('FunctionEnumerator', () => {
  describe('enumerate', () => {
    it('should return an empty array when an empty object is provided', () => {
      FunctionEnumerator.enumerate({}).should.eql([])
    })

    it('should return an empty array when an object with no function properties is provided', () => {
      const object = TestData.object()
      FunctionEnumerator.enumerate(object).should.eql([])
    })

    it('should return an array of function property names', () => {
      const function1 = TestData.string()
      const function2 = TestData.string()

      const object = {
        [function1]: () => '',
        [function2]: () => '',
        [TestData.string()]: TestData.string()
      }

      FunctionEnumerator.enumerate(object).should.contain(function1, function2)
    })
  })
})
