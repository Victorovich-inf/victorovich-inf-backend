// @ts-nocheck
import Router from 'express'
import {passport} from "../core/passport";
import BuyCourseController from "../controllers/BuyCourseController";
import {updateProgressValidations} from "../validations/course/updateProgress";
import {buyCourseValidations} from "../validations/course/buyCourse";

const router = new Router()

router.put('/:id', [passport.authenticate('jwt', {session: false}), updateProgressValidations],
    BuyCourseController.updateProgress)

router.patch('/curator-check/', [passport.authenticate('jwt', {session: false})],
    BuyCourseController.updateProgressCurator);
router.delete('/reset', [passport.authenticate('jwt', {session: false})],
    BuyCourseController.resetWinningStreak);
router.get('/:id', [passport.authenticate('jwt', {session: false})], BuyCourseController.getOnePayment);

export default router;
