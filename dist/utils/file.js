"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFile = exports.getFilePath = void 0;
const promises_1 = require("fs/promises");
const path_1 = require("path");
const fileDir = (0, path_1.join)(__dirname, '..');
const getFilePath = (filePath) => (0, path_1.join)(fileDir, filePath);
exports.getFilePath = getFilePath;
const removeFile = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, promises_1.unlink)((0, path_1.join)(fileDir, filePath));
    }
    catch (e) {
        console.log('error', e);
    }
});
exports.removeFile = removeFile;
//# sourceMappingURL=file.js.map