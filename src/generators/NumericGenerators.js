'use strict'

const NumericGenerators = function (random) {
  const MaxRealValue = Number('1E10')
  const MinRealValue = Number('-1E10')

  this.integer = () => random.integer(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)

  this.integerBetween = (min, max) => {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new Error(`Both the minimum and maximum values must be integers. Provided min: ${min}, max: ${max}`)
    }

    if (min < Number.MIN_SAFE_INTEGER) {
      throw new Error(`Minimum value must be greater than ${Number.MIN_SAFE_INTEGER}. Provided min: ${min}, max: ${max}`)
    }

    if (max > Number.MAX_SAFE_INTEGER) {
      throw new Error(`Maximum value must be less than ${Number.MAX_SAFE_INTEGER}. Provided min: ${min}, max: ${max}`)
    }

    if (min > max) {
      throw new Error(`Minimum value must be less than the maximum value. Provided min: ${min}, max: ${max}`)
    }

    return () => random.integer(min, max)
  }

  this.float = () => random.real(MaxRealValue, MinRealValue)

  this.floatBetween = (min, max) => {
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      throw new Error(`Both the minimum and maximum values must be numbers. Provided min: ${min}, max: ${max}`)
    }

    if (min > max) {
      throw new Error(`Minimum value must be less than the maximum value. Provided min: ${min}, max: ${max}`)
    }

    return () => random.real(min, max, true)
  }
}

module.exports = NumericGenerators
