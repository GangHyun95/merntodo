import jwt from 'jsonwebtoken';
import { createError } from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies?.access_token;
    console.log(token);
    if (!token) {
        return next(createError(401, '인증되지 않은 사용자입니다.'));
    }
    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return next(createError(403, '유효하지 않은 토큰입니다.'));
        req.user = user;
        next();
    });
};
