import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { API_BASE_URL } from '@/config';
import useAuthStore from '@/store/authStore';
import { isMobileDevice } from '@/utils/isMobileDevice';
import { CircleUserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            const data = await response.json();
            toast.success(data.message);
            if (isMobileDevice()) {
                sessionStorage.removeItem('refresh_token');
            }
            logout();
            setTimeout(() => {
                navigate('/', { replace: true });
            }, 0);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <CircleUserRound className='profile' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={handleLogout}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
