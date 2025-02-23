import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Todos from './pages/Todos.tsx';
import AuthPage from './pages/AuthPage.tsx';
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Todos />,
    },
    {
        path: '/auth',
        element: <AuthPage />,
    },
]);
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Toaster position='top-center' />
        <RouterProvider router={router} />
    </StrictMode>
);
