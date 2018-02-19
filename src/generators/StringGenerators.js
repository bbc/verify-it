'use strict'

const StringGenerators = function (random) {
  const generateString = () => random.string(random.integer(1, 100))

  const generateNonNumeric = () => {
    const generated = generateString()
    const filtered = generated.replace(/[0-9]/g, '')
    if (filtered) {
      return filtered
    } else {
      return generateNonNumeric()
    }
  }

  this.string = generateString

  this.stringWithLength = (length) => {
    if (length === null || length === undefined) {
      throw new Error('The length of string to be generated must be provided')
    }

    return () => random.string(length)
  }

  this.stringNonNumeric = generateNonNumeric
}

module.exports = StringGenerators
