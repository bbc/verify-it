const NumericGenerators = function (random) {
  const MaxRealValue = Number('1E10')
  const MinRealValue = Number('-1E10')

  this.integer = () => random.integer(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)

  this.float = () => random.real(MaxRealValue, MinRealValue)
}

module.exports = NumericGenerators
