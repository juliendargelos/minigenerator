# minigenerator

The simplest way to generate files on the go.

## Install

With yarn:

```bash
yarn add minigenerator
```

With npm:

```bash
npm install minigenerator --save
```

## Usage

minigenerator basically does 3 things:
- Read template files you included
- Apply rules you defined
- Write output files to the directory you chose

consider the following folder:

```yaml
generate.js
template/
  - .gitignore
  - main.js
  - README.md
```

**README.md**

```markdown
# hello world
```

**generate.js**

```javascript
const { Generator } = require('minigenerator')

const generator = new Generator({
  source: 'template',
  rules: {
    'main.js': ({ path, content }) => ({ path: 'index.js', content }),
    'README.md': ({ path, content }) => ({ path, content: content.replace('hello', 'hey') })
  }
})

;(async () => {
  await generator.generate('dist')
  console.log('generated')
})()
```

After running `node generate.js` a `dist` directory is created:

```yaml
dist/
  - .gitignore # just copied
  - index.js # copied and renamed from main.js
  - README.md # copied with new content: '# hey world'
```

Here the generator just read all the files included in the `template` directory, and applied rules to matching `main.js` and `README.md` files. Then it wrote output files in the `dist` directory.

### Options

```javascript
// These are the default values

new Generator({
  source,          // path to template directory (required)
  include: '**/*', // glob or array of globs to include from template directory
  exclude: [],     // glob or array of globs to exclude from template directory
  rules: [],       // rules to apply on included files
  context: {},     // arbitrary data to provide to rule handlers
  glob: {}         // fast-glob options
})
```

> See [`fast-glob` options](https://github.com/mrmlnc/fast-glob#options-1).
> 
> Note that the generator overwrites default values for `dot` (`true`) and `onlyFiles` (`false`).
> 
> Since they depend on internal use, `cwd`, `ignore`, `objectMode` and `absolute` options cannot be set.


### Rules

Rules can be written as an object or an array of objects:

```javascript
{
  rules: {
    '**/*.js': (entry, context) => { ... },
    '**/*.css': [ // You can stack mulitple handlers in an array
      (entry, context) => { ... },
      (entry, context) => { ... }
    ]
  }
}
```

```javascript
{
  rules: [
    {
      test: '**/*.js',
      use: (entry, context) => { ... }
    },
    {
      test: '**/*.css',
      use: [
        (entry, context) => { ... },
        (entry, context) => { ... }
    }
  ]
}
```

The first syntax is shorter but the second one gives you more options:

```javascript
{
  // match a glob
  test: '*.md',

  // match a regular expression
  test: /README/,

  // call custom function with entry as parameter
  test: (entry) => entry.content.includes('hello'),

  directory: false, // set to true to handle directories
  file: true        // set false to not handle files
}
```

The `use` option can be one or multiple handlers receiving `entry` and `context` parameters and returning (or not) another entry object. The `context` is the one defined in the generator, and the `entry` is an object representing the file or directory to process with the following properties:

```javascript
{
  path      // path relative to the template directory
  directory // true if the entry is a directory
  content   // content of the file if the entry is not a directory
}
```

If a handler returns a falsy value, the given entry will not be processed anymore by any rule, and it will be excluded from output files:

```javascript
{
    test: '*',
    use: entry => !entry.content.includes('foo') && entry
    // any file containing foo will be excluded
}
```

A handler can be asynchronous by returning a promise resolving the entry or using `async` operator.

### Built-in

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

### Prompt

You can directly feed the generator context from cli prompt:

```javascript
;(async () => {
  await generator.prompt({ name: 'foo' })
  generator.context
  /// => { name: 'Name from cli input' }
})()
```

The prompt option parameter is directly passed to [`inquirer's prompt method`](https://github.com/SBoudrias/Inquirer.js/#inquirerpromptquestions---promise).
