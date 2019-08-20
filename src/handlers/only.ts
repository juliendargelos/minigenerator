import { Entry } from '~/entry'

export default (condition: string) => (entry: Entry, context: object) => (
  context[condition] && entry
)
