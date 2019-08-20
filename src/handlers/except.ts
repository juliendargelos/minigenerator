import { Entry } from '~/entry'

export default (condition: any) => condition
  ? () => null
  : (entry: Entry) => entry 
