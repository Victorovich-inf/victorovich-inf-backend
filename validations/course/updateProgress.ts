import {body} from "express-validator";

export const updateProgressValidations = [
    body('data', 'Введите описание')
        .not()
        .isEmpty()
        .isLength({
            min: 3
        }),
];


