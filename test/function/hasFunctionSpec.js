const hasFunction = require('../../src/function/hasFunction')
const TestData = require('../TestData')

describe('hasFunction', () => {
  it('returns false if the parent is undefined', () => {
    return hasFunction().should.be.false
  })

  it('returns false if the parent is null', () => {
    return hasFunction(null, TestData.string()).should.be.false
  })

  it('returns false if the parent has no function parameters', () => {
    return hasFunction({}, TestData.string()).should.be.false
  })

  it('returns false if the parent has a property that is not a function', () => {
    const property = TestData.string()
    const parent = Object.assign(TestData.object(), {
      [property]: TestData.object()
    })

    return hasFunction(parent, property).should.be.false
  })

  it('returns true if the parent has a property that is a function', () => {
    const property = TestData.string()
    const parent = Object.assign(TestData.object(), {
      [property]: () => undefined
    })

    return hasFunction(parent, property).should.be.true
  })
})
