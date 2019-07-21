"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("~/utils");
const rename_1 = __importDefault(require("./rename"));
exports.default = (...extensions) => rename_1.default({
    from: new RegExp(`\\.(?:${extensions.map(utils_1.escapeRegExp).join('|')})$`, 'i'),
    to: ''
});
