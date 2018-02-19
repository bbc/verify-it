'use strict'

const enumerate = (object) => {
  return Object.getOwnPropertyNames(object).filter((name) => typeof object[name] === 'function')
}

module.exports.enumerate = enumerate
