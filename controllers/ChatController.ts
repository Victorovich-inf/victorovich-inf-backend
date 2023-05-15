import express from 'express';
import {Chat, User} from '../models'
import {validationResult} from "express-validator";
import {Op} from "sequelize";

class ChatController {
    async createRoomWithCurator(req: express.Request, res: express.Response) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json(errors.array());
            return;
        }
        try {
            const chat = await Chat.create(
                {user1Id: req.body.curatorId, user2Id: req.user.id},
            )
            res.status(201).json({
                roomId: chat.id,
            });
        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: 'Ошибка при покупке курса'
            })
        }
    }

    async getAll(req: express.Request, res: express.Response) {
        let chats;

        chats = await Chat.findAndCountAll({
            distinct: true,
            include: [
                {
                    model: User,
                    as: 'user1'
                },
                {
                    model: User,
                    as: 'user2'
                }
            ],
            where: {
                [Op.or]: [
                    { user1Id: req.user.id },
                    { user2Id: req.user.id }
                ]
            }
        })

        console.log(chats)

        return res.json(chats)
    }


}

export default new ChatController();
