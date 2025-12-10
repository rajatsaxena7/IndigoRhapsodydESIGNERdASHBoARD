// authService.js
import {
  setAccessToken,
  setRefreshToken,
  setUserId,
  setDesignerId,
  clearAuthCookies,
  getRefreshToken
} from './cookieService';
import { apiPost } from './apiService';
import { getApiBaseUrl } from '../config/environment';

export const loginDesigner = async (email, password) => {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/user/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies for cross-origin requests
      }
    );

    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const responseData = await response.json();

    // Check if the response has the expected structure
    if (!responseData.success || !responseData.data) {
      throw new Error("Invalid response format from server");
    }

    const { data } = responseData;

    // Store authentication data in cookies
    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }
    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
    }
    if (data.userId) {
      setUserId(data.userId);
    }
    if (data.designerId) {
      setDesignerId(data.designerId);
    }

    return data; // Return the user and designer details
  } catch (error) {
    // console.error("Error logging in:", error);
    throw error; // Rethrow the error to be caught by the UI
  }
};

// Logout function
export const logoutDesigner = () => {
  clearAuthCookies();
  window.location.href = '/login';
};

// Refresh token function
export const refreshToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiPost('/auth/refresh', { refreshToken });

    if (response.accessToken) {
      setAccessToken(response.accessToken);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }
      return response.accessToken;
    }

    throw new Error('Invalid refresh response');
  } catch (error) {
    clearAuthCookies();
    throw error;
  }
};
