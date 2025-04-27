// src/components/Navbar.tsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Logout, Dashboard, Home, ListAlt, AdminPanelSettings } from '@mui/icons-material';

type Section = 'dashboard' | 'shelters' | 'tasks' | 'admin';
type UserType = 'caseworker' | 'admin' | '';

interface NavbarProps {
  userType: UserType;
  onNavigate: (section: Section) => void;
  onLogout: () => void;
  activeSection: Section;
}

const Navbar: React.FC<NavbarProps> = ({ userType, onNavigate, onLogout, activeSection }) => {
  const isAdmin = userType === 'admin';

  const navItems = [
    { label: 'Dashboard', section: 'dashboard', icon: <Dashboard fontSize="small" sx={{ mr: 1 }} /> },
    { label: 'Shelters', section: 'shelters', icon: <Home fontSize="small" sx={{ mr: 1 }} /> },
    { label: 'Opportunities', section: 'tasks', icon: <ListAlt fontSize="small" sx={{ mr: 1 }} /> },
  ];
  if (isAdmin) {
    navItems.push({ label: 'Admin', section: 'admin', icon: <AdminPanelSettings fontSize="small" sx={{ mr: 1 }} /> });
  }

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ zIndex: 1200 }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton edge="start" color="primary" sx={{ mr: 1 }}>
            <Dashboard />
          </IconButton>
          <Typography variant="h6" fontWeight={700} color="text.primary" noWrap>
            SJ Shelter Hub
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.section}
              onClick={() => onNavigate(item.section as Section)}
              color={activeSection === item.section ? 'primary' : 'inherit'}
              sx={{
                fontWeight: activeSection === item.section ? 700 : 500,
                textTransform: 'none',
                bgcolor: activeSection === item.section ? 'action.selected' : 'transparent',
                borderRadius: 2,
                px: 2,
              }}
              startIcon={item.icon}
            >
              {item.label}
            </Button>
          ))}
          <Button
            onClick={onLogout}
            variant="outlined"
            color="inherit"
            startIcon={<Logout />}
            sx={{ ml: 2, borderRadius: 2, fontWeight: 600 }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;