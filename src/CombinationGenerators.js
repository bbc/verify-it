const CombinationGenerators = function (random, maxRetries) {
  const generateDistinctOther = (generator, existing, remainingRetries) => {
    if (remainingRetries === 0) {
      throw new Error(`Could not generate distinct values using the provided generator - tried ${maxRetries} times`)
    }

    const newValue = generator()
    if (newValue === existing) {
      return generateDistinctOther(generator, existing, remainingRetries - 1)
    } else {
      return newValue
    }
  }

  this.pairOf = (generator) => {
    if (!generator) {
      throw new Error('A generator function must be provided')
    }

    const first = generator()
    const second = generateDistinctOther(generator, first, maxRetries)
    return () => [first, second]
  }
}

module.exports = CombinationGenerators
