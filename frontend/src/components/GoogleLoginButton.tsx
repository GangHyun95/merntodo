import { useAuthStore } from '@/store/useAuthStore';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

export default function GoogleLoginButton() {
    const googleLogin = useAuthStore((state) => state.googleLogin);
    const isLoggingIn = useAuthStore((state) => state.isLoggingIn);

    const googleLoginHandler = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (response) => {
            const code = response.code;
            await googleLogin(code);
        },
        onError: () => {
            toast.error('Google 로그인 실패');
        },
    });

    return (
        <Button
            type='button'
            className='flex items-center w-full gap-4 px-12 mb-4 bg-transparent rounded-full cursor-pointer'
            disabled={isLoggingIn}
            variant='outline'
            onClick={() => googleLoginHandler()}
        >
            <img src='/google.png' alt='google' className='w-5' />
            {isLoggingIn ? (
                <>
                    <Loader2 className='size-5 animate-spin' />
                    Loading...
                </>
            ) : (
                'Google 계정으로 로그인'
            )}
        </Button>
    );
}
