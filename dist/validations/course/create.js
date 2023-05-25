"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourseValidations = void 0;
// @ts-nocheck
const express_validator_1 = require("express-validator");
const models_1 = require("../../models");
exports.createCourseValidations = [
    (0, express_validator_1.body)('name', 'Введите название')
        .not()
        .isEmpty()
        .isLength({
        min: 3
    })
        .custom(value => {
        return models_1.Course.findOne({ where: { name: value } })
            .then((res) => {
            if (res) {
                return Promise.reject('Название уже используется');
            }
            else {
                return Promise.resolve();
            }
        });
    }),
    (0, express_validator_1.body)('description', 'Введите описание')
        .not()
        .isEmpty()
        .isLength({
        min: 3
    }),
    (0, express_validator_1.body)('dateStart', 'Введите дату начала')
        .not()
        .isEmpty()
        .isLength({
        min: 3
    }),
];
//# sourceMappingURL=create.js.map