/**
 * Fetch API Wrapper
 * Handles CORS issues locally by using localhost, on Vercel uses proper backend URL
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://clear-glass-backend-.vercel.app/api';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

export async function fetchAPI(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options;

  // Detect if running locally - MUST be done at runtime in browser, not at module load
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // Ensure proper headers
  const headers = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Build full URL
  let url: string;
  if (endpoint.startsWith('http')) {
    url = endpoint;
  } else {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    
    // Use localhost during development, Vercel backend on production
    if (isLocalhost) {
      url = `http://localhost:5002/api/${cleanEndpoint}`;
    } else {
      url = `${API_URL}/${cleanEndpoint}`;
    }
  }

  // Add timestamp for cache-busting
  const separator = url.includes('?') ? '&' : '?';
  const urlWithTimestamp = `${url}${separator}_t=${Date.now()}`;

  // Prepare fetch options
  const finalOptions: RequestInit = {
    ...fetchOptions,
    headers,
    cache: 'no-store',
    credentials: 'include',
  };

  // Create timeout promise
  const timeoutPromise = new Promise<Response>((_, reject) =>
    setTimeout(
      () => reject(new Error('API request timeout')),
      timeout
    )
  );

  try {
    // Use Promise.race to implement timeout
    const response = await Promise.race([
      fetch(urlWithTimestamp, finalOptions),
      timeoutPromise,
    ]);

    if (!response.ok) {
      console.warn(`API response not ok: ${response.status} ${response.statusText} for ${url}`);
    }

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
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}
