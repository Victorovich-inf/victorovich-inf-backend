import {body} from "express-validator";

export const editTaskValidations = [
    body('name', 'Введите название')
        .not()
        .isEmpty()
        .isLength({
            min: 3
        })
    ,
    body('answer', 'Введите овтет')
        .not()
        .isEmpty()
    ,
    body('public', 'Введите public')
        .not()
        .isEmpty()
    ,
];
