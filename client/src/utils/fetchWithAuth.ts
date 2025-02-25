import useAuthStore from '../store/authStore';
import { refreshAccessToken } from './authService';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    let token = useAuthStore.getState().accessToken;

    const res = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });

    if (res.status === 401) {
        token = await refreshAccessToken();
        if (!token) return null;

        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            },
        });
    }

    return res.json();
}
