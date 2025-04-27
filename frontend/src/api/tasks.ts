import { Task } from '../types/Task';

const API_BASE = 'http://localhost:8080/api/tasks'; // Change to your backend URL if needed

export async function getAllTasks(params?: {
  status?: string;
  clientId?: string;
}): Promise<Task[]> {
  const url = new URL(API_BASE);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.append(key, String(value));
    });
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
} 