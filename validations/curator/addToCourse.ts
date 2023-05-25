import {body} from "express-validator";

export const createAddToCourseValidations = [
    body('userId', 'Введите userId')
        .not()
        .isEmpty()
];
