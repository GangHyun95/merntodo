
import jwt from 'jsonwebtoken';
import { createError } from './error.js';
import User from '../models/userModel.js';

export const verifyToken = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            return next(createError(401, '인증되지 않은 사용자입니다.'));
        }
    } else {
        return next(createError(401, '유효하지 않은 토큰입니다.'));
    }
};