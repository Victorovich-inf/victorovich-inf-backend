"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const register_1 = require("../validations/auth/register");
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const express_1 = __importDefault(require("express"));
const passport_1 = require("../core/passport");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploader_1 = require("../core/uploader");
const router = new express_1.default();
router.post('/admin/parse-xlsx', [passport_1.passport.authenticate('jwt', { session: false }), authMiddleware_1.adminMiddleware, uploader_1.uploader.single('file')], AuthController_1.default.parseXLSX);
router.post('/admin/register', [passport_1.passport.authenticate('jwt', { session: false }), authMiddleware_1.adminMiddleware, register_1.registerValidations], AuthController_1.default.register);
router.post('/admin/query', [passport_1.passport.authenticate('jwt', { session: false }), authMiddleware_1.adminMiddleware], AuthController_1.default.getAll);
router.delete('/admin/:id', passport_1.passport.authenticate('jwt', { session: false }), AuthController_1.default.delete);
router.patch('/admin/:id/ban', passport_1.passport.authenticate('jwt', { session: false }), AuthController_1.default.ban);
router.patch('/admin/:id/unban', passport_1.passport.authenticate('jwt', { session: false }), AuthController_1.default.unban);
router.patch('/admin/:id/make-curator', passport_1.passport.authenticate('jwt', { session: false }), AuthController_1.default.makeСurator);
router.patch('/admin/:id/remove-curator', passport_1.passport.authenticate('jwt', { session: false }), AuthController_1.default.removeСurator);
router.get('/notifications', passport_1.passport.authenticate('jwt', { session: false }), AuthController_1.default.getNotifications);
router.get('/achievements', passport_1.passport.authenticate('jwt', { session: false }), AuthController_1.default.getAchievements);
exports.default = router;
//# sourceMappingURL=user-routes.js.map