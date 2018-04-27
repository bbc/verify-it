'use strict'

const wordList = require('./nouns.json')

const WordGenerators = function (random) {
  this.word = () => random.pick(wordList)
}

module.exports = WordGenerators
