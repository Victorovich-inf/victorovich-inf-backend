"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const passport_1 = require("../core/passport");
const CuratorController_1 = __importDefault(require("../controllers/CuratorController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const addToCourse_1 = require("../validations/curator/addToCourse");
const getCurators_1 = require("../validations/curator/getCurators");
const router = new express_1.default();
router.post('/:id', [passport_1.passport.authenticate('jwt', { session: false }), authMiddleware_1.adminMiddleware, addToCourse_1.createAddToCourseValidations], CuratorController_1.default.addToCourse);
router.post('/all/query', [passport_1.passport.authenticate('jwt', { session: false }), authMiddleware_1.adminMiddleware, getCurators_1.getCuratorsValidations], CuratorController_1.default.getCurators);
router.delete('/:id', [passport_1.passport.authenticate('jwt', { session: false }), authMiddleware_1.adminMiddleware], CuratorController_1.default.deleteFromCourse);
exports.default = router;
//# sourceMappingURL=curator-routes.js.map