import useAuthStore from '../store/authStore';

export async function refreshAccessToken() {
    try {
        const res = await fetch(
            'http://localhost:3000/api/user/refresh-token',
            {
                method: 'GET',
                credentials: 'include',
            }
        );

        if (!res.ok) {
            useAuthStore.getState().setAccessToken(null);
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
