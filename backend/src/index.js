import express from 'express';

import authRoutes from './routes/auth.route.js';
import todoRoutes from './routes/todo.route.js';

import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { connectToDB } from './lib/db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectToDB();
});
