import { useAuth } from '@/contexts/AuthContext';

/**
 * Create authenticated fetch request with JWT token
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @param accessToken - JWT access token
 * @returns Fetch response
 */
export async function authenticatedFetch(
  url: string, 
  options: RequestInit = {}, 
  accessToken: string
): Promise<Response> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  return fetch(url, config);
}

/**
 * Hook for making authenticated API requests
 * This hook provides methods to make API calls with automatic token handling
 */
export function useApiClient() {
  const { tokens, refreshToken } = useAuth();

  const makeRequest = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    if (!tokens?.accessToken) {
      throw new Error('No access token available');
    }

    try {
      // Make the initial request
      let response = await authenticatedFetch(url, options, tokens.accessToken);

      // If token is expired, try to refresh
      if (response.status === 401) {
        const refreshSuccess = await refreshToken();
        
        if (refreshSuccess && tokens?.accessToken) {
          // Retry the request with new token
          response = await authenticatedFetch(url, options, tokens.accessToken);
        } else {
          // Refresh failed, user will be logged out
          throw new Error('Authentication failed');
        }
      }

      return response;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  const get = (url: string, options: RequestInit = {}) => {
    return makeRequest(url, { ...options, method: 'GET' });
  };

  const post = (url: string, data?: unknown, options: RequestInit = {}) => {
    return makeRequest(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  };

  const put = (url: string, data?: unknown, options: RequestInit = {}) => {
    return makeRequest(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  };

  const del = (url: string, options: RequestInit = {}) => {
    return makeRequest(url, { ...options, method: 'DELETE' });
  };

  return {
    get,
    post,
    put,
    delete: del,
    makeRequest,
  };
}
