import {body} from "express-validator";

export const createTaskValidations = [
    body('name', 'Введите название')
        .not()
        .isEmpty()
        .isLength({
            min: 3
        })
    ,
    body('lessonId', 'Введите id урока')
        .not()
        .isEmpty()
];
