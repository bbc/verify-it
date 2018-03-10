'use strict'

const WordGenerators = function (randomWords) {
  const generateWord = () => randomWords()

  this.word = generateWord
}

module.exports = WordGenerators
