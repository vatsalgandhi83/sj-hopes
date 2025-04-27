import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Shelter } from '../../types/Shelter';

interface ShelterCardProps {
  shelter: Shelter;
}

const ShelterCard: React.FC<ShelterCardProps> = ({ shelter }) => (
  <Paper sx={{ p: 2, borderRadius: 2 }} elevation={2}>
    <Typography variant="h6" fontWeight={600}>{shelter.name}</Typography>
    <Typography variant="body2" color="text.secondary">
      {shelter.addressLine1}, {shelter.city}, {shelter.state} {shelter.zipCode}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Type: {shelter.shelterType.replace('_', ' ')} | Capacity: {shelter.currentAvailability}/{shelter.totalCapacity}
    </Typography>
    {shelter.phone && <Typography variant="body2">Phone: {shelter.phone}</Typography>}
    {shelter.email && <Typography variant="body2">Email: {shelter.email}</Typography>}
  </Paper>
);

export default ShelterCard; 