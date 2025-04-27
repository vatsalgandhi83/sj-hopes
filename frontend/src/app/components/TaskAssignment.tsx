import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { Task } from '../../api/tasks';

interface TaskAssignmentProps {
  tasks: Task[];
  clients: Array<{
    id: string;
    name: string;
    currentShelter?: string;
  }>;
  onAssignTask: (taskId: string, clientId: string) => void;
}

const TaskAssignment: React.FC<TaskAssignmentProps> = ({
  tasks,
  clients,
  onAssignTask
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleAssign = () => {
    if (selectedTask && selectedClient) {
      onAssignTask(selectedTask.id, selectedClient);
      setIsDialogOpen(false);
      setSelectedTask(null);
      setSelectedClient('');
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedTask(null);
    setSelectedClient('');
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Available Tasks
      </Typography>
      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                  cursor: 'pointer'
                }
              }}
              onClick={() => handleTaskClick(task)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {task.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {task.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={`${task.duration} hours`}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`$${task.compensation}`}
                    size="small"
                    color="primary"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Location: {task.location}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {task.requiredSkills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTaskClick(task);
                  }}
                >
                  Assign Task
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={isDialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Task</DialogTitle>
        <DialogContent>
          {selectedTask && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedTask.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedTask.description}
              </Typography>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Select Client</InputLabel>
                <Select
                  value={selectedClient}
                  label="Select Client"
                  onChange={(e) => setSelectedClient(e.target.value)}
                >
                  {clients.map((client) => (
                    <MenuItem
                      key={client.id}
                      value={client.id}
                      disabled={!client.currentShelter}
                    >
                      {client.name}
                      {!client.currentShelter && ' (Not assigned to a shelter)'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleAssign}
            variant="contained"
            disabled={!selectedClient}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskAssignment; 