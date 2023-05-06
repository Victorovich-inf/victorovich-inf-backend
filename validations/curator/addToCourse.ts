import {body} from "express-validator";
import {Course} from '../../models'

export const createAddToCourseValidations = [
    body('userId', 'Введите userId')
        .not()
        .isEmpty()
];
