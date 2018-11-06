'use strict'

const enumerateFunctions = (object) => {
  return Object.getOwnPropertyNames(object).filter((name) => typeof object[name] === 'function')
}

module.exports = enumerateFunctions
