// src/components/SheltersSection.tsx
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { getAllShelters } from '../../api/shelters';
import { Shelter } from '../../types/Shelter';
import ShelterCard from './ShelterCard';

const SheltersSection: React.FC = () => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllShelters()
      .then(setShelters)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      <Typography variant="h4" fontWeight={700} color="text.primary" mb={3}>
        Shelter Network
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={2}>
        List of shelters with real-time availability
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          {shelters.map((shelter) => (
            <ShelterCard key={shelter.id} shelter={shelter} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SheltersSection;