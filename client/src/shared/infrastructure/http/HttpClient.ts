const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export interface HttpClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

export interface HttpClient {
  get<T>(path: string): Promise<T>;
  post<T, B>(path: string, body: B): Promise<T>;
  put<T, B>(path: string, body: B): Promise<T>;
  delete<T>(path: string): Promise<T>;
}

export const createHttpClient = (config?: Partial<HttpClientConfig>): HttpClient => {
  const baseUrl = config?.baseUrl ?? API_URL;

  const request = async <T>(method: string, path: string, body?: unknown): Promise<T> => {
    const url = `${baseUrl}${path}`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  };

  return {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body),
    put: (path, body) => request('PUT', path, body),
    delete: (path) => request('DELETE', path),
  };
};
