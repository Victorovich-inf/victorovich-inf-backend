// @ts-nocheck
import Router from 'express'
import {passport} from "../core/passport";
import BuyCourseController from "../controllers/BuyCourseController";
import {updateProgressValidations} from "../validations/course/updateProgress";
import {buyCourseValidations} from "../validations/course/buyCourse";

const router = new Router()

router.post('/:id', [passport.authenticate('jwt', {session: false}), buyCourseValidations],
    BuyCourseController.buyCourse)
router.put('/:id', [passport.authenticate('jwt', {session: false}), updateProgressValidations],
    BuyCourseController.updateProgress);
router.delete('/reset', [passport.authenticate('jwt', {session: false})],
    BuyCourseController.resetWinningStreak);
router.get('/:id', [passport.authenticate('jwt', {session: false})], BuyCourseController.getOnePayment);

export default router;
