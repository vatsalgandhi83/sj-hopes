import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { clientService } from '../../api/clients';
import { shelterService } from '../../api/shelters';
import { Shelter } from '../../api/shelters';

interface ClientRegistrationModalProps {
  open: boolean;
  onClose: () => void;
  shelter?: Shelter;
  onSuccess?: () => void;
}

const ClientRegistrationModal: React.FC<ClientRegistrationModalProps> = ({
  open,
  onClose,
  shelter,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [caseworkerNotes, setCaseworkerNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Register client
      const client = await clientService.createClient({
        name,
        caseworkerNotes
      });

      // Reserve bed if shelter is provided
      if (shelter && client.id) {
        await shelterService.reserveBed(shelter.id, client.id);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError('Failed to register client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Register New Client</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Client Name"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!name}
          helperText={!name ? 'Name is required' : ''}
        />
        <TextField
          margin="dense"
          label="Caseworker Notes"
          fullWidth
          multiline
          rows={4}
          value={caseworkerNotes}
          onChange={(e) => setCaseworkerNotes(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!name || loading}
        >
          {loading ? 'Registering...' : 'Register & Reserve'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientRegistrationModal; 