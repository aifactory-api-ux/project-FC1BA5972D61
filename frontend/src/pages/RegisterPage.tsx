import React from 'react';
import { Container, Box, CircularProgress } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { RegisterForm } from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (data: { email: string; password: string }) => {
    try {
      await register(data);
      navigate('/login');
    } catch {
      // error is handled by useAuth
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <RegisterForm onSubmit={handleSubmit} loading={loading} error={error} />
      </Box>
    </Container>
  );
};