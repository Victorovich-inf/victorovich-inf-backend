"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskValidations = void 0;
const express_validator_1 = require("express-validator");
exports.createTaskValidations = [
    (0, express_validator_1.body)('name', 'Введите название')
        .not()
        .isEmpty()
        .isLength({
        min: 3
    }),
    (0, express_validator_1.body)('lessonId', 'Введите id урока')
        .not()
        .isEmpty()
];
//# sourceMappingURL=create.js.map