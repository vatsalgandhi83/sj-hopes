// src/components/DashboardSection.tsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import BedIcon from '@mui/icons-material/Bed';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupIcon from '@mui/icons-material/Group';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface DashboardSectionProps {
    userName: string;
}

const stats = [
  {
    icon: <BedIcon sx={{ color: '#5B4FE5', fontSize: 40, mb: 1 }} />, // Indigo
    label: '47 Beds',
    sub: 'Available',
  },
  {
    icon: <ListAltIcon sx={{ color: '#22C55E', fontSize: 40, mb: 1 }} />, // Green
    label: '12 Tasks',
    sub: 'Active',
  },
  {
    icon: <GroupIcon sx={{ color: '#A21CAF', fontSize: 40, mb: 1 }} />, // Purple
    label: '156 Clients',
    sub: 'This Month',
  },
  {
    icon: <AccessTimeIcon sx={{ color: '#F97316', fontSize: 40, mb: 1 }} />, // Orange
    label: '5 Pending',
    sub: 'Needs Action',
  },
];

const DashboardSection: React.FC<DashboardSectionProps> = ({ userName }) => {
    return (
      <Box sx={{ p: { xs: 2, sm: 6 } }}>
        <Typography variant="h4" fontWeight={700} color="text.primary" mb={4}>
          Welcome, {userName}!
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          {stats.map((stat, idx) => (
            <Paper
              key={stat.label}
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                minHeight: 140,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              {stat.icon}
              <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
                {stat.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.sub}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    );
};

export default DashboardSection;