'use strict'

const { describe, it } = require('node:test')
require('../index.js')

describe('when no global test or it function is available', () => {
  it('should throw an error when verify.it is called', (t) => {
    t.assert.throws(
      () => verify.it('test name', () => null),
      new Error(
        'verify-it must be initialised with an it or test function, either by passing it to the init function or by defining a global it or test function'
      )
    )
  })

  it('should throw an error when verify.test is called', (t) => {
    t.assert.throws(
      () => verify.test('test name', () => null),
      new Error(
        'verify-it must be initialised with an it or test function, either by passing it to the init function or by defining a global it or test function'
      )
    )
  })

  it('should throw an error when verify.describe is called', (t) => {
    t.assert.throws(
      () => verify.describe('test name', () => null),
      new Error(
        'verify-it must be initialised with an it or test function, either by passing it to the init function or by defining a global it or test function'
      )
    )
  })
})
