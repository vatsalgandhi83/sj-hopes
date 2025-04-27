export type TaskStatus = 'OPEN' | 'ASSIGNED' | 'COMPLETED';

export interface Task {
  id: number;
  title: string;
  description?: string;
  location?: string;
  status: TaskStatus;
  clientId?: string;
  lastUpdated: string;
  taskDateTime?: string;
  estimatedDuration?: string;
  compensationDetails?: string;
  taskContactName?: string;
  taskContactPhone?: string;
} 