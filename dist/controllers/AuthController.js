"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const express_validator_1 = require("express-validator");
const ApiError_1 = require("../error/ApiError");
const generateHast_1 = require("../utils/generateHast");
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const fs = __importStar(require("fs"));
class AuthController {
    authCallback(req, res) {
        res.send(`<script>window.opener.postMessage('${JSON.stringify(req.user)}', '*');window.close();</script>`);
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.params;
                yield models_1.User.destroy({ where: { id } });
                res.status(201).json({
                    message: 'Пользователь удален'
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    getNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notifications = yield models_1.Notification.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
                res.status(200).json(notifications);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    getAchievements(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const achievements = yield models_1.Achievements.findOne({ where: { userId: req.user.id } });
                const statics = yield models_1.Statics.findOne({ where: { userId: req.user.id } });
                res.status(200).json({
                    achievements,
                    statics
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    parseXLSX(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filePath = req.file.path;
                const transporter = nodemailer_1.default.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.MAIL,
                        pass: process.env.PASS
                    }
                });
                const parse = node_xlsx_1.default.parse(filePath);
                const rows = parse[0].data;
                rows.shift();
                yield Promise.all(rows.map((el) => __awaiter(this, void 0, void 0, function* () {
                    const randomStr = Math.random().toString();
                    const confirmationCode = (0, generateHast_1.generateMD5)(process.env.SECRET_KEY + randomStr || randomStr);
                    yield models_1.User.create({
                        email: el[3],
                        confirmationCode
                    });
                    yield transporter.sendMail({
                        from: process.env.MAIL,
                        to: el[3],
                        subject: "Продолжение регистрации",
                        html: `<h1>Продолжение регистрации</h1>
        <h2>Привет</h2>
        <p>Для продолжения регистрации перейдите по ссылке !</p>
        <a href=${process.env.FRONT_URL}/auth/register?t=${confirmationCode}> Перейти</a>
        </div>`,
                    });
                })));
                fs.rmSync(filePath, {
                    force: true,
                });
                res.status(201).json({
                    message: 'Пользователи добавлены'
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    ban(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.params;
                yield models_1.User.update({ banned: true }, { where: { id } });
                res.status(201).json({
                    message: 'Пользователь забанен'
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    makeСurator(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.params;
                yield models_1.User.update({ role: 2 }, { where: { id } });
                res.status(201).json({
                    message: 'Пользователь назначен куратором'
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    removeСurator(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.params;
                yield models_1.User.update({ role: 0 }, { where: { id } });
                res.status(201).json({
                    message: 'Пользователь убран из кураторов'
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    unban(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.params;
                yield models_1.User.update({ banned: false }, { where: { id } });
                res.status(201).json({
                    message: 'Пользователь разбанен'
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { filter, paging } = req.body;
            let { skip, take } = paging;
            let offset = skip;
            let users;
            users = yield models_1.User.findAndCountAll({
                limit: take,
                attributes: { exclude: ['password'] },
                distinct: true,
                where: Object.assign({}, filter),
                offset
            });
            return res.json(users);
        });
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            const transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MAIL,
                    pass: process.env.PASS
                }
            });
            if (!errors.isEmpty()) {
                res.status(400).json(errors.array());
                return;
            }
            const randomStr = Math.random().toString();
            const confirmationCode = (0, generateHast_1.generateMD5)(process.env.SECRET_KEY + randomStr || randomStr);
            try {
                yield models_1.User.create({
                    email: req.body.email,
                    confirmationCode
                });
                transporter.sendMail({
                    from: process.env.MAIL,
                    to: req.body.email,
                    subject: "Продолжение регистрации",
                    html: `<h1>Продолжение регистрации</h1>
        <h2>Привет</h2>
        <p>Для продолжения регистрации перейдите по ссылке !</p>
        <a href=${process.env.FRONT_URL}/auth/register?t=${confirmationCode}> Перейти</a>
        </div>`,
                }).catch(() => next(ApiError_1.ApiError.internal('Ошибка при отправке email')));
                res.status(201).json({
                    message: 'Пользователь добавлен'
                });
            }
            catch (_a) {
                return next(ApiError_1.ApiError.internal('Ошибка при создании пользователя'));
            }
        });
    }
    complete(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ status: 'error', errors: errors.array() });
                return;
            }
            try {
                const user = yield models_1.User.findOne({ where: { confirmationCode: req.body.token }, raw: true });
                if (!user) {
                    return next(ApiError_1.ApiError.internal('Неверный токен!'));
                }
                const data = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    vkId: ((_a = req.body) === null || _a === void 0 ? void 0 : _a.vkId) || null,
                    confirmationCode: null,
                    password: (0, generateHast_1.generateMD5)(req.body.password + process.env.SECRET_KEY),
                };
                yield models_1.User.update(data, { where: { confirmationCode: req.body.token } });
                let userData = user;
                delete userData['password'];
                res.json({
                    user: Object.assign({}, userData),
                    token: jsonwebtoken_1.default.sign({ data: userData }, process.env.SECRET_KEY || '123', {
                        expiresIn: '30 days',
                    }),
                });
            }
            catch (_b) {
                return next(ApiError_1.ApiError.internal('Ошибка при создании пользователя'));
            }
        });
    }
    afterLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userData = req.user;
                delete userData['password'];
                const user = req.user ? userData : undefined;
                res.json({
                    user: Object.assign({}, user),
                    token: jsonwebtoken_1.default.sign({ data: user }, process.env.SECRET_KEY || '123', {
                        expiresIn: '30 days',
                    }),
                });
            }
            catch (error) {
                res.status(500).json({
                    status: 'error',
                    message: error,
                });
            }
        });
    }
}
exports.default = new AuthController();
//# sourceMappingURL=AuthController.js.map