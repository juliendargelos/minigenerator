---
title: options
---

These are the generator default options:

```javascript
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

Note that you can directly feed the generator context from cli prompt:

```javascript
;(async () => {
  await generator.prompt({ name: 'foo' })
  generator.context
  /// => { name: 'Name from cli input' }
})()
```

The `prompt` method is a proxy to the [prompts package](https://github.com/terkelg/prompts) method. It takes the same parameters.

---

See [Rules](rules) for more informations about rule configuration.
