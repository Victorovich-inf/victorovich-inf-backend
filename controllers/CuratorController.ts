// @ts-nocheck
import express from 'express';
import { Course, CuratorCourse, User, CourseUser} from '../models'
import {validationResult} from "express-validator";

class CuratorController {

    async deleteFromCourse(req: express.Request, res: express.Response) {
        try {
            let {id} = req.params

            await CuratorCourse.destroy({where: {id}});
            res.status(201).json({
                message: 'Куратор удалён из курса'
            });
        } catch (e) {
            console.log(e)
        }
    }

    async addToCourse(req: express.Request, res: express.Response, next: express.NextFunction) {
        const errors = validationResult(req);
        let {id: courseId} = req.params

        if (!errors.isEmpty()) {
            res.status(400).json(errors.array());
            return;
        }

        const course = await Course.findOne({where: {id: courseId}})

        if (!course) {
            return res.status(404).json({
                message: 'Курс не найден'
            })
        }

        const curatorCourse = await CuratorCourse.findOne({where: {courseId, userId: req.body.userId}})

        if (curatorCourse) {
            return res.status(404).json({
                message: 'Куратор уже прикреплён к этому курсу'
            })
        }

        try {
            await CuratorCourse.create({
                courseId,
                userId: req.body.userId
            })

            await CourseUser.create({
                courseId,
                curator: true,
                userId: req.body.userId
            })

            res.status(201).json({
                message: 'Куратор добавлен в курс',
            });
        } catch {
            res.status(500).json({
                message: 'Ошибка при добавлении куратора в курс'
            })
        }
    }


    async getCurators(req: express.Request, res: express.Response) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json(errors.array());
            return;
        }

        let curators = await User.findAndCountAll({
            distinct: true,
            where: {
                role: 2,
            }
        })

        return res.json(curators)
    }
}

export default new CuratorController();
