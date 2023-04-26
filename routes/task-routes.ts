import Router from 'express'
import {passport} from "../core/passport";
import {adminMiddleware} from "../middleware/authMiddleware";
import TaskController from "../controllers/TaskController";
import {createTaskValidations} from "../validations/task/create";
import {editTaskValidations} from "../validations/task/edit";
import {uploader} from "../core/uploader";

const router = new Router()

router.post('/admin/', [passport.authenticate('jwt', { session: false }), adminMiddleware, createTaskValidations],
    TaskController.create);
router.delete('/admin/:id', [passport.authenticate('jwt', { session: false }), adminMiddleware], TaskController.delete);
router.put('/admin/:id', [passport.authenticate('jwt', { session: false }), adminMiddleware, uploader.single('file')], TaskController.edit);


export default router;
