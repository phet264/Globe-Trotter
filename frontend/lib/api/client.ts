export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    requestId?: string;
  };
}

export class ApiError extends Error {
  code: string;
  requestId?: string;

  constructor(message: string, code: string, requestId?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.requestId = requestId;
  }
}

interface RequestOptions extends RequestInit {
  timeout?: number;
  params?: Record<string, string>;
}

export async function fetchApi<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { timeout = 8000, params, ...customConfig } = options;
  const config: RequestInit = {
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...customConfig.headers,
    },
  };

  const url = new URL(`/api${endpoint}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  config.signal = controller.signal;

  try {
    const response = await fetch(url.toString(), config);
    clearTimeout(id);

    const result: ApiResponse<T> = await response.json();

    if (!response.ok || !result.success) {
      throw new ApiError(
        result.error?.message || 'An unknown error occurred',
        result.error?.code || 'UNKNOWN_ERROR',
        result.error?.requestId
      );
    }

    return result.data as T;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timed out', 'TIMEOUT');
    }
    throw new ApiError('Network error', 'NETWORK_ERROR');
  }
}

export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, data?: unknown, options?: Omit<RequestOptions, 'method'>) =>
    fetchApi<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  patch: <T>(endpoint: string, data?: unknown, options?: Omit<RequestOptions, 'method'>) =>
    fetchApi<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};
