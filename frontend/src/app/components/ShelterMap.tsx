import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { Shelter } from '../../api/shelters';

// Define libraries array outside component
const libraries: ('places' | 'drawing' | 'geometry' | 'visualization')[] = ['places'];

interface ShelterMapProps {
  shelters: Shelter[];
  onShelterClick?: (shelter: Shelter) => void;
}

interface InfoWindowContentProps {
  shelter: Shelter;
  onViewDetails: () => void;
}

const InfoWindowContent: React.FC<InfoWindowContentProps> = ({ shelter, onViewDetails }) => (
  <div style={{ padding: '8px', maxWidth: '300px' }}>
    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 600 }}>
      {shelter.name}
    </h3>
    <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem' }}>
      {shelter.addressLine1}
      {shelter.addressLine2 && <br />}
      {shelter.addressLine2}
      <br />
      {shelter.city}, {shelter.state} {shelter.zipCode}
    </p>
    <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem' }}>
      Available Beds: {shelter.currentAvailability}/{shelter.totalCapacity}
    </p>
    {shelter.phone && (
      <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem' }}>
        Phone: {shelter.phone}
      </p>
    )}
    {shelter.email && (
      <p style={{ margin: '0 0 8px 0', fontSize: '0.875rem' }}>
        Email: {shelter.email}
      </p>
    )}
    {shelter.shelterType && (
      <p style={{ margin: '0 0 16px 0', fontSize: '0.875rem' }}>
        Type: {shelter.shelterType.replace('_', ' ')}
      </p>
    )}
    <button
      style={{
        width: '100%',
        padding: '8px 16px',
        backgroundColor: '#1976d2',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.875rem'
      }}
      onClick={onViewDetails}
    >
      View Details
    </button>
  </div>
);

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 37.3382,
  lng: -121.8863
};

const mapOptions: google.maps.MapOptions = {
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ],
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false
};

const ShelterMap: React.FC<ShelterMapProps> = ({ shelters, onShelterClick }) => {
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [detailedError, setDetailedError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      setApiKeyError('Google Maps API key is missing. Please check your environment variables.');
    } else if (apiKey.length < 10) {
      setApiKeyError('Google Maps API key appears to be invalid. Please check your environment variables.');
    } else {
      // Log the first few characters of the API key for debugging (safely)
      console.log('API Key format check:', {
        length: apiKey.length,
        startsWith: apiKey.substring(0, 5) + '...',
        hasRestrictions: apiKey.includes('restrict') || apiKey.includes('limit')
      });
    }
  }, [apiKey]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
    libraries
  });

  // Add effect to log loader status and handle loading state
  useEffect(() => {
    console.log('Google Maps Loader Status:', {
      isLoaded,
      loadError,
      apiKey: apiKey ? 'Present' : 'Missing',
      sheltersCount: shelters.length,
      currentUrl: window.location.href,
      isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    });

    // If the script is loaded, we can set isLoading to false
    if (isLoaded) {
      setIsLoading(false);
    }

    // Handle specific error cases
    if (loadError) {
      if (loadError.message.includes('ApiTargetBlockedMapError')) {
        setDetailedError(
          'The API key is blocked. This usually means:\n' +
          '1. The API key has domain restrictions that don\'t include your current domain\n' +
          '2. The API key has IP restrictions that don\'t include your current IP\n' +
          '3. The API key has API restrictions that don\'t include Maps JavaScript API\n\n' +
          'Current URL: ' + window.location.href + '\n' +
          'Please check the Google Cloud Console and ensure your API key is properly configured.'
        );
      } else {
        setDetailedError(loadError.message);
      }
    }
  }, [isLoaded, loadError, shelters.length, apiKey]);

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log('Map loaded successfully');
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    console.log('Map unmounted');
    setMap(null);
  }, []);

  const handleMarkerClick = (shelter: Shelter) => {
    if (!shelter.latitude || !shelter.longitude) {
      console.error('Invalid coordinates for shelter:', shelter.id);
      return;
    }
    setSelectedShelter(shelter);
    if (onShelterClick) {
      onShelterClick(shelter);
    }
  };

  if (apiKeyError) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiKeyError}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Please check your .env.local file and ensure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set correctly.
        </Typography>
      </Paper>
    );
  }

  if (loadError) {
    console.error('Google Maps load error:', loadError);
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading Google Maps
        </Alert>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
          {detailedError || 'Please check your API key and enabled services in the Google Cloud Console.'}
        </Typography>
      </Paper>
    );
  }

  if (!isLoaded) {
    console.log('Google Maps script is not loaded yet');
    return (
      <Paper
        elevation={3}
        sx={{
          height: '500px',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1
          }}
        >
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  console.log('Rendering map with shelters:', shelters.length);

  return (
    <Paper
      elevation={3}
      sx={{
        height: '500px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2
      }}
    >
      <div ref={mapContainerRef} style={containerStyle}>
        {/* @ts-ignore - Known issue with @react-google-maps/api types */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={mapOptions}
        >
          {shelters.map((shelter) => (
            <MarkerF
              key={shelter.id}
              position={{ lat: shelter.latitude, lng: shelter.longitude }}
              onClick={() => handleMarkerClick(shelter)}
            />
          ))}

          {selectedShelter && (
            <InfoWindowF
              position={{ lat: selectedShelter.latitude, lng: selectedShelter.longitude }}
              onCloseClick={() => setSelectedShelter(null)}
            >
              <InfoWindowContent
                shelter={selectedShelter}
                onViewDetails={() => {
                  if (onShelterClick) {
                    onShelterClick(selectedShelter);
                  }
                }}
              />
            </InfoWindowF>
          )}
        </GoogleMap>
      </div>
    </Paper>
  );
};

export default ShelterMap; 