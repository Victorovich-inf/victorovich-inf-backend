"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMD5 = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateMD5 = (value) => {
    return crypto_1.default.createHash('md5').update(value).digest('hex');
};
exports.generateMD5 = generateMD5;
//# sourceMappingURL=generateHast.js.map