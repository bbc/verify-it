const { describe, it } = require('node:test')
const getFunction = require('../../src/function/getFunction')
const TestData = require('../TestData')

describe('getFunction', () => {
  it('returns null if the parent is undefined', (t) => {
    t.assert.strictEqual(getFunction(), null)
  })

  it('returns null if the parent is null', (t) => {
    t.assert.strictEqual(getFunction(null, TestData.string()), null)
  })

  it('returns null if the parent has no function parameters', (t) => {
    t.assert.strictEqual(getFunction({}, TestData.string()), null)
  })

  it('returns null if the parent has a property that is not a function', (t) => {
    const property = TestData.string()
    const parent = Object.assign(TestData.object(), {
      [property]: TestData.object()
    })
    t.assert.strictEqual(getFunction(parent, property), null)
  })

  it('returns the correct function if the parent has a property that is a function', (t) => {
    const property = TestData.string()
    const parent = Object.assign(TestData.object(), {
      [property]: () => undefined
    })
    const expected = parent[property]
    t.assert.strictEqual(getFunction(parent, property), expected)
  })
})
