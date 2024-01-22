'use strict'

const RandomJS = require('random-js')
const enumerateFunctions = require('./function/enumerateFunctions')
const StringGenerators = require('./generators/StringGenerators')
const NumericGenerators = require('./generators/NumericGenerators')
const CombinationGenerators = require('./generators/CombinationGenerators')
const ObjectGenerators = require('./generators/ObjectGenerators')
const ErrorGenerators = require('./generators/ErrorGenerators')
const SelectionGenerators = require('./generators/SelectionGenerators')
const WordGenerators = require('./generators/WordGenerators')
const BooleanGenerators = require('./generators/BooleanGenerators')
const DateGenerators = require('./generators/DateGenerators')

const random = new RandomJS.Random(RandomJS.MersenneTwister19937.autoSeed())
const stringGenerators = new StringGenerators(random)
const numericGenerators = new NumericGenerators(random)
const combinationGenerators = new CombinationGenerators(random, 10)
const errorGenerators = new ErrorGenerators(random)
const selectionGenerators = new SelectionGenerators(random)
const wordGenerators = new WordGenerators(random)
const objectGenerators = new ObjectGenerators(random, wordGenerators)
const booleanGenerators = new BooleanGenerators(random)
const dateGenerators = new DateGenerators(random)

const generators = [
  stringGenerators,
  numericGenerators,
  combinationGenerators,
  objectGenerators,
  errorGenerators,
  selectionGenerators,
  wordGenerators,
  booleanGenerators,
  dateGenerators
]

generators.forEach((generator) => {
  enumerateFunctions(generator).forEach((name) => {
    module.exports[name] = generator[name]
  })
})
