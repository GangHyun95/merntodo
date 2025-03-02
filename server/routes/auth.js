import express from 'express';
import { register, login, logout, refreshAccessToken, googleLogin } from '../controllers/auth.js';
const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.post('/logout', logout);

router.post('/google', googleLogin);

router.post('/refresh-token', refreshAccessToken);
export default router;
