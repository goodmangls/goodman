const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: HeadersInit = { 'Content-Type': 'application/json', ...(options?.headers || {}) };

  const response = await fetch(`${API_URL}${path}`, { headers, ...options });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    let message = 'Request failed';
    if (contentType.includes('application/json')) {
      const body = await response.json().catch(() => ({}));
      message = body?.error?.message || body?.error || body?.message || message;
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export { API_URL };
