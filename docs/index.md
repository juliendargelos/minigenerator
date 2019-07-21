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

---

See [options](options) for more informations about generator parameters.
