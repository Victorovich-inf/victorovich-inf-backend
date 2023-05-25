"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyCourseValidations = void 0;
const express_validator_1 = require("express-validator");
exports.buyCourseValidations = [
    (0, express_validator_1.body)('buyed', 'Введите buyed')
        .not()
        .isEmpty()
];
//# sourceMappingURL=buyCourse.js.map