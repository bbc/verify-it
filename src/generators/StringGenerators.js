const StringGenerators = function (random) {
  this.string = () => random.string(random.integer(0, 100))

  this.fixedLengthString = (length) => {
    if (length === null || length === undefined) {
      throw new Error('The length of string to be generated must be provided')
    }

    return () => random.string(length)
  }
}

module.exports = StringGenerators
