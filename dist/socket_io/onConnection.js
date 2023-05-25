"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const message_handlers_1 = __importDefault(require("./handlers/message.handlers"));
const user_handlers_1 = __importDefault(require("./handlers/user.handlers"));
const notification_handlers_1 = __importDefault(require("./handlers/notification.handlers"));
function onConnection(io, socket) {
    const { roomId, userName, userId } = socket.handshake.query;
    if (userId) {
        socket.userId = userId;
        (0, notification_handlers_1.default)(io, socket);
    }
    if (roomId) {
        socket.roomId = roomId;
        socket.userName = userName;
        socket.join(roomId);
        (0, message_handlers_1.default)(io, socket);
        (0, user_handlers_1.default)(io, socket);
    }
    socket.on('disconnect', () => {
        console.log('disconnect');
        socket.disconnect();
    });
}
exports.default = onConnection;
//# sourceMappingURL=onConnection.js.map