"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const passport_1 = require("../core/passport");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploader_1 = require("../core/uploader");
const CourseController_1 = __importDefault(require("../controllers/CourseController"));
const edit_1 = require("../validations/lesson/edit");
const router = new express_1.default();
router.post('/admin/', [passport_1.passport.authenticate('jwt', { session: false }), authMiddleware_1.adminMiddleware, uploader_1.uploader.single('file')], CourseController_1.default.create);
router.post('/admin/query', [passport_1.passport.authenticate('jwt', { session: false }), authMiddleware_1.adminMiddleware], CourseController_1.default.getAll);
router.get('/admin/:id', [passport_1.passport.authenticate('jwt', { session: false }), authMiddleware_1.adminMiddleware], CourseController_1.default.getOne);
router.put('/admin/:id/save', [passport_1.passport.authenticate('jwt', { session: false }), authMiddleware_1.adminMiddleware], CourseController_1.default.savePage);
router.put('/admin/:id', [passport_1.passport.authenticate('jwt', { session: false }), authMiddleware_1.adminMiddleware, edit_1.editLessonValidations], CourseController_1.default.edit);
router.delete('/admin/:id', [passport_1.passport.authenticate('jwt', { session: false }), authMiddleware_1.adminMiddleware], CourseController_1.default.delete);
router.post('/admin/upload', [passport_1.passport.authenticate('jwt', { session: false }), uploader_1.uploader.single('file')], (req, res) => {
    const filePath = req.file.path;
    res.status(201).json({
        message: 'Файл загружен',
        filePath
    });
});
router.post('/query', CourseController_1.default.getAll);
router.post('/admin/copy/:id', [passport_1.passport.authenticate('jwt', { session: false }), authMiddleware_1.adminMiddleware], CourseController_1.default.copy);
router.get('/schedules', [passport_1.passport.authenticate('jwt', { session: false })], CourseController_1.default.getScheduleOfLessons);
exports.default = router;
//# sourceMappingURL=course-routes.js.map