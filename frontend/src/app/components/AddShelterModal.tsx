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
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import { shelterService, ShelterType, Shelter } from '../../api/shelters';

const shelterTypes = [
  'CONGREGATE',
  'TINY_HOME',
  'SAFE_PARKING',
  'MOTEL_CONVERSION',
  'NAVIGATION_CENTER',
  'OTHER'
];

const initialState = {
  name: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: 'CA',
  zipCode: '',
  latitude: '',
  longitude: '',
  totalCapacity: '',
  currentAvailability: '',
  shelterType: '',
  phone: '',
  email: '',
  operatingOrganization: '',
  description: '',
  allowsPets: false,
  allowsPartner: false,
  isActive: true
};

interface AddShelterModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  shelter?: Shelter | null;
}

interface FormErrors {
  name?: string;
  addressLine1?: string;
  city?: string;
  zipCode?: string;
  totalCapacity?: string;
  currentAvailability?: string;
  phone?: string;
  email?: string;
}

const AddShelterModal: React.FC<AddShelterModalProps> = ({ open, onClose, onSuccess, shelter }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validatingAddress, setValidatingAddress] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (shelter) {
      setForm({
        name: shelter.name || '',
        addressLine1: shelter.addressLine1 || '',
        addressLine2: shelter.addressLine2 || '',
        city: shelter.city || '',
        state: shelter.state || 'CA',
        zipCode: shelter.zipCode || '',
        latitude: shelter.latitude?.toString() || '',
        longitude: shelter.longitude?.toString() || '',
        totalCapacity: shelter.totalCapacity?.toString() || '',
        currentAvailability: shelter.currentAvailability?.toString() || '',
        shelterType: shelter.shelterType || '',
        phone: shelter.phone || '',
        email: shelter.email || '',
        operatingOrganization: shelter.operatingOrganization || '',
        description: shelter.description || '',
        allowsPets: shelter.allowsPets || false,
        allowsPartner: shelter.allowsPartner || false,
        isActive: shelter.active || true
      });
    } else {
      setForm(initialState);
    }
  }, [shelter]);

  const validateAddress = async () => {
    if (!form.addressLine1 || !form.city || !form.state || !form.zipCode) {
      setAddressError('Please fill in all address fields');
      return false;
    }

    setValidatingAddress(true);
    setAddressError('');

    try {
      const address = `${form.addressLine1}, ${form.city}, ${form.state} ${form.zipCode}`;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results[0]) {
        const location = data.results[0].geometry.location;
        setForm(prev => ({
          ...prev,
          latitude: location.lat.toString(),
          longitude: location.lng.toString()
        }));
        setAddressError('');
        return true;
      } else {
        setAddressError('Invalid address. Please check and try again.');
        return false;
      }
    } catch (err) {
      setAddressError('Failed to validate address. Please try again.');
      return false;
    } finally {
      setValidatingAddress(false);
    }
  };

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        return value.trim().length < 2 ? 'Name must be at least 2 characters' : undefined;
      case 'addressLine1':
        return value.trim().length < 5 ? 'Address must be at least 5 characters' : undefined;
      case 'city':
        return value.trim().length < 2 ? 'City must be at least 2 characters' : undefined;
      case 'zipCode':
        return !/^\d{5}(-\d{4})?$/.test(value) ? 'Invalid ZIP code format' : undefined;
      case 'totalCapacity':
      case 'currentAvailability':
        if (!value) return 'This field is required';
        if (isNaN(Number(value))) return 'Must be a number';
        if (Number(value) < 0) return 'Must be positive';
        if (name === 'currentAvailability' && Number(value) > Number(form.totalCapacity)) {
          return 'Cannot exceed total capacity';
        }
        return undefined;
      case 'phone':
        if (!value) return undefined;
        return !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)
          ? 'Invalid phone number format'
          : undefined;
      case 'email':
        if (!value) return undefined;
        return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
          ? 'Invalid email format'
          : undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Update form
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name!]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name!]: value }));
    }

    // Validate field
    if (name && type !== 'checkbox') {
      const error = validateField(name, value as string);
      setFormErrors((prev) => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const validate = () => {
    const errors: FormErrors = {};
    let isValid = true;

    // Validate all required fields
    const requiredFields = ['name', 'addressLine1', 'city', 'state', 'zipCode', 'totalCapacity', 'currentAvailability', 'shelterType'];
    requiredFields.forEach((key) => {
      const error = validateField(key, form[key as keyof typeof form] as string);
      if (error) {
        errors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    // Validate optional fields only if they have values
    const optionalFields = ['phone', 'email'];
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
    
    // Validate address and get coordinates
    const isAddressValid = await validateAddress();
    if (!isAddressValid) return;

    setLoading(true);
    try {
      const shelterData = {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        totalCapacity: Number(form.totalCapacity),
        currentAvailability: Number(form.currentAvailability),
        shelterType: form.shelterType as ShelterType
      };

      if (shelter) {
        await shelterService.updateShelter(shelter.id, shelterData);
      } else {
        await shelterService.createShelter(shelterData);
      }

      onSuccess();
      onClose();
      setForm(initialState);
    } catch (err: any) {
      setError(err.message || `Failed to ${shelter ? 'update' : 'add'} shelter`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{shelter ? 'Edit Shelter' : 'Add New Shelter'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Operating Organization"
              name="operatingOrganization"
              value={form.operatingOrganization}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Address Line 1"
              name="addressLine1"
              value={form.addressLine1}
              onChange={handleChange}
              required
              fullWidth
              error={!!formErrors.addressLine1}
              helperText={formErrors.addressLine1}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Address Line 2"
              name="addressLine2"
              value={form.addressLine2}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              fullWidth
              error={!!formErrors.city}
              helperText={formErrors.city}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
              required
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Zip Code"
              name="zipCode"
              value={form.zipCode}
              onChange={handleChange}
              required
              fullWidth
              error={!!formErrors.zipCode}
              helperText={formErrors.zipCode}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Total Capacity"
              name="totalCapacity"
              value={form.totalCapacity}
              onChange={handleChange}
              required
              fullWidth
              type="number"
              inputProps={{ min: 0 }}
              error={!!formErrors.totalCapacity}
              helperText={formErrors.totalCapacity}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Current Availability"
              name="currentAvailability"
              value={form.currentAvailability}
              onChange={handleChange}
              required
              fullWidth
              type="number"
              inputProps={{ min: 0, max: Number(form.totalCapacity) || undefined }}
              error={!!formErrors.currentAvailability}
              helperText={formErrors.currentAvailability}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              fullWidth
              placeholder="(123) 456-7890"
              error={!!formErrors.phone}
              helperText={formErrors.phone}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              placeholder="example@domain.com"
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={2} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Shelter Type"
              name="shelterType"
              value={form.shelterType}
              onChange={handleChange}
              required
              fullWidth
            >
              {shelterTypes.map((type) => (
                <MenuItem key={type} value={type}>{type.replace('_', ' ')}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={<Checkbox checked={form.isActive} onChange={handleChange} name="isActive" />}
              label="Active"
            />
            <FormControlLabel
              control={<Checkbox checked={form.allowsPets} onChange={handleChange} name="allowsPets" />}
              label="Allows Pets"
            />
            <FormControlLabel
              control={<Checkbox checked={form.allowsPartner} onChange={handleChange} name="allowsPartner" />}
              label="Allows Partners"
            />
          </Grid>
        </Grid>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {addressError && <Alert severity="error" sx={{ mt: 2 }}>{addressError}</Alert>}
        {validatingAddress && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography>Validating address...</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || validatingAddress}
        >
          {loading ? (shelter ? 'Updating...' : 'Adding...') : (shelter ? 'Update Shelter' : 'Add Shelter')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddShelterModal; 