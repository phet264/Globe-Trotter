// auth.ts

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

const BASE_URL = 'http://localhost:3001/api/v1';

export const authApi = {
  login: async (data: Record<string, unknown>) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Login failed');
    return { user: json.data.user, token: json.data.token };
  },
  
  signup: async (data: Record<string, unknown>) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Signup failed');
    return { user: json.data.user, token: json.data.token };
  },

  logout: async () => {
    // Just mock logout on the frontend for now, clearing the local token
    return new Promise<void>((resolve) => setTimeout(resolve, 500));
  },

  forgotPassword: async (_data: { email: string }) => {
    // return api.post('/auth/forgot-password', data);
    return new Promise<void>((resolve) => setTimeout(resolve, 1000));
  },

  resetPassword: async (_data: Record<string, unknown>) => {
    // return api.post('/auth/reset-password', data);
    return new Promise<void>((resolve) => setTimeout(resolve, 1000));
  }
};
