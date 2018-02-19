'use-strict'

require('../index.js')
const TestData = require('./TestData')

describe('verify-it', () => {
  const generated1 = TestData.object()
  const generated2 = TestData.object()

  verify.it('should generate values using the supplied functions using verify.it',
    () => generated1, () => generated2,
    (first, second) => {
      first.should.eql(generated1)
      second.should.eql(generated2)
    }
  )

  verify.test('should generate values using the supplied functions using verify.test',
    () => generated1, () => generated2,
    (first, second) => {
      first.should.eql(generated1)
      second.should.eql(generated2)
    }
  )

  verify.it('should work correctly with promise-based tests', () => '', (value) => {
    return Promise.reject(value).should.have.been.rejected
  })

  verify.it('should run tests with no generated values', () => {
    'one'.should.eql('one')
  })

  verify.it('should support async tests using done', (done) => {
    Promise.resolve('')
      .then(() => done())
  })
})
