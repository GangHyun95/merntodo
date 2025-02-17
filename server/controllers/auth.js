import { createError } from '../utils/error.js';
import { connectToDB } from '../utils/connect.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

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

export async function login(req, res, next) {}

export async function logout(req, res, next) {}
