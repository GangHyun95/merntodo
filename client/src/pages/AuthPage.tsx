import { useState } from 'react';
import { Lock, UserRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import "../styles/auth.scss";

export default function AuthForm() {
    const [isRegister, setIsRegister] = useState(false);
    return (
        <div className={`auth-container${isRegister ? ' active' : ''}`}>
            <div className='form-box login'>
                <form action=''>
                    <h1>Login</h1>
                    <div className='input-box'>
                        <Input type='text' placeholder='Username' />
                        <UserRound />
                    </div>
                    <div className='input-box'>
                        <Input type='password' placeholder='Password' />
                        <Lock />
                    </div>
                    <div className='my-4'>
                        <Link to='#' className='text-sm text-[#333]'>Forgot password?</Link>
                    </div>
                    <Button type='submit' className='btn'>
                        Login
                    </Button>
                </form>
            </div>

            <div className='form-box register'>
                <form action=''>
                    <h1>Registration</h1>
                    <div className='input-box'>
                        <Input type='text' placeholder='Username' />
                        <UserRound />
                    </div>
                    <div className='input-box'>
                        <Input type='password' placeholder='Password' />
                        <Lock />
                    </div>
                    <div className='input-box'>
                        <Input type='password' placeholder='Password Check' />
                        <Lock />
                    </div>
                    <Button type='submit' className='btn'>
                        Register
                    </Button>
                </form>
            </div>

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
