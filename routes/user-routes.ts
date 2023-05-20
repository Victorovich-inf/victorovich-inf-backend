import {registerValidations} from "../validations/auth/register";
import AuthController from "../controllers/AuthController";
import Router from 'express'
import {passport} from "../core/passport";
import {adminMiddleware} from "../middleware/authMiddleware";
import { uploader } from '../core/uploader';

const router = new Router()

router.post('/admin/parse-xlsx', [passport.authenticate('jwt', { session: false }), adminMiddleware, uploader.single('file')],
    AuthController.parseXLSX);
router.post('/admin/register', [passport.authenticate('jwt', { session: false }), adminMiddleware, registerValidations], AuthController.register);
router.post('/admin/query', [passport.authenticate('jwt', { session: false }), adminMiddleware], AuthController.getAll);
router.delete('/admin/:id', passport.authenticate('jwt', { session: false }), AuthController.delete);

router.patch('/admin/:id/ban', passport.authenticate('jwt', { session: false }), AuthController.ban);
router.patch('/admin/:id/unban', passport.authenticate('jwt', { session: false }), AuthController.unban);

router.patch('/admin/:id/make-curator', passport.authenticate('jwt', { session: false }), AuthController.makeСurator);
router.patch('/admin/:id/remove-curator', passport.authenticate('jwt', { session: false }), AuthController.removeСurator);


router.get('/notifications', passport.authenticate('jwt', { session: false }), AuthController.getNotifications);

export default router;
