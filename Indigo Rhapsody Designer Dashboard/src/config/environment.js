// Environment Configuration
const environments = {
    production: {
        API_BASE_URL: import.meta.env.VITE_API_BASE_URL_PRODUCTION || 'https://indigo-rhapsody-backend-ten.vercel.app',
        NODE_ENV: 'production'
    },
    development: {
        API_BASE_URL: import.meta.env.VITE_API_BASE_URL_DEVELOPMENT || 'https://indigo-rhapsody-backend-test.vercel.app',
        NODE_ENV: 'testing'
    }
};

// Get current environment from Vite env or default to production
const currentEnv = import.meta.env.VITE_CURRENT_ENV || 'production';

// Export current environment config
export const config = environments[currentEnv] || environments.production;

// Console logging for environment awareness
console.log(`%c🌍 Environment: ${currentEnv.toUpperCase()}`, 'color: #4CAF50; font-weight: bold; font-size: 14px;');
console.log(`%c🔗 API Base URL: ${config.API_BASE_URL}`, 'color: #2196F3; font-weight: bold;');
console.log(`%c📦 Node Environment: ${config.NODE_ENV}`, 'color: #FF9800; font-weight: bold;');

// Export all environments for reference
export { environments };

// Helper function to get API base URL
export const getApiBaseUrl = () => {
    return config.API_BASE_URL;
};

// Helper function to check if we're in production
export const isProduction = () => {
    return currentEnv === 'production';
};

// Helper function to check if we're in testing
export const isTesting = () => {
    return currentEnv === 'testing';
};
