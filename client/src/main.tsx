import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Todos from './pages/Todos.tsx';
import AuthPage from './pages/AuthPage.tsx';
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './components/routes/ProtectedRoute.tsx';
import ProtectedAuthPage from './components/routes/ProtectedAuthPage.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedAuthPage />,
        children: [{ path: '/', element: <AuthPage /> }],
    },
    {
        path: '/todo',
        element: <ProtectedRoute />,
        children: [{ path: '/todo', element: <Todos /> }],
    },
]);
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <Toaster position='top-center' />
            <RouterProvider router={router} />
        </GoogleOAuthProvider>
    </StrictMode>
);
