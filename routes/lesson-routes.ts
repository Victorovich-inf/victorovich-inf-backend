import Router from 'express'
import {passport} from "../core/passport";
import {adminMiddleware} from "../middleware/authMiddleware";
import LessonController from "../controllers/LessonController";
import {createLessonValidations} from "../validations/lesson/create";

const router = new Router()

router.post('/admin/', [passport.authenticate('jwt', { session: false }), adminMiddleware, createLessonValidations],
    LessonController.create);
router.delete('/admin/:id', [passport.authenticate('jwt', { session: false }), adminMiddleware], LessonController.delete);


export default router;
