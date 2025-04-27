import axiosInstance from './axiosConfig';

export type ClientStatus = 'SEEKING_PLACEMENT' | 'SHELTERED' | 'INACTIVE' | 'PERMANENTLY_HOUSED';

export interface Client {
  id?: string;
  name: string;
  pseudonym?: string;
  status?: ClientStatus;
  currentShelterId?: string;
  currentShelterName?: string;
  registrationDate?: string;
  lastActivityDate?: string;
  caseworkerNotes?: string;
}

export interface CreateClientDto {
  name: string;
  caseworkerNotes?: string;
}

export const clientService = {
  async getAllClients(): Promise<Client[]> {
    const response = await axiosInstance.get('/api/clients');
    return response.data;
  },

  async getClientById(id: string): Promise<Client> {
    const response = await axiosInstance.get(`/api/clients/${id}`);
    return response.data;
  },

  async createClient(client: CreateClientDto): Promise<Client> {
    const response = await axiosInstance.post('/api/clients', client);
    return response.data;
  }
}; 