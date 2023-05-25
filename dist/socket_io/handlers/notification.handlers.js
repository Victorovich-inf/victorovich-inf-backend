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
function notificationHandlers(io, socket) {
    const { userId } = socket;
    setInterval(function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (userId) {
                const notifications = yield models_1.Notification.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
                socket.emit("notification", {
                    notifications
                });
            }
        });
    }, 500000);
    socket.on('notification:remove', (message) => __awaiter(this, void 0, void 0, function* () {
        const { id } = message;
        yield models_1.Notification.destroy({ where: { id } });
        const notifications = yield models_1.Notification.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
        socket.emit("notification", {
            notifications
        });
    }));
}
exports.default = notificationHandlers;
//# sourceMappingURL=notification.handlers.js.map