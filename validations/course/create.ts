// @ts-nocheck
import {body} from "express-validator";
import {Course} from '../../models'

export const createCourseValidations = [
    body('name', 'Введите название')
        .not()
        .isEmpty()
        .isLength({
            min: 3
        })
        .custom(value => {
        return Course.findOne({ where: {name: value} })
            .then((res) => {
                if (res) {
                    return Promise.reject('Название уже используется')
                } else {
                    return Promise.resolve()
                }
            })
    }),
    body('description', 'Введите описание')
        .not()
        .isEmpty()
        .isLength({
            min: 3
        }),
    body('dateStart', 'Введите дату начала')
        .not()
        .isEmpty()
        .isLength({
            min: 3
        }),
];
