"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passport = void 0;
// @ts-nocheck
const passport_1 = __importDefault(require("passport"));
exports.passport = passport_1.default;
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const passport_vkontakte_1 = require("passport-vkontakte");
const passport_vkontakte_2 = require("passport-vkontakte");
const models_1 = require("../models");
const generateHast_1 = require("../utils/generateHast");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const date_1 = require("../utils/date");
passport_1.default.use('login', new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
}, (username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield models_1.User.findOne({ where: { email: username }, raw: true });
        const subscription = yield models_1.Subscription.findOne({ where: { userId: user.id }, raw: true });
        if (subscription) {
            user.Subscription = Object.assign(Object.assign({}, subscription), { active: (0, date_1.checkActiveSubscription)(subscription.end) });
        }
        else {
            user.Subscription = null;
        }
        if (!user) {
            return done(null, false);
        }
        if (user.banned) {
            done(null, false);
        }
        if (!user.confirmationCode && user.password === (0, generateHast_1.generateMD5)(password + process.env.SECRET_KEY)) {
            done(null, user);
        }
        else {
            done(null, false);
        }
    }
    catch (error) {
        done(error, false);
    }
})));
passport_1.default.use(new passport_jwt_1.Strategy({
    secretOrKey: process.env.SECRET_KEY || '123',
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromHeader('token'),
}, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield models_1.User.findOne({ where: { id: payload.data.id }, raw: true });
        const subscription = yield models_1.Subscription.findOne({ where: { userId: user.id }, raw: true });
        if (subscription) {
            user.Subscription = Object.assign(Object.assign({}, subscription), { active: (0, date_1.checkActiveSubscription)(subscription.end) });
        }
        else {
            user.Subscription = null;
        }
        if (user.banned) {
            done(null, false);
        }
        if (user) {
            return done(null, user);
        }
        done(null, false);
    }
    catch (error) {
        done(error, false);
    }
})));
passport_1.default.use('vkontakte-login', new passport_vkontakte_1.Strategy({
    clientID: process.env.VKONTAKTE_APP_ID,
    clientSecret: process.env.VKONTAKTE_APP_SECRET,
    callbackURL: `${process.env.SERVER_URL}/auth/vkontakte/callback`,
}, function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let findUser = yield models_1.User.findOne({
                where: {
                    vkId: profile.id,
                },
                raw: true
            });
            const subscription = yield models_1.Subscription.findOne({ where: { userId: findUser.id }, raw: true });
            if (subscription) {
                findUser.Subscription = Object.assign(Object.assign({}, subscription), { active: (0, date_1.checkActiveSubscription)(subscription.end) });
            }
            else {
                findUser.Subscription = null;
            }
            if (!findUser) {
                done(null, false);
            }
            else {
                delete findUser['password'];
                done(null, {
                    data: Object.assign({}, findUser),
                    token: jsonwebtoken_1.default.sign({ data: findUser }, process.env.SECRET_KEY || '123', {
                        expiresIn: '30 days',
                    }),
                });
            }
        }
        catch (e) {
            console.log(e);
        }
    });
}));
passport_1.default.use('register', new passport_vkontakte_2.Strategy({
    clientID: process.env.VKONTAKTE_APP_ID,
    clientSecret: process.env.VKONTAKTE_APP_SECRET,
    callbackURL: `${process.env.SERVER_URL}/auth/vkontakte/register/callback`,
}, function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = {
                id: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
            };
            const jsonAnswer = {
                data,
                type: 'register'
            };
            if (profile) {
                done(null, jsonAnswer);
            }
            else {
                done(null, false);
            }
        }
        catch (e) {
            console.log(e);
        }
    });
}));
passport_1.default.serializeUser(function (user, done) {
    done(null, user.id);
});
passport_1.default.deserializeUser(function (id, done) {
    models_1.User.findById(id, function (err, user) {
        err ? done(err) : done(null, user);
    });
});
//# sourceMappingURL=passport.js.map