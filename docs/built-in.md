---
title: built-in
---

There are a few built-in handlers and rules you may find useful:

```javascript
const { Generator, handlers, rules } = require('minigenerator')

new Generator({
  source: 'template',
  rules: {
    'main.js': handlers.rename({ to: 'index.js' }),
    '*.sass': handlers.rename({ from: /^_/, to: '' }), // remove leading underscore
    '*.ejs': [
        handlers.ejs({ /* ejs options */ }), // compile ejs files
        handlers.removeExtension('ejs') // then remove ejs extension
    ]
  },
  context: {   // these data will be accessible from handlers,
    hey: 'hey' // and so ejs will use it as locals
  }
})

new Generator({
    source: 'template',
    rules: [
      // there is also a buit-in ejs rule that uses the two same handlers and glob as above
      rules.ejs({ /* ejs options */ })
    ]
})
```
