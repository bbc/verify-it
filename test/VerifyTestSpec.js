'use strict'

const test = require('node:test')
const assert = require('node:assert')
const TestData = require('./TestData')
require('../index.js')

global.test = test.test

const generated1 = TestData.object()
const generated2 = TestData.object()

verify.test(
  'should support initialisation with a global test function',
  () => generated1,
  () => generated2,
  (first, second) => {
    assert.equal(first, generated1)
    assert.equal(second, generated2)
  }
)

verify.it(
  'creates it as a synonym for test when initialised with a global test function',
  () => generated1,
  () => generated2,
  (first, second) => {
    assert.equal(first, generated1)
    assert.equal(second, generated2)
  }
)
