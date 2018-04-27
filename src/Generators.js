'use strict'

const Random = require('random-js')
const FunctionEnumerator = require('./util/FunctionEnumerator')
const StringGenerators = require('./generators/StringGenerators')
const NumericGenerators = require('./generators/NumericGenerators')
const CombinationGenerators = require('./generators/CombinationGenerators')
const ObjectGenerators = require('./generators/ObjectGenerators')
const ErrorGenerators = require('./generators/ErrorGenerators')
const SelectionGenerators = require('./generators/SelectionGenerators')
const WordGenerators = require('./generators/WordGenerators')

const random = new Random(Random.engines.mt19937().autoSeed())
const stringGenerators = new StringGenerators(random)
const numericGenerators = new NumericGenerators(random)
const combinationGenerators = new CombinationGenerators(random, 10)
const errorGenerators = new ErrorGenerators(random)
const selectionGenerators = new SelectionGenerators(random)
const wordGenerators = new WordGenerators(random)
const objectGenerators = new ObjectGenerators(random, wordGenerators)

const generators = [
  stringGenerators,
  numericGenerators,
  combinationGenerators,
  objectGenerators,
  errorGenerators,
  selectionGenerators,
  wordGenerators
]

generators.forEach((generator) => {
  FunctionEnumerator.enumerate(generator).forEach((name) => {
    module.exports[name] = generator[name]
  })
})
