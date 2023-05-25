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
class CuratorController {
    deleteFromCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.params;
                yield models_1.CuratorCourse.destroy({ where: { id } });
                res.status(201).json({
                    message: 'Куратор удалён из курса'
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    addToCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            let { id: courseId } = req.params;
            if (!errors.isEmpty()) {
                res.status(400).json(errors.array());
                return;
            }
            const course = yield models_1.Course.findOne({ where: { id: courseId } });
            if (!course) {
                return res.status(404).json({
                    message: 'Курс не найден'
                });
            }
            const curatorCourse = yield models_1.CuratorCourse.findOne({ where: { courseId, userId: req.body.userId } });
            if (curatorCourse) {
                return res.status(404).json({
                    message: 'Куратор уже прикреплён к этому курсу'
                });
            }
            try {
                yield models_1.CuratorCourse.create({
                    courseId,
                    userId: req.body.userId
                });
                res.status(201).json({
                    message: 'Куратор добавлен в курс',
                });
            }
            catch (_a) {
                res.status(500).json({
                    message: 'Ошибка при добавлении куратора в курс'
                });
            }
        });
    }
    getCurators(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json(errors.array());
                return;
            }
            let curators = yield models_1.User.findAndCountAll({
                distinct: true,
                where: {
                    role: 2,
                }
            });
            return res.json(curators);
        });
    }
}
exports.default = new CuratorController();
//# sourceMappingURL=CuratorController.js.map