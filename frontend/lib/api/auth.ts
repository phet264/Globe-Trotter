// auth.ts

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

const BASE_URL = '/api/v1';

export const authApi = {
  login: async (data: Record<string, unknown>) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Login failed');
    return { user: json.data.user };
  },
  
  signup: async (data: Record<string, unknown>) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Signup failed');
    return { user: json.data.user };
  },

  logout: async () => {
    await fetch(`${BASE_URL}/auth/logout`, { method: 'POST' });
  },
  
  me: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`);
    const json = await res.json();
    if (!res.ok) throw new Error('Not authenticated');
    return { user: json.data.user };
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
