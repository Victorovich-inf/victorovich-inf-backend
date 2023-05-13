import Router from 'express'
import {passport} from "../core/passport";
import BuyCourseController from "../controllers/BuyCourseController";
import {updateProgressValidations} from "../validations/course/updateProgress";

const router = new Router()

router.post('/:id', [passport.authenticate('jwt', {session: false})],
    BuyCourseController.buyCourse)
router.put('/:id', [passport.authenticate('jwt', {session: false}), updateProgressValidations],
    BuyCourseController.updateProgress);
router.get('/:id', [passport.authenticate('jwt', {session: false})], BuyCourseController.getOnePayment);

export default router;
