require('../index.js')
const TestData = require('./TestData')

describe('verify-it', () => {
  const generated1 = TestData.object()
  const generated2 = TestData.object()

  verify.it('should generate values using the supplied functions',
    () => generated1, () => generated2,
    (first, second) => {
      first.should.eql(generated1)
      second.should.eql(generated2)
    }
  )
})
