// src/components/LoginScreen.tsx
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import { Home, Person, AdminPanelSettings } from '@mui/icons-material';
import Alert from '@mui/material/Alert';

type UserType = 'caseworker' | 'admin';

interface LoginScreenProps {
  onLogin: (userType: UserType, email: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [userType, setUserType] = useState<UserType>('caseworker');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    setTimeout(() => {
      // Hardcoded credential check
      if (
        (userType === 'caseworker' && email === 'demo@example.com' && password === 'password') ||
        (userType === 'admin' && email === 'admin@example.com' && password === 'admin123')
      ) {
        onLogin(userType, email);
      } else {
        setError('Invalid credentials. Please use the demo credentials shown below.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: '90vh',
        width: '100vw',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 0,
        m: 0,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: 350,
          maxHeight: '95vh',
          overflow: 'auto',
          borderRadius: 4,
          p: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Home sx={{ color: 'white', fontSize: 36 }} />
          </Box>
          <Typography variant="h4" fontWeight={700} color="text.primary" align="center" gutterBottom>
            SJ Shelter Hub
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" align="center">
            Connecting people to shelter and opportunities
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="user-type-label">User Type</InputLabel>
            <Select
              labelId="user-type-label"
              value={userType}
              label="User Type"
              onChange={(e) => setUserType(e.target.value as UserType)}
              disabled={isLoading}
            >
              <MenuItem value="caseworker">
                <Person sx={{ mr: 1, verticalAlign: 'middle' }} fontSize="small" /> Caseworker
              </MenuItem>
              <MenuItem value="admin">
                <AdminPanelSettings sx={{ mr: 1, verticalAlign: 'middle' }} fontSize="small" /> Administrator
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="email"
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="current-password"
          />
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, borderRadius: 2, fontWeight: 600 }}
            disabled={isLoading}
          >
            {isLoading ? <><CircularProgress size={24} sx={{ color: 'white', mr: 2 }} /> Signing In...</> : 'Sign In'}
          </Button>
        </Box>
        <Box sx={{ mt: 3, textAlign: 'center', color: 'text.secondary', fontSize: 14 }}>
          <Typography variant="body2" color="text.secondary">
            Demo credentials:
          </Typography>
          <Typography variant="caption" display="block">
            Caseworker: demo@example.com / password
          </Typography>
          <Typography variant="caption" display="block">
            Admin: admin@example.com / admin123
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginScreen;