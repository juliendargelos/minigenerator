import * as ejs from 'ejs'
import { Entry } from '~/entry'

export default (options: object) => (entry: Entry, context: object) => ({
  ...entry,
  content: ejs.render(entry.content, context, options)
})
