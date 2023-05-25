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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const express_validator_1 = require("express-validator");
const dayjs_1 = __importDefault(require("dayjs"));
class SubscriptionController {
    buySubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json(errors.array());
                return;
            }
            try {
                let duration = req.body.duration;
                let start = (0, dayjs_1.default)().toString();
                let end = (0, dayjs_1.default)().add(+duration, 'month').toString();
                const data = {
                    start: start,
                    end: end,
                    duration: duration,
                    userId: req.user.id,
                };
                const userSub = yield models_1.Subscription
                    .findOne({
                    where: { userId: req.user.id },
                    raw: true
                });
                if (userSub) {
                    yield models_1.Subscription.update(data, { where: { userId: req.user.id } });
                }
                else {
                    yield models_1.Subscription.create(data);
                }
                const user = yield models_1.User.findOne({
                    where: {
                        id: req.user.id,
                    },
                    include: {
                        model: models_1.Subscription
                    }
                });
                res.status(201).json({
                    message: 'Подписка приобретена',
                    user
                });
            }
            catch (e) {
                res.status(500).json({
                    message: 'Ошибка при покупке подписки'
                });
            }
        });
    }
}
exports.default = new SubscriptionController();
//# sourceMappingURL=SubscriptionController.js.map