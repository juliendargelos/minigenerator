"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cleanArray(value) {
    return (Array.isArray(value) ? value : [value]).filter(Boolean);
}
exports.cleanArray = cleanArray;
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
exports.escapeRegExp = escapeRegExp;
