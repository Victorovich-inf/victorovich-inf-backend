import Router from 'express'
import {passport} from "../core/passport";
import {adminMiddleware} from "../middleware/authMiddleware";
import { uploader } from '../core/uploader';
import CourseController from "../controllers/CourseController";

const router = new Router()

router.post('/admin/', [passport.authenticate('jwt', { session: false }), adminMiddleware, uploader.single('file')],
    CourseController.create);
router.post('/admin/query', [passport.authenticate('jwt', { session: false }), adminMiddleware],
    CourseController.getAll);
router.get('/admin/:id', [passport.authenticate('jwt', { session: false }), adminMiddleware], CourseController.getOne);
router.delete('/admin/:id', [passport.authenticate('jwt', { session: false }), adminMiddleware], CourseController.delete);


export default router;
