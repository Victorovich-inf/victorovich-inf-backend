import {body} from "express-validator";
import {Course} from '../../models'

export const createLessonValidations = [
    body('name', 'Введите название')
        .not()
        .isEmpty()
        .isLength({
            min: 3
        })
    ,
    body('courseId', 'Введите id курса')
        .not()
        .isEmpty()
];
