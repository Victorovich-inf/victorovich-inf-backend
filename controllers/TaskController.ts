import express from 'express';
import {Task, Lesson, Content} from '../models'
import {validationResult} from "express-validator";

class TaskController {

    async delete(req: express.Request, res: express.Response) {
        try {
            let {id} = req.params

            await Task.destroy({where: {id}});
            res.status(201).json({
                message: 'Задача удалена'
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

        const lesson = Lesson.findOne({where: {id: req.body.lessonId}})

        if (!lesson) {
            res.status(404).json({
                message: 'Урок не найден'
            })
        }

        try {
            const data = await Task.create({
                name: req.body.name,
                lessonId: req.body.lessonId
            })

            const taskId = data.id;

            await Content.create({
                taskId
            })

            res.status(201).json({
                message: 'Задача добавлена',
            });
        } catch {
            res.status(500).json({
                message: 'Ошибка при добавлении задачи'
            })
        }
    }


}

export default new TaskController();
