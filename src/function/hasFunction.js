'use strict'

module.exports = (parent, key) => !!parent && !!parent[key] && typeof parent[key] === 'function'
