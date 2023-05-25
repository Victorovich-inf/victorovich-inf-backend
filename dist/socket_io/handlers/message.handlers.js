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
// @ts-nocheck
const models_1 = require("../../models");
const file_1 = require("../../utils/file");
const messages = {};
function messageHandlers(io, socket) {
    const { roomId } = socket;
    const updateMessageList = () => {
        io.to(roomId).emit('message_list:update', messages[roomId]);
    };
    socket.on('message:get', () => __awaiter(this, void 0, void 0, function* () {
        if (roomId) {
            messages[roomId] = yield models_1.Message.findAll({
                where: { chatId: roomId }, distinct: true,
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
            });
            updateMessageList();
        }
    }));
    socket.on('message:add', (message) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const created = yield models_1.Message.create(message);
        const createdMessage = yield models_1.Message.findOne({
            where: { id: created.id }, distinct: true,
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
        });
        yield models_1.Notification.create({
            userId: message.recipientId,
            text: `${createdMessage.sender.firstName} ${createdMessage.sender.lastName} написал Вам сообщение`
        });
        (_a = messages[roomId]) === null || _a === void 0 ? void 0 : _a.push(createdMessage);
        updateMessageList();
    }));
    socket.on('message:remove', (message) => __awaiter(this, void 0, void 0, function* () {
        var _b;
        const { id, path } = message;
        yield models_1.Message.destroy({ where: { id } });
        if (path)
            yield (0, file_1.removeFile)(path);
        messages[roomId] = (_b = messages[roomId]) === null || _b === void 0 ? void 0 : _b.filter((m) => m.id !== id);
        updateMessageList();
    }));
}
exports.default = messageHandlers;
//# sourceMappingURL=message.handlers.js.map