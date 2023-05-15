import Router from 'express'
import {passport} from "../core/passport";
import ChatController from "../controllers/ChatController";
import {createRoomWithCuratorValidations} from "../validations/chat/createRoomWithCurator";

const router = new Router()

router.post('/withCurator', [passport.authenticate('jwt', {session: false}), createRoomWithCuratorValidations],
    ChatController.createRoomWithCurator)
router.get('/', [passport.authenticate('jwt', {session: false})],
    ChatController.getAll)

export default router;
