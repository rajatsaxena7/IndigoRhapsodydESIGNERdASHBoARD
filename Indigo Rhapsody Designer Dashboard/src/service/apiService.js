import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearAuthCookies,
  isTokenExpired
} from './cookieService';
import { getApiBaseUrl } from '../config/environment';

const BASE_URL = getApiBaseUrl();

// Refresh token endpoint
const REFRESH_TOKEN_URL = `${BASE_URL}/auth/refresh`;

// Flag to prevent multiple refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Refresh access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(REFRESH_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();

    if (data.accessToken) {
      setAccessToken(data.accessToken);
      if (data.refreshToken) {
        setRefreshToken(data.refreshToken);
      }
      return data.accessToken;
    } else {
      throw new Error('No access token in refresh response');
    }
  } catch (error) {
    // If refresh fails, clear all auth data and redirect to login
    clearAuthCookies();
    window.location.href = '/login';
    throw error;
  }
};

// Create authenticated request
const createAuthenticatedRequest = async (url, options = {}) => {
  let accessToken = getAccessToken();

  // Check if token is expired
  if (accessToken && isTokenExpired(accessToken)) {
    if (isRefreshing) {
      // If already refreshing, queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(token => {
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          },
        });
      }).catch(err => {
        throw err;
      });
    }

    isRefreshing = true;

    try {
      accessToken = await refreshAccessToken();
      processQueue(null, accessToken);
    } catch (error) {
      processQueue(error, null);
      throw error;
    } finally {
      isRefreshing = false;
    }
  }

  // Add authorization header if token exists
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    // Check if token already has Bearer prefix
    const authHeader = accessToken.startsWith('Bearer ') ? accessToken : `Bearer ${accessToken}`;
    headers.Authorization = authHeader;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  // Log API call for debugging
  console.log(`🚀 API Call: ${options.method || 'GET'} ${url}`);

  try {
    const response = await createAuthenticatedRequest(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.message === 'Token refresh failed' || error.message === 'No refresh token available') {
      // Redirect to login if refresh fails
      clearAuthCookies();
      window.location.href = '/login';
    }
    throw error;
  }
};

// GET request
export const apiGet = (endpoint) => {
  return apiRequest(endpoint, { method: 'GET' });
};

// POST request
export const apiPost = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// PUT request
export const apiPut = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// DELETE request
export const apiDelete = (endpoint) => {
  return apiRequest(endpoint, { method: 'DELETE' });
};

// PATCH request
export const apiPatch = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

// Logout function
export const logout = () => {
  clearAuthCookies();
  window.location.href = '/login';
};
