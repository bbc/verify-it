'use strict'

module.exports = (parent, key) => {
  if (!!parent && !!parent[key] && typeof parent[key] === 'function') {
    /** @type {typeof parent[key]} */
    const value = parent[key]
    return value
  }

  return null
}
