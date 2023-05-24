import Router from 'express'
import {passport} from "../core/passport";
import SubscriptionController from "../controllers/SubscriptionController";
import {createSubscriptionValidations} from "../validations/subscription/create";

const router = new Router()

router.post('/', [passport.authenticate('jwt', {session: false}), createSubscriptionValidations],
    SubscriptionController.buySubscription)

export default router;
