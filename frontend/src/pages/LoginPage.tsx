import GoogleLoginButton from '@/components/GoogleLoginButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Loader, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { login, isLoggingIn, googleClientId, getGoogleClientId } =
        useAuthStore(
            useShallow((state) => ({
                login: state.login,
                isLoggingIn: state.isLoggingIn,
                googleClientId: state.googleClientId,
                getGoogleClientId: state.getGoogleClientId,
            }))
        );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login(formData);
    };

    useEffect(() => {
        getGoogleClientId();
    }, [getGoogleClientId]);

    if (!googleClientId)
        return (
            <div className='flex items-center justify-center h-screen'>
                <Loader className='size-10 animate-spin' />
            </div>
        );

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <div className='h-screen p-10 bg-muted'>
                <div className='grid w-full h-full grid-cols-1 md:grid-cols-2 bg-background'>
                    <div className='flex items-center justify-center flex-col w-full'>
                        <div className='my-4'>
                            <div className='flex items-center gap-3 mb-6 justify-center'>
                                <img
                                    src='/favicon.png'
                                    alt='logo'
                                    className='w-14'
                                />
                                <h2 className='text-4xl font-bold'>로그인</h2>
                            </div>
                            <p className='mt-2 text-sm text-slate-700'>
                                오늘 할 일을 정리하고, 더 나은 하루를 시작하세요
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className='w-full max-w-sm mt-4 px-4 sm:px-0'
                        >
                            <Label htmlFor='email'>이메일</Label>
                            <Input
                                className='mt-2 mb-4 bg-transparent rounded-full'
                                type='email'
                                id='email'
                                placeholder='이메일을 입력하세요.'
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                            />
                            <Label htmlFor='password'>비밀번호</Label>
                            <Input
                                className='mt-2 bg-transparent rounded-full'
                                type='password'
                                id='password'
                                placeholder='비밀번호를 입력하세요.'
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                            />

                            <Button
                                type='submit'
                                className='w-full mt-6 bg-primary/90 rounded-full hover:bg-primary cursor-pointer'
                                disabled={isLoggingIn}
                            >
                                {isLoggingIn ? (
                                    <>
                                        <Loader2 className='size-5 animate-spin' />
                                        Loading...
                                    </>
                                ) : (
                                    '로그인'
                                )}
                            </Button>

                            <div className='flex items-center gap-4 my-6'>
                                <div className='flex-1 h-px bg-border' />
                                <span className='text-sm text-muted-foreground'>
                                    or
                                </span>
                                <div className='flex-1 h-px bg-border' />
                            </div>
                            <GoogleLoginButton />
                        </form>
                        <div className='mt-4 text-sm text-slate-600'>
                            아직 계정이 없으신가요?{' '}
                            <Link
                                to='/signup'
                                className='text-primary hover:underline'
                            >
                                계정 만들기
                            </Link>
                        </div>
                    </div>
                    <div className='relative hidden md:block'>
                        <img
                            className='object-cover w-full h-full'
                            src='/bg.png'
                            alt='bg-image'
                        />
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}
