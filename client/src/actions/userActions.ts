import { API_BASE_URL } from '@/config';
import useAuthStore from '@/store/authStore';
import { isMobileDevice } from '@/utils/isMobileDevice';

type RegisterState = {
    success: string | null;
    error: string | null;
};
export async function register(
    previousState: RegisterState,
    formData: FormData
): Promise<RegisterState> {
    try {
        const email = formData.get('email');
        const password = formData.get('password');
        const passwordCheck = formData.get('passwordCheck');
        const res = await fetch(`${API_BASE_URL}/api/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, passwordCheck }),
        });
        const data = await res.json();
        if (data?.error) {
            return { ...previousState, error: data.error };
        }
        return { error: null, success: data };
    } catch (error) {
        return { ...previousState, error: 'Something is wrong' };
    }
}

export async function login(
    previousState: RegisterState,
    formData: FormData
): Promise<RegisterState> {
    try {
        const email = formData.get('email');
        const password = formData.get('password');
        const res = await fetch(`${API_BASE_URL}/api/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data?.error) {
            return { ...previousState, error: data.error };
        }

        if (data.access_token) {
            useAuthStore.getState().setAccessToken(data.access_token);
            if (isMobileDevice()) {
                sessionStorage.setItem('refresh_token', data.refresh_token);
            }
        }
        return { error: null, success: data };
    } catch (error) {
        return { ...previousState, error: 'Something is wrong' };
    }
}
