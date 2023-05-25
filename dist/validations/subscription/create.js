"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscriptionValidations = void 0;
const express_validator_1 = require("express-validator");
exports.createSubscriptionValidations = [
    (0, express_validator_1.body)('duration', 'Введите duration')
        .not()
        .isEmpty()
];
//# sourceMappingURL=create.js.map