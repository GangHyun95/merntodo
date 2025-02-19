import { useActionState, useEffect } from 'react';
import { Eye, EyeOff, UserRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { login } from '@/actions/userActions';
import { useState } from 'react';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [state, formAction, isPending] = useActionState(login, {
        success: null,
        error: null,
    });
    const [showPassword, setShowPassword] = useState(false);

    const [message, setMessage] = useState<{
        text: string | null;
        type: 'success' | 'error' | null;
    }>({
        text: null,
        type: null,
    });
    useEffect(() => {
        if (state.success || state.error) {
            setMessage({
                text: state.success || state.error,
                type: state.success ? 'success' : 'error',
            });

            const timer = setTimeout(() => {
                setMessage({ text: null, type: null });
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
                <div className='my-4'>
                    <Link to='#' className='text-sm text-[#333]'>
                        Forgot password?
                    </Link>
                </div>
                {message.text && (
                    <span
                        className={`message ${
                            message.type === 'success' ? 'successMsg' : ''
                        }`}
                    >
                        {message.text}
                    </span>
                )}
                <Button disabled={isPending} className='btn'>
                    {isPending ? 'Logging in' : 'Login'}
                </Button>
            </form>
        </div>
    );
}
