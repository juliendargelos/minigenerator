declare module "test" {
    export type Test = string | RegExp | ((path: string) => boolean);
}
declare module "entry" {
    export interface Entry {
        directory?: boolean;
        path: string;
        content?: string;
    }
}
declare module "handler" {
    import { Entry } from "entry";
    export type Handler = ((entry: Entry, context: object) => Entry | null | Promise<Entry | null>);
}
declare module "rule" {
    import { Test } from "test";
    import { Handler } from "handler";
    export interface Rule {
        test: Test;
        use: Handler | Handler[];
        directory?: boolean;
        file?: boolean;
    }
}
declare module "config" {
    import { Rule } from "rule";
    import { Handler } from "handler";
    export interface Config {
        source: string;
        include?: string | string[];
        exclude?: string | string[];
        rules?: Rule[] | {
            [glob: string]: Handler | Handler[];
        };
        context?: object;
        glob?: object;
    }
}
declare module "utils" {
    export function cleanArray(value: any): any[];
    export function escapeRegExp(string: string): string;
}
declare module "generator" {
    import { Config } from "config";
    import { Rule } from "rule";
    import { Handler } from "handler";
    import { Entry } from "entry";
    export class Generator implements Config {
        source: string;
        include: string | string[];
        exclude: string | string[];
        rules: Rule[] | {
            [glob: string]: Handler | Handler[];
        };
        context: object;
        glob: object;
        constructor({ source, include, exclude, rules, context, glob }: Config);
        readonly input: Promise<Entry[]>;
        readonly output: Promise<Entry[]>;
        test(rule: Rule, entry: Entry): boolean;
        use(rule: Rule, entry: Entry): Promise<Entry | null>;
        prompt(questions: any): Promise<void>;
        generate(destination: string): Promise<void>;
    }
}
declare module "handlers/ejs" {
    import { Entry } from "entry";
    const _default: (options: object) => (entry: Entry, context: object) => {
        content: string;
        directory?: boolean;
        path: string;
    };
    export default _default;
}
declare module "handlers/rename" {
    import { Entry } from "entry";
    const _default_1: ({ from, to }: {
        from?: RegExp;
        to: string;
    }) => (entry: Entry) => {
        path: string;
        directory?: boolean;
        content?: string;
    };
    export default _default_1;
}
declare module "handlers/remove-extension" {
    const _default_2: (...extensions: string[]) => (entry: import("entry").Entry) => {
        path: string;
        directory?: boolean;
        content?: string;
    };
    export default _default_2;
}
declare module "handlers/index" {
    export { default as ejs } from "handlers/ejs";
    export { default as removeExtension } from "handlers/remove-extension";
    export { default as rename } from "handlers/rename";
}
declare module "rules/ejs" {
    const _default_3: (options: object) => {
        test: string;
        use: (((entry: import("entry").Entry, context: object) => {
            content: string;
            directory?: boolean;
            path: string;
        }) | ((entry: import("entry").Entry) => {
            path: string;
            directory?: boolean;
            content?: string;
        }))[];
    };
    export default _default_3;
}
declare module "rules/index" {
    export { default as ejs } from "rules/ejs";
}
declare module "index" {
    import * as handlers from "handlers/index";
    import * as rules from "rules/index";
    export { Generator } from "generator";
    export { handlers, rules };
}
