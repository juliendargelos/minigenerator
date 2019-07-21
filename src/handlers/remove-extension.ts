import { escapeRegExp } from '~/utils'
import rename from './rename'

export default (...extensions: string[]) => rename({
  from: new RegExp(`\\.(?:${extensions.map(escapeRegExp).join('|')})$`, 'i'),
  to: ''
})
