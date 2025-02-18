import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Todos from './pages/Todos.tsx';
import Register from './pages/Register.tsx';
import Login from './pages/Login.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Todos />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: 'login',
        element: <Login />,
    },
]);
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
