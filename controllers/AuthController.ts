// @ts-nocheck
import express from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import {Op} from "sequelize";
import {User, Notification, Achievements, Statics, CourseUser, ProgressCourseUser} from '../models'
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

    async updateProfile(req: express.Request, res: express.Response) {
        try {
            const errors = validationResult(req);

            const userId = req.user.id;

            if (!errors.isEmpty()) {
                res.status(400).json(errors.array());
                return;
            }

            await User.update({firstName: req.body.firstName, lastName: req.body.lastName}, {where: {id: userId}})

            let user = {...req.user, firstName: req.body.firstName, lastName: req.body.lastName};

            delete user['password'];

            res.status(201).json({
                message: 'Настройки сохранены',
                user: user
            });
        } catch (e) {
            res.status(500).json({
                message: 'Ошибка при сохранении профиля'
            });
        }
    }

    async updatePassword(req: express.Request, res: express.Response) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                res.status(400).json(errors.array());
                return;
            }

            const oldPassword = generateMD5(req.body.oldPassword + process.env.SECRET_KEY)

            const userId = req.user.id;

            if (oldPassword !== req.user.password) {
                return res.status(403).json({
                    message: 'Пароли не совпадают',
                })
            }
            const newPassword = generateMD5(req.body.newPassword + process.env.SECRET_KEY)

            await User.update({password: newPassword}, {where: {id: userId}})

            res.status(201).json({
                message: 'Пароль изменён',
            });
        } catch (e) {
            res.status(500).json({
                message: 'Ошибка при изменении пароля'
            });
        }
    }

    async getNotifications(req: express.Request, res: express.Response) {
        try {
            const notifications = await Notification.findAll({
                where: {userId: req.user.id},
                order: [['createdAt', 'DESC']]
            });
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

    async makeAdmin(req: express.Request, res: express.Response) {
        try {
            let {id} = req.params
            await User.update({role: 1}, {where: {id}})
            res.status(201).json({
                message: 'Пользователь назначен администратором'
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
        let filterBody = {...filter}
        let {skip, take} = paging
        let offset = skip
        let users;

        if (filter) {
            if (filter.hasOwnProperty('lastName')) {
                filterBody['lastName'] = {
                    [Op.like]: `${filterBody['lastName']}%`,
                }
            }
        }


        users = await User.findAndCountAll({
            limit: take,
            attributes: {exclude: ['password']},
            distinct: true,
            where: {...filterBody},
            order: [['id', 'ASC']],
            offset
        })
        return res.json(users)
    }

    async addToCourse(req: express.Request, res: express.Response, next: express.NextFunction) {
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

            const find = await User.findOne({where: {email: req.body.email}})

            if (find) {
                const courseUser = await CourseUser.create({
                    userId: find.id,
                    courseId: req.body.courseId,
                    end: req.body.end,
                });

                const progress = await ProgressCourseUser.findOne({
                    where: {
                        userId: find.id,
                        courseId: req.body.courseId,
                    }
                })

                if (progress) {
                    await progress.update({courseUserId: courseUser.id});
                } else {
                    await ProgressCourseUser.create({
                        courseUserId: courseUser.id,
                        userId: find.id,
                        courseId: req.body.courseId,
                    })
                }

                await find.update({confirmationCode});
            } else {

                const createdUser = await User.create({
                    email: req.body.email,
                    confirmationCode
                });

                const courseUser = await CourseUser.create({
                    userId: createdUser.id,
                    courseId: req.body.courseId,
                    end: req.body.end,
                });

                await ProgressCourseUser.create({
                    courseUserId: courseUser.id,
                    userId: createdUser.id,
                    courseId: req.body.courseId,
                })
            }

            transporter.sendMail({
                from: process.env.MAIL,
                to: req.body.email,
                subject: "Приглашение на курс",
                html: `<h1>Приглашение на курс</h1>
        <h2>Привет</h2>
        <p>Для получения доступа к курсу перейдите по ссылке !</p>
        <a href=${process.env.FRONT_URL}/auth/register?t=${confirmationCode}&course=${req.body.courseId}> Перейти</a>
        </div>`,
            }).catch(() => next(ApiError.internal('Ошибка при отправке email')))

            res.status(201).json({
                message: 'Пользователь добавлен на курс'
            });
        } catch {
            return next(ApiError.internal('Ошибка при создании пользователя'))
        }
    }

    async editUserCourse(req: express.Request, res: express.Response, next: express.NextFunction) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json(errors.array());
            return;
        }

        try {
            const find = await CourseUser.findOne({where: {userId: req.body.userId, courseId: req.body.courseId}})

            await find.update({end: req.body.end});

            res.status(201).json({
                message: 'Сохранено'
            });
        } catch {
            return next(ApiError.internal('Ошибка при создании пользователя'))
        }
    }

    async deleteUserCourse(req: express.Request, res: express.Response, next: express.NextFunction) {
        let {id} = req.params

        try {
            await CourseUser.destroy({where: {userId: req.body.userId, courseId: id}})

            res.status(201).json({
                message: 'Сохранено'
            });
        } catch (e) {
            console.log(e)
            return next(ApiError.internal('Ошибка при создании пользователя'))
        }
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
                confirmationCode,
                role: 2
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


    async reset(req: express.Request, res: express.Response, next: express.NextFunction) {
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

        const resetCode = generateMD5(process.env.SECRET_KEY + randomStr || randomStr)

        try {
            const user = await User.findOne({
                where: {email: req.body.email}
            });


            if (!user) {
                return res.status(500).json({
                    message: 'Email не найден'
                })
            }

            await user.update({resetCode});

            transporter.sendMail({
                from: process.env.MAIL,
                to: req.body.email,
                subject: "Восстановление пароля",
                html: `<h1>Восстановление пароля</h1>
        <h2>Привет</h2>
        <p>Чтобы задать новый пароль перейдите по ссылке !</p>
        <a href=${process.env.FRONT_URL}/auth/confirm?t=${resetCode}> Перейти</a>
        </div>`,
            }).catch(() => next(ApiError.internal('Ошибка при отправке email')));

            res.status(201).json({
                message: 'Инструкция отправлена на почту'
            });
        } catch {
            return next(ApiError.internal('Ошибка при создании пользователя'))
        }
    }

    async confirm(req: express.Request, res: express.Response, next: express.NextFunction) {
        const newPassword = generateMD5(req.body.password + process.env.SECRET_KEY)

        try {
            const obj = await User.findOne({where: {resetCode: req.body.token}, distinct: true})

            await User.update({password: newPassword, resetCode: null}, {where: {resetCode: req.body.token}})

            let user = obj;
            delete user['password']

            res.json({
                user: {
                    ...user
                },
                token: jwt.sign({data: user}, process.env.SECRET_KEY || '123', {
                    expiresIn: '30 days',
                }),
            });
        } catch (e) {
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

            const courseUser = await CourseUser.findOne({where: {userId: user.id, courseId: req.body.course}})

            if (user.role !== 2) {
                if (!courseUser) {
                    return res.status(404).json({
                        message: 'У вас нет приглашений на курсы',
                    })
                } else {
                    await courseUser.update({completed: true})
                }
            }

            await User.update(data, {where: {confirmationCode: req.body.token}})

            let userData = user;
            delete userData['password']

            return res.json({
                user: {
                    ...userData
                },
                token: jwt.sign({data: userData}, process.env.SECRET_KEY || '123', {
                    expiresIn: '30 days',
                }),
            });
        } catch (e) {
            console.log(e)
            return next(ApiError.internal('Ошибка при создании пользователя'))
        }
    }

    async hasAccount(req: express.Request, res: express.Response, next: express.NextFunction) {
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

            const courseUser = await CourseUser.findOne({where: {userId: user.id, courseId: req.body.course}})

            if (!courseUser && user.role === 0) {
                return res.status(500).json()
            }

            if (user.password) {
                let userData = user;
                delete userData['password']

                await User.update({confirmationCode: null}, {where: {confirmationCode: req.body.token}})

                await courseUser.update({completed: true})

                return res.json({
                    user: {
                        ...userData
                    },
                    token: jwt.sign({data: userData}, process.env.SECRET_KEY || '123', {
                        expiresIn: '30 days',
                    }),
                })
            } else {
                return res.status(404).json()
            }

        } catch (e) {
            console.log(e)
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
