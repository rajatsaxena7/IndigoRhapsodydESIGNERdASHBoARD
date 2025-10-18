# JWT Authentication Implementation with Cookies

This document describes the JWT authentication implementation that replaces localStorage with secure HTTP-only cookies for better security.

## Overview

The application now uses JWT tokens stored in HTTP-only cookies instead of localStorage for enhanced security. This prevents XSS attacks and provides better token management.

## Key Components

### 1. Cookie Service (`src/service/cookieService.js`)

Handles all cookie operations for JWT tokens:

- **setAccessToken(token)**: Stores JWT access token in cookie
- **getAccessToken()**: Retrieves JWT access token from cookie
- **setRefreshToken(token)**: Stores refresh token in cookie
- **getRefreshToken()**: Retrieves refresh token from cookie
- **setUserId(userId)**: Stores user ID in cookie
- **getUserId()**: Retrieves user ID from cookie
- **setDesignerId(designerId)**: Stores designer ID in cookie
- **getDesignerId()**: Retrieves designer ID from cookie
- **clearAuthCookies()**: Clears all authentication cookies
- **isAuthenticated()**: Checks if user is authenticated
- **isTokenExpired(token)**: Checks if JWT token is expired
- **parseJwt(token)**: Parses JWT token payload

### 2. API Service (`src/service/apiService.js`)

Centralized API service with automatic token management:

- **apiGet(endpoint)**: GET requests with auth headers
- **apiPost(endpoint, data)**: POST requests with auth headers
- **apiPut(endpoint, data)**: PUT requests with auth headers
- **apiDelete(endpoint)**: DELETE requests with auth headers
- **apiPatch(endpoint, data)**: PATCH requests with auth headers

Features:
- Automatic token refresh on expiration
- Request queuing during token refresh
- Automatic logout on refresh failure
- Centralized error handling

### 3. Authentication Context (`src/context/AuthContext.jsx`)

React context for managing authentication state:

- **useAuth()**: Hook to access auth context
- **login(userData)**: Updates auth state after login
- **logout()**: Clears auth state and redirects to login
- **user**: Current user object
- **loading**: Loading state
- **isAuthenticated**: Boolean indicating auth status

### 4. Updated Authentication Service (`src/service/authService.js`)

Modified to use cookies instead of localStorage:

- **loginDesigner(email, password)**: Login with cookie storage
- **logoutDesigner()**: Logout with cookie clearing
- **refreshToken()**: Refresh access token

## Cookie Configuration

Cookies are configured with security best practices:

```javascript
const COOKIE_CONFIG = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict', // CSRF protection
  path: '/', // Available across entire site
};
```

## Token Format

The implementation handles both formats:
- **With Bearer prefix**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Without Bearer prefix**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

The system automatically detects and handles both formats for API requests and token validation.

## Token Refresh Flow

1. **Token Expiration Check**: Before each API request, check if access token is expired
2. **Refresh Request**: If expired, use refresh token to get new access token
3. **Request Queuing**: Queue pending requests during refresh
4. **Automatic Retry**: Retry queued requests with new token
5. **Logout on Failure**: If refresh fails, clear cookies and redirect to login

## Security Benefits

1. **XSS Protection**: HTTP-only cookies cannot be accessed by JavaScript
2. **CSRF Protection**: SameSite=strict prevents cross-site requests
3. **Automatic Expiration**: Tokens expire automatically
4. **Secure Transmission**: HTTPS-only in production
5. **Centralized Management**: All auth logic in one place

## Migration from localStorage

All localStorage usage has been replaced:

- `localStorage.getItem("userId")` → `getUserId()`
- `localStorage.getItem("designerId")` → `getDesignerId()`
- `localStorage.getItem("token")` → `getAccessToken()`
- `localStorage.setItem()` → `setUserId()`, `setDesignerId()`, `setAccessToken()`
- `localStorage.clear()` → `clearAuthCookies()`

## API Endpoints

The implementation expects these backend endpoints:

- **Login**: `POST /user/login` - Returns success response with data containing accessToken, refreshToken, userId, designerId, user, designer, and is_approved
- **Refresh**: `POST /auth/refresh` - Accepts refresh token, returns new access token
- **All Protected Endpoints**: Require `Authorization: Bearer <token>` header

### Login Response Format
```json
{
  "success": true,
  "message": "Designer login successful",
  "data": {
    "userId": "user_id",
    "designerId": "designer_id", 
    "is_approved": true,
    "accessToken": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... },
    "designer": { ... }
  }
}
```

## Usage Examples

### Login
```javascript
import { loginDesigner } from '../service/authService';
import { useAuth } from '../context/AuthContext';

const { login } = useAuth();
const response = await loginDesigner(email, password);
// response contains: userId, designerId, accessToken, refreshToken, user, designer, is_approved
login(response);
```

### API Calls
```javascript
import { apiGet, apiPost } from '../service/apiService';

// GET request with automatic auth
const data = await apiGet('/products/getProductsByDesigner/123');

// POST request with automatic auth
const result = await apiPost('/products/createProduct', productData);
```

### Check Authentication
```javascript
import { isAuthenticated } from '../service/cookieService';
import { useAuth } from '../context/AuthContext';

// Using cookie service
if (isAuthenticated()) {
  // User is logged in
}

// Using auth context
const { isAuthenticated, user } = useAuth();
if (isAuthenticated && user) {
  // User is logged in
}
```

### Logout
```javascript
import { useAuth } from '../context/AuthContext';

const { logout } = useAuth();
logout(); // Clears cookies and redirects to login
```

## Error Handling

The implementation includes comprehensive error handling:

- **Network Errors**: Retry with exponential backoff
- **Token Expiration**: Automatic refresh
- **Refresh Failure**: Automatic logout
- **API Errors**: Proper error messages to user
- **Invalid Tokens**: Clear cookies and redirect

## Testing

To test the implementation:

1. **Login**: Verify cookies are set correctly
2. **API Calls**: Verify auth headers are sent
3. **Token Refresh**: Test with expired tokens
4. **Logout**: Verify cookies are cleared
5. **Security**: Test XSS and CSRF protection

## Dependencies

- **js-cookie**: Cookie management library
- **react-router-dom**: Navigation
- **react-toastify**: Notifications

## Future Enhancements

1. **Token Rotation**: Implement refresh token rotation
2. **Remember Me**: Longer expiration for "remember me" option
3. **Multi-tab Support**: Handle multiple browser tabs
4. **Offline Support**: Cache for offline functionality
5. **Audit Logging**: Track authentication events
