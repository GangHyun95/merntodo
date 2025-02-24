import { createError } from '../utils/error.js';
import { connectToDB } from '../utils/connect.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function register(req, res, next) {
    try {
        const { email, password, passwordCheck } = req.body;
        if (!email) return next(createError(400, '이메일을 입력해주세요.'));

        if (!password) return next(createError(400, '비밀번호를 입력해주세요.'));

        if (!passwordCheck)
            return next(createError(400, '비밀번호 확인을 입력해주세요.'));

        if (password !== passwordCheck)
            return next(
                createError(
                    400,
                    '비밀번호와 비밀번호 확인이 일치하지 않습니다.'
                )
            );

        await connectToDB();

        const alreadyRegistered = await User.exists({ email });
        if (alreadyRegistered)
            return next(createError(400, '이미 가입된 이메일입니다.'));
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const newUser = new User({ ...req.body, password: hash });
        await newUser.save();

        const accessToken = generateAccessToken(newUser.id);
        res.status(201).json({
            _id: newUser.id,
            email: newUser.email,
            access_token: accessToken,
        });
    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email) return next(createError(400, '이메일을 입력해주세요.'));

        if (!password) return next(createError(400, '비밀번호를 입력해주세요.'));

        await connectToDB();
        const user = await User.findOne({ email });
        if (!user)
            return next(
                createError(400, '이메일 또는 비밀번호가 올바르지 않습니다.')
            );

        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!isPasswordCorrect)
            return next(
                createError(400, '이메일 또는 비밀번호가 올바르지 않습니다.')
            );

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({
            _id: user.id,
            email: user.email,
            access_token: accessToken,
        });
    } catch (error) {
        next(error);
    }
}

export async function refreshAccessToken(req, res, next) {
    try {
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {
            return next(createError(401, 'Refresh Token이 없습니다. 다시 로그인해주세요.'));
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                console.error("Refresh Token 검증 실패:", err.message);
                return next(createError(403, '유효하지 않은 Refresh Token입니다. 다시 로그인해주세요.'));
            }

            const user = await User.findById(decoded.id);
            if (!user) {
                console.error("사용자 찾기 실패");
                return next(createError(404, '해당 사용자를 찾을 수 없습니다. 다시 로그인해주세요.'));
            }

            const newAccessToken = generateAccessToken(user.id);
            console.log("새 Access Token 발급:", newAccessToken);

            res.json({ access_token: newAccessToken });
        });
    } catch (error) {
        console.error("refreshAccessToken 처리 중 오류 발생:", error);
        next(error);
    }
}

export async function logout(req, res, next) {
    res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    })
        .status(200)
        .json({ message: '로그아웃 완료' });
}

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d',
    });
};
