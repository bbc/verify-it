const CombinationGenerators = function (random, maxDistinctRetries) {
  const generateDistinct = (generator, existing, remainingRetries) => {
    if (remainingRetries === 0) {
      throw new Error(`Could not generate distinct values using the provided generator - tried ${maxDistinctRetries} times`)
    }

    const newValue = generator()
    if (existing.includes(newValue)) {
      return generateDistinct(generator, existing, remainingRetries - 1)
    } else {
      return newValue
    }
  }

  this.array = (generator) => {
    if (!generator) {
      throw new Error('A generator function must be provided')
    }

    return () => {
      const length = random.integer(1, 100)
      return new Array(length).fill(1).map(generator)
    }
  }

  this.distinct = (generator, number) => {
    if (!generator) {
      throw new Error('A generator function must be provided')
    }

    if (!number || !Number.isInteger(number) || number < 2) {
      throw new Error('A number of values greater than 1 must be provided')
    }

    return () => {
      const values = []

      for (let i = 0; i < number; i++) {
        values.push(generateDistinct(generator, values, maxDistinctRetries))
      }

      return values
    }
  }
}

module.exports = CombinationGenerators
