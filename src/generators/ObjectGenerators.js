'use strict'

const ObjectGenerators = function (random, wordGenerators) {
  const createObject = (propertyNames) => {
    const result = {}

    propertyNames.forEach((name) => {
      result[name] = random.string(random.integer(1, 20))
    })

    return result
  }

  this.object = () => {
    const numberOfProperties = random.integer(1, 10)
    const propertyNames = new Array(numberOfProperties).fill(1).map(() => wordGenerators.word())
    return createObject(propertyNames)
  }

  this.objectWith = function () {
    const propertyNames = [].slice.call(arguments)
    if (propertyNames.length === 0) {
      throw new Error('At least one property name must be provided')
    }

    return () => createObject(propertyNames)
  }
}

module.exports = ObjectGenerators
