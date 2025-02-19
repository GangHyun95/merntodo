import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Todos from './pages/Todos.tsx';
import AuthPage from './pages/AuthPage.tsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Todos />,
    },
    {
        path: '/auth',
        element: <AuthPage />
    }
]);
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
