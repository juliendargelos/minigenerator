"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ from = null, to }) => from
    ? (entry) => (Object.assign({}, entry, { path: entry.path.replace(from, to) }))
    : (entry) => (Object.assign({}, entry, { path: to }));
