const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load environment variables
const CLIENT_ID = process.env.CHROME_CLIENT_ID;
const CLIENT_SECRET = process.env.CHROME_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.CHROME_REFRESH_TOKEN;
const EXTENSION_ID = process.env.CHROME_EXTENSION_ID;

// Generate access token
async function getAccessToken() {
  try {
    const response = await axios.post(
      'https://accounts.google.com/o/oauth2/token',
      null,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params: {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: REFRESH_TOKEN,
          grant_type: 'refresh_token',
        },
      },
    );
    return response.data.access_token;
  } catch (error) {
    console.error(
      'Error generating access token:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

// Upload the extension
async function uploadExtension(accessToken, zipPath) {
  try {
    const zipFile = fs.readFileSync(zipPath);
    const response = await axios.put(
      `https://www.googleapis.com/upload/chromewebstore/v1.1/items/${EXTENSION_ID}`,
      zipFile,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-goog-api-version': '2',
          'Content-Length': zipFile.length,
        },
      },
    );
    console.log('Upload response:', response.data);
  } catch (error) {
    console.error(
      'Error uploading extension:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

// Publish the extension
async function publishExtension(accessToken) {
  try {
    const response = await axios.post(
      `https://www.googleapis.com/chromewebstore/v1.1/items/${EXTENSION_ID}/publish`,
      null,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-goog-api-version': '2',
        },
      },
    );
    console.log('Publish response:', response.data);
  } catch (error) {
    console.error(
      'Error publishing extension:',
      error.response?.data || error.message,
    );
    throw error;
  }
}

(async () => {
  try {
    const zipPath = path.resolve(__dirname, '../extension.zip'); // Adjust the path if needed
    const accessToken = await getAccessToken();
    await uploadExtension(accessToken, zipPath);
    await publishExtension(accessToken);
  } catch (error) {
    console.error('Failed to complete the publishing process:', error.message);
  }
})();
