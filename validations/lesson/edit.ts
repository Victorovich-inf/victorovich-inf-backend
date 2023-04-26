import {body} from "express-validator";
import {Course} from '../../models'

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
