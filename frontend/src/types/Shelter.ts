export type ShelterType =
  | 'CONGREGATE'
  | 'TINY_HOME'
  | 'SAFE_PARKING'
  | 'MOTEL_CONVERSION'
  | 'NAVIGATION_CENTER'
  | 'OTHER';

export interface Shelter {
  id: number;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  totalCapacity: number;
  currentAvailability: number;
  shelterType?: ShelterType;
  phone?: string;
  email?: string;
  operatingOrganization?: string;
  description?: string;
  allowsPets?: boolean;
  allowsPartner?: boolean;
  lastUpdated?: string;
  isActive?: boolean;
} 