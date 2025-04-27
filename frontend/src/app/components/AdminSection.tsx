// src/components/AdminSection.tsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const AdminSection: React.FC = () => {
  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      <Typography variant="h4" fontWeight={700} color="text.primary" mb={3}>
        Admin Panel
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={2}>
        Manage shelters, tasks, and users (Component Placeholder)
      </Typography>
      {/* Add admin UI here */}
    </Box>
  );
};

export default AdminSection;