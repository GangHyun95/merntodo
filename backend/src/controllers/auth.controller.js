import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken } from '../lib/utils.js';
import jwt from 'jsonwebtoken';

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

export const googleLogin = async (req, res) => {
    const { code } = req.body;

    try {
        if (!code) {
            return res.status(400).json({
                message: 'Google 로그인 코드가 필요합니다.',
            });
        }

        const tokenResponse = await fetch(
            'https://oauth2.googleapis.com/token',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    code,
                    grant_type: 'authorization_code',
                    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                }).toString(),
            }
        );

        const tokenData = await tokenResponse.json();

        const { access_token } = tokenData;

        if (!access_token) {
            return res.status(400).json({
                message: 'Google Access Token을 가져오지 못했습니다.',
            });
        }

        const userInfoResponse = await fetch(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        const userInfo = await userInfoResponse.json();

        const { id: googleId, email, name, picture } = userInfo;

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                googleId,
                name,
                avatar: picture,
            });
            await user.save();
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
                name: user.name,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error('Google 로그인 오류:', error);
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const getGoogleClientId = async (req, res) => {
    try {
        res.json({
            googleClientId: process.env.GOOGLE_CLIENT_ID,
        });
    } catch (error) {
        console.error('Google Client ID 가져오기 오류:', error);
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies['refresh-token'];
    try {
        if (!refreshToken) {
            return res.status(401).json({
                message: 'Refresh Token이 없습니다. 다시 로그인해주세요.',
            });
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) {
                    return res.status(403).json({
                        message: 'Refresh Token이 유효하지 않습니다.',
                    });
                }

                const user = await User.findById(decoded.id);
                if (!user) {
                    return res.status(404).json({
                        message: '사용자를 찾을 수 없습니다.',
                    });
                }

                const newAccessToken = generateAccessToken(user._id);

                res.json({
                    accessToken: newAccessToken,
                });
            }
        );
    } catch (error) {
        console.error('Access Token 갱신 오류:', error);
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        });
    }
};
