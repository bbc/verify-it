import test from 'node:test'
import assert from 'node:assert'
import { Gen, init } from '../../'
import mocha from 'mocha'

// Auto-initialisation if global.it or global.test exist
verify.it('should compile', () => {
  assert(true)
})

const nativeTestVerify = init(test)

nativeTestVerify.describe('Gen', Gen.string, (describeString: string) => {
  nativeTestVerify.it(
    'can use generators',
    Gen.integer,
    (integerValue: number, t) => {
      t.assert.equal(typeof describeString, 'string')
      t.assert.equal(typeof integerValue, 'number')
    }
  )

  nativeTestVerify.it(
    'can run async tests',
    Gen.integer,
    async (integerValue: number, t) => {
      t.assert.equal(typeof describeString, 'string')
      t.assert.equal(typeof integerValue, 'number')
    }
  )

  nativeTestVerify.it(
    'can use the done function',
    Gen.integer,
    (integerValue: number, t, done) => {
      t.assert.equal(typeof describeString, 'string')
      t.assert.equal(typeof integerValue, 'number')

      Promise.resolve()
        .then(() => done())
        .catch((error) => done(error))
    }
  )

  nativeTestVerify.it.skip(
    'can skip tests',
    Gen.integer,
    (integerValue: number, t) => {
      t.assert.equal(typeof describeString, 'string')
      t.assert.equal(typeof integerValue, 'number')
    }
  )

  nativeTestVerify.it.only(
    'can focus tests',
    Gen.integer,
    (integerValue: number, t) => {
      t.assert.equal(typeof describeString, 'string')
      t.assert.equal(typeof integerValue, 'number')
    }
  )
})

const nativeTestVerifyItNoDescribe = init({
  it: test.it
})

// @ts-expect-error - describe should not be available
nativeTestVerifyItNoDescribe.describe

// it and test are synonyms
nativeTestVerifyItNoDescribe.it
nativeTestVerifyItNoDescribe.test

const nativeTestVerifyTestNoDescribe = init({
  test: test.test
})

// @ts-expect-error - describe should not be available
nativeTestVerifyTestNoDescribe.describe

// it and test are synonyms
nativeTestVerifyTestNoDescribe.it
nativeTestVerifyTestNoDescribe.test

const mochaVerify = init(mocha)

mochaVerify.describe('Gen', Gen.string, (describeString: string) => {
  mochaVerify.it('can use generators', Gen.integer, (integerValue: number) => {
    assert(typeof describeString === 'string')
    assert(typeof integerValue === 'number')
  })

  mochaVerify.it(
    'can run async tests',
    Gen.integer,
    async (integerValue: number) => {
      assert(typeof describeString === 'string')
      assert(typeof integerValue === 'number')
    }
  )

  mochaVerify.it(
    'can use the done function',
    Gen.integer,
    (integerValue: number, done) => {
      assert(typeof describeString === 'string')
      assert(typeof integerValue === 'number')

      Promise.resolve()
        .then(() => done())
        .catch((error) => done(error))
    }
  )

  mochaVerify.it.skip('can skip tests', Gen.integer, (integerValue: number) => {
    assert(typeof describeString === 'string')
    assert(typeof integerValue === 'number')
  })

  mochaVerify.it.only(
    'can focus tests',
    Gen.integer,
    (integerValue: number) => {
      assert(typeof describeString === 'string')
      assert(typeof integerValue === 'number')
    }
  )
})

const mochaTestVerifyItNoDescribe = init({
  it: mocha.it
})

// @ts-expect-error - describe should not be available
mochaTestVerifyItNoDescribe.describe

// it and test are synonyms
mochaTestVerifyItNoDescribe.it
mochaTestVerifyItNoDescribe.test

const mochaTestVerifyTestNoDescribe = init({
  test: mocha.test
})

// @ts-expect-error - describe should not be available
mochaTestVerifyTestNoDescribe.describe

// it and test are synonyms
mochaTestVerifyTestNoDescribe.it
mochaTestVerifyTestNoDescribe.test

// Gen.objectWith() should return an object with the specified keys of type string
const objectWithKeys = Gen.objectWith('foo', 'bar')()
typeof objectWithKeys.foo === 'string'
typeof objectWithKeys.bar === 'string'
