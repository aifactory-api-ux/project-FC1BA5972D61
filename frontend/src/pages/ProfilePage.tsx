import React, { useEffect } from 'react';
import { Container, Box } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { UserProfileComponent } from '../components/UserProfile';

export const ProfilePage: React.FC = () => {
  const { user, fetchProfile, loading, error } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        {user && <UserProfileComponent user={user} />}
      </Box>
    </Container>
  );
};