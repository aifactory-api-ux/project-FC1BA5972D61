import React from 'react';
import { Container, Box } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data: { email: string; password: string }) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch {
      // error is handled by useAuth
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />
      </Box>
    </Container>
  );
};