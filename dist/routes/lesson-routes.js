"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const passport_1 = require("../core/passport");
const authMiddleware_1 = require("../middleware/authMiddleware");
const LessonController_1 = __importDefault(require("../controllers/LessonController"));
const create_1 = require("../validations/lesson/create");
const edit_1 = require("../validations/lesson/edit");
const router = new express_1.default();
router.post('/admin/', [passport_1.passport.authenticate('jwt', { session: false }), authMiddleware_1.adminMiddleware, create_1.createLessonValidations], LessonController_1.default.create);
router.delete('/admin/:id', [passport_1.passport.authenticate('jwt', { session: false }), authMiddleware_1.adminMiddleware], LessonController_1.default.delete);
router.put('/admin/:id', [passport_1.passport.authenticate('jwt', { session: false }), authMiddleware_1.adminMiddleware, edit_1.editLessonValidations], LessonController_1.default.edit);
exports.default = router;
//# sourceMappingURL=lesson-routes.js.map