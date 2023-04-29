import Router from 'express'
import {passport} from "../core/passport";
import BuyCourseController from "../controllers/BuyCourseController";

const router = new Router()

router.post('/:id', [passport.authenticate('jwt', {session: false})],
    BuyCourseController.buyCourse);

export default router;
