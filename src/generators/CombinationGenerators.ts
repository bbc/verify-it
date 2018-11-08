import { random } from './Random'

type Generator<T> = () => T

const MAX_DISTINCT_RETRIES = 10

export function generateDistinct <T> (generator: Generator<T>, existing: T[], remainingRetries: number = MAX_DISTINCT_RETRIES): T {
  if (remainingRetries === 0) {
    throw new Error(`Could not generate distinct values using the provided generator - tried ${MAX_DISTINCT_RETRIES} times`)
  }

  const newValue = generator()
  if (existing.indexOf(newValue) !== -1) {
    return generateDistinct(generator, existing, remainingRetries - 1)
  } else {
    return newValue
  }
}

export const array = <T> (generator: Generator<T>, length: number) => {
  if (!generator) {
    throw new Error('A generator function must be provided')
  }

  return () => {
    const lengthToUse = length || random.integer(1, 100)
    return new Array(lengthToUse).fill(1).map(generator)
  }
}

export const distinct = <T> (generator: Generator<T>, length: number) => {
  if (!generator) {
    throw new Error('A generator function must be provided')
  }

  if (!length || !Number.isInteger(length) || length < 2) {
    throw new Error('A number of values greater than 1 must be provided')
  }

  return () => {
    const values = [] as T[]

    new Array(length).fill(1).forEach(() => {
      values.push(generateDistinct(generator, values))
    })

    return values
  }
}
