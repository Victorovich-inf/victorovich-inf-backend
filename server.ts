import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import {passport} from './core/passport';
import {User} from './models';
import authRoutes from './routes/auth-routes'
import userRoutes from './routes/user-routes'

const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.listen(5001, async (): Promise<void> => {
    console.log(User)
});

