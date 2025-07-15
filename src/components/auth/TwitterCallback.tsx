
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const TwitterCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
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
      // Recuperar el code verifier del sessionStorage
      const codeVerifier = sessionStorage.getItem('twitter_code_verifier');
      
      if (codeVerifier) {
        // Aquí intercambiarías el code por el access token
        // En tu implementación real, harías una llamada a tu backend
        console.log('Twitter auth successful:', { code, state, codeVerifier });
        
        // Notificar al padre que la autenticación fue exitosa
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'twitter_auth_success', 
            code: code,
            state: state,
            codeVerifier: codeVerifier
          }, window.location.origin);
          window.close();
        }
      }
    }
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
