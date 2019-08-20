import { Entry } from '~/entry'

export default (condition: any) => condition
  ? (entry: Entry) => entry 
  : () => null
