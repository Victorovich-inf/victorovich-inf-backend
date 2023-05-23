import express from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import {User, Notification, Achievements, Statics} from '../models'
import {validationResult} from "express-validator";
import {ApiError} from "../error/ApiError";
import {generateMD5} from "../utils/generateHast";
import {UserModelInterface} from "../@types";
import xlsx from 'node-xlsx';
import * as fs from "fs";

class AuthController {

    authCallback(req: express.Request, res: express.Response) {
        res.send(
            `<script>window.opener.postMessage('${JSON.stringify(
                req.user,
            )}', '*');window.close();</script>`,
        );
    }

    async delete(req: express.Request, res: express.Response) {
        try {
            let {id} = req.params
            await User.destroy({where: {id}});
            res.status(201).json({
                message: 'Пользователь удален'
            });
        } catch (e) {
            console.log(e)
        }
    }

    async getNotifications(req: express.Request, res: express.Response) {
        try {
            const notifications = await Notification.findAll({where: {userId: req.user.id}, order: [['createdAt', 'DESC']]});
            res.status(200).json(notifications);
        } catch (e) {
            console.log(e)
        }
    }

    async getAchievements(req: express.Request, res: express.Response) {
        try {
            const achievements = await Achievements.findOne({where: {userId: req.user.id}});
            const statics = await Statics.findOne({where: {userId: req.user.id}});

            res.status(200).json({
                achievements,
                statics
            });
        } catch (e) {
            console.log(e)
        }
    }

    async parseXLSX(req: express.Request, res: express.Response) {
        try {
            const filePath = req.file.path;

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.MAIL,
                    pass: process.env.PASS
                }
            });

            const parse = xlsx.parse(filePath);

            const rows = parse[0].data;

            rows.shift()

            await Promise.all(rows.map(async (el) => {
                const randomStr = Math.random().toString();

                const confirmationCode = generateMD5(process.env.SECRET_KEY + randomStr || randomStr)

                await User.create({
                    email: el[3] as string,
                    confirmationCode
                });

                await transporter.sendMail({
                    from: process.env.MAIL,
                    to: el[3] as string,
                    subject: "Продолжение регистрации",
                    html: `<h1>Продолжение регистрации</h1>
        <h2>Привет</h2>
        <p>Для продолжения регистрации перейдите по ссылке !</p>
        <a href=${process.env.FRONT_URL}/auth/register?t=${confirmationCode}> Перейти</a>
        </div>`,
                });

            }))

            fs.rmSync(filePath, {
                force: true,
            });

            res.status(201).json({
                message: 'Пользователи добавлены'
            });
        } catch (e) {
            console.log(e)
        }
    }

    async ban(req: express.Request, res: express.Response) {
        try {
            let {id} = req.params
            await User.update({banned: true}, {where: {id}})
            res.status(201).json({
                message: 'Пользователь забанен'
            });
        } catch (e) {
            console.log(e)
        }
    }

    async makeСurator(req: express.Request, res: express.Response) {
        try {
            let {id} = req.params
            await User.update({role: 2}, {where: {id}})
            res.status(201).json({
                message: 'Пользователь назначен куратором'
            });
        } catch (e) {
            console.log(e)
        }
    }

    async removeСurator(req: express.Request, res: express.Response) {
        try {
            let {id} = req.params
            await User.update({role: 0}, {where: {id}})
            res.status(201).json({
                message: 'Пользователь убран из кураторов'
            });
        } catch (e) {
            console.log(e)
        }
    }

    async unban(req: express.Request, res: express.Response) {
        try {
            let {id} = req.params
            await User.update({banned: false}, {where: {id}})
            res.status(201).json({
                message: 'Пользователь разбанен'
            });
        } catch (e) {
            console.log(e)
        }
    }

    async getAll(req: express.Request, res: express.Response) {
        let {filter, paging} = req.body
        let {skip, take} = paging
        let offset = skip
        let users;
        users = await User.findAndCountAll({
            limit: take,
            attributes: {exclude: ['password']},
            distinct: true,
            where: {...filter},
            offset
        })
        return res.json(users)
    }

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
            res.status(400).json(errors.array());
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
        <a href=${process.env.FRONT_URL}/auth/register?t=${confirmationCode}> Перейти</a>
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
            const user = await User.findOne({where: {confirmationCode: req.body.token}, raw: true})

            if (!user) {
                return next(ApiError.internal('Неверный токен!'))
            }

            const data: UserModelInterface = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                vkId: req.body?.vkId || null,
                confirmationCode: null,
                password: generateMD5(req.body.password + process.env.SECRET_KEY),
            };

            await User.update(data, {where: {confirmationCode: req.body.token}})

            let userData = user;
            delete userData['password']

            res.json({
                user: {
                    ...userData
                },
                token: jwt.sign({data: userData}, process.env.SECRET_KEY || '123', {
                    expiresIn: '30 days',
                }),
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
