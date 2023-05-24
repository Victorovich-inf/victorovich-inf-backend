import express from 'express';
import {Subscription, User} from '../models'
import {validationResult} from "express-validator";
import dayjs from 'dayjs';
import {upsertSubscription} from "../utils/db";

class SubscriptionController {

    async buySubscription(req: express.Request, res: express.Response) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json(errors.array());
            return;
        }
        try {
            let duration = req.body.duration
            let start = dayjs().toString();
            let end = dayjs().add(+duration, 'month').toString()

            await upsertSubscription({
                start: start,
                end: end,
                duration: duration,
                userId: req.user.id,
            }, req.user.id)

            const user = await User.findOne({
                where: {
                    id: req.user.id,
                },
                include: {
                    model: Subscription
                }
            });

            res.status(201).json({
                message: 'Подписка приобретена',
                user
            });
        } catch (e) {
            res.status(500).json({
                message: 'Ошибка при покупке подписки'
            })
        }
    }


}

export default new SubscriptionController();
