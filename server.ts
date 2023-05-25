// @ts-nocheck
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
import chatRoutes from './routes/chat-routes'
import subscriptionRoutes from './routes/subscription-routes'
import {Server} from 'socket.io'
import { createServer } from 'http'
import onConnection from "./socket_io/onConnection";

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
app.use('/chat', chatRoutes);
app.use('/subscription', subscriptionRoutes);

const server = createServer(app)

const io = new Server(server, {
    cors: process.env.FRONT_URL as string,
    serveClient: false
})

io.on('connection', (socket) => {

    console.log('connect')

    onConnection(io, socket)
})

server.listen(5001, async (): Promise<void> => {
    console.log(User)
});

