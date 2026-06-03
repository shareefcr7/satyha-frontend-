/**
 * Fetch API Wrapper
 * Always fetches fresh data with proper CORS headers
 */

const getApiUrl = () => {
  // Always check hostname at runtime
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5002/api';
    }
  }
  
  // On server-side or production, use env var
  return process.env.NEXT_PUBLIC_API_URL || 'https://clear-glass-backend.vercel.app/api';
};

interface FetchOptions extends RequestInit {
  timeout?: number;
}

export async function fetchAPI(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = 15000, ...fetchOptions } = options;

  const headers = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Build full URL
  let url: string;
  if (endpoint.startsWith('http')) {
    url = endpoint;
  } else {
    const apiBase = getApiUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    url = `${apiBase}/${cleanEndpoint}`;
  }

  // Add cache-busting params
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const separator = url.includes('?') ? '&' : '?';
  const urlWithTimestamp = `${url}${separator}_t=${timestamp}&_r=${random}`;

  console.log('Fetching from:', urlWithTimestamp);

  const finalOptions: RequestInit = {
    ...fetchOptions,
    headers,
    cache: 'no-store',
    credentials: 'include',
  };

  const timeoutPromise = new Promise<Response>((_, reject) =>
    setTimeout(() => reject(new Error('Request timeout')), timeout)
  );

  try {
    const response = await Promise.race([
      fetch(urlWithTimestamp, finalOptions),
      timeoutPromise,
    ]);

    return response;
  } catch (error) {
    console.error(`Fetch failed for ${endpoint}:`, error);
    throw error;
  }
}

export async function fetchAPIJson<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  const response = await fetchAPI(endpoint, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }
  return response.json();
}
