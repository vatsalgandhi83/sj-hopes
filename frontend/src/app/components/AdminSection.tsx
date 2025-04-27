// src/components/AdminSection.tsx
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import PetsIcon from '@mui/icons-material/Pets';
import GroupIcon from '@mui/icons-material/Group';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

const API = '/api/admin/analytics';

const statCard = (icon: React.ReactNode, label: string, value: string | number, color: string) => (
  <Paper sx={{ p: 3, borderRadius: 3, textAlign: 'center', background: color, color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }} elevation={3}>
    <Box sx={{ fontSize: 40 }}>{icon}</Box>
    <Typography variant="h6">{label}</Typography>
    <Typography variant="h4" fontWeight={700}>{value}</Typography>
  </Paper>
);

const AdminSection: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskSummary, setTaskSummary] = useState<any>(null);
  const [shelterSummary, setShelterSummary] = useState<any>(null);
  const [shelterTypes, setShelterTypes] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const [taskRes, shelterSummaryRes, shelterTypesRes] = await Promise.all([
        axios.get(`${API}/task-summary`),
        axios.get(`${API}/shelter-summary`),
        axios.get(`${API}/shelter-types`),
      ]);
      setTaskSummary(taskRes.data);
      setShelterSummary(shelterSummaryRes.data);
      setShelterTypes(shelterTypesRes.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 6 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      <Typography variant="h4" fontWeight={700} color="text.primary" mb={4}>
        Admin Analytics Dashboard
      </Typography>

      {/* Task Summary Cards */}
      <Typography variant="h6" fontWeight={600} mb={2} color="text.secondary">
        Task Overview
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          {statCard(<AssignmentIcon />, 'Total Tasks', taskSummary?.totalTasks ?? '-', '#1976d2')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {statCard(<AssignmentLateIcon />, 'Open Tasks', taskSummary?.openTasks ?? '-', '#ffa000')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {statCard(<AssignmentIndIcon />, 'Assigned Tasks', taskSummary?.assignedTasks ?? '-', '#0288d1')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {statCard(<AssignmentTurnedInIcon />, 'Completed Tasks', taskSummary?.completedTasks ?? '-', '#43a047')}
        </Grid>
      </Grid>

      {/* Shelter Summary Cards */}
      <Typography variant="h6" fontWeight={600} mb={2} color="text.secondary">
        Shelter Overview
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          {statCard(<HomeWorkIcon />, 'Total Shelters', shelterSummary?.totalShelters ?? '-', '#1976d2')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {statCard(<CheckCircleIcon />, 'Active Shelters', shelterSummary?.activeShelters ?? '-', '#43a047')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {statCard(<ErrorOutlineIcon />, 'Inactive Shelters', shelterSummary?.inactiveShelters ?? '-', '#d32f2f')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {statCard(<GroupIcon />, 'Total Capacity', shelterSummary?.totalCapacity ?? '-', '#0288d1')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {statCard(<GroupIcon />, 'Current Availability', shelterSummary?.currentAvailability ?? '-', '#ffa000')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {statCard(<GroupIcon />, 'Occupancy Rate', shelterSummary?.overallOccupancyRate ?? '-', '#7b1fa2')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {statCard(<PetsIcon />, 'Shelters Allowing Pets', shelterSummary?.sheltersAllowingPets ?? '-', '#8d6e63')}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {statCard(<GroupIcon />, 'Shelters Allowing Partners', shelterSummary?.sheltersAllowingPartners ?? '-', '#00897b')}
        </Grid>
      </Grid>

      {/* Shelter Types Table */}
      <Typography variant="h5" fontWeight={600} mt={6} mb={2}>
        Shelter Types Breakdown
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Shelter Type</TableCell>
              <TableCell>Count</TableCell>
              <TableCell>Total Capacity</TableCell>
              <TableCell>Current Availability</TableCell>
              <TableCell>Occupancy Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shelterTypes.map((row: any) => (
              <TableRow key={row.shelterType}>
                <TableCell>{row.shelterType}</TableCell>
                <TableCell>{row.shelterCount}</TableCell>
                <TableCell>{row.totalCapacity}</TableCell>
                <TableCell>{row.currentAvailability}</TableCell>
                <TableCell>
                  {row.occupancyRate !== undefined ? row.occupancyRate : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminSection;