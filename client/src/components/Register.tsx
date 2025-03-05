import { useActionState, useEffect, useState } from 'react';
import { Eye, EyeOff, UserRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { register } from '@/actions/userActions';
import toast from 'react-hot-toast';

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
    const [capsLockOn, setCapsLockOn] = useState(false);

    const toggleShowPassword = (field: 'password' | 'passwordCheck') => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    useEffect(() => {
        if (state.success) {
            setIsRegister(false);
            setFormData({ email: '', password: '', passwordCheck: '' });
        }
    }, [state.success]);

    useEffect(() => {
        if (state.success) {
            toast.success(state.success);
        }
        if (state.error) {
            toast.error(state.error);
        }
        if (state.success || state.error) {
            state.success = null;
            state.error = null;
        }
    }, [state.success, state.error]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.getModifierState('CapsLock')) {
            setCapsLockOn(true);
        } else {
            setCapsLockOn(false);
        }
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!event.getModifierState('CapsLock')) {
            setCapsLockOn(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className='form-box register'>
            <form action={formAction}>
                <h1 className='title'>Todo APP</h1>
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
                        inputMode='text'
                        name='password'
                        placeholder='Password'
                        value={formData.password}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
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
                        inputMode='text'
                        name='passwordCheck'
                        placeholder='Password Check'
                        value={formData.passwordCheck}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
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
                {capsLockOn && (
                    <p
                        style={{
                            color: 'red',
                            fontSize: '12px',
                        }}
                    >
                        ⚠ CAPS LOCK이 켜져 있습니다!
                    </p>
                )}

                <Button disabled={isPending} className='btn'>
                    {isPending ? 'Registering' : 'Register'}
                </Button>
            </form>
        </div>
    );
}
