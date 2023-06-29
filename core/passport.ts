// @ts-nocheck
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as JWTstrategy, ExtractJwt} from 'passport-jwt';
import {Strategy as VKontakteStrategy} from 'passport-vkontakte';
import {Strategy as VKontakteStrategyRegister} from 'passport-vkontakte';
import {User, Subscription} from '../models';
import {generateMD5} from '../utils/generateHast';
import {UserModelInterface} from "../@types";
import jwt from "jsonwebtoken";
import {checkActiveSubscription} from "../utils/date";

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

                if (user.banned) {
                    done(null, false);
                }

                if (user.password === generateMD5(password + process.env.SECRET_KEY)) {
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

                if (user.banned) {
                    done(null, false);
                }

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

passport.use('vkontakte-login',
    new VKontakteStrategy(
        {
            clientID: process.env.VKONTAKTE_APP_ID,
            clientSecret: process.env.VKONTAKTE_APP_SECRET,
            callbackURL: `${process.env.SERVER_URL}/auth/vkontakte/callback`,
        },
        async function myVerifyCallbackFn(
            accessToken,
            refreshToken,
            params,
            profile,
            done
        ) {
            try {
                let findUser = await User.findOne({
                    where: {
                        vkId: profile.id,
                    },
                    raw: true
                });

                console.log('findUser', findUser)

                if (!findUser) {
                    done(null, false);
                } else {
                    delete findUser['password']
                    done(null, {
                        data: {
                            ...findUser
                        },
                        token: jwt.sign({data: findUser}, process.env.SECRET_KEY || '123', {
                            expiresIn: '30 days',
                        }),
                    })
                }
            } catch (e) {
                console.log(e)
            }

        }
    )
);

passport.use('register',
    new VKontakteStrategyRegister(
        {
            clientID: process.env.VKONTAKTE_APP_ID,
            clientSecret: process.env.VKONTAKTE_APP_SECRET,
            callbackURL: `${process.env.SERVER_URL}/auth/vkontakte/register/callback`,
        },
        async function myVerifyCallbackFn(
            accessToken,
            refreshToken,
            params,
            profile,
            done
        ) {
            try {
                const data = {
                    id: profile.id,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                }
                const jsonAnswer = {
                    data,
                    type: 'register'
                }

                if (profile) {
                    done(null, jsonAnswer)
                } else {
                    done(null, false)
                }
            } catch (e) {
                console.log(e)
            }

        }
    )
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
