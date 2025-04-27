import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { clientService, type Client, type ClientStatus } from '../../api/clients';
import { shelterService, type Shelter } from '../../api/shelters';

interface ClientRegistrationProps {
  onClientRegistered: (client: Client) => void;
}

const ClientRegistration: React.FC<ClientRegistrationProps> = ({ onClientRegistered }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    pseudonym: '',
    caseworkerNotes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const newClient = await clientService.createClient({
        name: formData.name,
        caseworkerNotes: formData.caseworkerNotes
      });
      setSuccess(true);
      onClientRegistered(newClient);
      setFormData({ name: '', pseudonym: '', caseworkerNotes: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" fontWeight={600} mb={3}>
        Register New Client
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Client registered successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Client Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Pseudonym (Optional)"
              value={formData.pseudonym}
              onChange={(e) => setFormData({ ...formData, pseudonym: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Caseworker Notes"
              multiline
              rows={4}
              value={formData.caseworkerNotes}
              onChange={(e) => setFormData({ ...formData, caseworkerNotes: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Register Client'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ClientRegistration; 