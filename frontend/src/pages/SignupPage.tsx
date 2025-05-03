import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordCheck: '',
    });

    const { isSigningUp, signup } = useAuthStore();

    const validateForm = () => {
        if (!formData.email.trim()) return toast.error('이메일을 입력해주세요');
        if (!formData.password.trim())
            return toast.error('비밀번호를 입력해주세요');

        if (formData.password.length < 6)
            return toast.error('비밀번호는 최소 6자 이상이어야 합니다');

        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isValid = validateForm();
        if (isValid === true) {
            const isSuccess = await signup(formData);
            if (isSuccess) navigate('/login');
        }
    };

    return (
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
                            <h2 className='text-4xl font-bold'>회원가입</h2>
                        </div>
                        <p className='mt-2 text-sm text-slate-700'>
                            오늘 할 일을 정리하고, 더 나은 하루를 시작하세요
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className='w-full max-w-sm mt-4'
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
                            className='mt-2 mb-4 bg-transparent rounded-full'
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

                        <Label htmlFor='passwordCheck'>비밀번호 확인</Label>
                        <Input
                            className='mt-2 bg-transparent rounded-full'
                            type='password'
                            id='passwordCheck'
                            placeholder='비밀번호를 입력하세요.'
                            value={formData.passwordCheck}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    passwordCheck: e.target.value,
                                })
                            }
                        />

                        <Button
                            type='submit'
                            className='w-full mt-6 bg-primary/90 rounded-full hover:bg-primary cursor-pointer'
                            disabled={isSigningUp}
                        >
                            {isSigningUp ? (
                                <>
                                    <Loader2 className='size-5 animate-spin' />
                                    Loading...
                                </>
                            ) : (
                                '회원가입'
                            )}
                        </Button>

                        <div className='flex items-center gap-4 my-6'>
                            <div className='flex-1 h-px bg-border' />
                            <span className='text-sm text-muted-foreground'>
                                or
                            </span>
                            <div className='flex-1 h-px bg-border' />
                        </div>
                    </form>
                    <div className='mt-4 text-sm text-slate-600'>
                        이미 계정이 있으신가요?{' '}
                        <Link
                            to='/login'
                            className='text-primary hover:underline'
                        >
                            로그인
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
    );
}
