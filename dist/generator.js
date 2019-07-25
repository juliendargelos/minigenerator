"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const minimatch_1 = __importDefault(require("minimatch"));
const prompts_1 = __importDefault(require("prompts"));
const utils_1 = require("./utils");
class Generator {
    constructor({ source, include = '**/*', exclude = [], rules = [], context = {}, glob = {} }) {
        this.source = source;
        this.include = include;
        this.exclude = exclude;
        this.rules = rules;
        this.context = context;
        this.glob = glob;
    }
    get input() {
        return fast_glob_1.default(utils_1.cleanArray(this.include), Object.assign({ dot: true, onlyFiles: false }, this.glob, { cwd: path_1.default.resolve(this.source), ignore: utils_1.cleanArray(this.exclude), objectMode: true, absolute: false })).then(entries => Promise.all(entries.map(async (entry) => ({
            path: entry.path,
            content: entry.dirent.isDirectory()
                ? null
                : (await fs_extra_1.default.readFile(path_1.default.resolve(this.source, entry.path))).toString()
        }))));
    }
    get output() {
        const rules = Array.isArray(this.rules)
            ? this.rules
            : Object.entries(this.rules).map(([test, use]) => ({ test, use }));
        return this.input.then(entries => Promise.all(entries.map(entry => (rules.reduce((entry, rule) => (this.test(rule, entry) ? this.use(rule, entry) : entry), entry))))).then(utils_1.cleanArray);
    }
    test(rule, entry) {
        if (entry.directory && !rule.directory)
            return false;
        if (!entry.directory && 'file' in rule && !rule.file)
            return false;
        if (typeof rule.test === 'function')
            return rule.test(entry.path);
        if (typeof rule.test === 'string')
            return minimatch_1.default(entry.path, rule.test);
        return !!entry.path.match(rule.test);
    }
    async use(rule, entry) {
        return await entry && utils_1.cleanArray(rule.use).reduce(async (entry, handler) => (await entry && handler(await entry, this.context)), entry);
    }
    async prompt(questions) {
        this.context = Object.assign({}, this.context, (await prompts_1.default(questions)));
    }
    async generate(destination) {
        destination = path_1.default.resolve(destination);
        await fs_extra_1.default.ensureDir(destination);
        await Promise.all((await this.output).map(async (entry) => {
            const resolved = path_1.default.join(destination, entry.path);
            if (entry.directory)
                return fs_extra_1.default.ensureDir(resolved);
            await fs_extra_1.default.ensureDir(path_1.default.dirname(resolved));
            await fs_extra_1.default.writeFile(resolved, entry.content);
        }));
    }
}
exports.Generator = Generator;
