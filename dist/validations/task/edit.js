"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editTaskValidations = void 0;
const express_validator_1 = require("express-validator");
exports.editTaskValidations = [
    (0, express_validator_1.body)('name', 'Введите название')
        .not()
        .isEmpty()
        .isLength({
        min: 3
    }),
    (0, express_validator_1.body)('answer', 'Введите овтет')
        .not()
        .isEmpty(),
    (0, express_validator_1.body)('public', 'Введите public')
        .not()
        .isEmpty(),
];
//# sourceMappingURL=edit.js.map