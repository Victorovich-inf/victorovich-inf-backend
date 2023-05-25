// @ts-nocheck
import Router from 'express'
import {passport} from "../core/passport";
import CuratorController from "../controllers/CuratorController";
import {adminMiddleware} from "../middleware/authMiddleware";
import {createAddToCourseValidations} from "../validations/curator/addToCourse";
import {getCuratorsValidations} from "../validations/curator/getCurators";

const router = new Router()

router.post('/:id', [passport.authenticate('jwt', {session: false}), adminMiddleware, createAddToCourseValidations],
    CuratorController.addToCourse)
router.post('/all/query', [passport.authenticate('jwt', {session: false}), adminMiddleware, getCuratorsValidations],
    CuratorController.getCurators);
router.delete('/:id', [passport.authenticate('jwt', {session: false}), adminMiddleware],
    CuratorController.deleteFromCourse);

export default router;
