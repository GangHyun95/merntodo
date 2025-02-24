import { create } from 'zustand';
import { refreshAccessToken } from '@/utils/authService';

type AuthState = {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    logout: () => void;
    refreshToken: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    setAccessToken: (token) => set({ accessToken: token }),

    logout: () => {
        set({ accessToken: null });
    },

    refreshToken: async () => {
        const newToken = await refreshAccessToken();
        if (newToken) {
            set({ accessToken: newToken });
        } else {
            set({ accessToken: null });
        }
    },
}));

export default useAuthStore;
