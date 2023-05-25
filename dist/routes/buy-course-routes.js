"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const passport_1 = require("../core/passport");
const BuyCourseController_1 = __importDefault(require("../controllers/BuyCourseController"));
const updateProgress_1 = require("../validations/course/updateProgress");
const buyCourse_1 = require("../validations/course/buyCourse");
const router = new express_1.default();
router.post('/:id', [passport_1.passport.authenticate('jwt', { session: false }), buyCourse_1.buyCourseValidations], BuyCourseController_1.default.buyCourse);
router.put('/:id', [passport_1.passport.authenticate('jwt', { session: false }), updateProgress_1.updateProgressValidations], BuyCourseController_1.default.updateProgress);
router.delete('/reset', [passport_1.passport.authenticate('jwt', { session: false })], BuyCourseController_1.default.resetWinningStreak);
router.get('/:id', [passport_1.passport.authenticate('jwt', { session: false })], BuyCourseController_1.default.getOnePayment);
exports.default = router;
//# sourceMappingURL=buy-course-routes.js.map