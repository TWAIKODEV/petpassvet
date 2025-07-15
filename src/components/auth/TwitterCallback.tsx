
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const TwitterCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleTwitterCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        console.error('Twitter OAuth error:', error);
        // Notificar al padre que hubo un error
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'twitter_auth_error', 
            error: error 
          }, window.location.origin);
          window.close();
        }
        return;
      }

      if (code && state) {
        try {
          // Recuperar el code verifier del sessionStorage
          const codeVerifier = sessionStorage.getItem('twitter_code_verifier');
          const storedState = sessionStorage.getItem('twitter_oauth_state');
          
          // Verificar el state parameter
          if (state !== storedState) {
            throw new Error('State parameter mismatch');
          }
          
          if (!codeVerifier) {
            throw new Error('Code verifier not found');
          }

          // Intercambiar el code por el access token usando nuestro backend
          const response = await fetch('/api/auth/twitter/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code: code,
              codeVerifier: codeVerifier,
              redirectUri: import.meta.env.VITE_TWITTER_REDIRECT_URI
            })
          });

          const tokenData = await response.json();

          if (!response.ok) {
            throw new Error(tokenData.error || 'Failed to exchange token');
          }

          console.log('Twitter auth successful:', tokenData);
          
          // Notificar al padre que la autenticación fue exitosa
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
