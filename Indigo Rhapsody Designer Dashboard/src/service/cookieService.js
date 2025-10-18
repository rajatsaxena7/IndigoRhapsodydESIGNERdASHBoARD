import Cookies from 'js-cookie';

// Cookie configuration
const COOKIE_CONFIG = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
  sameSite: 'strict', // Protect against CSRF attacks
  path: '/', // Available across the entire site
};

// Cookie names
const COOKIE_NAMES = {
  ACCESS_TOKEN: 'access_token',
  USER_ID: 'user_id',
  DESIGNER_ID: 'designer_id',
  REFRESH_TOKEN: 'refresh_token',
};

// Set JWT access token in cookie
export const setAccessToken = (token) => {
  if (token) {
    Cookies.set(COOKIE_NAMES.ACCESS_TOKEN, token, COOKIE_CONFIG);
  }
};

// Get JWT access token from cookie
export const getAccessToken = () => {
  return Cookies.get(COOKIE_NAMES.ACCESS_TOKEN);
};

// Set refresh token in cookie
export const setRefreshToken = (token) => {
  if (token) {
    Cookies.set(COOKIE_NAMES.REFRESH_TOKEN, token, {
      ...COOKIE_CONFIG,
      expires: 30, // Refresh tokens last longer (30 days)
    });
  }
};

// Get refresh token from cookie
export const getRefreshToken = () => {
  return Cookies.get(COOKIE_NAMES.REFRESH_TOKEN);
};

// Set user ID in cookie
export const setUserId = (userId) => {
  if (userId) {
    Cookies.set(COOKIE_NAMES.USER_ID, userId, COOKIE_CONFIG);
  }
};

// Get user ID from cookie
export const getUserId = () => {
  return Cookies.get(COOKIE_NAMES.USER_ID);
};

// Set designer ID in cookie
export const setDesignerId = (designerId) => {
  if (designerId) {
    Cookies.set(COOKIE_NAMES.DESIGNER_ID, designerId, COOKIE_CONFIG);
  }
};

// Get designer ID from cookie
export const getDesignerId = () => {
  return Cookies.get(COOKIE_NAMES.DESIGNER_ID);
};

// Clear all authentication cookies
export const clearAuthCookies = () => {
  Object.values(COOKIE_NAMES).forEach(cookieName => {
    Cookies.remove(cookieName, { path: '/' });
  });
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const accessToken = getAccessToken();
  const userId = getUserId();
  return !!(accessToken && userId);
};

// Get authorization header for API requests
export const getAuthHeader = () => {
  const token = getAccessToken();
  if (!token) return {};
  
  // Check if token already has Bearer prefix
  const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  return { Authorization: authHeader };
};

// Parse JWT token to get payload (without verification)
export const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  // Remove Bearer prefix if present
  const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
  
  const payload = parseJwt(cleanToken);
  if (!payload || !payload.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

// Get token expiration time
export const getTokenExpiration = (token) => {
  if (!token) return null;
  
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return null;
  
  return new Date(payload.exp * 1000);
};
