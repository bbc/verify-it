const NumericGenerators = function (random) {
  const MaxRealValue = Number('8E307')
  const MinRealValue = Number('-8E307')

  this.integer = () => random.integer(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)

  this.real = () => random.real(MaxRealValue, MinRealValue)
}

module.exports = NumericGenerators
