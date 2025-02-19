import { useState } from 'react';
import { Button } from '@/components/ui/button';
import '../styles/auth.scss';
import Login from '@/components/Login';
import Register from '@/components/Register';

export default function AuthForm() {
    const [isRegister, setIsRegister] = useState(false);
    return (
        <div className={`auth-container${isRegister ? ' active' : ''}`}>
            <Login />
            <Register setIsRegister={setIsRegister} />

            <div className='toggle-box'>
                <div className='toggle-panel toggle-left'>
                    <h1>Hello, Welcome!</h1>
                    <p>Don't have an account?</p>
                    <Button
                        onClick={() => setIsRegister(true)}
                        className='btn register-btn'
                    >
                        Register
                    </Button>
                </div>
                <div className='toggle-panel toggle-right'>
                    <h1>Welcome Back!</h1>
                    <p>Already have an account?</p>
                    <Button
                        onClick={() => setIsRegister(false)}
                        className='btn login-btn'
                    >
                        Login
                    </Button>
                </div>
            </div>
        </div>
    );
}
