import { API_BASE_URL } from '@/config';
import useAuthStore from '../store/authStore';
import { isMobileDevice } from './isMobileDevice';

export async function refreshAccessToken() {
    try {
        let headers: Record<string, string> = { "Content-Type": "application/json" };
        let options: RequestInit = { method: "POST", headers };

        if (isMobileDevice()) {
            const refreshToken = sessionStorage.getItem("refresh_token");
            if (!refreshToken) {
                useAuthStore.getState().setAccessToken(null);
                return null;
            }
            headers["Authorization"] = `Bearer ${refreshToken}`;
        } else {
            options.credentials = "include";
            options.body = JSON.stringify({});
        }

        const res = await fetch(`${API_BASE_URL}/api/user/refresh-token`, options);

        
        if (!res.ok) {
            useAuthStore.getState().setAccessToken(null);
            if (isMobileDevice()) sessionStorage.removeItem("refresh_token");
            return null;
        }

        const data = await res.json();
        useAuthStore.getState().setAccessToken(data.access_token);
        return data.access_token;
    } catch (error) {
        console.error('토큰 갱신 중 오류 발생:', error);
        return null;
    }
}
