import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';

function App() {
    const authUser = false;
    return (
        <>
            <Routes>
                <Route
                    path='/'
                    element={authUser ? <HomePage /> : <Navigate to='/login' />}
                ></Route>
                <Route
                    path='/signup'
                    element={!authUser ? <SignupPage /> : <Navigate to='/' />}
                ></Route>
                <Route
                    path='/login'
                    element={!authUser ? <LoginPage /> : <Navigate to='/' />}
                ></Route>
            </Routes>
            <Toaster />
        </>
    );
}

export default App;
