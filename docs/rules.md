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

---

See [Built-in](built-in) to discover useful buit-in rules and handlers.
