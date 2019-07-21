import { Test } from './test'
import { Handler } from './handler'

export interface Rule {
  test: Test
  use: Handler | Handler[]
  directory?: boolean
  file?: boolean
}
