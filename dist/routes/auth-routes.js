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
const router = new express_1.default();
router.post('/complete', register_1.completeValidations, AuthController_1.default.complete);
router.post('/login', passport_1.passport.authenticate('login'), AuthController_1.default.afterLogin);
router.get('/check', passport_1.passport.authenticate('jwt', { session: false }), AuthController_1.default.afterLogin);
router.get("/vkontakte-login", passport_1.passport.authenticate("vkontakte-login", { session: false }));
router.get("/vkontakte-register", passport_1.passport.authenticate('register', { session: false }));
router.get('/vkontakte/callback', passport_1.passport.authenticate('vkontakte-login', { session: false }), AuthController_1.default.authCallback);
router.get('/vkontakte/register/callback', passport_1.passport.authenticate('register', { session: false }), AuthController_1.default.authCallback);
exports.default = router;
//# sourceMappingURL=auth-routes.js.map