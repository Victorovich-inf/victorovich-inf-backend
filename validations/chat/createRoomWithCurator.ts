import { body } from 'express-validator';

export const createRoomWithCuratorValidations = [
    body('curatorId', 'Введите curatorId')
        .not()
        .isEmpty()
];
