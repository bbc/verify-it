import { random } from './Random'

export const error = () => new Error(random.string(20))
