import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Chip
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { clientService, type Client, type ClientStatus } from '../../api/clients';
import { shelterService, type Shelter } from '../../api/shelters';
import ClientRegistrationModal from './ClientRegistrationModal';

const getStatusColor = (status: ClientStatus | undefined) => {
  switch (status) {
    case 'SEEKING_PLACEMENT':
      return 'warning'; // Orange
    case 'SHELTERED':
      return 'success'; // Green
    case 'INACTIVE':
      return 'error'; // Red
    case 'PERMANENTLY_HOUSED':
      return 'info'; // Blue
    default:
      return 'default';
  }
};

// Helper function
const formatToYyyyMmDd = (isoDateTimeString: string | null | undefined): string => {
  if (!isoDateTimeString || isoDateTimeString.length < 10) {
    return 'N/A'; // Handle null, undefined, or too short string
  }
  // Take the first 10 characters
  return isoDateTimeString.substring(0, 10);
};


const ClientManagement: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedShelter, setSelectedShelter] = useState<string>('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'ALL'>('ALL');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clientsData, sheltersData] = await Promise.all([
        clientService.getAllClients(),
        shelterService.getAllShelters()
      ]);
      setClients(clientsData);
      setShelters(sheltersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignClick = (client: Client) => {
    setSelectedClient(client);
    setSelectedShelter(client.currentShelterId || '');
    setIsAssignDialogOpen(true);
  };

  const handleAssignSubmit = async () => {
    if (!selectedClient?.id || !selectedShelter) return;

    try {
      await shelterService.reserveBed(selectedShelter, selectedClient.id);
      await fetchData(); // Refresh data
      setIsAssignDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign shelter');
    }
  };

  const handleClientRegistered = async () => {
    setIsRegisterDialogOpen(false);
    await fetchData(); // Refresh data
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.currentShelterName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Client Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsRegisterDialogOpen(true)}
        >
          Register New Client
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          }}
        />
        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value as ClientStatus | 'ALL')}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="SEEKING_PLACEMENT">Seeking Placement</MenuItem>
            <MenuItem value="SHELTERED">Sheltered</MenuItem>
            <MenuItem value="INACTIVE">Inactive</MenuItem>
            <MenuItem value="PERMANENTLY_HOUSED">Permanently Housed</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Current Shelter</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={client.status || 'SEEKING_PLACEMENT'}
                    color={getStatusColor(client.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{client.currentShelterName || 'Not Assigned'}</TableCell>
                <TableCell>{formatToYyyyMmDd(client.registrationDate) || 'N/A'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleAssignClick(client)}
                    disabled={client.status === 'PERMANENTLY_HOUSED'}
                  >
                    Assign Shelter
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isAssignDialogOpen} onClose={() => setIsAssignDialogOpen(false)}>
        <DialogTitle>Assign Shelter</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Shelter</InputLabel>
            <Select
              value={selectedShelter}
              label="Select Shelter"
              onChange={(e) => setSelectedShelter(e.target.value)}
            >
              {shelters.map((shelter) => (
                <MenuItem 
                  key={shelter.id} 
                  value={shelter.id}
                  disabled={shelter.currentAvailability === 0}
                >
                  {shelter.name} ({shelter.currentAvailability} beds available)
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAssignDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAssignSubmit}
            variant="contained"
            disabled={!selectedShelter}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      <ClientRegistrationModal
        open={isRegisterDialogOpen}
        onClose={() => setIsRegisterDialogOpen(false)}
        onSuccess={handleClientRegistered}
      />
    </Box>
  );
};

export default ClientManagement; 