"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const express_validator_1 = require("express-validator");
const sequelize_1 = require("sequelize");
class ChatController {
    createRoomWithCurator(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json(errors.array());
                return;
            }
            try {
                const existChat = yield models_1.Chat.findOne({ where: { user1Id: req.body.curatorId, user2Id: req.user.id } });
                if (existChat) {
                    res.status(201).json({
                        roomId: existChat.id,
                    });
                    return;
                }
                const chat = yield models_1.Chat.create({ user1Id: req.body.curatorId, user2Id: req.user.id });
                res.status(201).json({
                    roomId: chat.id,
                });
            }
            catch (e) {
                console.log(e);
                res.status(500).json({
                    message: 'Ошибка при покупке курса'
                });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let chats;
            chats = yield models_1.Chat.findAndCountAll({
                distinct: true,
                include: [
                    {
                        model: models_1.User,
                        as: 'user1'
                    },
                    {
                        model: models_1.User,
                        as: 'user2'
                    }
                ],
                where: {
                    [sequelize_1.Op.or]: [
                        { user1Id: req.user.id },
                        { user2Id: req.user.id }
                    ]
                }
            });
            return res.json(chats);
        });
    }
    getMessagesFromChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let messages;
            let { id } = req.params;
            messages = yield models_1.Message.findAndCountAll({
                distinct: true,
                include: [
                    {
                        model: models_1.User,
                        as: 'sender'
                    },
                    {
                        model: models_1.User,
                        as: 'recipient'
                    }
                ],
                where: {
                    chatId: id
                }
            });
            return res.json(messages);
        });
    }
}
exports.default = new ChatController();
//# sourceMappingURL=ChatController.js.map