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
class TaskController {
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.params;
                yield models_1.Task.destroy({ where: { id } });
                res.status(201).json({
                    message: 'Задача удалена'
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json(errors.array());
                return;
            }
            const lesson = models_1.Lesson.findOne({ where: { id: req.body.lessonId } });
            if (!lesson) {
                res.status(404).json({
                    message: 'Урок не найден'
                });
            }
            try {
                const data = yield models_1.Task.create({
                    name: req.body.name,
                    lessonId: req.body.lessonId
                });
                const taskId = data.id;
                yield models_1.Content.create({
                    taskId
                });
                res.status(201).json({
                    message: 'Задача добавлена',
                });
            }
            catch (_a) {
                res.status(500).json({
                    message: 'Ошибка при добавлении задачи'
                });
            }
        });
    }
    edit(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            const filePath = (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path;
            let { id } = req.params;
            if (!errors.isEmpty()) {
                res.status(400).json(errors.array());
                return;
            }
            try {
                if (filePath) {
                    yield models_1.Task.update(Object.assign(Object.assign({}, req.body), { taskSolutionFile: filePath }), { where: { id } });
                }
                else {
                    yield models_1.Task.update(req.body, { where: { id } });
                }
                res.status(201).json({
                    message: 'Задача изменена',
                });
            }
            catch (_b) {
                res.status(500).json({
                    message: 'Ошибка при изменении задачи'
                });
            }
        });
    }
}
exports.default = new TaskController();
//# sourceMappingURL=TaskController.js.map