'use client';

import React, { useState, useEffect } from 'react';
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
import { taskService, Task, TaskStatus } from '../../api/tasks';
import AddOpportunityModal from './AddOpportunityModal';

const AdminOpportunitiesSection: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Filtering logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      !searchTerm ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === 'ALL' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddClick = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchTasks();
    setModalOpen(false);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} mb={3} spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Manage Work Opportunities
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddClick}>
          Add Opportunity
        </Button>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        <TextField
          label="Search by title or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ width: 250 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'ALL')}>
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="OPEN">Open</MenuItem>
            <MenuItem value="ASSIGNED">Assigned</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Date/Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Compensation</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.location}</TableCell>
                <TableCell>{task.taskDateTime ? new Date(task.taskDateTime).toLocaleString() : 'Flexible'}</TableCell>
                <TableCell>{task.estimatedDuration}</TableCell>
                <TableCell>{task.compensationDetails}</TableCell>
                <TableCell>
                  <Chip
                    label={task.status}
                    color={
                      task.status === 'COMPLETED' ? 'success' :
                      task.status === 'ASSIGNED' ? 'warning' :
                      'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(task)} color="primary">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddOpportunityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
        task={editingTask}
      />
    </Box>
  );
};

export default AdminOpportunitiesSection; 