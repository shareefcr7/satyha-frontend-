/**
 * Fetch API Wrapper
 * Handles CORS issues by:
 * 1. Using server-side proxies (Next.js API routes)
 * 2. Adding proper headers
 * 3. Implementing error handling
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

  // Ensure proper headers
  const headers = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Build full URL
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_URL}${endpoint}`;

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
      throw new Error(`API error: ${response.status} ${response.statusText}`);
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
  return response.json();
}
