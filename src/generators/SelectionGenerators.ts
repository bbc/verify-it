import { random } from './Random'

export const pick = <T> (values: T[]) => {
  if (!values) {
    throw new Error('The options to be picked from must be provided')
  } else if (!Array.isArray(values)) {
    throw new Error('The options to be picked from must be an array')
  } else if (values.length <= 1) {
    throw new Error('The options array must have at least one entry')
  } else {
    return () => random.pick(values)
  }
}
