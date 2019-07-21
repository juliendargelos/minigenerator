"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handlers_1 = require("~/handlers");
exports.default = (options) => ({
    test: '*.ejs',
    use: [
        handlers_1.ejs(options),
        handlers_1.removeExtension('ejs')
    ]
});
