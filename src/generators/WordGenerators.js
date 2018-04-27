'use strict'

const wordList = require('../resources/word-list')

const WordGenerators = function (random) {
  this.word = () => random.pick(wordList)
}

module.exports = WordGenerators
