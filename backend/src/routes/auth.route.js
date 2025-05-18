import express from 'express';
import {
    getGoogleClientId,
    googleLogin,
    login,
    logout,
    refreshAccessToken,
    register,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/google', googleLogin);

router.post('/refresh', refreshAccessToken);

router.get('/google', getGoogleClientId);

export default router;
