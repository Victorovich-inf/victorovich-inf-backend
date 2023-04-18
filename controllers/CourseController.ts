import express from 'express';
import {Course, Lesson, Task} from '../models'
import {validationResult} from "express-validator";
import fs from "fs";

class CourseController {

    async delete(req: express.Request, res: express.Response) {
        try {
            let {id} = req.params

            const course = Course.findOne({where: {id}})

            fs.rmSync(course.logo, {
                force: true,
            })

            await Course.destroy({where: {id}});
            res.status(201).json({
                message: 'Курс удален'
            });
        } catch (e) {
            console.log(e)
        }
    }

    async getOne(req: express.Request, res: express.Response) {
        try {
            let {id} = req.params
            const course = await Course.findOne({where: {id},
                include: {
                    model: Lesson,
                    include: {
                        model: Task
                    }
                }
            });
            res.status(200).json(course);
        } catch (e) {
            console.log(e)
        }
    }

    async getAll(req: express.Request, res: express.Response) {
        let {filter, paging} = req.body
        let {skip, take} = paging
        let offset = skip
        let courses;

        courses = await Course.findAndCountAll({
            limit: take,
            distinct: true,
            where: {...filter},
            offset
        })

        return res.json(courses)
    }

    async create(req: express.Request, res: express.Response, next: express.NextFunction) {
        const errors = validationResult(req);
        const filePath = req.file.path;

        if (!errors.isEmpty()) {
            res.status(400).json(errors.array());
            return;
        }

        try {
            const course = await Course.create({
                name: req.body.name,
                description: req.body.description,
                dateStart: req.body.dateStart,
                cost: req.body.cost,
                logo: filePath,
                free: req.body.free,
            });

            const courseId = course.id;

            const lesson = await Lesson.create({
                name: 'Урок 1',
                courseId
            })

            const lessonId = lesson.id;

            await Task.create({
                name: 'Задание 1',
                lessonId
            })

            res.status(201).json({
                message: 'Курс добавлен',
                data: course
            });
        } catch {
            res.status(500).json({
                message: 'Ошибка при добавлении курса'
            })
        }
    }


}

export default new CourseController();
