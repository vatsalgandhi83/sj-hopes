// src/components/LoginScreen.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  Alert,
  Divider
} from '@mui/material';
import { Close, Login as LoginIcon } from '@mui/icons-material';

interface LoginScreenProps {
  onLogin: (type: 'caseworker' | 'admin', name: string) => void;
  onClose: () => void;
  context?: 'reserve' | 'general';
}

const DEMO_CREDENTIALS = {
  caseworker: {
    email: 'demo@example.com',
    password: 'password'
  },
  admin: {
    email: 'admin@example.com',
    password: 'admin123'
  }
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onClose, context = 'general' }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    type: context === 'reserve' ? 'caseworker' as const : 'caseworker' as 'caseworker' | 'admin'
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate credentials
    const demoCreds = DEMO_CREDENTIALS[formData.type];
    if (formData.email === demoCreds.email && formData.password === demoCreds.password) {
      onLogin(formData.type, formData.type === 'admin' ? 'Admin User' : 'Case Worker');
    } else {
      setError('Invalid credentials. Please use the demo credentials provided.');
    }
  };

  const handleDemoLogin = (type: 'caseworker' | 'admin') => {
    setFormData({
      email: DEMO_CREDENTIALS[type].email,
      password: DEMO_CREDENTIALS[type].password,
      type
    });
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography 
            variant="h5" 
            fontWeight={700}
            sx={{
              background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Welcome to SJ Hopes
          </Typography>
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{
              color: theme.palette.grey[500],
              '&:hover': {
                color: theme.palette.grey[700],
                backgroundColor: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main
                  }
                }
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main
                  }
                }
              }}
            />
            {context === 'general' && (
              <FormControl 
                fullWidth 
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main
                    }
                  }
                }}
              >
                <InputLabel>Login As</InputLabel>
                <Select
                  value={formData.type}
                  label="Login As"
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'caseworker' | 'admin' })}
                >
                  <MenuItem value="caseworker">Caseworker</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              startIcon={<LoginIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                py: 1.5,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0,0,0,0.2)'
                }
              }}
            >
              Sign In
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Demo Credentials
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
              {context === 'general' && (
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => handleDemoLogin('admin')}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Use Admin Demo Account
                </Button>
              )}
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => handleDemoLogin('caseworker')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Use Caseworker Demo Account
              </Button>
            </Box>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginScreen;