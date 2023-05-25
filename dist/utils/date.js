"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkActiveSubscription = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const checkActiveSubscription = (end) => {
    let now = (0, dayjs_1.default)();
    return now < (0, dayjs_1.default)(end);
};
exports.checkActiveSubscription = checkActiveSubscription;
//# sourceMappingURL=date.js.map