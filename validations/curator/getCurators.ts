import {body} from "express-validator";
import {Course} from '../../models'

export const getCuratorsValidations = [
    body('courseId', 'Введите courseId')
        .not()
        .isEmpty()
];
