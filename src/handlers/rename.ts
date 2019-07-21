import { Entry } from '~/entry'

export default ({ from = null, to }: { from?: RegExp, to: string }) => from
  ? (entry: Entry) => ({ ...entry, path: entry.path.replace(from, to) })
  : (entry: Entry) => ({ ...entry, path: to })
