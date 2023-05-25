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
class LessonController {
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.params;
                yield models_1.Lesson.destroy({ where: { id } });
                res.status(201).json({
                    message: 'Урок удален'
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
            const lesson = models_1.Course.findOne({ where: { id: req.body.courseId } });
            if (!lesson) {
                res.status(404).json({
                    message: 'Курс не найден'
                });
            }
            try {
                const data = yield models_1.Lesson.create({
                    name: req.body.name,
                    courseId: req.body.courseId
                });
                const lessonId = data.id;
                yield models_1.Content.create({
                    lessonId
                });
                res.status(201).json({
                    message: 'Урок добавлен',
                });
            }
            catch (_a) {
                res.status(500).json({
                    message: 'Ошибка при добавлении курса'
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
                yield models_1.Lesson.update(req.body, { where: { id } });
                res.status(201).json({
                    message: 'Урок изменён',
                });
            }
            catch (_a) {
                res.status(500).json({
                    message: 'Ошибка при изменении урока'
                });
            }
        });
    }
}
exports.default = new LessonController();
//# sourceMappingURL=LessonController.js.map