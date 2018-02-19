'use strict'

const ErrorGenerators = function (random) {
  this.error = () => new Error(random.string(20))
}

module.exports = ErrorGenerators
