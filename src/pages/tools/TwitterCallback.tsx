
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const TwitterCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        console.error('Twitter OAuth error:', error);
        // Notificar al padre que hubo un error
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'TWITTER_AUTH_ERROR', 
            error: error 
          }, '*');
        }
        window.close();
        return;
      }

      if (code && state) {
        try {
          // Simular el intercambio de código por token
          // En una implementación real, esto se haría en tu backend
          const mockTokenResponse = {
            access_token: 'mock_twitter_token_' + Date.now(),
            refresh_token: 'mock_refresh_token_' + Date.now(),
            expires_in: 7200,
            token_type: 'bearer',
            scope: 'tweet.read tweet.write users.read dm.read dm.write offline.access'
          };

          // Simular obtener información del usuario
          const mockUserInfo = {
            id: 'tw_user_' + Date.now(),
            username: 'clinicpro_vet',
            name: 'ClinicPro Veterinaria',
            followers_count: 1650,
            following_count: 320,
            tweet_count: 145,
            profile_image_url: 'https://images.pexels.com/photos/6568663/pexels-photo-6568663.jpeg?auto=compress&cs=tinysrgb&w=400',
            verified: false
          };

          // Crear el objeto de cuenta
          const newAccount = {
            id: Date.now().toString(),
            platform: 'twitter' as const,
            handle: '@' + mockUserInfo.username,
            name: mockUserInfo.name,
            url: `https://twitter.com/${mockUserInfo.username}`,
            connected: true,
            connectedAt: new Date().toISOString(),
            userId: mockUserInfo.id,
            accessToken: mockTokenResponse.access_token,
            refreshToken: mockTokenResponse.refresh_token,
            profileImage: mockUserInfo.profile_image_url,
            verified: mockUserInfo.verified,
            metrics: {
              followers: mockUserInfo.followers_count,
              followersChange: 35,
              engagement: 3.5,
              engagementChange: 0.4,
              reach: 4200,
              reachChange: 180,
              clicks: 95,
              clicksChange: 15
            }
          };

          // Enviar los datos al componente padre
          if (window.opener) {
            window.opener.postMessage({ 
              type: 'TWITTER_AUTH_SUCCESS', 
              account: newAccount 
            }, '*');
          }

          // Cerrar la ventana
          setTimeout(() => {
            window.close();
          }, 500);

        } catch (error) {
          console.error('Error processing Twitter callback:', error);
          if (window.opener) {
            window.opener.postMessage({ 
              type: 'TWITTER_AUTH_ERROR', 
              error: 'Error processing authentication' 
            }, '*');
          }
          window.close();
        }
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Procesando autenticación de Twitter
        </h2>
        <p className="text-gray-600">
          Por favor, no cierres esta ventana...
        </p>
      </div>
    </div>
  );
};

export default TwitterCallback;
