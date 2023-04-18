import Router from 'express'
import {passport} from "../core/passport";
import {adminMiddleware} from "../middleware/authMiddleware";
import TaskController from "../controllers/TaskController";
import {createTaskValidations} from "../validations/task/create";

const router = new Router()

router.post('/admin/', [passport.authenticate('jwt', { session: false }), adminMiddleware, createTaskValidations],
    TaskController.create);
router.delete('/admin/:id', [passport.authenticate('jwt', { session: false }), adminMiddleware], TaskController.delete);


export default router;
