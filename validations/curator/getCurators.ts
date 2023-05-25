import {body} from "express-validator";

export const getCuratorsValidations = [
    body('courseId', 'Введите courseId')
        .not()
        .isEmpty()
];
