// auth.ts

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export const authApi = {
  login: async (data: Record<string, unknown>) => {
    // In a real implementation this hits the backend
    // return api.post<{ user: User; token: string }>('/auth/login', data);
    
    // Simulate API delay and success for development
    return new Promise<{ user: User; token: string }>((resolve, reject) => {
      setTimeout(() => {
        if (data.email === 'test@example.com' && data.password === 'password') {
          resolve({
            user: { id: '1', name: 'Test User', email: 'test@example.com' },
            token: 'mock-jwt-token'
          });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  },
  
  signup: async (data: Record<string, unknown>) => {
    // return api.post<{ user: User; token: string }>('/auth/signup', data);
    return new Promise<{ user: User; token: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          user: { id: '2', name: data.name as string, email: data.email as string },
          token: 'mock-jwt-token'
        });
      }, 1000);
    });
  },

  logout: async () => {
    // return api.post('/auth/logout');
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
