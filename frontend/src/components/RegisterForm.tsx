import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import type { UserRegisterRequest } from '../types/auth';

interface RegisterFormProps {
  onSubmit: (data: UserRegisterRequest) => void;
  loading: boolean;
  error: string | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError('Enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError('Password is required');
      return false;
    }
    if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email) && validatePassword(password)) {
      onSubmit({ email, password });
    }
  };

  const isFormValid = email && password && !emailError && !passwordError;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Register
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => validateEmail(email)}
        error={!!emailError}
        helperText={emailError}
        fullWidth
        margin="normal"
        disabled={loading}
      />

      <TextField
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => validatePassword(password)}
        error={!!passwordError}
        helperText={passwordError}
        fullWidth
        margin="normal"
        disabled={loading}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={!isFormValid || loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </Button>
    </Box>
  );
};