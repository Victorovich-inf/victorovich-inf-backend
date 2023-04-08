import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as JWTstrategy, ExtractJwt} from 'passport-jwt';
import {User} from '../models';
import {generateMD5} from '../utils/generateHast';
import {UserModelInterface} from "../@types";

passport.use('login', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (username: string, password: string, done): Promise<void> => {
            try {
                let user = await User.findOne({where: {email: username}, raw: true})

                if (!user) {
                    return done(null, false);
                }

                if (!user.confirmationCode && user.password === generateMD5(password + process.env.SECRET_KEY)) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch (error) {
                done(error, false);
            }
        },
    )
);

passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.SECRET_KEY || '123',
            jwtFromRequest: ExtractJwt.fromHeader('token'),
        },
        async (payload: {
            data: UserModelInterface;
            id: string }, done): Promise<void> => {
            try {
                const user = await User.findOne({where: {id: payload.data.id}, raw: true});

                if (user) {
                    return done(null, user);
                }

                done(null, false);
            } catch (error) {
                done(error, false);
            }
        },
    ),
);


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        err ? done(err) : done(null, user);
    });
});

export {passport};
