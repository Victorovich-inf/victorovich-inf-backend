"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const express_validator_1 = require("express-validator");
const file_1 = require("../utils/file");
class CourseController {
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.params;
                const course = models_1.Course.findOne({ where: { id } });
                if (course.logo)
                    yield (0, file_1.removeFile)(course.logo);
                yield models_1.Course.destroy({ where: { id } });
                res.status(201).json({
                    message: 'Курс удален'
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.params;
                const course = yield models_1.Course.findOne({
                    where: { id },
                    include: [{
                            model: models_1.Lesson,
                            include: [
                                {
                                    model: models_1.Task,
                                    include: [
                                        {
                                            model: models_1.Content
                                        },
                                        {
                                            model: models_1.Lesson
                                        }
                                    ]
                                },
                                {
                                    model: models_1.Content
                                }
                            ]
                        }, {
                            model: models_1.CuratorCourse,
                            include: {
                                model: models_1.User
                            }
                        }]
                });
                res.status(200).json(course);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    getScheduleOfLessons(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = req.user.id;
                const coursesUser = yield models_1.CourseUser.findAll({
                    where: { userId },
                });
                const courseIds = coursesUser.map(el => el.courseId);
                if (courseIds === null || courseIds === void 0 ? void 0 : courseIds.length) {
                    const lessons = [];
                    for (let i = 0; i < courseIds.length; i++) {
                        const course = yield models_1.Lesson.findAll({
                            where: { courseId: courseIds[i] },
                            include: {
                                model: models_1.Course
                            },
                        });
                        lessons.push(...course);
                    }
                    return res.status(200).json(lessons);
                }
                else {
                    return res.status(200).json([]);
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { filter, paging } = req.body;
            let { skip, take } = paging;
            let offset = skip;
            let courses;
            courses = yield models_1.Course.findAndCountAll({
                limit: take,
                distinct: true,
                where: Object.assign({}, filter),
                include: [
                    {
                        model: models_1.CourseUser,
                    }
                ],
                offset
            });
            return res.json(courses);
        });
    }
    savePage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { data } = req.body;
                const content = data;
                Object.keys(content).map((el) => __awaiter(this, void 0, void 0, function* () {
                    let key = el.split('_')[0];
                    let type = el.split('_')[1];
                    if (type === 'lesson') {
                        if (content[el].elements) {
                            const elements = content[el].elements;
                            yield models_1.Content.update({ content: (elements === null || elements === void 0 ? void 0 : elements.length) ? elements : [] }, { where: { lessonId: key } });
                        }
                    }
                    else if (type === 'task') {
                        if (content[el].elements) {
                            const elements = content[el].elements;
                            yield models_1.Content.update({ content: (elements === null || elements === void 0 ? void 0 : elements.length) ? elements : [] }, { where: { taskId: key } });
                        }
                    }
                }));
                res.status(200).json({
                    message: 'Курс сохранен'
                });
            }
            catch (_a) {
                res.status(500).json({
                    message: 'Ошибка при сохранении курса'
                });
            }
        });
    }
    edit(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            let { id } = req.params;
            if (!errors.isEmpty()) {
                res.status(400).json(errors.array());
                return;
            }
            try {
                yield models_1.Course.update(req.body, { where: { id } });
                res.status(201).json({
                    message: 'Курс изменён',
                });
            }
            catch (_a) {
                res.status(500).json({
                    message: 'Ошибка при изменении курса'
                });
            }
        });
    }
    copy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id } = req.params;
            try {
                let course = yield models_1.Course.findOne({
                    where: { id },
                    raw: true,
                });
                delete course.id;
                if (!course) {
                    return res.status(404).json({
                        message: 'Курс не найден'
                    });
                }
                const lessons = yield models_1.Lesson.findAll({
                    where: { courseId: id },
                    raw: true,
                    include: {
                        model: models_1.Course
                    },
                });
                const tasks = [];
                const contents = [];
                const lessonIds = lessons.map(el => el.id);
                for (let i = 0; i < lessonIds.length; i++) {
                    const task = yield models_1.Task.findAll({
                        where: { lessonId: lessonIds[i] },
                        raw: true,
                    });
                    const content = yield models_1.Content.findAll({
                        where: { lessonId: lessonIds[i] },
                        raw: true,
                    });
                    tasks.push(...task);
                    contents.push(...content);
                }
                const taskIds = tasks === null || tasks === void 0 ? void 0 : tasks.map(el => el.id);
                for (let i = 0; i < taskIds.length; i++) {
                    const content = yield models_1.Content.findAll({
                        where: { taskId: taskIds[i] },
                        raw: true,
                    });
                    contents.push(...content);
                }
                const copyCourse = yield models_1.Course.create(Object.assign({}, course));
                for (let i = 0; i < (lessons === null || lessons === void 0 ? void 0 : lessons.length); i++) {
                    const needCopyTasks = tasks.filter(el => el.lessonId == lessons[i].id);
                    const needCopyContentsLesson = contents.filter(el => el.lessonId == lessons[i].id);
                    const created = {
                        name: lessons[i].name,
                        public: lessons[i].public,
                        index: lessons[i].index,
                        start: lessons[i].start,
                        courseId: copyCourse.id,
                    };
                    const copyLesson = yield models_1.Lesson.create(created);
                    for (let icc2 = 0; icc2 < (needCopyContentsLesson === null || needCopyContentsLesson === void 0 ? void 0 : needCopyContentsLesson.length); icc2++) {
                        const created = {
                            content: needCopyContentsLesson[icc2].content,
                            lessonId: copyLesson.id
                        };
                        yield models_1.Content.create(created);
                    }
                    for (let icc = 0; icc < (needCopyTasks === null || needCopyTasks === void 0 ? void 0 : needCopyTasks.length); icc++) {
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
                        };
                        const copyTask = yield models_1.Task.create(created);
                        for (let icc3 = 0; icc3 < (needCopyContentsTask === null || needCopyContentsTask === void 0 ? void 0 : needCopyContentsTask.length); icc3++) {
                            const created = {
                                content: needCopyContentsTask[icc3].content,
                                taskId: copyTask.id
                            };
                            yield models_1.Content.create(created);
                        }
                    }
                }
                res.status(201).json({
                    message: 'Курс скопирован'
                });
            }
            catch (e) {
                console.log(e);
                res.status(500).json({
                    message: 'Ошибка при изменении курса'
                });
            }
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            const filePath = req.file.path;
            if (!errors.isEmpty()) {
                res.status(400).json(errors.array());
                return;
            }
            try {
                const course = yield models_1.Course.create({
                    name: req.body.name,
                    description: req.body.description,
                    dateStart: req.body.dateStart,
                    cost: req.body.cost,
                    logo: filePath,
                    free: req.body.free,
                });
                const courseId = course.id;
                const lesson = yield models_1.Lesson.create({
                    name: 'Урок 1',
                    courseId
                });
                const lessonId = lesson.id;
                yield models_1.Content.create({
                    lessonId
                });
                const task = yield models_1.Task.create({
                    name: 'Задание 1',
                    lessonId
                });
                const taskId = task.id;
                yield models_1.Content.create({
                    taskId
                });
                res.status(201).json({
                    message: 'Курс добавлен',
                    data: course
                });
            }
            catch (e) {
                console.log(e);
                res.status(500).json({
                    message: 'Ошибка при добавлении курса'
                });
            }
        });
    }
}
exports.default = new CourseController();
//# sourceMappingURL=CourseController.js.map