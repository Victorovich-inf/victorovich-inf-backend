// @ts-nocheck
import express from 'express';
import {Task, Lesson, Content, TaskAnswerFile} from '../models'
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

        const lesson = await Lesson.findOne({where: {id: req.body.lessonId}})

        if (!lesson) {
            res.status(404).json({
                message: 'Урок не найден'
            })
        }

        try {
            const data = await Task.create({
                name: req.body.name,
                lessonId: req.body.lessonId,
                index: Number(req.body.maxIndex) || 0
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


    async answerFile(req: express.Request, res: express.Response) {
        const task = await Task.findOne({where: {id: req.body.taskId}})

        if (!task) {
            return res.status(404).json({
                message: 'Задача не найдена'
            })
        }

        try {

            await TaskAnswerFile.create({
                taskId: req.body.taskId,
                userId: req.user.id,
                link: req.body.link,
            })

            res.status(201).json({
                message: 'Ответ отправлен на проверку куратору',
            });
        } catch {
            res.status(500).json({
                message: 'Ошибка при загрузке ответа'
            })
        }
    }

    async answerFileAgain(req: express.Request, res: express.Response) {
        const task = await Task.findOne({where: {id: req.body.taskId}})

        if (!task) {
            return res.status(404).json({
                message: 'Задача не найдена'
            })
        }

        try {

            const taskAnswerFile = await TaskAnswerFile.findOne({
                where: {
                    taskId: req.body.taskId,
                    userId: req.user.id,
                }
            })

            await taskAnswerFile.update({wrong: false, link: req.body.link});

            res.status(201).json({
                message: 'Ответ ещё раз отправлен на проверку куратору',
            });
        } catch {
            res.status(500).json({
                message: 'Ошибка при загрузке ответа'
            })
        }
    }


    async edit(req: express.Request, res: express.Response) {
        const errors = validationResult(req);
        const filePath = req?.file?.path;

        let {id} = req.params

        if (!errors.isEmpty()) {
            res.status(400).json(errors.array());
            return;
        }

        try {
            if (filePath) {
                await Task.update(
                    {...req.body, taskSolutionFile: filePath},
                    {where: {id}}
                )
            } else {
                await Task.update(
                    req.body,
                    {where: {id}}
                )
            }

            res.status(201).json();
        } catch (e) {
            console.log('e', e)
            res.status(500).json({
                message: 'Ошибка при изменении задачи'
            })
        }
    }


}

export default new TaskController();
