"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProgressValidations = void 0;
const express_validator_1 = require("express-validator");
exports.updateProgressValidations = [
    (0, express_validator_1.body)('data', 'Введите описание')
        .not()
        .isEmpty()
        .isLength({
        min: 3
    }),
];
//# sourceMappingURL=updateProgress.js.map