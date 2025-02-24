import useAuthStore from '@/store/authStore';
import { refreshAccessToken } from '@/utils/authService';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (!accessToken) {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    setAccessToken(newToken);
                } else {
                    toast.error('로그인이 필요합니다.');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, [accessToken]);

    if (loading) return;

    if (!accessToken) {
        return <Navigate to='/' replace />;
    }

    return <Outlet />;
}
