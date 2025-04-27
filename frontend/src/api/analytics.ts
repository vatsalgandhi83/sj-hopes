import axiosInstance from './axiosConfig';
import { TaskSummaryDto } from './tasks';
import { ShelterSummaryDto, ShelterTypeSummaryDto } from './shelters';

export const analyticsService = {
  async getTaskSummary(): Promise<TaskSummaryDto> {
    const response = await axiosInstance.get('/api/admin/analytics/task-summary');
    return response.data;
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