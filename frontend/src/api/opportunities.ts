import axios from 'axios';

export type OpportunityType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'VOLUNTEER';

export interface WorkOpportunity {
  id: string;
  title: string;
  description: string;
  type: OpportunityType;
  organization: string;
  location: string;
  requirements: string;
  salary?: number;
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOpportunityDto {
  title: string;
  description: string;
  type: OpportunityType;
  organization: string;
  location: string;
  requirements: string;
  salary?: number;
  contactEmail?: string;
  contactPhone?: string;
  isActive?: boolean;
}

export interface UpdateOpportunityDto extends Partial<CreateOpportunityDto> {}

class OpportunityService {
  private baseUrl = '/api/opportunities';

  async getAllOpportunities(): Promise<WorkOpportunity[]> {
    const response = await axios.get<WorkOpportunity[]>(this.baseUrl);
    return response.data;
  }

  async getOpportunityById(id: string): Promise<WorkOpportunity> {
    const response = await axios.get<WorkOpportunity>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createOpportunity(data: CreateOpportunityDto): Promise<WorkOpportunity> {
    const response = await axios.post<WorkOpportunity>(this.baseUrl, data);
    return response.data;
  }

  async updateOpportunity(id: string, data: UpdateOpportunityDto): Promise<WorkOpportunity> {
    const response = await axios.patch<WorkOpportunity>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteOpportunity(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}

export const opportunityService = new OpportunityService(); 