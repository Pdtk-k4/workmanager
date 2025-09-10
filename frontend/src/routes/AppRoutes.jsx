import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
    const [user, setUser] = useState(() => localStorage.getItem('user'));

    // Theo dõi thay đổi trong localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            setUser(localStorage.getItem('user'));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/dashboard"
                    element={user ? <Dashboard /> : <Navigate to="/login" replace />}
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;