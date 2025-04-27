// src/components/SheltersSection.tsx
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import { shelterService, type Shelter, type ShelterType } from '../../api/shelters';
import ShelterCard from './ShelterCard';
import ShelterMap from './ShelterMap';

const SheltersSection: React.FC = () => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [filteredShelters, setFilteredShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ShelterType | ''>('');
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    setLoading(true);
    shelterService.getAllShelters()
      .then(data => {
        setShelters(data);
        setFilteredShelters(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = shelters;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(shelter => 
        shelter.name.toLowerCase().includes(searchLower) ||
        shelter.addressLine1.toLowerCase().includes(searchLower) ||
        shelter.city.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (selectedType) {
      filtered = filtered.filter(shelter => shelter.shelterType === selectedType);
    }

    setFilteredShelters(filtered);
  }, [searchTerm, selectedType, shelters]);

  const handleShelterClick = (shelter: Shelter) => {
    // Handle shelter click - could show more details or open reservation modal
    console.log('Shelter clicked:', shelter);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      <Typography variant="h4" fontWeight={700} color="text.primary" mb={3}>
        Shelter Network
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Find available shelters in San Jose
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search shelters"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, address, or city"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Shelter Type</InputLabel>
            <Select
              value={selectedType}
              label="Shelter Type"
              onChange={(e) => setSelectedType(e.target.value as ShelterType | '')}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="CONGREGATE">Congregate</MenuItem>
              <MenuItem value="TINY_HOME">Tiny Home</MenuItem>
              <MenuItem value="SAFE_PARKING">Safe Parking</MenuItem>
              <MenuItem value="MOTEL_CONVERSION">Motel Conversion</MenuItem>
              <MenuItem value="NAVIGATION_CENTER">Navigation Center</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Map View */}
      <Box sx={{ mb: 4 }}>
        <ShelterMap 
          shelters={filteredShelters} 
          onShelterClick={handleShelterClick}
        />
      </Box>

      {/* List View */}
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          {filteredShelters.map((shelter) => (
            <ShelterCard 
              key={shelter.id} 
              shelter={shelter}
              onReserveClick={() => handleShelterClick(shelter)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SheltersSection;