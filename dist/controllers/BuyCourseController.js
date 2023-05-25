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
const achievements_1 = require("../utils/achievements");
const db_1 = require("../utils/db");
class BuyCourseController {
    getOnePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.params;
                const course = yield models_1.Course.findOne({
                    where: { id },
                    include: [
                        {
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
                        },
                        {
                            model: models_1.CourseUser,
                            where: { userId: req.user.id },
                            include: [
                                {
                                    model: models_1.ProgressCourseUser
                                }
                            ]
                        },
                        {
                            model: models_1.CuratorCourse,
                            include: {
                                model: models_1.User
                            }
                        }
                    ]
                });
                res.status(200).json(course);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    buyCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            let { id } = req.params;
            const userId = req.user.id;
            if (!errors.isEmpty()) {
                res.status(400).json(errors.array());
                return;
            }
            try {
                const courseUser = yield models_1.CourseUser.create({ courseId: id, userId, buyed: req.body.buyed });
                yield models_1.ProgressCourseUser.create({ courseUserId: courseUser.id });
                res.status(201).json({
                    message: 'Курс приобретён',
                });
            }
            catch (_a) {
                res.status(500).json({
                    message: 'Ошибка при покупке курса'
                });
            }
        });
    }
    updateProgress(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            let { id } = req.params;
            if (!errors.isEmpty()) {
                res.status(400).json(errors.array());
                return;
            }
            try {
                const courseUser = yield models_1.CourseUser.findOne({
                    where: {
                        userId: req.user.id,
                        courseId: id
                    }
                });
                if (!courseUser) {
                    return res.status(404).json({
                        message: 'Курс не найден'
                    });
                }
                yield models_1.ProgressCourseUser.update({ data: req.body.data }, { where: { id: courseUser.id } });
                if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.answer) {
                    yield (0, achievements_1.checkCorrectlyCompletedTasksAndWinningStreak)(req.user.id);
                }
                yield (0, achievements_1.checkCompletedCourse)(req.body.data, id, req.user.id);
                res.status(201).json({
                    message: 'Прогресс сохранён',
                });
            }
            catch (e) {
                console.log(e);
                res.status(500).json({
                    message: 'Ошибка при покупке курса'
                });
            }
        });
    }
    resetWinningStreak(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, db_1.upsertStatics)({ winningStreak: 0, userId: req.user.id }, req.user.id);
                res.status(201).json({
                    message: 'Прогресс сохранён',
                });
            }
            catch (e) {
                res.status(500).json({
                    message: 'Ошибка'
                });
            }
        });
    }
}
exports.default = new BuyCourseController();
//# sourceMappingURL=BuyCourseController.js.map