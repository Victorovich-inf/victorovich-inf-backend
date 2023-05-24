import {body} from "express-validator";

export const buyCourseValidations = [
    body('buyed', 'Введите buyed')
        .not()
        .isEmpty()
];


