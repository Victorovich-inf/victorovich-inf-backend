import {registerValidations} from "../validations/auth/register";
import AuthController from "../controllers/AuthController";
import Router from 'express'
import {passport} from "../core/passport";
import {adminMiddleware} from "../middleware/authMiddleware";
const router = new Router()

router.post('/admin/register', [passport.authenticate('jwt', { session: false }), adminMiddleware, registerValidations], AuthController.register);
router.post('/admin/query', [passport.authenticate('jwt', { session: false }), adminMiddleware], AuthController.getAll);
router.delete('/admin/:id', passport.authenticate('jwt', { session: false }), AuthController.delete);

router.patch('/admin/:id/ban', passport.authenticate('jwt', { session: false }), AuthController.ban);
router.patch('/admin/:id/unban', passport.authenticate('jwt', { session: false }), AuthController.unban);

router.patch('/admin/:id/make-curator', passport.authenticate('jwt', { session: false }), AuthController.makeСurator);
router.patch('/admin/:id/remove-curator', passport.authenticate('jwt', { session: false }), AuthController.removeСurator);

export default router;
