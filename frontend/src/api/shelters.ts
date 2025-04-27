import { Shelter } from '../types/Shelter';

const API_BASE = 'http://localhost:8080/api/shelters'; // Change to your backend URL if needed

export async function getAllShelters(params?: {
  type?: string;
  city?: string;
  state?: string;
  available?: boolean;
}): Promise<Shelter[]> {
  const url = new URL(API_BASE);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.append(key, String(value));
    });
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch shelters');
  return res.json();
} 