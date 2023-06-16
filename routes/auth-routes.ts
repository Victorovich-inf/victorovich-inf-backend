// @ts-nocheck
import {completeValidations} from "../validations/auth/register";
import AuthController from "../controllers/AuthController";
import Router from 'express'
import {passport} from "../core/passport";
const router = new Router()

router.post('/complete', completeValidations, AuthController.complete);
router.post('/has-account', AuthController.hasAccount);
router.post('/login', passport.authenticate('login'), AuthController.afterLogin);
router.get('/check', passport.authenticate('jwt', { session: false }), AuthController.afterLogin);

router.get("/vkontakte-login", passport.authenticate("vkontakte-login", {session: false}));
router.get("/vkontakte-register", passport.authenticate('register', {session: false}));

router.get(
    '/vkontakte/callback',
    passport.authenticate('vkontakte-login', {session: false}),
    AuthController.authCallback,
);

router.get(
    '/vkontakte/register/callback',
    passport.authenticate('register', {session: false}),
    AuthController.authCallback,
);


export default router;
