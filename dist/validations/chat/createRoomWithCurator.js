"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoomWithCuratorValidations = void 0;
const express_validator_1 = require("express-validator");
exports.createRoomWithCuratorValidations = [
    (0, express_validator_1.body)('curatorId', 'Введите curatorId')
        .not()
        .isEmpty()
];
//# sourceMappingURL=createRoomWithCurator.js.map