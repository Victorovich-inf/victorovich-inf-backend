import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import {passport} from './core/passport';
import {User} from './models';
import authRoutes from './routes/auth-routes'
import userRoutes from './routes/user-routes'
import courseRoutes from './routes/course-routes'
import lessonRoutes from './routes/lesson-routes'
import taskRoutes from './routes/task-routes'
import buyCourseRoutes from './routes/buy-course-routes'
import curatorRoutes from './routes/curator-routes'

const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use('/static', express.static('static'));

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/course', courseRoutes);
app.use('/lesson', lessonRoutes);
app.use('/task', taskRoutes);
app.use('/buy-course', buyCourseRoutes);
app.use('/curator', curatorRoutes);

app.listen(5001, async (): Promise<void> => {
    console.log(User)
});

