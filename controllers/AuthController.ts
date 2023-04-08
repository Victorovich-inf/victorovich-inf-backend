import express from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import {User} from '../models'
import {validationResult} from "express-validator";
import {ApiError} from "../error/ApiError";
import {generateMD5} from "../utils/generateHast";
import {UserModelInterface} from "../@types";

class AuthController {
    async register(req: express.Request, res: express.Response, next: express.NextFunction) {
        const errors = validationResult(req);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL,
                pass: process.env.PASS
            }
        });

        if (!errors.isEmpty()) {
            res.status(400).json({status: 'error', errors: errors.array()});
            return;
        }

        const randomStr = Math.random().toString();

        const confirmationCode = generateMD5(process.env.SECRET_KEY + randomStr || randomStr)

        try {
            await User.create({
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
        <a href=${process.env.FRONT_URL}/confirm?t=${confirmationCode}> Перейти</a>
        </div>`,
            }).catch(() => next(ApiError.internal('Ошибка при отправке email')));

            res.status(201).json({
                message: 'Пользователь добавлен'
            });
        } catch {
            return next(ApiError.internal('Ошибка при создании пользователя'))
        }
    }

    async complete(req: express.Request, res: express.Response, next: express.NextFunction) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({status: 'error', errors: errors.array()});
            return;
        }

        try {
            const user = await User.findOne({where: {confirmationCode: req.body.token}})

            if (!user) {
                return next(ApiError.internal('Неверный токен!'))
            }

            const data: UserModelInterface = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                confirmationCode: null,
                password: generateMD5(req.body.password + process.env.SECRET_KEY),
            };

            await User.update(data, {where: {confirmationCode: req.body.token}})

            res.status(201).json({
                message: 'Регистрация завершена'
            });
        } catch {
            return next(ApiError.internal('Ошибка при создании пользователя'))
        }
    }

    async afterLogin(req: express.Request, res: express.Response): Promise<void> {
        try {
            let userData = req.user;
            delete userData['password']
            const user = req.user ? userData : undefined;
            res.json({
                user: {
                    ...user
                },
                token: jwt.sign({data: user}, process.env.SECRET_KEY || '123', {
                    expiresIn: '30 days',
                }),
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error,
            });
        }
    }


}

export default new AuthController();