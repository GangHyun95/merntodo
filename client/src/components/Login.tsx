import { useActionState, useEffect } from 'react';
import { Eye, EyeOff, UserRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { login } from '@/actions/userActions';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import useAuthStore from '@/store/authStore';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [state, formAction, isPending] = useActionState(login, {
        success: null,
        error: null,
    });
    const [showPassword, setShowPassword] = useState(false);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);

    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (response) => {
            try {
                const res = await fetch(
                    'http://localhost:3000/api/user/google',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code: response.code }),
                        credentials: 'include',
                    }
                );

                const data: { access_token?: string } = await res.json();
                console.log(data);

                if (data.access_token) {
                    toast.success('Google 로그인 성공!');
                    setAccessToken(data.access_token);
                    navigate('/todo', { replace: true });
                } else {
                    toast.error('Google 로그인 실패');
                }
            } catch (error) {
                console.error('Google 로그인 에러:', error);
                toast.error('Google 로그인 중 문제가 발생했습니다.');
            }
        },
        onError: () => {
            toast.error('Google 로그인 실패');
        },
    });

    useEffect(() => {
        if (state.success) {
            navigate('/todo', { replace: true });
        }
    }, [state.success]);

    useEffect(() => {
        if (state.error) {
            toast.error(state.error);
        }
    }, [state.error]);

    useEffect(() => {
        if (state.success || state.error) {
            const timer = setTimeout(() => {
                state.success = null;
                state.error = null;
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [state.success, state.error]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className='form-box login'>
            <h1 className='title'>Todo APP</h1>
            <form action={formAction}>
                <h1>Login</h1>
                <div className='input-box'>
                    <Input
                        type='email'
                        name='email'
                        placeholder='Email Address'
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <UserRound />
                </div>
                <div className='input-box'>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        placeholder='Password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type='button'
                        onClick={() => setShowPassword((prev) => !prev)}
                        className='flex items-center'
                    >
                        {showPassword ? <Eye /> : <EyeOff />}
                    </button>
                </div>

                <Button disabled={isPending} className='btn'>
                    {isPending ? 'Logging in' : 'Login'}
                </Button>
                <p>or</p>
                <div className='social-icons'>
                    <button type='button' className='btn' onClick={() => googleLogin()}>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            x='0px'
                            y='0px'
                            width='20'
                            height='20'
                            viewBox='0 0 48 48'
                        >
                            <path
                                fill='#FFC107'
                                d='M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z'
                            ></path>
                            <path
                                fill='#FF3D00'
                                d='M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z'
                            ></path>
                            <path
                                fill='#4CAF50'
                                d='M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z'
                            ></path>
                            <path
                                fill='#1976D2'
                                d='M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z'
                            ></path>
                        </svg>
                        <p>Google Login</p>
                    </button>
                </div>
            </form>
        </div>
    );
}
