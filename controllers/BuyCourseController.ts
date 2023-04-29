import express from 'express';
import { ProgressCourseUser, CourseUser} from '../models'
import {validationResult} from "express-validator";

class BuyCourseController {

    async buyCourse(req: express.Request, res: express.Response, next: express.NextFunction) {
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

}

export default new BuyCourseController();
