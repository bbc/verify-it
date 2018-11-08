import { random } from './Random'

const wordList = require('./nouns.json') as string[]
export const word = () => random.pick(wordList)
