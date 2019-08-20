import { Entry } from '~/entry'

export default (condition: any) => (entry: Entry) => !condition && entry
