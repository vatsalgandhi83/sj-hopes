import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Shelter } from '../../api/shelters';
import ClientRegistrationModal from './ClientRegistrationModal';

interface ShelterCardProps {
  shelter: Shelter;
  onReserveClick: () => void;
  isLoggedIn?: boolean;
}

const ShelterCard: React.FC<ShelterCardProps> = ({ shelter, onReserveClick, isLoggedIn }) => {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const availabilityPercentage = (shelter.currentAvailability / shelter.totalCapacity) * 100;
  const isLowAvailability = availabilityPercentage < 25;

  const handleReserveClick = () => {
    if (isLoggedIn) {
      setShowRegistrationModal(true);
    } else {
      onReserveClick(); // This will trigger login modal
    }
  };

  const handleRegistrationSuccess = () => {
    setShowRegistrationModal(false);
    // Optionally refresh shelter data here
  };

  return (
    <>
      <Paper 
        sx={{ 
          p: 2, 
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          height: '100%'
        }} 
        elevation={2}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" fontWeight={600}>{shelter.name}</Typography>
          <Chip 
            label={shelter.shelterType?.replace('_', ' ')} 
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        <Typography variant="body2" color="text.secondary">
          {shelter.addressLine1}
          {shelter.addressLine2 && `, ${shelter.addressLine2}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {shelter.city}, {shelter.state} {shelter.zipCode}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          {shelter.allowsPets && (
            <Chip label="Pets Allowed" size="small" color="success" />
          )}
          {shelter.allowsPartner && (
            <Chip label="Partners Allowed" size="small" color="success" />
          )}
        </Box>

        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Typography 
            variant="body2" 
            color={isLowAvailability ? 'error' : 'text.secondary'}
            sx={{ mb: 1 }}
          >
            Available Beds: {shelter.currentAvailability}/{shelter.totalCapacity}
          </Typography>

          {shelter.phone && (
            <Typography variant="body2" color="text.secondary">
              Phone: {shelter.phone}
            </Typography>
          )}
          {shelter.email && (
            <Typography variant="body2" color="text.secondary">
              Email: {shelter.email}
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleReserveClick}
          disabled={shelter.currentAvailability === 0}
          sx={{ mt: 2 }}
        >
          {shelter.currentAvailability === 0 ? 'No Beds Available' : 'Reserve Bed'}
        </Button>
      </Paper>

      <ClientRegistrationModal
        open={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        shelter={shelter}
        onSuccess={handleRegistrationSuccess}
      />
    </>
  );
};

export default ShelterCard; 