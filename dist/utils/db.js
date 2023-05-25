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
exports.upsertStatics = exports.upsertAchievements = void 0;
// @ts-nocheck
const models_1 = require("../models");
const upsertAchievements = (values, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const obj = yield models_1.Achievements
        .findOne({
        where: { userId }
    });
    if (obj) {
        return obj.update(values);
    }
    return models_1.Achievements.create(values);
});
exports.upsertAchievements = upsertAchievements;
const upsertStatics = (values, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const obj = yield models_1.Statics
        .findOne({
        where: { userId }
    });
    if (obj) {
        return obj.update(values);
    }
    return models_1.Statics.create(values);
});
exports.upsertStatics = upsertStatics;
//# sourceMappingURL=db.js.map