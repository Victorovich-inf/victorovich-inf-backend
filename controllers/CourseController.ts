import express from 'express';
import {Course, Lesson, Task, Content, CourseUser, CuratorCourse, User} from '../models'
import {validationResult} from "express-validator";
import {Content as ContentType} from "../@types";

class CourseController {

    async delete(req: express.Request, res: express.Response) {
        try {
            let {id} = req.params

            const course = Course.findOne({where: {id}})
            //
            // fs.rmSync(course.logo, {
            //     force: true,
            // })

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
                include: [{
                    model: Lesson,
                    include: [
                        {
                            model: Task,
                            include: [
                                {
                                    model: Content
                                },
                                {
                                    model: Lesson
                                }
                            ]
                        },
                        {
                            model: Content
                        }
                    ]
            }, {
                    model: CuratorCourse,
                    include: {
                        model: User
                    }
                }]
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
            include: [
                {
                    model: CourseUser,
                }
            ],
            offset
        })

        return res.json(courses)
    }



    async savePage(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            let {data} = req.body

            const content = data as ContentType;

            Object.keys(content).map(async (el) => {
                let key = el.split('_')[0]
                let type = el.split('_')[1]

                if (type === 'lesson') {
                    if (content[el].elements) {
                        const elements = content[el].elements;
                        await Content.update({content: elements?.length ? elements : []}, {where: {lessonId: key}})
                    }
                } else if (type === 'task') {
                    if (content[el].elements) {
                        const elements = content[el].elements;
                        await Content.update({content: elements?.length ? elements : []}, {where: {taskId: key}})
                    }
                }
            })

            res.status(200).json({
                message: 'Курс сохранен'
            })
        } catch {
            res.status(500).json({
                message: 'Ошибка при сохранении курса'
            })
        }
    }

    async edit(req: express.Request, res: express.Response, next: express.NextFunction) {
        const errors = validationResult(req);

        let {id} = req.params

        if (!errors.isEmpty()) {
            res.status(400).json(errors.array());
            return;
        }

        try {
            await Course.update(
                req.body,
                { where: { id } }
            )

            res.status(201).json({
                message: 'Курс изменён',
            });
        } catch {
            res.status(500).json({
                message: 'Ошибка при изменении курса'
            })
        }
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

            await Content.create({
                lessonId
            })

            const task = await Task.create({
                name: 'Задание 1',
                lessonId
            })

            const taskId = task.id;

            await Content.create({
                taskId
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
