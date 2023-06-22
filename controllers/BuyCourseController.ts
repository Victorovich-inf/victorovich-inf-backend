// @ts-nocheck
import express from 'express';
import {
    Course,
    Lesson,
    Task,
    Content,
    CourseUser,
    ProgressCourseUser,
    CuratorCourse,
    User,
    TaskAnswerFile
} from '../models'
import {validationResult} from "express-validator";
import {
    checkCompletedCourse,
    checkCorrectlyCompletedTasksAndWinningStreak
} from "../utils/achievements";
import {upsertStatics} from "../utils/db";

class BuyCourseController {

    async getOnePayment(req: express.Request, res: express.Response) {
        try {
            let {id} = req.params
            const course = await Course.findOne({
                where: {id},
                order: [
                    [Lesson, 'index', 'ASC'],
                    [Lesson, Task, 'index', 'ASC']
                ],
                include: [
                    {
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
                                    },
                                    {
                                        model: TaskAnswerFile,
                                        include: [
                                            {
                                                model: User
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                model: Content
                            }
                        ]
                    },
                    {
                        model: CourseUser,
                        where: {userId: req.user.id},
                        include: [
                            {
                                model: ProgressCourseUser
                            }
                        ]
                    },
                    {
                        model: CuratorCourse,
                        include: {
                            model: User
                        }
                    }
                ]
            });
            res.status(200).json(course);
        } catch (e) {
            console.log(e)
        }
    }


    async buyCourse(req: express.Request, res: express.Response) {
        const errors = validationResult(req);

        let {id} = req.params

        const userId = req.user.id;

        if (!errors.isEmpty()) {
            res.status(400).json(errors.array());
            return;
        }

        try {
            const courseUser = await CourseUser.create(
                {courseId: id, userId},
            )

            await ProgressCourseUser.create(
                {courseUserId: courseUser.id},
            )

            res.status(201).json({
                message: 'Курс приобретён',
            });
        } catch {
            res.status(500).json({
                message: 'Ошибка при покупке курса'
            })
        }
    }

    async updateProgress(req: express.Request, res: express.Response) {
        const errors = validationResult(req);

        let {id} = req.params


        if (!errors.isEmpty()) {
            res.status(400).json(errors.array());
            return;
        }

        try {

            const courseUser = await CourseUser.findOne({
                where: {
                    userId: req.user.id,
                    courseId: id
                }
            })

            if (!courseUser) {
                return res.status(404).json({
                    message: 'Курс не найден'
                })
            }

            await ProgressCourseUser.update(
                {data: req.body.data},
                {where: {id: courseUser.id}}
            )

            if (req.body?.answer) {
                await checkCorrectlyCompletedTasksAndWinningStreak(req.user.id)
            }

            await checkCompletedCourse(req.body.data, id, req.user.id)

            res.status(201).json();
        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: 'Ошибка при покупке курса'
            })
        }
    }

    async updateProgressCurator(req: express.Request, res: express.Response) {
        const errors = validationResult(req);

        const courseId = req.body.courseId
        const taskId = req.body.taskId
        const lessonId = req.body.lessonId
        const correctly = req.body.correctly
        const userId = req.body.userId

        if (!errors.isEmpty()) {
            res.status(400).json(errors.array());
            return;
        }

        try {

            const courseUser = await CourseUser.findOne({
                where: {
                    userId: userId,
                    courseId: courseId
                }
            })

            const progress = await ProgressCourseUser.findOne({
                where: {
                    courseUserId: courseUser.id,
                }
            })

            if (!courseUser) {
                return res.status(404).json({
                    message: 'Курс не найден'
                })
            }

            const data = JSON.parse(progress.data) || {};

            if (correctly === true) {
                if (Object.keys(data).length) {
                    data[`${lessonId}_lesson`] = {
                        viewed: true,
                        Tasks: [
                            ...data[`${lessonId}_lesson`]?.Tasks || [],
                            {
                                answer: 'Ввиде файла',
                                correctly: true,
                                id: taskId.toString()
                            }
                        ]
                    }
                } else {
                    data[`${lessonId}_lesson`] = {
                        Tasks: [
                            {
                                answer: 'Ввиде файла',
                                correctly: true,
                                id: taskId.toString()
                            }
                        ],
                        viewed: true
                    }
                }
                await ProgressCourseUser.update({data: JSON.stringify(data)}, {
                    where: {
                        courseUserId: courseUser.id,
                    }
                })
                await TaskAnswerFile.destroy({where: {taskId, userId}})
            } else {
                await TaskAnswerFile.update({wrong: true}, {where: {taskId, userId}})
            }

            res.status(201).json();
        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: 'Ошибка при покупке курса'
            })
        }
    }

    async resetWinningStreak(req: express.Request, res: express.Response) {
        try {

            await upsertStatics({winningStreak: 0, userId: req.user.id}, req.user.id)

            res.status(201).json();
        } catch (e) {
            res.status(500).json({
                message: 'Ошибка'
            })
        }
    }


}

export default new BuyCourseController();
