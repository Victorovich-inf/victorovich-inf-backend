import {body} from "express-validator";

export const editLessonValidations = [
    body('name', 'Введите название')
        .not()
        .isEmpty()
        .isLength({
            min: 3
        })
    ,
    body('public', 'Введите public')
        .not()
        .isEmpty()
];
