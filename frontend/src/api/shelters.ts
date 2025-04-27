import axiosInstance from './axiosConfig';

export type ShelterType = 'CONGREGATE' | 'TINY_HOME' | 'SAFE_PARKING' | 'MOTEL_CONVERSION' | 'NAVIGATION_CENTER' | 'OTHER';

export interface Shelter {
  id: string;
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
  active?: boolean;
  lastUpdated?: string;
}

export interface CreateShelterDto {
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
  isActive?: boolean;
}

export interface ShelterSearchParams {
  shelterType?: ShelterType;
  allowsPartner?: boolean;
  isActive?: boolean;
  allowsPets?: boolean;
}

export interface ShelterReserveRequestDto {
  clientId: string;
}

export interface ShelterSummaryDto {
  totalShelters?: number;
  activeShelters?: number;
  inactiveShelters?: number;
  totalCapacity?: number;
  currentAvailability?: number;
  overallOccupancyRate?: number;
  sheltersAllowingPets?: number;
  sheltersAllowingPartners?: number;
}

export interface ShelterTypeSummaryDto {
  shelterType?: ShelterType;
  shelterCount?: number;
  totalCapacity?: number;
  currentAvailability?: number;
  occupancyRate?: number;
}

export const shelterService = {
  async getAllShelters(): Promise<Shelter[]> {
    const response = await axiosInstance.get('/api/shelters');
    return response.data;
  },

  async getShelterById(id: string): Promise<Shelter> {
    const response = await axiosInstance.get(`/api/shelters/${id}`);
    return response.data;
  },

  async searchShelters(params: ShelterSearchParams): Promise<Shelter[]> {
    const response = await axiosInstance.get('/api/shelters/search', { params });
    return response.data;
  },

  async createShelter(shelter: CreateShelterDto): Promise<Shelter> {
    const response = await axiosInstance.post('/api/admin/shelters', shelter);
    return response.data;
  },

  async updateShelter(id: string, shelter: Partial<CreateShelterDto>): Promise<Shelter> {
    const response = await axiosInstance.put(`/api/admin/shelters/${id}`, shelter);
    return response.data;
  },

  async deleteShelter(id: string): Promise<void> {
    await axiosInstance.delete(`/api/admin/shelters/${id}`);
  },

  async reserveBed(shelterId: string, clientId: string): Promise<void> {
    await axiosInstance.post(`/api/shelters/${shelterId}/reserve`, { clientId });
  },

  async getShelterSummary(): Promise<ShelterSummaryDto> {
    const response = await axiosInstance.get('/api/admin/analytics/shelter-summary');
    return response.data;
  },

  async getShelterTypesSummary(): Promise<ShelterTypeSummaryDto[]> {
    const response = await axiosInstance.get('/api/admin/analytics/shelter-types');
    return response.data;
  }
}; 