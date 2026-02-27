'use strict'

const { describe, it } = require('node:test')
const enumerateFunctions = require('../../src/function/enumerateFunctions')
const TestData = require('../TestData')

describe('enumerateFunctions', () => {
  it('should return an empty array when an empty object is provided', (t) => {
    t.assert.deepStrictEqual(enumerateFunctions({}), [])
  })

  it('should return an empty array when an object with no function properties is provided', (t) => {
    const object = TestData.object()
    t.assert.deepStrictEqual(enumerateFunctions(object), [])
  })

  it('should return an array of function property names', (t) => {
    const function1 = TestData.string()
    const function2 = TestData.string()

    const object = {
      [function1]: () => '',
      [function2]: () => '',
      [TestData.string()]: TestData.string()
    }

    const result = enumerateFunctions(object)
    t.assert.ok(result.includes(function1))
    t.assert.ok(result.includes(function2))
  })
})
