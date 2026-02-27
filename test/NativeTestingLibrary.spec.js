const { it, describe } = require('node:test')
const { init, Gen } = require('../index')

const verify = init({ it, describe })

verify.describe(
  'When using the native Node.js testing library',
  Gen.string,
  (value) => {
    verify.it('uses generators provided to verify.describe()', (t) => {
      t.assert.strictEqual(typeof value, 'string')
    })
  }
)

describe('When using the native Node.js testing library', () => {
  verify.it(
    'uses generators provided to verify.it()',
    Gen.string,
    (value, t) => {
      t.assert.strictEqual(typeof value, 'string')
    }
  )
})
