"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAddToCourseValidations = void 0;
const express_validator_1 = require("express-validator");
exports.createAddToCourseValidations = [
    (0, express_validator_1.body)('userId', 'Введите userId')
        .not()
        .isEmpty()
];
//# sourceMappingURL=addToCourse.js.map