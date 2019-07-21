import { Rule } from './rule'
import { Handler } from './handler'

export interface Config {
  source: string
  include?: string | string[]
  exclude?: string | string[]
  rules?: Rule[] | { [glob: string]: Handler | Handler[] }
  context?: object
  glob?: object
}
