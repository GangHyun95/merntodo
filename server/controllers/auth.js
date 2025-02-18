import { createError } from '../utils/error.js';
import { connectToDB } from '../utils/connect.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function register(req, res, next) {
    const data = req.body;
    console.log(data);
    if (!data?.email) {
        return next(createError(400, '이메일을 입력해주세요.'));
    }
    if (!data?.password) {
        return next(createError(400, '비밀번호를 입력해주세요.'));
    }

    await connectToDB();
    const alreadyRegistered = await User.exists({ email: data.email });
    if (alreadyRegistered)
        return next(createError(400, '이미 가입된 이메일입니다.'));
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });
    await newUser.save();
    res.status(201).json('회원가입이 완료되었습니다.');
}

export async function login(req, res, next) {
    const data = req.body;
    console.log(data);
    if (!data?.email) {
        return next(createError(400, '이메일을 입력해주세요.'));
    }
    if (!data?.password) {
        return next(createError(400, '비밀번호를 입력해주세요.'));
    }
    await connectToDB();
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(400, '이메일 또는 비밀번호가 올바르지 않습니다.'));
    const isPasswordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
    );
    if (!isPasswordCorrect)
        return next(createError(400, '이메일 또는 비밀번호가 올바르지 않습니다.'));
    const token = jwt.sign({ id: user._id }, process.env.JWT);
    console.log(token);
    res.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    })
        .status(200)
        .json('로그인 완료');
}

export async function logout(req, res, next) {
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    })
        .status(200)
        .json({ message: '로그아웃 완료' });
}
