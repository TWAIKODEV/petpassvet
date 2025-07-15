
const express = require('express');
const https = require('https');
const crypto = require('crypto');
const querystring = require('querystring');
const router = express.Router();

// Twitter OAuth 1.0a configuration
const TWITTER_CONFIG = {
  consumerKey: '48AWFyLYrCKnIdRJN01wwQDAv',
  consumerSecret: 'mRo8IIcHB4OsPsKvzn2zHnC3eowu4UQAGoderzXSeGwb1bFtKD',
  callbackUrl: 'https://115dd90c-31c9-486b-9d35-4af9c54208d3-00-2a6t7zw0swmnu.worf.replit.dev/auth/twitter/callback'
};

// Helper function to generate OAuth signature
function generateOAuthSignature(method, url, params, consumerSecret, tokenSecret = '') {
  // Sort parameters
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  // Create signature base string
  const signatureBaseString = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(sortedParams)
  ].join('&');

  // Create signing key
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;

  // Generate signature
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(signatureBaseString)
    .digest('base64');

  return signature;
}

// Helper function to generate nonce
function generateNonce() {
  return crypto.randomBytes(16).toString('hex');
}

// Helper function to generate timestamp
function generateTimestamp() {
  return Math.floor(Date.now() / 1000).toString();
}

// Helper function to make Twitter API request
function makeTwitterRequest(method, url, params, consumerSecret, tokenSecret = '') {
  return new Promise((resolve, reject) => {
    const oauthParams = {
      oauth_consumer_key: TWITTER_CONFIG.consumerKey,
      oauth_nonce: generateNonce(),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: generateTimestamp(),
      oauth_version: '1.0'
    };

    // Add additional params
    const allParams = { ...oauthParams, ...params };

    // Generate signature
    const signature = generateOAuthSignature(method, url, allParams, consumerSecret, tokenSecret);
    oauthParams.oauth_signature = signature;

    // Create Authorization header
    const authHeader = 'OAuth ' + Object.keys(oauthParams)
      .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
      .join(', ');

    // Prepare request data
    const postData = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');

    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (method === 'POST') {
      req.write(postData);
    }
    req.end();
  });
}

// Step 1: Get request token
router.post('/twitter/request-token', async (req, res) => {
  try {
    const params = {
      oauth_callback: TWITTER_CONFIG.callbackUrl
    };

    const response = await makeTwitterRequest(
      'POST',
      'https://api.twitter.com/oauth/request_token',
      params,
      TWITTER_CONFIG.consumerSecret
    );

    const responseParams = querystring.parse(response);
    
    if (responseParams.oauth_callback_confirmed !== 'true') {
      throw new Error('OAuth callback not confirmed');
    }

    res.json({
      oauth_token: responseParams.oauth_token,
      oauth_token_secret: responseParams.oauth_token_secret,
      auth_url: `https://api.twitter.com/oauth/authorize?oauth_token=${responseParams.oauth_token}`
    });

  } catch (error) {
    console.error('Error getting request token:', error);
    res.status(500).json({ 
      error: 'Failed to get request token',
      message: error.message
    });
  }
});

// Step 2: Exchange request token for access token
router.post('/twitter/access-token', async (req, res) => {
  try {
    const { oauth_token, oauth_token_secret, oauth_verifier } = req.body;

    if (!oauth_token || !oauth_token_secret || !oauth_verifier) {
      return res.status(400).json({ 
        error: 'Missing required parameters' 
      });
    }

    const params = {
      oauth_verifier: oauth_verifier
    };

    const response = await makeTwitterRequest(
      'POST',
      'https://api.twitter.com/oauth/access_token',
      params,
      TWITTER_CONFIG.consumerSecret,
      oauth_token_secret
    );

    const responseParams = querystring.parse(response);

    // Get user information
    const userParams = {};
    const userResponse = await makeTwitterRequest(
      'GET',
      'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true&skip_status=true',
      userParams,
      TWITTER_CONFIG.consumerSecret,
      responseParams.oauth_token_secret
    );

    const userData = JSON.parse(userResponse);

    res.json({
      access_token: responseParams.oauth_token,
      access_token_secret: responseParams.oauth_token_secret,
      user_id: responseParams.user_id,
      screen_name: responseParams.screen_name,
      user: {
        id: userData.id_str,
        username: userData.screen_name,
        name: userData.name,
        profile_image_url: userData.profile_image_url_https,
        public_metrics: {
          followers_count: userData.followers_count,
          following_count: userData.friends_count,
          tweet_count: userData.statuses_count
        }
      }
    });

  } catch (error) {
    console.error('Error exchanging access token:', error);
    res.status(500).json({ 
      error: 'Failed to exchange access token',
      message: error.message
    });
  }
});

// Get user profile with access token
router.post('/twitter/user-profile', async (req, res) => {
  try {
    const { access_token, access_token_secret } = req.body;

    if (!access_token || !access_token_secret) {
      return res.status(400).json({ 
        error: 'Missing access tokens' 
      });
    }

    const userResponse = await makeTwitterRequest(
      'GET',
      'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true&skip_status=true',
      {},
      TWITTER_CONFIG.consumerSecret,
      access_token_secret
    );

    const userData = JSON.parse(userResponse);

    res.json({
      user: {
        id: userData.id_str,
        username: userData.screen_name,
        name: userData.name,
        profile_image_url: userData.profile_image_url_https,
        public_metrics: {
          followers_count: userData.followers_count,
          following_count: userData.friends_count,
          tweet_count: userData.statuses_count
        }
      }
    });

  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ 
      error: 'Failed to get user profile',
      message: error.message
    });
  }
});

module.exports = router;
