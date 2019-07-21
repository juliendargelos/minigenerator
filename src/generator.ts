import path from 'path'
import fs from 'fs-extra'
import glob from 'fast-glob'
import minimatch from 'minimatch'
import inquirer from 'inquirer'
import { Config } from './config'
import { Rule } from './rule'
import { Handler } from './handler'
import { Entry } from './entry'
import { cleanArray } from './utils'

export class Generator implements Config {
  public source: string
  public include: string | string[]
  public exclude: string | string[]
  public rules: Rule[] | { [glob: string]: Handler | Handler[] }
  public context: object
  public glob: object

  constructor({
    source,
    include = '**/*',
    exclude = [],
    rules = [],
    context = {},
    glob = {}
  }: Config) {
    this.source = source
    this.include = include
    this.exclude = exclude
    this.rules = rules
    this.context = context
    this.glob = glob
  }

  get input(): Promise<Entry[]> {
    return glob(cleanArray(this.include), {
      dot: true,
      onlyFiles: false,
      ...this.glob,
      cwd: path.resolve(this.source),
      ignore: cleanArray(this.exclude),
      objectMode: true,
      absolute: false
    }).then(entries => Promise.all(entries.map(async entry => ({
      path: entry.path,
      content: entry.dirent.isDirectory()
        ? null
        : (await fs.readFile(path.resolve(this.source, entry.path))).toString()
    }))))
  }

  get output(): Promise<Entry[]> {
    const rules = Array.isArray(this.rules)
      ? this.rules
      : Object.entries(this.rules).map(([test, use]): Rule => ({ test, use }))

    return this.input.then(entries => Promise.all(entries.map(entry => (
      rules.reduce((entry: Entry, rule: Rule) => (
        this.test(rule, entry) ? this.use(rule, entry) : entry
      ), entry)
    )))).then(cleanArray)
  }

  test(rule: Rule, entry: Entry): boolean {
    if (entry.directory && !rule.directory) return false
    if (!entry.directory && 'file' in rule && !rule.file) return false
    if (typeof rule.test === 'function') return rule.test(entry.path)
    if (typeof rule.test === 'string') return minimatch(entry.path, rule.test)
    return !!entry.path.match(rule.test)
  }

  async use(rule: Rule, entry: Entry): Promise<Entry | null> {
    return await entry && cleanArray(rule.use).reduce(async (entry, handler) => (
      await entry && handler(await entry, this.context)
    ), entry)
  }

  async prompt(questions): Promise<void> {
    this.context = { ...this.context, ...(await inquirer.promp(questions)) }
  }

  async generate(destination: string): Promise<void> {
    destination = path.resolve(destination)
    await fs.ensureDir(destination)
    await Promise.all((await this.output).map(async (entry) => {
      const resolved = path.join(destination, entry.path)
      if (entry.directory) return fs.ensureDir(resolved)
      await fs.ensureDir(path.dirname(resolved))
      await fs.writeFile(resolved, entry.content)
    }))
  }
}
