import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken } from '../lib/utils.js';

export const register = async (req, res) => {
    const { email, password, passwordCheck } = req.body;

    try {
        if (!email || !password || !passwordCheck) {
            return res
                .status(400)
                .json({ message: '모든 필수 항목을 입력해 주세요.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: '이메일 형식이 올바르지 않습니다.',
            });
        }

        if (password.length < 6) {
            return res
                .status(400)
                .json({ message: '비밀번호는 최소 6자 이상이어야 합니다.' });
        }

        if (password !== passwordCheck) {
            return res.status(400).json({
                message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.',
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: '이미 존재하는 이메일입니다.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hashedPassword,
        });
        await newUser.save();

        res.status(201).json({
            message: '회원가입이 완료되었습니다.',
        });
    } catch (error) {
        console.error('회원가입 오류:', error);
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: '이메일 또는 비밀번호가 올바르지 않습니다.',
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: '이메일 또는 비밀번호가 올바르지 않습니다.',
            });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie('refresh-token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            accessToken,
            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('로그인 오류:', error);
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const logout = async (req, res) => {
    res.clearCookie('refresh-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    res.status(200).json({
        message: '로그아웃되었습니다.',
    });
};

export const googleLogin = async (req, res) => {};

export const refreshAccessToken = async (req, res) => {};
