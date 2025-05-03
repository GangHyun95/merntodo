import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';

function App() {
    return (
        <Routes>
            <Route path='/' element={<HomePage />}></Route>
            <Route path='/signup' element={<SignupPage />}></Route>
            <Route path='/login' element={<LoginPage />}></Route>
        </Routes>
    );
}

export default App;
