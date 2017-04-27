const NumericGenerators = function (random) {
  this.integer = () => random.integer(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)

  this.real = () => random.real(Number.MIN_VALUE, Number.MAX_VALUE)
}

module.exports = NumericGenerators
