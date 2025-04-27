// src/components/TasksSection.tsx
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { taskService, Task } from '../../api/tasks';
import { clientService, Client } from '../../api/clients';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'OPEN':
      return 'warning';
    case 'ASSIGNED':
      return 'info';
    case 'COMPLETED':
      return 'success';
    default:
      return 'default';
  }
};

const TasksSection: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [completeError, setCompleteError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchTasksAndClients();
  }, []);

  const fetchTasksAndClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, clientsData] = await Promise.all([
        taskService.getAllTasks(),
        clientService.getAllClients()
      ]);
      setTasks(tasksData);
      setClients(clientsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openAssignDialog = (task: Task) => {
    setSelectedTask(task);
    setAssignError(null);
    setAssignDialogOpen(true);
  };

  const handleAssign = async () => {
    if (!selectedTask || !selectedClientId) return;
    setAssignLoading(true);
    setAssignError(null);
    try {
      await taskService.assignTask(selectedTask.id.toString(), selectedClientId);
      setAssignDialogOpen(false);
      setSelectedClientId('');
      fetchTasksAndClients();
    } catch (err: any) {
      setAssignError('Failed to assign task');
    } finally {
      setAssignLoading(false);
    }
  };

  const handleComplete = async (task: Task) => {
    setCompleteLoading(true);
    setCompleteError(null);
    try {
      await taskService.completeTask(task.id.toString());
      fetchTasksAndClients();
    } catch (err: any) {
      setCompleteError('Failed to complete task');
    } finally {
      setCompleteLoading(false);
    }
  };

  const getAssigneeName = (clientId?: string) => {
    if (!clientId) return <em>Unassigned</em>;
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : <em>Unknown</em>;
  };

  // Filtering logic
  const filteredTasks = tasks.filter((task) => {
    const statusMatch = statusFilter === 'ALL' || task.status === statusFilter;
    const assigneeMatch =
      assigneeFilter === 'ALL' ||
      (assigneeFilter === 'UNASSIGNED' && !task.clientId) ||
      (assigneeFilter !== 'ALL' && assigneeFilter !== 'UNASSIGNED' && task.clientId === assigneeFilter);
    return statusMatch && assigneeMatch;
  });

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      <Typography variant="h4" fontWeight={700} color="text.primary" mb={3}>
        Work Opportunities
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={2}>
        Assign micro-tasks to clients
      </Typography>
      {/* Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="OPEN">Open</MenuItem>
            <MenuItem value="ASSIGNED">Assigned</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Assignee</InputLabel>
          <Select
            value={assigneeFilter}
            label="Assignee"
            onChange={(e) => setAssigneeFilter(e.target.value)}
          >
            <MenuItem value="ALL">All Assignees</MenuItem>
            <MenuItem value="UNASSIGNED">Unassigned</MenuItem>
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {completeError && <Alert severity="error">{completeError}</Alert>}
      {!loading && !error && (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          {filteredTasks.map((task) => (
            <Paper key={task.id} sx={{ p: 2, borderRadius: 2 }} elevation={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" fontWeight={600}>{task.title}</Typography>
                <Chip label={task.status} color={getStatusColor(task.status)} size="small" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {task.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {task.location && `Location: ${task.location}`}
              </Typography>
              {task.estimatedDuration && <Typography variant="body2">Duration: {task.estimatedDuration}</Typography>}
              {task.compensationDetails && <Typography variant="body2">Compensation: {task.compensationDetails}</Typography>}
              {task.taskContactName && <Typography variant="body2">Contact: {task.taskContactName}</Typography>}
              {task.taskContactPhone && <Typography variant="body2">Phone: {task.taskContactPhone}</Typography>}
              <Typography variant="body2" sx={{ mt: 1 }}>
                Assignee: {getAssigneeName(task.clientId)}
              </Typography>
              {/* Action Buttons by Status */}
              {task.status === 'OPEN' && (
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={() => openAssignDialog(task)}
                >
                  Assign
                </Button>
              )}
              {task.status === 'ASSIGNED' && (
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleComplete(task)}
                    disabled={completeLoading}
                  >
                    {completeLoading ? 'Completing...' : 'Complete'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="info"
                    size="small"
                    onClick={() => openAssignDialog(task)}
                  >
                    Switch Assignee
                  </Button>
                </Box>
              )}
            </Paper>
          ))}
        </Box>
      )}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)}>
        <DialogTitle>Assign Task</DialogTitle>
        <DialogContent>
          {assignError && <Alert severity="error">{assignError}</Alert>}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Client</InputLabel>
            <Select
              value={selectedClientId}
              label="Select Client"
              onChange={(e) => setSelectedClientId(e.target.value)}
            >
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAssign}
            variant="contained"
            disabled={!selectedClientId || assignLoading}
          >
            {assignLoading ? 'Assigning...' : 'Assign'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default TasksSection;