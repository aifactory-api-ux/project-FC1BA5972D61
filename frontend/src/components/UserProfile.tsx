import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';
import type { UserProfile } from '../types/auth';

interface UserProfileProps {
  user: UserProfile;
}

export const UserProfileComponent: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Profile
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            <strong>ID:</strong> {user.id}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {user.email}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};