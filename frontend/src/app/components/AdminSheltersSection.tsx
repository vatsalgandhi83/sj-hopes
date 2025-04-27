import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Chip,
  IconButton
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { shelterService, Shelter, ShelterType } from '../../api/shelters';
import AddShelterModal from './AddShelterModal';

const AdminSheltersSection: React.FC = () => {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [petsFilter, setPetsFilter] = useState('ALL');
  const [partnerFilter, setPartnerFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingShelter, setEditingShelter] = useState<Shelter | null>(null);

  useEffect(() => {
    fetchShelters();
  }, []);

  const fetchShelters = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await shelterService.getAllShelters();
      setShelters(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load shelters');
    } finally {
      setLoading(false);
    }
  };

  // Filtering logic
  const filteredShelters = shelters.filter((shelter) => {
    const matchesSearch =
      !searchTerm ||
      shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shelter.city && shelter.city.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !typeFilter || shelter.shelterType === typeFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && shelter.active) ||
      (statusFilter === 'INACTIVE' && !shelter.active);
    const matchesPets =
      petsFilter === 'ALL' ||
      (petsFilter === 'YES' && shelter.allowsPets) ||
      (petsFilter === 'NO' && !shelter.allowsPets);
    const matchesPartners =
      partnerFilter === 'ALL' ||
      (partnerFilter === 'YES' && shelter.allowsPartner) ||
      (partnerFilter === 'NO' && !shelter.allowsPartner);
    return matchesSearch && matchesType && matchesStatus && matchesPets && matchesPartners;
  });

  const handleAddClick = () => {
    setEditingShelter(null);
    setModalOpen(true);
  };

  const handleEditClick = (shelter: Shelter) => {
    setEditingShelter(shelter);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchShelters();
    setModalOpen(false);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} mb={3} spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Manage Shelters
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Add Shelter
        </Button>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        <TextField
          label="Search by name or city"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ width: 250 }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Type</InputLabel>
          <Select value={typeFilter} label="Type" onChange={(e) => setTypeFilter(e.target.value)}>
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="CONGREGATE">Congregate</MenuItem>
            <MenuItem value="TINY_HOME">Tiny Home</MenuItem>
            <MenuItem value="SAFE_PARKING">Safe Parking</MenuItem>
            <MenuItem value="MOTEL_CONVERSION">Motel Conversion</MenuItem>
            <MenuItem value="NAVIGATION_CENTER">Navigation Center</MenuItem>
            <MenuItem value="OTHER">Other</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="INACTIVE">Inactive</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Pets</InputLabel>
          <Select value={petsFilter} label="Pets" onChange={(e) => setPetsFilter(e.target.value)}>
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="YES">Yes</MenuItem>
            <MenuItem value="NO">No</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Partners</InputLabel>
          <Select value={partnerFilter} label="Partners" onChange={(e) => setPartnerFilter(e.target.value)}>
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="YES">Yes</MenuItem>
            <MenuItem value="NO">No</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Pets</TableCell>
              <TableCell>Partners</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredShelters.map((shelter) => (
              <TableRow key={shelter.id}>
                <TableCell>{shelter.name}</TableCell>
                <TableCell>{shelter.shelterType}</TableCell>
                <TableCell>{shelter.city}</TableCell>
                <TableCell>
                  <Chip label={shelter.active ? 'Active' : 'Inactive'} color={shelter.active ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={shelter.allowsPets ? 'Yes' : 'No'} color={shelter.allowsPets ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={shelter.allowsPartner ? 'Yes' : 'No'} color={shelter.allowsPartner ? 'success' : 'default'} size="small" />
                </TableCell>
                <TableCell>{shelter.totalCapacity}</TableCell>
                <TableCell>{shelter.currentAvailability}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(shelter)} color="primary">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddShelterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
        shelter={editingShelter}
      />
    </Box>
  );
};

export default AdminSheltersSection; 