import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { CssBaseline, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from './hooks/useAuth';
import { Link } from 'react-router-dom';

const AppHeader: React.FC = () => {
  const { accessToken, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Auth App
        </Typography>
        {accessToken ? (
          <Button color="inherit" onClick={logout}>Logout</Button>
        ) : (
          <Box>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CssBaseline />
      <AppHeader />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;