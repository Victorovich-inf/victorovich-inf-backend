import {completeValidations} from "../validations/auth/register";
import AuthController from "../controllers/AuthController";
import Router from 'express'
import {passport} from "../core/passport";
const router = new Router()

router.post('/complete', completeValidations, AuthController.complete);
router.post('/login', passport.authenticate('login'), AuthController.afterLogin);
router.get('/check', passport.authenticate('jwt', { session: false }), AuthController.afterLogin);

router.get("/vkontakte-login", passport.authenticate("vkontakte-login"));
router.get("/vkontakte-register", passport.authenticate("register", {passReqToCallback: true}));

router.get(
    '/vkontakte/callback',
    passport.authenticate('vkontakte-login'),
    AuthController.authCallback,
);

router.get(
    '/vkontakte/register/callback',
    function(req, res, next) {
        passport.authenticate('register', function(err, user, info) {
            if (err || !user) {
                console.log('err')
                // failed
            } else {
                console.log(req)
                console.log(user)
                console.log('success')
                // successful
            }
        })(req, res, next);
    },
    AuthController.authCallback,
);


export default router;
