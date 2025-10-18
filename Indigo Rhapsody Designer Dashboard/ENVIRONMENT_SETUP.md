# Environment Configuration

This project supports multiple environments for development and testing.

## Setup

1. **Copy the environment template:**
   ```bash
   cp env.example .env
   ```

2. **Configure your environment:**
   Edit the `.env` file to set your preferred environment and URLs.

## Environment Variables

### Available Environments
- **production**: For production deployment
- **testing**: For testing with staging backend

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_CURRENT_ENV` | Current environment (production/testing) | production |
| `VITE_API_BASE_URL_PRODUCTION` | Production API base URL | https://indigo-rhapsody-backend-ten.vercel.app |
| `VITE_API_BASE_URL_TESTING` | Testing API base URL | https://indigo-rhapsody-backend-test.vercel.app |

## Usage

### Switching Environments

1. **For Production:**
   ```env
   VITE_CURRENT_ENV=production
   ```

2. **For Testing:**
   ```env
   VITE_CURRENT_ENV=testing
   ```

### Custom API URLs

You can override the default API URLs by setting the environment variables:

```env
VITE_API_BASE_URL_PRODUCTION=https://your-prod-api.com
VITE_API_BASE_URL_TESTING=https://your-test-api.com
```

## Code Usage

The environment configuration is automatically used in the API service:

```javascript
import { getApiBaseUrl, isProduction, isTesting } from '../config/environment';

// Get current API base URL
const apiUrl = getApiBaseUrl();

// Check environment
if (isProduction()) {
  console.log('Running in production mode');
}
```

## Default Configuration

If no `.env` file is found, the system defaults to:
- Environment: `production`
- API URL: `https://indigo-rhapsody-backend-ten.vercel.app`
