import { Entry } from './entry'

export type Handler = (
  (entry: Entry, context: object) => Entry | null | Promise<Entry | null>
)
