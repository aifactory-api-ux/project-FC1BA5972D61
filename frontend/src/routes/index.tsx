import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { ProfilePage } from '../pages/ProfilePage';
import { useAuth } from '../hooks/useAuth';

export const AppRoutes: React.FC = () => {
  const { accessToken } = useAuth();

  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/profile"
        element={accessToken ? <ProfilePage /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to={accessToken ? '/profile' : '/login'} />} />
    </Routes>
  );
};