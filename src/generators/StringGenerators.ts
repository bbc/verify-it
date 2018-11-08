import { random } from './Random'

export const string = () => random.string(random.integer(1, 100)) // tslint:disable-line variable-name

export const stringWithLength = (length: number) => {
  if (length === null || length === undefined) { // tslint:disable-line strict-type-predicates
    throw new Error('The length of string to be generated must be provided')
  }

  return () => random.string(length)
}

export const stringNonNumeric: () => string = () => {
  const generated = string()
  const filtered = generated.replace(/[0-9]/g, '')
  if (filtered) {
    return filtered
  } else {
    return stringNonNumeric()
  }
}
