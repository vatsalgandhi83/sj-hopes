import axios from 'axios';

export type TaskStatus = 'OPEN' | 'ASSIGNED' | 'COMPLETED';

export interface Task {
  id: number;
  title: string;
  description: string;
  location: string;
  status: TaskStatus;
  clientId: number | null;
  lastUpdated: string;
  taskDateTime: string | null;
  estimatedDuration: string;
  compensationDetails: string;
  taskContactName: string;
  taskContactPhone: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  location: string;
  taskDateTime: string | null;
  estimatedDuration: string;
  compensationDetails: string;
  taskContactName: string;
  taskContactPhone: string;
}

export interface UpdateTaskDto {
  title: string;
  description: string;
  location: string;
  taskDateTime: string | null;
  estimatedDuration: string;
  compensationDetails: string;
  taskContactName: string;
  taskContactPhone: string;
}

export interface TaskAssignRequestDto {
  clientId: string;
}

export interface TaskSummaryDto {
  totalTasks: number;
  openTasks: number;
  assignedTasks: number;
  completedTasks: number;
  averageCompletionTime: string;
}

class TaskService {
  private baseUrl = '/api/tasks';
  private adminBaseUrl = '/api/admin/tasks';

  async getAllTasks(): Promise<Task[]> {
    const response = await axios.get<Task[]>(this.baseUrl);
    return response.data;
  }

  async getTaskById(id: number): Promise<Task> {
    const response = await axios.get<Task>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    const response = await axios.post<Task>(this.adminBaseUrl, data);
    return response.data;
  }

  async updateTask(id: number, data: UpdateTaskDto): Promise<Task> {
    const response = await axios.put<Task>(`${this.adminBaseUrl}/${id}`, data);
    return response.data;
  }

  async deleteTask(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }

  async assignTask(taskId: number, clientId: string): Promise<Task> {
    const response = await axios.put<Task>(`${this.baseUrl}/${taskId}/assign`, { clientId });
    return response.data;
  }

  async completeTask(taskId: number): Promise<Task> {
    const response = await axios.put<Task>(`${this.baseUrl}/${taskId}/complete`);
    return response.data;
  }

  async getTaskSummary(): Promise<TaskSummaryDto> {
    const response = await axios.get<TaskSummaryDto>('/api/admin/analytics/task-summary');
    return response.data;
  }
}

export const taskService = new TaskService(); 