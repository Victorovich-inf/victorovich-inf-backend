"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCuratorsValidations = void 0;
const express_validator_1 = require("express-validator");
exports.getCuratorsValidations = [
    (0, express_validator_1.body)('courseId', 'Введите courseId')
        .not()
        .isEmpty()
];
//# sourceMappingURL=getCurators.js.map