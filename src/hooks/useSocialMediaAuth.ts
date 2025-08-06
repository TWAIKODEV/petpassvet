import { useState } from 'react';
import { useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { useToastContext } from '../context/ToastContext';
import twitterAuthService from '../services/twitterAuth';
import tiktokAuthService from '../services/tiktokAuth';
import linkedinAuthService from '../services/linkedinAuth';
import youtubeAuthService from '../services/youtubeAuth';
import facebookAuthService from '../services/facebookAuth';
import instagramAuthService from '../services/instagramAuth';
import microsoftAuthService from '../services/microsoftAuth';

export const useSocialMediaAuth = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [tiktokCallbackProcessed, setTiktokCallbackProcessed] = useState(false);
  const [twitterCallbackProcessed, setTwitterCallbackProcessed] = useState(false);
  const [linkedinCallbackProcessed, setLinkedinCallbackProcessed] = useState(false);
  const [youtubeCallbackProcessed, setYoutubeCallbackProcessed] = useState(false);
  const [facebookCallbackProcessed, setFacebookCallbackProcessed] = useState(false);
  const [instagramCallbackProcessed, setInstagramCallbackProcessed] = useState(false);
  const [microsoftCallbackProcessed, setMicrosoftCallbackProcessed] = useState(false);
  
  const { showSuccess, showError } = useToastContext();

  // Convex mutations and actions
  const exchangeTwitterToken = useAction(api.twitter.exchangeTwitterToken);
  const getTwitterUserInfo = useAction(api.twitter.getTwitterUserInfo);
  const saveTwitterAccount = useMutation(api.twitter.saveTwitterAccount);
  const disconnectAccount = useMutation(api.twitter.disconnectAccount);
  
  const exchangeTikTokToken = useAction(api.tiktok.exchangeTikTokToken);
  const getTikTokUserInfo = useAction(api.tiktok.getTikTokUserInfo);
  const saveTikTokAccount = useMutation(api.tiktok.saveTikTokAccount);
  
  const exchangeLinkedInToken = useAction(api.linkedin.exchangeLinkedInToken);
  const getLinkedInUserInfo = useAction(api.linkedin.getLinkedInUserInfo);
  const saveLinkedInAccount = useMutation(api.linkedin.saveLinkedInAccount);
  
  const exchangeGoogleToken = useAction(api.google.exchangeGoogleToken);
  const getYouTubeChannelInfo = useAction(api.youtube.getYouTubeChannelInfo);
  const saveYouTubeAccount = useMutation(api.youtube.saveYouTubeAccount);
  
  const exchangeFacebookToken = useAction(api.facebook.exchangeFacebookToken);
  const getFacebookUserInfo = useAction(api.facebook.getFacebookUserInfo);
  const saveFacebookAccount = useMutation(api.facebook.saveFacebookAccount);
  
  const exchangeInstagramToken = useAction(api.instagram.exchangeInstagramToken);
  const getInstagramUserInfo = useAction(api.instagram.getInstagramUserInfo);
  const saveInstagramAccount = useMutation(api.instagram.saveInstagramAccount);
  
  const exchangeMicrosoftToken = useAction(api.microsoft.exchangeMicrosoftToken);
  const getMicrosoftUserInfo = useAction(api.microsoft.getMicrosoftUserInfo);
  const saveMicrosoftAccount = useMutation(api.microsoft.saveMicrosoftAccount);

  // Twitter Authentication
  const handleTwitterCallback = async () => {
    if (twitterCallbackProcessed) return;
    setTwitterCallbackProcessed(true);
    try {
      setIsConnecting(true);
      
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        throw new Error(`Error en autenticación: ${error}`);
      }

      if (!code || !state) {
        throw new Error('Faltan parámetros de autorización');
      }

      const savedState = localStorage.getItem('twitter_auth_state');
      if (state !== savedState) {
        throw new Error(`State no coincide. Recibido: ${state}, Guardado: ${savedState}`);
      }

      const codeVerifier = localStorage.getItem('twitter_code_verifier');
      if (!codeVerifier) {
        throw new Error('Code verifier no encontrado');
      }

      localStorage.removeItem('twitter_auth_state');
      localStorage.removeItem('twitter_code_verifier');
      window.history.replaceState({}, document.title, window.location.pathname);

      const authResponse = await exchangeTwitterToken({ code, codeVerifier });
      
      if (authResponse) {
        const userInfo = await getTwitterUserInfo({ accessToken: authResponse.access_token });
        
        if (userInfo && userInfo.data) {
          const publicMetrics = userInfo.data.public_metrics || {};
          
          await saveTwitterAccount({
            userId: "current-user",
            username: userInfo.data.username,
            name: userInfo.data.name,
            accessToken: authResponse.access_token,
            refreshToken: authResponse.refresh_token,
            expiresAt: Date.now() + (authResponse.expires_in * 1000),
            followers: publicMetrics.followers_count,
            following: publicMetrics.following_count,
            posts: publicMetrics.tweet_count,
            profileImageUrl: userInfo.data.profile_image_url,
            verified: userInfo.data.verified,
            accountCreatedAt: userInfo.data.created_at
          });
          
          window.history.replaceState({}, document.title, window.location.pathname);
          showSuccess('Cuenta de Twitter conectada exitosamente');
          return true;
        }
      } else {
        throw new Error('No se pudo obtener el token de acceso');
      }
    } catch (error) {
      console.error('Error conectando Twitter:', error);
      showError(`Error conectando la cuenta de Twitter: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectTwitter = async () => {
    try {
      await twitterAuthService.initiateAuth();
    } catch (error) {
      console.error('Error iniciando autenticación de Twitter:', error);
      showError('Error iniciando la autenticación de Twitter');
    }
  };

  // TikTok Authentication
  const handleTikTokCallback = async () => {
    if (tiktokCallbackProcessed) return;
    setTiktokCallbackProcessed(true);
    try {
      setIsConnecting(true);
      
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        throw new Error(`Error en autenticación: ${error}`);
      }

      if (!code || !state) {
        throw new Error('Faltan parámetros de autorización');
      }

      const savedState = localStorage.getItem('tiktok_auth_state');
      if (state !== savedState) {
        throw new Error(`State no coincide. Recibido: ${state}, Guardado: ${savedState}`);
      }

      const codeVerifier = localStorage.getItem('tiktok_code_verifier');
      if (!codeVerifier) {
        throw new Error('Code verifier no encontrado');
      }

      localStorage.removeItem('tiktok_auth_state');
      localStorage.removeItem('tiktok_code_verifier');
      window.history.replaceState({}, document.title, window.location.pathname);

      const authResponse = await exchangeTikTokToken({ code, codeVerifier });
      
      if (authResponse && authResponse.access_token) {
        const userInfo = await getTikTokUserInfo({ accessToken: authResponse.access_token });
        
        if (userInfo && userInfo.data) {
          const userData = userInfo.data.user || userInfo.data;
          
          await saveTikTokAccount({
            userId: "current-user",
            username: userData.display_name || userData.username || 'tiktok_user',
            name: userData.display_name || userData.username || 'TikTok User',
            accessToken: authResponse.access_token,
            refreshToken: authResponse.refresh_token,
            expiresAt: Date.now() + (authResponse.expires_in * 1000),
            followers: userData.follower_count || 0,
            following: userData.following_count || 0,
            videos: userData.video_count || 0,
            profileImageUrl: userData.avatar_url || '',
            verified: userData.is_verified || false,
            accountCreatedAt: new Date().toISOString()
          });
          
          showSuccess('Cuenta de TikTok conectada exitosamente');
          return true;
        }
      } else {
        if (authResponse && authResponse.error) {
          showError(`Error en token exchange: ${authResponse.error} - ${authResponse.error_description || ''}. Haz clic en "Conectar con TikTok" para reintentar.`);
        } else {
          showError(`No se pudo obtener el token de acceso. Haz clic en "Conectar con TikTok" para reintentar.`);
        }
        return false;
      }
    } catch (error) {
      showError(`Error conectando la cuenta de TikTok: ${error instanceof Error ? error.message : String(error)}. Haz clic en "Conectar con TikTok" para reintentar.`);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectTikTok = async () => {
    try {
      await tiktokAuthService.initiateAuth();
    } catch (error) {
      console.error('Error iniciando autenticación de TikTok:', error);
      showError('Error iniciando la autenticación de TikTok');
    }
  };

  // LinkedIn Authentication
  const handleLinkedInCallback = async () => {
    if (linkedinCallbackProcessed) return;
    setLinkedinCallbackProcessed(true);
    try {
      setIsConnecting(true);
      
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      if (error) {
        window.history.replaceState({}, document.title, window.location.pathname);
        
        let errorMessage = error;
        if (errorDescription) {
          const decodedDescription = decodeURIComponent(errorDescription);
          errorMessage = `${error}: ${decodedDescription}`;
        }
        
        if (error === 'openid_insufficient_scope_error') {
          errorMessage = 'Error de configuración: LinkedIn requiere los scopes openid, profile y email. Contacta al administrador.';
        } else if (error === 'unauthorized_scope_error') {
          errorMessage = 'Error de permisos: La aplicación no tiene autorización para los scopes solicitados.';
        }
        
        throw new Error(`Error en autenticación: ${errorMessage}`);
      }

      if (!code || !state) {
        throw new Error('Faltan parámetros de autorización');
      }

      const savedState = localStorage.getItem('linkedin_auth_state');
      if (state !== savedState) {
        throw new Error(`State no coincide. Recibido: ${state}, Guardado: ${savedState}`);
      }

      localStorage.removeItem('linkedin_auth_state');
      localStorage.removeItem('linkedin_code_verifier');
      window.history.replaceState({}, document.title, window.location.pathname);

      const authResponse = await exchangeLinkedInToken({ code });
      
      if (authResponse && authResponse.access_token) {
        const userInfo = await getLinkedInUserInfo({ accessToken: authResponse.access_token });
        
        if (userInfo) {
          const userData = userInfo;
          
          await saveLinkedInAccount({
            userId: "current-user",
            username: userData.sub || userData.email || 'linkedin_user',
            name: userData.name || userData.given_name + ' ' + userData.family_name || 'LinkedIn User',
            accessToken: authResponse.access_token,
            refreshToken: authResponse.refresh_token,
            expiresAt: Date.now() + (authResponse.expires_in * 1000),
            followers: 0,
            following: 0,
            posts: 0,
            profileImageUrl: userData.picture || '',
            verified: false,
            accountCreatedAt: new Date().toISOString()
          });
          
          showSuccess('Cuenta de LinkedIn conectada exitosamente');
          return true;
        }
      } else {
        showError('No se pudo obtener el token de acceso de LinkedIn');
        return false;
      }
    } catch (error) {
      console.error('Error conectando LinkedIn:', error);
      showError(`Error conectando la cuenta de LinkedIn: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectLinkedIn = async () => {
    try {
      await linkedinAuthService.initiateAuth();
    } catch (error) {
      console.error('Error iniciando autenticación de LinkedIn:', error);
      showError('Error iniciando la autenticación de LinkedIn');
    }
  };

  // YouTube Authentication
  const handleYouTubeCallback = async () => {
    if (youtubeCallbackProcessed) return;
    setYoutubeCallbackProcessed(true);
    try {
      setIsConnecting(true);
      
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      if (error) {
        window.history.replaceState({}, document.title, window.location.pathname);
        
        let errorMessage = error;
        if (errorDescription) {
          const decodedDescription = decodeURIComponent(errorDescription);
          errorMessage = `${error}: ${decodedDescription}`;
        }
        
        throw new Error(`Error en autenticación: ${errorMessage}`);
      }

      if (!code || !state) {
        throw new Error('Faltan parámetros de autorización');
      }

      const savedState = localStorage.getItem('youtube_auth_state');
      if (state !== savedState) {
        throw new Error(`State no coincide. Recibido: ${state}, Guardado: ${savedState}`);
      }

      const codeVerifier = localStorage.getItem('youtube_code_verifier');
      if (!codeVerifier) {
        throw new Error('Code verifier no encontrado');
      }

      localStorage.removeItem('youtube_auth_state');
      localStorage.removeItem('youtube_code_verifier');
      window.history.replaceState({}, document.title, window.location.pathname);

      const authResponse = await exchangeGoogleToken({ code, codeVerifier });
      
      if (authResponse && authResponse.access_token) {
        const channelInfo = await getYouTubeChannelInfo({ accessToken: authResponse.access_token });
        
        if (channelInfo) {
          if (!channelInfo.hasChannel) {
            showError('Esta cuenta de Google no tiene un canal de YouTube. Por favor, crea un canal en YouTube y vuelve a intentarlo.');
            return false;
          }
          
          const userData = channelInfo.userInfo;
          const channelData = channelInfo.channelInfo;
          const statistics = channelInfo.statistics;
          
          await saveYouTubeAccount({
            userId: "current-user",
            username: channelData?.snippet?.customUrl || userData.email || 'youtube_user',
            name: channelData?.snippet?.title || userData.name || 'YouTube User',
            accessToken: authResponse.access_token,
            refreshToken: authResponse.refresh_token,
            expiresAt: Date.now() + (authResponse.expires_in * 1000),
            followers: parseInt(statistics.subscriberCount) || 0,
            following: 0,
            posts: parseInt(statistics.videoCount) || 0,
            views: parseInt(channelInfo.viewCount) || 0,
            profileImageUrl: channelData?.snippet?.thumbnails?.default?.url || userData.picture || '',
            verified: false,
            accountCreatedAt: channelData?.snippet?.publishedAt || new Date().toISOString()
          });
          
          showSuccess('Cuenta de YouTube conectada exitosamente');
          return true;
        }
      } else {
        showError('No se pudo obtener el token de acceso de Google');
        return false;
      }
    } catch (error) {
      console.error('Error conectando YouTube:', error);
      showError(`Error conectando la cuenta de YouTube: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectYouTube = async () => {
    try {
      await youtubeAuthService.initiateAuth();
    } catch (error) {
      console.error('Error iniciando autenticación de YouTube:', error);
      showError('Error iniciando la autenticación de YouTube');
    }
  };

  // Facebook Authentication
  const handleFacebookCallback = async () => {
    if (facebookCallbackProcessed) return;
    setFacebookCallbackProcessed(true);
    try {
      setIsConnecting(true);
      
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      if (error) {
        window.history.replaceState({}, document.title, window.location.pathname);
        
        let errorMessage = error;
        if (errorDescription) {
          const decodedDescription = decodeURIComponent(errorDescription);
          errorMessage = `${error}: ${decodedDescription}`;
        }
        
        throw new Error(`Error en autenticación: ${errorMessage}`);
      }

      if (!code || !state) {
        throw new Error('Faltan parámetros de autorización');
      }

      const savedState = localStorage.getItem('facebook_auth_state');
      if (state !== savedState) {
        throw new Error(`State no coincide. Recibido: ${state}, Guardado: ${savedState}`);
      }

      localStorage.removeItem('facebook_auth_state');
      window.history.replaceState({}, document.title, window.location.pathname);

      const authResponse = await exchangeFacebookToken({ code });
      
      if (authResponse && authResponse.access_token) {
        const userInfo = await getFacebookUserInfo({ accessToken: authResponse.access_token });
        
        if (userInfo) {
          const hasPage = userInfo.hasPage;
          const userData = userInfo.user;
          const pageData = userInfo.page;
          
          if (!hasPage || !pageData) {
            showError('Esta cuenta de Facebook no tiene páginas de negocio. Por favor, crea una página de Facebook para tu negocio y vuelve a intentarlo. Solo se pueden conectar páginas de Facebook, no perfiles personales.');
            return false;
          }
          
          const accountData = {
            username: pageData.username || pageData.name || userData.name,
            name: userData.name,
            followers: pageData.followers_count || 0,
            following: pageData.fan_count || 0,
            posts: pageData.published_posts.data.length || 0,
            profileImageUrl: pageData.picture?.data?.url || userData.picture?.data?.url || '',
            verified: pageData.verification_status === 'verified' || false,
            accountCreatedAt: pageData.created_time || userData.created_time || new Date().toISOString()
          };
          
          await saveFacebookAccount({
            userId: "current-user",
            username: accountData.username,
            name: accountData.name,
            accessToken: authResponse.access_token,
            refreshToken: authResponse.refresh_token,
            expiresAt: Date.now() + (authResponse.expires_in * 1000),
            followers: accountData.followers,
            following: accountData.following,
            posts: accountData.posts,
            profileImageUrl: accountData.profileImageUrl,
            verified: accountData.verified,
            accountCreatedAt: accountData.accountCreatedAt
          });
          
          showSuccess('Cuenta de Facebook conectada exitosamente');
          return true;
        }
      } else {
        showError('No se pudo obtener el token de acceso de Facebook');
        return false;
      }
    } catch (error) {
      console.error('Error conectando Facebook:', error);
      showError(`Error conectando la cuenta de Facebook: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectFacebook = async () => {
    try {
      await facebookAuthService.initiateAuth();
    } catch (error) {
      console.error('Error iniciando autenticación de Facebook:', error);
      showError('Error iniciando la autenticación de Facebook');
    }
  };

  // Instagram Authentication
  const handleInstagramCallback = async () => {
    if (instagramCallbackProcessed) return;
    setInstagramCallbackProcessed(true);
    try {
      setIsConnecting(true);
      
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      if (error) {
        window.history.replaceState({}, document.title, window.location.pathname);
        
        let errorMessage = error;
        if (errorDescription) {
          const decodedDescription = decodeURIComponent(errorDescription);
          errorMessage = `${error}: ${decodedDescription}`;
        }
        
        throw new Error(`Error en autenticación: ${errorMessage}`);
      }

      if (!code || !state) {
        throw new Error('Faltan parámetros de autorización');
      }

      const savedState = localStorage.getItem('instagram_auth_state');
      if (state !== savedState) {
        throw new Error(`State no coincide. Recibido: ${state}, Guardado: ${savedState}`);
      }

      localStorage.removeItem('instagram_auth_state');
      window.history.replaceState({}, document.title, window.location.pathname);

      const authResponse = await exchangeInstagramToken({ code });
      
      if (authResponse && authResponse.access_token) {
        const userInfo = await getInstagramUserInfo({ accessToken: authResponse.access_token });
        
        if (userInfo) {
          const userData = userInfo.user;
          
          await saveInstagramAccount({
            userId: "current-user",
            username: userData.username || 'instagram_user',
            name: userData.username || 'Instagram User',
            accessToken: authResponse.access_token,
            refreshToken: authResponse.refresh_token,
            expiresAt: Date.now() + (authResponse.expires_in * 1000),
            followers: userData.followers_count || 0,
            following: userData.follows_count || 0,
            posts: userData.media_count || 0,
            profileImageUrl: '',
            verified: false,
            accountCreatedAt: new Date().toISOString()
          });
          
          showSuccess('Cuenta de Instagram conectada exitosamente');
          return true;
        }
      } else {
        showError('No se pudo obtener el token de acceso de Instagram');
        return false;
      }
    } catch (error) {
      console.error('Error conectando Instagram:', error);
      showError(`Error conectando la cuenta de Instagram: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectInstagram = async () => {
    try {
      await instagramAuthService.initiateAuth();
    } catch (error) {
      console.error('Error iniciando autenticación de Instagram:', error);
      showError('Error iniciando la autenticación de Instagram');
    }
  };

  // Microsoft Authentication
  const handleMicrosoftCallback = async () => {
    if (microsoftCallbackProcessed) return;
    setMicrosoftCallbackProcessed(true);
    try {
      setIsConnecting(true);
      
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      if (error) {
        window.history.replaceState({}, document.title, window.location.pathname);
        
        let errorMessage = error;
        if (errorDescription) {
          const decodedDescription = decodeURIComponent(errorDescription);
          errorMessage = `${error}: ${decodedDescription}`;
        }
        
        throw new Error(`Error en autenticación: ${errorMessage}`);
      }

      if (!code || !state) {
        throw new Error('Faltan parámetros de autorización');
      }

      const savedState = localStorage.getItem('microsoft_auth_state');
      if (state !== savedState) {
        throw new Error(`State no coincide. Recibido: ${state}, Guardado: ${savedState}`);
      }

      localStorage.removeItem('microsoft_auth_state');
      window.history.replaceState({}, document.title, window.location.pathname);

      const authResponse = await exchangeMicrosoftToken({ code });
      
      if (authResponse && authResponse.access_token) {
        const userInfo = await getMicrosoftUserInfo({ accessToken: authResponse.access_token });
        
        if (userInfo) {
          await saveMicrosoftAccount({
            userId: "current-user",
            username: userInfo.userPrincipalName || userInfo.displayName || 'microsoft_user',
            name: userInfo.displayName || userInfo.userPrincipalName || 'Microsoft User',
            accessToken: authResponse.access_token,
            refreshToken: authResponse.refresh_token,
            expiresAt: Date.now() + (authResponse.expires_in * 1000),
            email: userInfo.mail || userInfo.userPrincipalName || '',
            profileImageUrl: '',
            accountCreatedAt: new Date().toISOString()
          });
          
          showSuccess('Cuenta de Microsoft conectada exitosamente');
          return true;
        }
      } else {
        showError('No se pudo obtener el token de acceso de Microsoft');
        return false;
      }
    } catch (error) {
      console.error('Error conectando Microsoft:', error);
      showError(`Error conectando la cuenta de Microsoft: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnectMicrosoft = async () => {
    try {
      await microsoftAuthService.initiateAuth();
    } catch (error) {
      console.error('Error iniciando autenticación de Microsoft:', error);
      showError('Error iniciando la autenticación de Microsoft');
    }
  };

  // Generic reconnect function
  const handleReconnectAccount = async (platform: string) => {
    switch (platform) {
      case 'tiktok':
        await handleConnectTikTok();
        break;
      case 'twitter':
        await handleConnectTwitter();
        break;
      case 'linkedin':
        await handleConnectLinkedIn();
        break;
      case 'youtube':
        await handleConnectYouTube();
        break;
      case 'facebook':
        await handleConnectFacebook();
        break;
      case 'instagram':
        await handleConnectInstagram();
        break;
      case 'microsoft':
        await handleConnectMicrosoft();
        break;
      default:
        showError(`Plataforma ${platform} no soportada`);
    }
  };

  // Update connected accounts function
  const updateConnectedAccounts = async (connectedAccounts: any[]) => {
    if (!connectedAccounts || connectedAccounts.length === 0) return;
    
    try {
      for (const account of connectedAccounts) {
        if (!account.connected || !account.accessToken) continue;
        
        if (account.expiresAt && Date.now() > account.expiresAt) {
          console.log(`Token expirado para ${account.platform}: ${account.username}`);
          await disconnectAccount({ accountId: account._id as Id<"socialAccounts"> });
          showError(`Token expirado para ${account.platform}: ${account.username}. Por favor, reconecta la cuenta.`);
          continue;
        }

        try {
          switch (account.platform) {
            case 'tiktok':
              await updateTikTokAccount(account);
              break;
            case 'twitter':
              await updateTwitterAccount(account);
              break;
            case 'linkedin':
              await updateLinkedInAccount(account);
              break;
            case 'youtube':
              await updateYouTubeAccount(account);
              break;
            case 'facebook':
              await updateFacebookAccount(account);
              break;
            case 'instagram':
              await updateInstagramAccount(account);
              break;
            case 'microsoft':
              await updateMicrosoftAccount(account);
              break;
          }
        } catch (error) {
          console.error(`Error actualizando ${account.platform}:`, error);
          await disconnectAccount({ accountId: account._id as Id<"socialAccounts"> });
          showError(`Error actualizando ${account.platform}: ${account.username}`);
        }
      }
    } catch (error) {
      console.error('Error actualizando cuentas:', error);
      showError('Error actualizando las cuentas conectadas');
    }
  };

  // Helper functions for updating accounts
  const updateTikTokAccount = async (account: any) => {
    console.log(`Actualizando datos de TikTok para: ${account.username}`);
    const userInfo = await getTikTokUserInfo({ accessToken: account.accessToken });
    
    if (userInfo && userInfo.data) {
      const userData = userInfo.data.user || userInfo.data;
      
      await saveTikTokAccount({
        userId: account.userId,
        username: userData.display_name || userData.username || account.username,
        name: userData.display_name || userData.username || account.name,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken,
        expiresAt: account.expiresAt,
        followers: userData.follower_count || account.followers || 0,
        following: userData.following_count || account.following || 0,
        videos: userData.video_count || account.posts || 0,
        profileImageUrl: userData.avatar_url || account.profileImageUrl || '',
        verified: userData.is_verified || account.verified || false,
        accountCreatedAt: account.accountCreatedAt || new Date().toISOString()
      });
      
      console.log(`Datos actualizados para TikTok: ${account.username}`);
    }
  };

  const updateTwitterAccount = async (account: any) => {
    console.log(`Actualizando datos de Twitter para: ${account.username}`);
    const userInfo = await getTwitterUserInfo({ accessToken: account.accessToken });
    
    if (userInfo && userInfo.data) {
      const publicMetrics = userInfo.data.public_metrics || {};
      
      await saveTwitterAccount({
        userId: account.userId,
        username: userInfo.data.username,
        name: userInfo.data.name,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken,
        expiresAt: account.expiresAt,
        followers: publicMetrics.followers_count || account.followers || 0,
        following: publicMetrics.following_count || account.following || 0,
        posts: publicMetrics.tweet_count || account.posts || 0,
        profileImageUrl: userInfo.data.profile_image_url || account.profileImageUrl || '',
        verified: userInfo.data.verified || account.verified || false,
        accountCreatedAt: userInfo.data.created_at || account.accountCreatedAt || new Date().toISOString()
      });
      
      console.log(`Datos actualizados para Twitter: ${account.username}`);
    }
  };

  const updateLinkedInAccount = async (account: any) => {
    console.log(`Actualizando datos de LinkedIn para: ${account.username}`);
    const userInfo = await getLinkedInUserInfo({ accessToken: account.accessToken });
    
    if (userInfo) {
      const userData = userInfo;
      
      await saveLinkedInAccount({
        userId: account.userId,
        username: userData.sub || userData.email || account.username,
        name: userData.name || userData.given_name + ' ' + userData.family_name || account.name,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken,
        expiresAt: account.expiresAt,
        followers: 0,
        following: 0,
        posts: 0,
        profileImageUrl: userData.picture || account.profileImageUrl || '',
        verified: false,
        accountCreatedAt: account.accountCreatedAt || new Date().toISOString()
      });
      
      console.log(`Datos actualizados para LinkedIn: ${account.username}`);
    }
  };

  const updateYouTubeAccount = async (account: any) => {
    console.log(`Actualizando datos de YouTube para: ${account.username}`);
    const channelInfo = await getYouTubeChannelInfo({ accessToken: account.accessToken });
    
    if (channelInfo && channelInfo.hasChannel) {
      const userData = channelInfo.userInfo;
      const channelData = channelInfo.channelInfo;
      const statistics = channelInfo.statistics;
      
      await saveYouTubeAccount({
        userId: account.userId,
        username: channelData?.snippet?.customUrl || userData.email || account.username,
        name: channelData?.snippet?.title || userData.name || account.name,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken,
        expiresAt: account.expiresAt,
        followers: parseInt(statistics.subscriberCount) || account.followers || 0,
        following: 0,
        posts: parseInt(statistics.videoCount) || account.posts || 0,
        views: parseInt(channelInfo.viewCount) || account.views || 0,
        profileImageUrl: channelData?.snippet?.thumbnails?.default?.url || userData.picture || account.profileImageUrl || '',
        verified: false,
        accountCreatedAt: channelData?.snippet?.publishedAt || account.accountCreatedAt || new Date().toISOString()
      });
      
      console.log(`Datos actualizados para YouTube: ${account.username}`);
    } else if (channelInfo && !channelInfo.hasChannel) {
      await disconnectAccount({ accountId: account._id as Id<"socialAccounts"> });
      showError(`La cuenta de YouTube ${account.username} ya no tiene un canal. Por favor, reconecta la cuenta después de crear un canal.`);
    }
  };

  const updateFacebookAccount = async (account: any) => {
    console.log(`Actualizando datos de Facebook para: ${account.username}`);
    const userInfo = await getFacebookUserInfo({ accessToken: account.accessToken });
    
    if (userInfo) {
      const hasPage = userInfo.hasPage;
      const userData = userInfo.user;
      const pageData = userInfo.page;
      
      if (!hasPage || !pageData) {
        await disconnectAccount({ accountId: account._id as Id<"socialAccounts"> });
        showError(`La cuenta de Facebook ${account.username} ya no tiene páginas de negocio. Por favor, reconecta la cuenta después de crear una página de Facebook para tu negocio.`);
        return;
      }
      
      const accountData = {
        username: pageData.username || pageData.name || userData.name,
        name: userData.name,
        followers: pageData.followers_count || 0,
        following: pageData.fan_count || 0,
        posts: pageData.published_posts.data.length || 0,
        profileImageUrl: pageData.picture?.data?.url || userData.picture?.data?.url || account.profileImageUrl || '',
        verified: pageData.verification_status === 'verified' || account.verified || false,
        accountCreatedAt: pageData.created_time || userData.created_time || account.accountCreatedAt || new Date().toISOString()
      };
      
      await saveFacebookAccount({
        userId: account.userId,
        username: accountData.username,
        name: accountData.name,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken,
        expiresAt: account.expiresAt,
        followers: accountData.followers,
        following: accountData.following,
        posts: accountData.posts,
        profileImageUrl: accountData.profileImageUrl,
        verified: accountData.verified,
        accountCreatedAt: accountData.accountCreatedAt
      });
      
      console.log(`Datos actualizados para Facebook: ${account.username}`);
    }
  };

  const updateInstagramAccount = async (account: any) => {
    console.log(`Actualizando datos de Instagram para: ${account.username}`);
    const userInfo = await getInstagramUserInfo({ accessToken: account.accessToken });
    
    if (userInfo) {
      const userData = userInfo.user;
      
      await saveInstagramAccount({
        userId: account.userId,
        username: userData.username || account.username,
        name: userData.username || account.name,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken,
        expiresAt: account.expiresAt,
        followers: userData.followers_count || account.followers || 0,
        following: userData.follows_count || account.following || 0,
        posts: userData.media_count || account.posts || 0,
        profileImageUrl: account.profileImageUrl || '',
        verified: account.verified || false,
        accountCreatedAt: account.accountCreatedAt || new Date().toISOString()
      });
      
      console.log(`Datos actualizados para Instagram: ${account.username}`);
    }
  };

  const updateMicrosoftAccount = async (account: any) => {
    console.log(`Actualizando datos de Microsoft para: ${account.username}`);
    const userInfo = await getMicrosoftUserInfo({ accessToken: account.accessToken });
    
    if (userInfo) {
      await saveMicrosoftAccount({
        userId: account.userId,
        username: userInfo.userPrincipalName || userInfo.displayName || account.username,
        name: userInfo.displayName || userInfo.userPrincipalName || account.name,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken,
        expiresAt: account.expiresAt,
        email: userInfo.mail || userInfo.userPrincipalName || account.email || '',
        profileImageUrl: account.profileImageUrl || '',
        accountCreatedAt: account.accountCreatedAt || new Date().toISOString()
      });
      
      console.log(`Datos actualizados para Microsoft: ${account.username}`);
    }
  };

  return {
    // State
    isConnecting,
    tiktokCallbackProcessed,
    twitterCallbackProcessed,
    linkedinCallbackProcessed,
    youtubeCallbackProcessed,
    facebookCallbackProcessed,
    instagramCallbackProcessed,
    microsoftCallbackProcessed,
    
    // Callback handlers
    handleTwitterCallback,
    handleTikTokCallback,
    handleLinkedInCallback,
    handleYouTubeCallback,
    handleFacebookCallback,
    handleInstagramCallback,
    handleMicrosoftCallback,
    
    // Connect handlers
    handleConnectTwitter,
    handleConnectTikTok,
    handleConnectLinkedIn,
    handleConnectYouTube,
    handleConnectFacebook,
    handleConnectInstagram,
    handleConnectMicrosoft,
    
    // Utility functions
    handleReconnectAccount,
    updateConnectedAccounts,
  };
}; 