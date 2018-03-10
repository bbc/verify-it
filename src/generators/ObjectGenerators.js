'use strict'

const ObjectGenerators = function (random, randomWords) {
  const createObject = (propertyNames) => {
    const result = {}

    propertyNames.forEach((name) => {
      result[name] = random.string(random.integer(1, 20))
    })

    return result
  }

  this.object = () => {
    const numberOfProperties = random.integer(1, 10)
    const propertyNames = new Array(numberOfProperties).fill(1).map(() => random.string(20))
    return createObject(propertyNames)
  }

  this.objectWithReadableKeys = () => {
    const numberOfProperties = random.integer(1, 10)
    const propertyNames = new Array(numberOfProperties).fill(1).map(() => randomWords())
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
