"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const passport_1 = require("../core/passport");
const SubscriptionController_1 = __importDefault(require("../controllers/SubscriptionController"));
const create_1 = require("../validations/subscription/create");
const router = new express_1.default();
router.post('/', [passport_1.passport.authenticate('jwt', { session: false }), create_1.createSubscriptionValidations], SubscriptionController_1.default.buySubscription);
exports.default = router;
//# sourceMappingURL=subscription-routes.js.map