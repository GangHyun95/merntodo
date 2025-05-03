import { useAuthStore } from '@/store/useAuthStore';

export default function HomePage() {
    const { logout } = useAuthStore();
    return <div onClick={logout}>로그아웃</div>;
}
