'use strict'

const SelectionGenerators = function (random) {
  this.pick = (values) => {
    if (!values) {
      throw new Error('The options to be picked from must be provided')
    } else if (!Array.isArray(values)) {
      throw new Error('The options to be picked from must be an array')
    } else if (values.length <= 1) {
      throw new Error('The options array must have at least one entry')
    }

    return () => random.pick(values)
  }
}

module.exports = SelectionGenerators
