import { random } from './Random'
import { word } from './WordGenerators'

export const createObject = (propertyNames: string[]) => {
  const result = {} as any

  propertyNames.forEach((name) => {
    result[name] = random.string(random.integer(1, 20))
  })

  return result as object
}

export const object = () => {
  const numberOfProperties = random.integer(1, 10)
  const propertyNames = new Array(numberOfProperties).fill(1).map(() => word())
  return createObject(propertyNames)
}

export const objectWith = function () {
  const propertyNames = [].slice.call(arguments)
  if (propertyNames.length === 0) {
    throw new Error('At least one property name must be provided')
  }

  return () => createObject(propertyNames)
}
