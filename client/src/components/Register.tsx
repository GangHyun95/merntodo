import { useActionState, useEffect, useState } from 'react';
import { Eye, EyeOff, UserRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { register } from '@/actions/userActions';

type Props = {
    setIsRegister: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function Register({ setIsRegister }: Props) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordCheck: '',
    });

    const [state, formAction, isPending] = useActionState(register, {
        success: null,
        error: null,
    });

    const [showPassword, setShowPassword] = useState({
        password: false,
        passwordCheck: false,
    });
    
    const toggleShowPassword = (field: 'password' | 'passwordCheck') => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const [message, setMessage] = useState<{
        text: string | null;
        type: 'success' | 'error' | null;
    }>({
        text: null,
        type: null,
    });

    useEffect(() => {
        if (state.success) {
            const timer = setTimeout(() => {
                setIsRegister(false);
                setFormData({ email: '', password: '', passwordCheck: '' });
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [state.success]);

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
        <div className='form-box register'>
            <form action={formAction}>
                <h1>Registration</h1>
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
                        type={showPassword.password ? 'text' : 'password'}
                        name='password'
                        placeholder='Password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type='button'
                        onClick={() => toggleShowPassword('password')}
                        className='flex items-center'
                    >
                        {showPassword.password ? <Eye /> : <EyeOff />}
                    </button>
                </div>
                <div className='input-box'>
                    <Input
                        type={showPassword.passwordCheck ? 'text' : 'password'}
                        name='passwordCheck'
                        placeholder='Password Check'
                        value={formData.passwordCheck}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type='button'
                        onClick={() => toggleShowPassword('passwordCheck')}
                        className='flex items-center'
                    >
                        {showPassword.passwordCheck ? <Eye /> : <EyeOff />}
                    </button>
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
                    {isPending ? 'Registering' : 'Register'}
                </Button>
            </form>
        </div>
    );
}
