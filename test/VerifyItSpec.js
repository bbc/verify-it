'use-strict'

const test = require('node:test')
const assert = require('node:assert')
const TestData = require('./TestData')
const { Gen } = require('../index.js')

// Mimic test framework behaviour where done is the first callback argument
const delegateToIt = (name, callback, itFunction) => {
  if (callback.length === 0) {
    return itFunction(name, callback)
  }

  return itFunction(name, (_, done) => {
    return callback(done)
  })
}

const delegatedIt = (name, callback) => {
  return delegateToIt(name, callback, test.it)
}

delegatedIt.skip = (name, callback) => {
  return delegateToIt(name, callback, test.it.skip)
}

global.it = delegatedIt
global.describe = test.describe

describe('verify-it', () => {
  const generated1 = TestData.object()
  const generated2 = TestData.object()

  verify.it(
    'should generate values using the supplied functions using verify.it',
    () => generated1,
    () => generated2,
    (first, second) => {
      assert.equal(first, generated1)
      assert.equal(second, generated2)
    }
  )

  verify.test(
    'should generate values using the supplied functions using verify.test',
    () => generated1,
    () => generated2,
    (first, second) => {
      assert.equal(first, generated1)
      assert.equal(second, generated2)
    }
  )

  verify.it(
    'should work correctly with promise-based tests',
    Gen.error,
    async (error) => {
      await assert.rejects(() => Promise.reject(error), error)
    }
  )

  verify.it('should run tests with no generated values', () => {
    assert.equal('one', 'one')
  })

  verify.it('should support async tests using done', (done) => {
    Promise.resolve('').then(() => done())
  })

  verify.it.skip('should skip tests if marked', () => {
    throw new Error('Should have been skipped')
  })

  describe.skip('when a describe block is skipped', () => {
    verify.it('should skip entire describe blocks', () => {
      throw new Error('Should have been skipped')
    })
  })
})

describe('verify.describe', () => {
  const generated1 = TestData.object()

  verify.describe(
    'when a verify.describe block is used',
    () => generated1,
    (generated) => {
      it('the value from the generator is passed to the inner test function', () => {
        assert.equal(generated, generated1)
      })
    }
  )

  verify.describe.skip('when skipped', () => {
    it('should skip entire describe blocks', () => {
      throw new Error('Should have been skipped')
    })
  })
})
