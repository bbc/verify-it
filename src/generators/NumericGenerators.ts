import { random } from './Random'

const MAX_REAL_VALUE = Number('1E10')
const MIN_REAL_VALUE = Number('-1E10')

export const integer = () => {
  return random.integer(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
}

export const integerBetween = (min: number, max: number) => {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error(`Both the minimum and maximum values must be integers. Provided min: ${min}, max: ${max}`)
  } else if (min < Number.MIN_SAFE_INTEGER) {
    throw new Error(`Minimum value must be greater than ${Number.MIN_SAFE_INTEGER}. Provided min: ${min}, max: ${max}`)
  } else if (max > Number.MAX_SAFE_INTEGER) {
    throw new Error(`Maximum value must be less than ${Number.MAX_SAFE_INTEGER}. Provided min: ${min}, max: ${max}`)
  } else if (min > max) {
    throw new Error(`Minimum value must be less than the maximum value. Provided min: ${min}, max: ${max}`)
  } else {
    return () => random.integer(min, max)
  }
}

export const float = () => {
  return random.real(MAX_REAL_VALUE, MIN_REAL_VALUE)
}

export const floatBetween = (min: number, max: number) => {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new Error(`Both the minimum and maximum values must be numbers. Provided min: ${min}, max: ${max}`)
  } else if (min > max) {
    throw new Error(`Minimum value must be less than the maximum value. Provided min: ${min}, max: ${max}`)
  } else {
    return () => random.real(min, max, true)
  }
}
