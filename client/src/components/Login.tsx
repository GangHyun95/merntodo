import { useActionState, useEffect } from 'react';
import { Eye, EyeOff, UserRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { login } from '@/actions/userActions';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [state, formAction, isPending] = useActionState(login, {
        success: null,
        error: null,
    });
    const [showPassword, setShowPassword] = useState(false);

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
            </form>
        </div>
    );
}
