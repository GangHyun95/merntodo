import { useEffect } from 'react';
import useAuthStore from '@/store/authStore';

export default function AuthInitializer() {
    const refreshToken = useAuthStore((state) => state.refreshToken);

    useEffect(() => {
        refreshToken();
    }, []);

    return null;
}
