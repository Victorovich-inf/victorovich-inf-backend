import express from 'express';
import {Course, Lesson, Task, Content, CourseUser, ProgressCourseUser, CuratorCourse, User} from '../models'
import {validationResult} from "express-validator";

class BuyCourseController {

    async getOnePayment(req: express.Request, res: express.Response) {
        try {
            let {id} = req.params
            const course = await Course.findOne({
                where: {id},
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

            await ProgressCourseUser.update(
                {data: req.body.data},
                {where: {id}}
            )

            res.status(201).json({
                message: 'Прогресс сохранён',
            });
        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: 'Ошибка при покупке курса'
            })
        }
    }


}

export default new BuyCourseController();
