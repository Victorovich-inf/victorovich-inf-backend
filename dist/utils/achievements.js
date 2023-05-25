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
exports.checkCorrectlyCompletedTasksAndWinningStreak = exports.checkCompletedCourse = void 0;
// @ts-nocheck
const models_1 = require("../models");
const db_1 = require("./db");
const dataToContent = (data) => {
    const content = {};
    data.map(el => {
        var _a, _b;
        if ((_a = el.Tasks) === null || _a === void 0 ? void 0 : _a.length) {
            (_b = el.Tasks) === null || _b === void 0 ? void 0 : _b.map(task => {
                content[`${task.id}_task`] = {
                    elements: task.Content.content,
                    public: task.public,
                };
            });
            content[`${el.id}_lesson`] = {
                elements: el.Content.content,
                public: el.public,
            };
        }
    });
    return content;
};
const calculateProgress = (data, all) => {
    let percent = 0;
    let count = 0;
    Object.keys(data).map(el => {
        if (data[el].viewed) {
            count = count + 1;
            data[el].Tasks.map(el => {
                if (el.correctly) {
                    count = count + 1;
                }
            });
        }
    });
    percent = +(count / all * 100).toFixed(0);
    return percent;
};
const checkCompletedCourse = (answerData, courseId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const find = yield models_1.Achievements
        .findOne({
        where: { userId, completedCourse: true }
    });
    if (find) {
        return;
    }
    const lessons = yield models_1.Lesson.findAll({
        where: { courseId }, include: [
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
    });
    const content = dataToContent(lessons);
    let all = Object.keys(content).filter(el => content[el].public).length;
    const percent = calculateProgress(JSON.parse(answerData), all);
    if (percent > 99) {
        yield (0, db_1.upsertAchievements)({ completedCourse: true, userId }, userId);
    }
});
exports.checkCompletedCourse = checkCompletedCourse;
const checkCorrectlyCompletedTasksAndWinningStreak = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const find = yield models_1.Statics
        .findOne({
        where: { userId }
    });
    if (find) {
        let correctlyCompletedTasks = +(find === null || find === void 0 ? void 0 : find.correctlyCompletedTasks) + 1;
        let winningStreak = +(find === null || find === void 0 ? void 0 : find.winningStreak) + 1;
        yield find.update({ correctlyCompletedTasks, winningStreak, userId });
        switch (correctlyCompletedTasks) {
            case 10: {
                yield (0, db_1.upsertAchievements)({ correctTasks10: true, userId }, userId);
                break;
            }
            case 25: {
                yield (0, db_1.upsertAchievements)({ correctTasks25: true, userId }, userId);
                break;
            }
            case 50: {
                yield (0, db_1.upsertAchievements)({ correctTasks50: true, userId }, userId);
                break;
            }
            case 100: {
                yield (0, db_1.upsertAchievements)({ correctTasks100: true, userId }, userId);
                break;
            }
        }
        switch (winningStreak) {
            case 5: {
                yield (0, db_1.upsertAchievements)({ winningStreak5: true, userId }, userId);
                break;
            }
            case 10: {
                yield (0, db_1.upsertAchievements)({ winningStreak10: true, userId }, userId);
                break;
            }
            case 15: {
                yield (0, db_1.upsertAchievements)({ winningStreak15: true, userId }, userId);
                break;
            }
            case 25: {
                yield (0, db_1.upsertAchievements)({ winningStreak25: true, userId }, userId);
                break;
            }
        }
    }
    else {
        yield models_1.Statics.create({ correctlyCompletedTasks: 1, winningStreak: 1, userId });
    }
});
exports.checkCorrectlyCompletedTasksAndWinningStreak = checkCorrectlyCompletedTasksAndWinningStreak;
//# sourceMappingURL=achievements.js.map