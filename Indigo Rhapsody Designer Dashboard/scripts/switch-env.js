#!/usr/bin/env node

/**
 * Environment Switcher Script
 * Usage: node scripts/switch-env.js [development|testing]
 */

const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '..', '.env');
const envExampleFile = path.join(__dirname, '..', 'env.example');

const environments = {
    production: {
        VITE_CURRENT_ENV: 'production',
        VITE_API_BASE_URL_PRODUCTION: 'https://indigo-rhapsody-backend-ten.vercel.app',
        VITE_API_BASE_URL_TESTING: 'https://indigo-rhapsody-backend-test.vercel.app'
    },
    testing: {
        VITE_CURRENT_ENV: 'development',
        VITE_API_BASE_URL_DEVELOPMENT: 'https://indigo-rhapsody-backend-ten.vercel.app',
        VITE_API_BASE_URL_TESTING: 'https://indigo-rhapsody-backend-test.vercel.app'
    }
};

function createEnvFile(env) {
    const config = environments[env];
    if (!config) {
        console.error(`❌ Invalid environment: ${env}`);
        console.log('Available environments: production, testing');
        process.exit(1);
    }

    const envContent = Object.entries(config)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    fs.writeFileSync(envFile, envContent);
    console.log(`✅ Switched to ${env} environment`);
    console.log(`📁 Environment file: ${envFile}`);
    console.log(`🔗 API Base URL: ${config.VITE_API_BASE_URL_PRODUCTION}`);
}

function showCurrentEnv() {
    if (fs.existsSync(envFile)) {
        const content = fs.readFileSync(envFile, 'utf8');
        const currentEnv = content.match(/VITE_CURRENT_ENV=(.+)/)?.[1] || 'unknown';
        console.log(`📋 Current environment: ${currentEnv}`);
    } else {
        console.log('📋 No .env file found. Using default: production');
    }
}

// Main execution
const targetEnv = process.argv[2];

if (!targetEnv) {
    showCurrentEnv();
    console.log('\nUsage: node scripts/switch-env.js [production|testing]');
    process.exit(0);
}

createEnvFile(targetEnv);
