// @ts-nocheck
import express from 'express';
import {Course, Lesson, Task, Content, CourseUser, CuratorCourse, User} from '../models'
import {validationResult} from "express-validator";
import {Content as ContentType} from "../@types";
import {removeFile} from "../utils/file";

class CourseController {

    async delete(req: express.Request, res: express.Response) {
        try {
            let {id} = req.params

            const course = Course.findOne({where: {id}})

            if (course.logo)
                await removeFile(course.logo)

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
            const course = await Course.findOne({
                where: {id},
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

    async getScheduleOfLessons(req: express.Request, res: express.Response) {
        try {
            let userId = req.user.id
            const coursesUser = await CourseUser.findAll({
                where: {userId},
            });

            const courseIds = coursesUser.map(el => el.courseId);

            if (courseIds?.length) {

                const lessons = []

                for (let i = 0; i < courseIds.length; i++) {
                    const course = await Lesson.findAll({
                        where: {courseId: courseIds[i]},
                        include: {
                            model: Course
                        },
                    })
                    lessons.push(...course)
                }

                return res.status(200).json(lessons);
            } else {
                return res.status(200).json([])
            }
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

    async edit(req: express.Request, res: express.Response) {
        const filePath = req?.file?.path;

        let {id} = req.params

        try {
            if (filePath) {
                await Course.update(
                    {...req.body, logo: filePath},
                    {where: {id}}
                )
            } else {
                await Course.update(
                    req.body,
                    {where: {id}}
                )
            }

            res.status(201).json({
                message: 'Курс изменён',
            });
        } catch {
            res.status(500).json({
                message: 'Ошибка при изменении курса'
            })
        }
    }


    async copy(req: express.Request, res: express.Response) {
        let {id} = req.params

        try {
            let course = await Course.findOne({
                where: { id},
                raw: true,
            });

            delete course.id;

            if (!course) {
                return res.status(404).json({
                    message: 'Курс не найден'
                })
            }

            const lessons = await Lesson.findAll({
                where: {courseId: id},
                raw: true,
                include: {
                    model: Course
                },
            })
            const tasks = [];
            const contents = [];

            const lessonIds = lessons.map(el => el.id)

            for (let i = 0; i < lessonIds.length; i++) {
                const task = await Task.findAll({
                    where: {lessonId: lessonIds[i]},
                    raw: true,
                })
                const content = await Content.findAll({
                    where: {lessonId: lessonIds[i]},
                    raw: true,
                })
                tasks.push(...task)
                contents.push(...content)
            }
            const taskIds = tasks?.map(el => el.id)


            for (let i = 0; i < taskIds.length; i++) {
                const content = await Content.findAll({
                    where: {taskId: taskIds[i]},
                    raw: true,
                })
                contents.push(...content)
            }

            const copyCourse = await Course.create({...course});

            for (let i = 0; i < lessons?.length; i++) {

                const needCopyTasks = tasks.filter(el => el.lessonId == lessons[i].id);
                const needCopyContentsLesson = contents.filter(el => el.lessonId == lessons[i].id);

                const created = {
                    name: lessons[i].name,
                    public: lessons[i].public,
                    index: lessons[i].index,
                    start: lessons[i].start,
                    courseId: copyCourse.id,
                }
                const copyLesson = await Lesson.create(created)


                for (let icc2 = 0; icc2 < needCopyContentsLesson?.length; icc2++) {
                    const created = {
                        content: needCopyContentsLesson[icc2].content,
                        lessonId: copyLesson.id
                    }
                    await Content.create(created)
                }

                for (let icc = 0; icc < needCopyTasks?.length; icc++) {

                    const needCopyContentsTask = contents.filter(el => el.taskId == needCopyTasks[i].id);

                    const created = {
                        name: needCopyTasks[icc].name,
                        answer: needCopyTasks[icc].answer,
                        prompt: needCopyTasks[icc].prompt,
                        taskSolutionText: needCopyTasks[icc].taskSolutionText,
                        taskSolutionFile: needCopyTasks[icc].taskSolutionFile,
                        public: needCopyTasks[icc].public,
                        answerFile: needCopyTasks[icc].answerFile,
                        index: needCopyTasks[icc].index,
                        lessonId: copyLesson.id,
                    }
                    const copyTask = await Task.create(created)

                    for (let icc3 = 0; icc3 < needCopyContentsTask?.length; icc3++) {
                        const created = {
                            content: needCopyContentsTask[icc3].content,
                            taskId: copyTask.id
                        }
                        await Content.create(created)
                    }
                }

            }



            res.status(201).json({
                message: 'Курс скопирован'
            });
        } catch (e) {
            console.log(e)
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
        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: 'Ошибка при добавлении курса'
            })
        }
    }


}

export default new CourseController();
