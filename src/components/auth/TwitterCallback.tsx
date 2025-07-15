
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const TwitterCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleTwitterCallback = async () => {
      const oauth_token = searchParams.get('oauth_token');
      const oauth_verifier = searchParams.get('oauth_verifier');
      const denied = searchParams.get('denied');

      if (denied) {
        console.error('Twitter OAuth denied');
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'twitter_auth_error', 
            error: 'User denied authorization' 
          }, window.location.origin);
          window.close();
        }
        return;
      }

      if (oauth_token && oauth_verifier) {
        try {
          // Get stored request token secret
          const oauth_token_secret = sessionStorage.getItem('twitter_oauth_token_secret');
          
          if (!oauth_token_secret) {
            throw new Error('OAuth token secret not found in session');
          }

          // Exchange request token for access token
          const response = await fetch('/api/auth/twitter/access-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              oauth_token: oauth_token,
              oauth_token_secret: oauth_token_secret,
              oauth_verifier: oauth_verifier
            })
          });

          const tokenData = await response.json();

          if (!response.ok) {
            throw new Error(tokenData.error || 'Failed to exchange token');
          }

          console.log('Twitter OAuth 1.0a successful:', tokenData);
          
          // Clean up session storage
          sessionStorage.removeItem('twitter_oauth_token_secret');
          
          // Notify parent window
          if (window.opener) {
            window.opener.postMessage({ 
              type: 'twitter_auth_success', 
              tokenData: tokenData,
              user: tokenData.user
            }, window.location.origin);
            window.close();
          }

        } catch (error) {
          console.error('Error during Twitter token exchange:', error);
          if (window.opener) {
            window.opener.postMessage({ 
              type: 'twitter_auth_error', 
              error: error.message 
            }, window.location.origin);
            window.close();
          }
        }
      } else {
        console.error('Missing OAuth parameters');
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'twitter_auth_error', 
            error: 'Missing OAuth parameters' 
          }, window.location.origin);
          window.close();
        }
      }
    };

    handleTwitterCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Procesando autenticación de Twitter...</p>
      </div>
    </div>
  );
};

export default TwitterCallback;
