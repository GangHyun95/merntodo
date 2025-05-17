import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { useShallow } from 'zustand/shallow';
import { Loader } from 'lucide-react';

function App() {
    const { checkAuth, isCheckingAuth, accessToken } = useAuthStore(
        useShallow((state) => ({
            checkAuth: state.checkAuth,
            isCheckingAuth: state.isCheckingAuth,
            accessToken: state.accessToken,
        }))
    );
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth && !accessToken)
        return (
            <div className='flex items-center justify-center h-screen'>
                <Loader className='size-10 animate-spin' />
            </div>
        );
    return (
        <>
            <Routes>
                <Route
                    path='/'
                    element={
                        accessToken ? <HomePage /> : <Navigate to='/login' />
                    }
                ></Route>
                <Route
                    path='/signup'
                    element={
                        !accessToken ? <SignupPage /> : <Navigate to='/' />
                    }
                ></Route>
                <Route
                    path='/login'
                    element={!accessToken ? <LoginPage /> : <Navigate to='/' />}
                ></Route>
            </Routes>
            <Toaster />
        </>
    );
}

export default App;
