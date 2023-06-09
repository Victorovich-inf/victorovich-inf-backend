// @ts-nocheck
import express from 'express';
import {Course, Lesson, Content} from '../models'
import {validationResult} from "express-validator";

class LessonController {

    async delete(req: express.Request, res: express.Response) {
        try {
            let {id} = req.params

            await Lesson.destroy({where: {id}});
            res.status(201).json({
                message: 'Урок удален'
            });
        } catch (e) {
            console.log(e)
        }
    }

    async create(req: express.Request, res: express.Response, next: express.NextFunction) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json(errors.array());
            return;
        }

        const lesson = Course.findOne({where: {id: req.body.courseId}})

        if (!lesson) {
            res.status(404).json({
                message: 'Курс не найден'
            })
        }

        try {

            const data = await Lesson.create({
                name: req.body.name,
                courseId: req.body.courseId,
                index: Number(req.body.maxIndex) || 0
            })

            const lessonId = data.id;

            await Content.create({
                lessonId
            })

            res.status(201).json({
                message: 'Урок добавлен',
            });
        } catch {
            res.status(500).json({
                message: 'Ошибка при добавлении курса'
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
            await Lesson.update(
                req.body,
                { where: { id } }
            )

            res.status(201).json({
                message: 'Урок изменён',
            });
        } catch {
            res.status(500).json({
                message: 'Ошибка при изменении урока'
            })
        }
    }

}

export default new LessonController();
