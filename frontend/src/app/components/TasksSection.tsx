// src/components/TasksSection.tsx
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { getAllTasks } from '../../api/tasks';
import { Task } from '../../types/Task';

const TasksSection: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      <Typography variant="h4" fontWeight={700} color="text.primary" mb={3}>
        Work Opportunities
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={2}>
        Assign micro-tasks to clients
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          {tasks.map((task) => (
            <Paper key={task.id} sx={{ p: 2, borderRadius: 2 }} elevation={2}>
              <Typography variant="h6" fontWeight={600}>{task.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {task.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {task.status}
                {task.location && ` | Location: ${task.location}`}
              </Typography>
              {task.estimatedDuration && <Typography variant="body2">Duration: {task.estimatedDuration}</Typography>}
              {task.compensationDetails && <Typography variant="body2">Compensation: {task.compensationDetails}</Typography>}
              {task.taskContactName && <Typography variant="body2">Contact: {task.taskContactName}</Typography>}
              {task.taskContactPhone && <Typography variant="body2">Phone: {task.taskContactPhone}</Typography>}
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};
export default TasksSection;