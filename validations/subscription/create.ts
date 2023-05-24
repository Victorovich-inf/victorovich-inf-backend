import {body} from "express-validator";

export const createSubscriptionValidations = [
    body('duration', 'Введите duration')
        .not()
        .isEmpty()
];
