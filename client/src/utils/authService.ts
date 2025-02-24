import useAuthStore from '../store/authStore';

export async function refreshAccessToken() {
    try {
        const res = await fetch('http://localhost:3000/api/user/refresh-token', {
            method: 'GET',
            credentials: 'include',
        });

        if (!res.ok) {
            console.log("Refresh Token 만료됨, 다시 로그인 필요");
            useAuthStore.getState().setAccessToken(null);
            return null;
        }

        const data = await res.json();
        console.log(data.access_token);
        useAuthStore.getState().setAccessToken(data.access_token);
        return data.access_token;
    } catch (error) {
        console.error("토큰 갱신 중 오류 발생:", error);
        return null;
    }
}
