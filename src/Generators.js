const Random = require('random-js')
const CombinationGenerators = require('./CombinationGenerators')

const random = new Random(Random.engines.mt19937().autoSeed())
const combinationGenerators = new CombinationGenerators(random, 10)

const string = () => random.string(random.integer(0, 100))

const fixedLengthString = (length) => {
  if (length === null || length === undefined) {
    throw new Error('The length of string to be generated must be provided')
  }

  return () => random.string(length)
}

const integer = () => random.integer(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)

const real = () => random.real(Number.MIN_VALUE, Number.MAX_VALUE)

module.exports = {
  string: string,
  fixedLengthString: fixedLengthString,
  integer: integer,
  real: real,
  pairOf: combinationGenerators.pairOf
}
