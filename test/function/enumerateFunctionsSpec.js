'use-strict'

const enumerateFunctions = require('../../src/function/enumerateFunctions')
const TestData = require('../TestData')

describe('enumerateFunctions', () => {
  it('should return an empty array when an empty object is provided', () => {
    enumerateFunctions({}).should.eql([])
  })

  it('should return an empty array when an object with no function properties is provided', () => {
    const object = TestData.object()
    enumerateFunctions(object).should.eql([])
  })

  it('should return an array of function property names', () => {
    const function1 = TestData.string()
    const function2 = TestData.string()

    const object = {
      [function1]: () => '',
      [function2]: () => '',
      [TestData.string()]: TestData.string()
    }

    enumerateFunctions(object).should.contain(function1, function2)
  })
})
