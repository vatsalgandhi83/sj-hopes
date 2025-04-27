import axios from 'axios';

const API_URL = 'http://localhost:8081';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'caseworker';
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: 'admin' | 'caseworker';
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    // For hackathon, we'll use mock authentication
    // In production, this would call the actual API
    return new Promise((resolve) => {
      setTimeout(() => {
        if (
          (credentials.role === 'caseworker' && credentials.email === 'demo@example.com' && credentials.password === 'password') ||
          (credentials.role === 'admin' && credentials.email === 'admin@example.com' && credentials.password === 'admin123')
        ) {
          resolve({
            id: '1',
            email: credentials.email,
            role: credentials.role,
            name: credentials.role === 'admin' ? 'Admin User' : 'Case Worker'
          });
        } else {
          throw new Error('Invalid credentials');
        }
      }, 800);
    });
  },

  async logout(): Promise<void> {
    // Clear local storage or session
    localStorage.removeItem('user');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }
}; 