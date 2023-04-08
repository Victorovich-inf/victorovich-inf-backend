import {completeValidations, registerValidations} from "../validations/auth/register";
import AuthController from "../controllers/AuthController";
import Router from 'express'
import {passport} from "../core/passport";
import {adminMiddleware} from "../middleware/authMiddleware";
const router = new Router()

router.post('/complete', completeValidations, AuthController.complete);
router.post('/login', passport.authenticate('login'), AuthController.afterLogin);
router.get('/check', passport.authenticate('jwt', { session: false }), AuthController.afterLogin);

router.post('/admin/register', [passport.authenticate('jwt', { session: false }), adminMiddleware, registerValidations], AuthController.register);
router.post('/admin/login', [passport.authenticate('login'), adminMiddleware], AuthController.afterLogin);

export default router;