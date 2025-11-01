import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file manually
function loadEnvFile() {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').trim();
        if (key && value) {
          process.env[key.trim()] = value;
        }
      }
    });
    console.log('✓ Loaded environment variables from .env file\n');
  } else {
    console.warn('⚠️  No .env file found at:', envPath);
    console.warn('   Using system environment variables\n');
  }
}

// Load environment variables first
loadEnvFile();

// Load environment variables
const CLIENT_ID = process.env.CHROME_CLIENT_ID;
const CLIENT_SECRET = process.env.CHROME_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.CHROME_REFRESH_TOKEN;
const EXTENSION_ID = process.env.CHROME_EXTENSION_ID;

// Validate environment variables
function validateEnvVars() {
  const missing = [];
  if (!CLIENT_ID) missing.push('CHROME_CLIENT_ID');
  if (!CLIENT_SECRET) missing.push('CHROME_CLIENT_SECRET');
  if (!REFRESH_TOKEN) missing.push('CHROME_REFRESH_TOKEN');
  if (!EXTENSION_ID) missing.push('CHROME_EXTENSION_ID');

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach((varName) => console.error(`   - ${varName}`));
    console.error(
      '\nPlease set these environment variables before publishing.',
    );
    console.error('Example:');
    console.error('  export CHROME_CLIENT_ID="your-client-id"');
    console.error('  export CHROME_CLIENT_SECRET="your-client-secret"');
    console.error('  export CHROME_REFRESH_TOKEN="your-refresh-token"');
    console.error('  export CHROME_EXTENSION_ID="your-extension-id"');
    process.exit(1);
  }
}

// Generate access token
async function getAccessToken() {
  try {
    console.log('🔐 Generating access token...');
    const response = await axios.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
    console.log('✓ Access token generated successfully');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Error generating access token:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   ', error.message);
    }
    throw error;
  }
}

// Upload the extension
async function uploadExtension(accessToken, zipPath) {
  try {
    console.log('📤 Uploading extension...');
    const zipFile = fs.readFileSync(zipPath);
    const response = await axios.put(
      `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${EXTENSION_ID}`,
      zipFile,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-goog-api-version': '2',
          'Content-Type': 'application/zip',
        },
      },
    );
    console.log('✓ Extension uploaded successfully');
    console.log('   Upload status:', response.data.uploadState);
    if (response.data.itemError) {
      console.warn('⚠️  Upload warnings:', response.data.itemError);
    }
    return response.data;
  } catch (error) {
    console.error('❌ Error uploading extension:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   ', error.message);
    }
    throw error;
  }
}

// Publish the extension
async function publishExtension(accessToken) {
  try {
    console.log('🚀 Publishing extension...');
    const response = await axios.post(
      `https://www.googleapis.com/chromewebstore/v1.1/items/${EXTENSION_ID}/publish`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-goog-api-version': '2',
          'Content-Type': 'application/json',
        },
      },
    );
    console.log('✓ Extension published successfully');
    console.log('   Publish status:', response.data.status || 'OK');
    if (response.data.statusDetail) {
      console.log('   Details:', response.data.statusDetail);
    }
    return response.data;
  } catch (error) {
    console.error('❌ Error publishing extension:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   ', error.message);
    }
    throw error;
  }
}

(async () => {
  try {
    console.log('🎯 Starting Chrome Extension Publishing Process\n');

    // Validate environment variables
    validateEnvVars();

    // Check if zip file exists
    const zipPath = path.resolve(__dirname, '../build.zip');
    if (!fs.existsSync(zipPath)) {
      console.error('❌ build.zip not found at:', zipPath);
      console.error(
        '   Please run "npm run zip" first to create the build.zip file.',
      );
      process.exit(1);
    }

    const stats = fs.statSync(zipPath);
    console.log(`📦 Found build.zip (${(stats.size / 1024).toFixed(2)} KB)\n`);

    // Get access token
    const accessToken = await getAccessToken();
    console.log();

    // Upload extension
    await uploadExtension(accessToken, zipPath);
    console.log();

    // Publish extension
    await publishExtension(accessToken);
    console.log();

    console.log('🎉 Extension published successfully to Chrome Web Store!');
    console.log('   Extension ID:', EXTENSION_ID);
    console.log('   View your extension at:');
    console.log(`   https://chrome.google.com/webstore/detail/${EXTENSION_ID}`);
  } catch (error) {
    console.error('\n💥 Publishing process failed');
    process.exit(1);
  }
})();
