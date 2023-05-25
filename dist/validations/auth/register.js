"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeValidations = exports.registerValidations = void 0;
// @ts-nocheck
const express_validator_1 = require("express-validator");
const models_1 = require("../../models");
exports.registerValidations = [
    (0, express_validator_1.body)('email', 'Введите E-Mail')
        .isEmail()
        .withMessage('Неверный E-Mail')
        .isLength({
        min: 10,
        max: 40,
    })
        .withMessage('Допустимое кол-во символов в почте от 10 до 40.').custom(value => {
        return models_1.User.findOne({ where: { email: value } })
            .then((res) => {
            if (res) {
                return Promise.reject('Email уже используется');
            }
            else {
                return Promise.resolve();
            }
        });
    }),
];
exports.completeValidations = [
    (0, express_validator_1.body)('token')
        .not()
        .isEmpty()
        .isLength({
        min: 3
    }),
    (0, express_validator_1.body)('firstName', 'Имя не может быть пустым')
        .not()
        .isEmpty()
        .isLength({
        min: 3
    }),
    (0, express_validator_1.body)('lastName', 'Фамилия не может быть пустой')
        .not()
        .isEmpty()
        .isLength({
        min: 3
    }),
    (0, express_validator_1.body)('password', 'Пароль не может быть пустой')
        .not()
        .isEmpty()
        .isLength({
        min: 3
    }),
];
//# sourceMappingURL=register.js.map