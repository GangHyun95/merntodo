import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    let token;

    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            if (!decoded) {
                return res.status(401).json({
                    message: 'token not valid',
                });
            }

            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({
                    message: 'user not found',
                });
            }

            req.user = user;

            next();
        } else {
            return res.status(401).json({
                message: 'no token',
            });
        }
    } catch (error) {
        return res.status(401).json({
            message: 'token failed',
        });
    }
};
