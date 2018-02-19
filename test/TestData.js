'use strict'

const Random = require('random-js')
const random = new Random()

const string = (length) => length ? random.string(length) : random.string(10)

const integer = (min, max) => random.integer(min, max)

const float = (min, max) => random.real(min, max)

const object = () => {
  let keys = [].slice.call(arguments)
  if (!keys || !keys.length) {
    const numberOfKeys = random.integer(1, 20)
    keys = []
    for (let i = 0; i < numberOfKeys; i++) {
      keys[i] = random.string(10)
    }
  }

  const obj = {}
  keys.forEach((key) => {
    obj[key] = random.string(30)
  })

  return obj
}

const error = () => new Error(random.string(20))

module.exports.string = string
module.exports.integer = integer
module.exports.float = float
module.exports.object = object
module.exports.error = error
