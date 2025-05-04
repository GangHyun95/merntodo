import { axiosInstance } from '@/lib/axios';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';

type AuthState = {
    accessToken: string | null;
    refreshToken: string | null;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isCheckingAuth: boolean;
    googleClientId: string;
    checkAuth: () => Promise<void>;
    signup: (data: UserType) => Promise<boolean>;
    login: (data: UserType) => Promise<void>;
    logout: () => Promise<void>;
    googleLogin: (code: string) => Promise<void>;
    getGoogleClientId: () => Promise<void>;
};

type UserType = {
    email: string;
    password: string;
    passwordCheck?: string;
};

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    refreshToken: null,
    isSigningUp: false,
    isLoggingIn: false,
    googleClientId: '',
    isCheckingAuth: true,
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/refresh-token');
            set({ accessToken: res.data.accessToken });
        } catch (error) {
            console.log('Error in checkAuth: ', error);
            set({ accessToken: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/register', data);
            if (res.status === 201) {
                toast.success('회원가입이 완료되었습니다.');
                return true;
            }
            return false;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const errorMessage =
                err.response?.data?.message || 'Unknown error occurred';
            toast.error(errorMessage);
            return false;
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/login', data);
            set({ accessToken: res.data.accessToken });
            toast.success('로그인 성공');
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const errorMessage =
                err.response?.data?.message || 'Unknown error occurred';
            toast.error(errorMessage);
        } finally {
            set({ isLoggingIn: false });
        }
    },
    googleLogin: async (code: string) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/google-login', {
                code,
            });
            const { accessToken, refreshToken } = res.data;
            if (accessToken) {
                set({ accessToken, refreshToken });
                toast.success('구글 로그인 성공');
            } else {
                toast.error('구글 로그인 실패');
            }
        } catch (error) {
            console.error('Google 로그인 에러:', error);
            toast.error('Google 로그인 중 문제가 발생했습니다.');
        } finally {
            set({ isLoggingIn: false });
        }
    },

    getGoogleClientId: async () => {
        try {
            const res = await axiosInstance.get('/auth/google-client-id');
            set({ googleClientId: res.data.googleClientId });
        } catch (error) {
            console.log('Error: ', error);
            set({ googleClientId: '' });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ accessToken: null });
            toast.success('로그아웃 성공');
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const errorMessage =
                err.response?.data?.message || 'Unknown error occurred';
            toast.error(errorMessage);
        }
    },
}));
