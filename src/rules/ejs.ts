import { ejs, removeExtension } from '~/handlers'

export default (options: object) => ({
  test: '*.ejs',
  use: [
    ejs(options),
    removeExtension('ejs')
  ]
})
