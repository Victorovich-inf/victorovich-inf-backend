"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const passport_1 = require("../core/passport");
const ChatController_1 = __importDefault(require("../controllers/ChatController"));
const createRoomWithCurator_1 = require("../validations/chat/createRoomWithCurator");
const router = new express_1.default();
router.post('/withCurator', [passport_1.passport.authenticate('jwt', { session: false }), createRoomWithCurator_1.createRoomWithCuratorValidations], ChatController_1.default.createRoomWithCurator);
router.get('/', [passport_1.passport.authenticate('jwt', { session: false })], ChatController_1.default.getAll);
router.get('/room/:id', [passport_1.passport.authenticate('jwt', { session: false })], ChatController_1.default.getMessagesFromChat);
exports.default = router;
//# sourceMappingURL=chat-routes.js.map