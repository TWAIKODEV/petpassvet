
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

// Twitter OAuth 2.0 token exchange endpoint
router.post('/twitter/token', async (req, res) => {
  try {
    const { code, codeVerifier, redirectUri } = req.body;

    if (!code || !codeVerifier || !redirectUri) {
      return res.status(400).json({ 
        error: 'Missing required parameters: code, codeVerifier, or redirectUri' 
      });
    }

    // Prepare token exchange request
    const tokenUrl = 'https://api.twitter.com/2/oauth2/token';
    const clientId = process.env.VITE_TWITTER_CLIENT_ID;
    const clientSecret = process.env.VITE_TWITTER_CLIENT_SECRET;

    // Create Basic Auth header
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
      client_id: clientId
    });

    // Exchange authorization code for access token
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: tokenParams.toString()
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Twitter token exchange error:', tokenData);
      return res.status(400).json({ 
        error: 'Failed to exchange code for token',
        details: tokenData
      });
    }

    // Get user information with the access token
    const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url,public_metrics', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error('Twitter user data error:', userData);
      return res.status(400).json({ 
        error: 'Failed to get user data',
        details: userData
      });
    }

    // Return both token and user data
    res.json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      token_type: tokenData.token_type,
      scope: tokenData.scope,
      user: userData.data
    });

  } catch (error) {
    console.error('Twitter OAuth error:', error);
    res.status(500).json({ 
      error: 'Internal server error during Twitter authentication',
      message: error.message
    });
  }
});

module.exports = router;
