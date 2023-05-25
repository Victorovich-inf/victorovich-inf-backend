// @ts-nocheck
import { body } from 'express-validator';
import {User} from '../../models'

export const registerValidations = [
    body('email', 'Введите E-Mail')
        .isEmail()
        .withMessage('Неверный E-Mail')
        .isLength({
            min: 10,
            max: 40,
        })
        .withMessage('Допустимое кол-во символов в почте от 10 до 40.').custom(value => {
        return User.findOne({ where: {email: value} })
            .then((res: any) => {
                if (res) {
                    return Promise.reject('Email уже используется')
                } else {
                    return Promise.resolve()
                }
            })
    }),
];


export const completeValidations = [
    body('token')
        .not()
        .isEmpty()
        .isLength({
            min: 3
        }),
    body('firstName', 'Имя не может быть пустым')
        .not()
        .isEmpty()
        .isLength({
            min: 3
        }),
    body('lastName', 'Фамилия не может быть пустой')
        .not()
        .isEmpty()
        .isLength({
            min: 3
        }),
    body('password', 'Пароль не может быть пустой')
        .not()
        .isEmpty()
        .isLength({
            min: 3
        }),
];
