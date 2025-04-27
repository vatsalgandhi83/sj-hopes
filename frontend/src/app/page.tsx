// src/app/page.tsx
'use client'; // Directive needed for hooks and event handlers

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Chip,
  IconButton,
  Collapse,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider
} from '@mui/material';
import { Search, LocationOn, FilterList, Close, Pets, Group, Map, List } from '@mui/icons-material';
import Layout from './components/Layout';
import LoginScreen from './components/LoginScreen';
import { shelterService, type Shelter, type ShelterType } from '../api/shelters';
import ShelterCard from './components/ShelterCard';
import ShelterMap from './components/ShelterMap';
import { useAuth } from './hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isLoggedIn, userType, login, logout } = useAuth();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [filteredShelters, setFilteredShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list'); // Default to list view
  const [loginContext, setLoginContext] = useState<'general' | 'reserve'>('general');

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ShelterType | ''>('');
  const [allowPets, setAllowPets] = useState(false);
  const [allowPartners, setAllowPartners] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Memoized search function to prevent unnecessary re-renders
  const performSearch = useCallback(async (params: Record<string, any>) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Searching with params:', params);
      const data = await shelterService.searchShelters(params);
      setShelters(data);
      setFilteredShelters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shelters');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    performSearch({});
  }, [performSearch]);

  // Redirect to /admin if admin is logged in
  useEffect(() => {
    if (isLoggedIn && userType === 'admin') {
      router.push('/admin');
    }
  }, [isLoggedIn, userType, router]);

  const handleLoginClick = (context: 'general' | 'reserve' = 'general') => {
    setLoginContext(context);
    setShowLogin(true);
  };

  const handleLogin = (type: 'caseworker' | 'admin', name: string) => {
    login(type);
    setShowLogin(false);
    if (type === 'admin') {
      router.push('/admin');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleSearch = async () => {
    const searchParams: Record<string, any> = {};
    
    if (selectedType) {
      searchParams.shelterType = selectedType;
    }
    
    if (allowPets) {
      searchParams.allowsPets = true;
    }
    
    if (allowPartners) {
      searchParams.allowsPartner = true;
    }
    
    if (isActive) {
      searchParams.isActive = true;
    }

    await performSearch(searchParams);
  };

  const handleFilter = () => {
    let filtered = shelters;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(shelter => 
        shelter.name.toLowerCase().includes(searchLower) ||
        shelter.addressLine1.toLowerCase().includes(searchLower) ||
        shelter.city.toLowerCase().includes(searchLower)
      );
    }

    setFilteredShelters(filtered);
  };

  // Handle search term changes
  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    if (!value) {
      // If search term is cleared, reset to original filtered results
      setFilteredShelters(shelters);
    }
  };

  // Handle filter changes
  const handleFilterChange = async (type: 'type' | 'pets' | 'partners' | 'active', value: any) => {
    // Update state first
    switch (type) {
      case 'type':
        setSelectedType(value);
        break;
      case 'pets':
        setAllowPets(value);
        break;
      case 'partners':
        setAllowPartners(value);
        break;
      case 'active':
        setIsActive(value);
        break;
    }

    // Wait for state to update
    await new Promise(resolve => setTimeout(resolve, 0));

    // Get current state values
    const currentState = {
      type: type === 'type' ? value : selectedType,
      pets: type === 'pets' ? value : allowPets,
      partners: type === 'partners' ? value : allowPartners,
      active: type === 'active' ? value : isActive
    };

    // Construct search parameters
    const searchParams: Record<string, any> = {};
    
    if (currentState.type) {
      searchParams.shelterType = currentState.type;
    }
    
    if (currentState.pets) {
      searchParams.allowsPets = true;
    }
    
    if (currentState.partners) {
      searchParams.allowsPartner = true;
    }
    
    if (currentState.active) {
      searchParams.isActive = true;
    }

    console.log('Current state:', currentState);
    console.log('Search params:', searchParams);

    await performSearch(searchParams);
  };

  return (
    <Layout 
      isLoggedIn={isLoggedIn} 
      onLoginClick={() => handleLoginClick('general')}
      userType={userType || undefined}
      onLogout={handleLogout}
    >
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: 'url("/images/san-jose-skyline.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '500px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h2"
            color="white"
            fontWeight={700}
            sx={{ mb: 2, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          >
            Find Shelter in San Jose
          </Typography>
          <Typography
            variant="h5"
            color="white"
            sx={{ mb: 4, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
          >
            Access real-time shelter availability and support services
          </Typography>

          {/* Search Section */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 2,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Search by name, address, or city"
                  value={searchTerm}
                  onChange={(e) => handleSearchTermChange(e.target.value)}
                  InputProps={{
                    startAdornment: <LocationOn color="action" sx={{ mr: 1 }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{ borderRadius: 2, height: '56px' }}
                >
                  Filters
                </Button>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Search />}
                  onClick={handleFilter}
                  disabled={loading}
                  sx={{ borderRadius: 2, height: '56px' }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>

            {/* Advanced Filters */}
            <Collapse in={showFilters}>
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Shelter Type</InputLabel>
                      <Select
                        value={selectedType}
                        label="Shelter Type"
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        sx={{ borderRadius: 2 }}
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
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={allowPets}
                            onChange={(e) => handleFilterChange('pets', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Allows Pets"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={allowPartners}
                            onChange={(e) => handleFilterChange('partners', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Allows Partners"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={isActive}
                            onChange={(e) => handleFilterChange('active', e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Active Only"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Paper>
        </Container>
      </Box>

      {/* Results Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredShelters.length > 0 ? (
          <>
            {/* View Toggle and Results Count */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" fontWeight={600}>
                Available Shelters ({filteredShelters.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  color={viewMode === 'map' ? 'primary' : 'default'}
                  onClick={() => setViewMode('map')}
                >
                  <Map />
                </IconButton>
                <IconButton
                  color={viewMode === 'list' ? 'primary' : 'default'}
                  onClick={() => setViewMode('list')}
                >
                  <List />
                </IconButton>
              </Box>
            </Box>

            {/* Map View */}
            {viewMode === 'map' && (
              <Box sx={{ mb: 4, height: '500px', borderRadius: 2, overflow: 'hidden' }}>
                <ShelterMap shelters={filteredShelters} />
              </Box>
            )}

            {/* List View */}
            <Grid container spacing={3}>
              {filteredShelters.map((shelter) => (
                <Grid item xs={12} sm={6} md={4} key={shelter.id}>
                  <ShelterCard
                    shelter={shelter}
                    onReserveClick={() => {
                      if (!isLoggedIn) {
                        handleLoginClick('reserve');
                      }
                    }}
                    isLoggedIn={isLoggedIn}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No shelters found matching your criteria
            </Typography>
          </Paper>
        )}
      </Container>

      {/* Login Modal */}
      {showLogin && (
        <LoginScreen
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
          context={loginContext}
        />
      )}
    </Layout>
  );
}