import Router from 'express'
import {passport} from "../core/passport";
import {adminMiddleware} from "../middleware/authMiddleware";
import {uploader} from '../core/uploader';
import CourseController from "../controllers/CourseController";
import express from "express";
import {editLessonValidations} from "../validations/lesson/edit";

const router = new Router()

router.post('/admin/', [passport.authenticate('jwt', {session: false}), adminMiddleware, uploader.single('file')],
    CourseController.create);
router.post('/admin/query', [passport.authenticate('jwt', {session: false}), adminMiddleware],
    CourseController.getAll);
router.get('/admin/:id', [passport.authenticate('jwt', {session: false}), adminMiddleware], CourseController.getOne);
router.put('/admin/:id/save', [passport.authenticate('jwt', {session: false}), adminMiddleware], CourseController.savePage);
router.put('/admin/:id', [passport.authenticate('jwt', {session: false}), adminMiddleware, editLessonValidations], CourseController.edit);
router.delete('/admin/:id', [passport.authenticate('jwt', {session: false}), adminMiddleware], CourseController.delete);

router.post('/admin/upload', [passport.authenticate('jwt', {session: false}), uploader.single('file')], (req: express.Request, res: express.Response) => {
    const filePath = req.file.path;
    res.status(201).json({
        message: 'Файл загружен',
        filePath
    });
})

router.post('/query', [passport.authenticate('jwt', {session: false})],
    CourseController.getAll);

router.post('/admin/copy/:id', [passport.authenticate('jwt', {session: false}), adminMiddleware],
    CourseController.copy);

router.get('/schedules', [passport.authenticate('jwt', {session: false})],
    CourseController.getScheduleOfLessons);


export default router;
