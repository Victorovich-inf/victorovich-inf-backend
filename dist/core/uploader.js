"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploader = void 0;
const multer_1 = __importDefault(require("multer"));
exports.uploader = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: function (_, __, cb) {
            cb(null, 'static');
        },
        filename: function (_, file, cb) {
            cb(null, file.fieldname + '-' + (Math.random() + 1).toString(36).substring(7) + '.' + file.originalname.split('.')[1]);
        },
    }),
});
//# sourceMappingURL=uploader.js.map