"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLessonValidations = void 0;
const express_validator_1 = require("express-validator");
exports.createLessonValidations = [
    (0, express_validator_1.body)('name', 'Введите название')
        .not()
        .isEmpty()
        .isLength({
        min: 3
    }),
    (0, express_validator_1.body)('courseId', 'Введите id курса')
        .not()
        .isEmpty()
];
//# sourceMappingURL=create.js.map