import express from 'express';
import AuthRoute from './routes/auth.js';
import TodoRoute from './routes/todo.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
dotenv.config();

const allowedOrigins = ['http://localhost:5173', 'https://merntodo-client.onrender.com'];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.set('port', process.env.PORT || 3000);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use('/api/user', AuthRoute);
app.use('/api/todos', TodoRoute);

// 전역 에러 핸들러
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || '서버 오류';
    res.status(statusCode).json({ error: message });
});

app.listen(app.get('port'), () => {
    console.log(`서버가 ${app.get('port')}번 포트에서 실행 중입니다.`);
});
