const { expect } = require('chai')
const getFunction = require('../../src/function/getFunction')
const TestData = require('../TestData')

describe('getFunction', () => {
  it('returns null if the parent is undefined', () => {
    expect(getFunction()).to.be.null
  })

  it('returns null if the parent is null', () => {
    expect(getFunction(null, TestData.string())).to.be.null
  })

  it('returns null if the parent has no function parameters', () => {
    expect(getFunction({}, TestData.string())).to.be.null
  })

  it('returns null if the parent has a property that is not a function', () => {
    const property = TestData.string()
    const parent = Object.assign(TestData.object(), {
      [property]: TestData.object()
    })
    expect(getFunction(parent, property)).to.be.null
  })

  it('returns true if the parent has a property that is a function', () => {
    const property = TestData.string()
    const parent = Object.assign(TestData.object(), {
      [property]: () => undefined
    })
    expect(getFunction(parent, property)).to.equal(parent[property])
  })
})
