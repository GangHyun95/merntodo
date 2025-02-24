import express from 'express';
import { register, login, logout, refreshAccessToken } from '../controllers/auth.js';
const router = express.Router();

router.post('/login', login);

router.post('/register', register);

router.post('/logout', logout);

router.get('/refresh-token', refreshAccessToken);
export default router;
