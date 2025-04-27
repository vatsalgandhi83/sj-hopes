'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Alert,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { taskService, Task, TaskStatus } from '../../api/tasks';

const initialState = {
  title: '',
  description: '',
  location: '',
  status: 'OPEN' as TaskStatus,
  taskDateTime: '',
  estimatedDuration: '',
  compensationDetails: '',
  taskContactName: '',
  taskContactPhone: ''
};

interface FormErrors {
  title?: string;
  description?: string;
  location?: string;
  taskDateTime?: string;
  estimatedDuration?: string;
  compensationDetails?: string;
  taskContactName?: string;
  taskContactPhone?: string;
}

interface AddOpportunityModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task?: Task | null;
}

const AddOpportunityModal: React.FC<AddOpportunityModalProps> = ({ open, onClose, onSuccess, task }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        location: task.location || '',
        status: task.status || 'OPEN',
        taskDateTime: task.taskDateTime || '',
        estimatedDuration: task.estimatedDuration || '',
        compensationDetails: task.compensationDetails || '',
        taskContactName: task.taskContactName || '',
        taskContactPhone: task.taskContactPhone || ''
      });
    } else {
      setForm(initialState);
    }
  }, [task]);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'title':
        return value.trim().length < 2 ? 'Title must be at least 2 characters' : undefined;
      case 'description':
        return value.trim().length < 10 ? 'Description must be at least 10 characters' : undefined;
      case 'location':
        return value.trim().length < 2 ? 'Location must be at least 2 characters' : undefined;
      case 'taskDateTime':
        if (!value) return undefined;
        const date = new Date(value);
        return isNaN(date.getTime()) ? 'Invalid date/time format' : undefined;
      case 'estimatedDuration':
        return value.trim().length < 2 ? 'Please specify duration' : undefined;
      case 'compensationDetails':
        return value.trim().length < 2 ? 'Please specify compensation details' : undefined;
      case 'taskContactName':
        return value.trim().length < 2 ? 'Contact name must be at least 2 characters' : undefined;
      case 'taskContactPhone':
        if (!value) return undefined;
        return !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)
          ? 'Invalid phone number format'
          : undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm((prev) => ({ ...prev, [name!]: value }));

    if (name) {
      const error = validateField(name, value);
      setFormErrors((prev) => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const validate = () => {
    const errors: FormErrors = {};
    let isValid = true;

    const requiredFields = ['title', 'description', 'location', 'estimatedDuration', 'compensationDetails', 'taskContactName'];
    requiredFields.forEach((key) => {
      const error = validateField(key, form[key as keyof typeof form] as string);
      if (error) {
        errors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    const optionalFields = ['taskDateTime', 'taskContactPhone'];
    optionalFields.forEach((key) => {
      const value = form[key as keyof typeof form] as string;
      if (value) {
        const error = validateField(key, value);
        if (error) {
          errors[key as keyof FormErrors] = error;
          isValid = false;
        }
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const taskData = {
        ...form,
        taskDateTime: form.taskDateTime || null
      };

      if (task) {
        await taskService.updateTask(task.id, taskData);
      } else {
        await taskService.createTask(taskData);
      }

      onSuccess();
      onClose();
      setForm(initialState);
    } catch (err: any) {
      setError(err.message || `Failed to ${task ? 'update' : 'add'} task`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              fullWidth
              error={!!formErrors.title}
              helperText={formErrors.title}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={3}
              error={!!formErrors.description}
              helperText={formErrors.description}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              fullWidth
              error={!!formErrors.location}
              helperText={formErrors.location}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date/Time"
              name="taskDateTime"
              value={form.taskDateTime}
              onChange={handleChange}
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!formErrors.taskDateTime}
              helperText={formErrors.taskDateTime}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Estimated Duration"
              name="estimatedDuration"
              value={form.estimatedDuration}
              onChange={handleChange}
              required
              fullWidth
              error={!!formErrors.estimatedDuration}
              helperText={formErrors.estimatedDuration}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Compensation Details"
              name="compensationDetails"
              value={form.compensationDetails}
              onChange={handleChange}
              required
              fullWidth
              error={!!formErrors.compensationDetails}
              helperText={formErrors.compensationDetails}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact Name"
              name="taskContactName"
              value={form.taskContactName}
              onChange={handleChange}
              required
              fullWidth
              error={!!formErrors.taskContactName}
              helperText={formErrors.taskContactName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact Phone"
              name="taskContactPhone"
              value={form.taskContactPhone}
              onChange={handleChange}
              fullWidth
              placeholder="(123) 456-7890"
              error={!!formErrors.taskContactPhone}
              helperText={formErrors.taskContactPhone}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={form.status}
                onChange={handleChange}
                label="Status"
                disabled={!task}
              >
                <MenuItem value="OPEN">Open</MenuItem>
                <MenuItem value="ASSIGNED">Assigned</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? (task ? 'Updating...' : 'Adding...') : (task ? 'Update Task' : 'Add Task')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddOpportunityModal; 