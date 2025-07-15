import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  RefreshCw, 
  BarChart2, 
  ArrowUp, 
  ArrowDown, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Globe, 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Eye, 
  TrendingUp,
  Plus,
  Edit,
  Trash,
  X,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

// Types for social media metrics
interface SocialMetrics {
  followers: number;
  followersChange: number;
  engagement: number;
  engagementChange: number;
  reach: number;
  reachChange: number;
  clicks: number;
  clicksChange: number;
}

interface SocialAccount {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'youtube';
  handle: string;
  url: string;
  connected: boolean;
  metrics: SocialMetrics;
  userId?: string;
  accessToken?: string;
  connectedAt?: string;
}

// Instagram App Configuration (these would be environment variables in production)
const INSTAGRAM_CONFIG = {
  clientId: import.meta.env.VITE_INSTAGRAM_CLIENT_ID || 'your_instagram_client_id',
  redirectUri: import.meta.env.VITE_INSTAGRAM_REDIRECT_URI || 'https://your-domain.com/auth/instagram/callback',
  scope: 'user_profile,user_media'
};

// Facebook App Configuration (these would be environment variables in production)
const FACEBOOK_CONFIG = {
  appId: import.meta.env.VITE_FACEBOOK_APP_ID || 'your_facebook_app_id',
  redirectUri: import.meta.env.VITE_FACEBOOK_REDIRECT_URI || 'https://your-domain.com/auth/facebook/callback',
  scope: 'pages_show_list,pages_read_engagement,pages_manage_posts,pages_read_user_content,pages_messaging'
};

// Twitter/X App Configuration (these would be environment variables in production)
const TWITTER_CONFIG = {
  clientId: import.meta.env.VITE_TWITTER_CLIENT_ID || 'your_twitter_client_id',
  redirectUri: import.meta.env.VITE_TWITTER_REDIRECT_URI || 'https://your-domain.com/auth/twitter/callback',
  scope: 'tweet.read tweet.write users.read dm.read dm.write offline.access',
  authUrl: 'https://twitter.com/i/oauth2/authorize',
  tokenUrl: 'https://api.twitter.com/2/oauth2/token'
};

// Mock data for social accounts
const mockSocialAccounts: SocialAccount[] = [
  {
    id: '1',
    platform: 'instagram',
    handle: '@clinicpro_vet',
    url: 'https://instagram.com/clinicpro_vet',
    connected: true,
    connectedAt: '2024-01-15T10:30:00Z',
    metrics: {
      followers: 5240,
      followersChange: 120,
      engagement: 3.8,
      engagementChange: 0.5,
      reach: 15600,
      reachChange: 1200,
      clicks: 320,
      clicksChange: 45
    }
  },
  {
    id: '2',
    platform: 'facebook',
    handle: 'ClinicPro Veterinaria',
    url: 'https://facebook.com/clinicpro',
    connected: false,
    metrics: {
      followers: 0,
      followersChange: 0,
      engagement: 0,
      engagementChange: 0,
      reach: 0,
      reachChange: 0,
      clicks: 0,
      clicksChange: 0
    }
  }
];

interface Post {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'youtube';
  content: string;
  image?: string;
  publishDate: string;
  status: 'published' | 'scheduled' | 'draft';
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
}

// Mock data for posts
const mockPosts: Post[] = [
  {
    id: '1',
    platform: 'instagram',
    content: '¡Descubre nuestros servicios de peluquería canina! 🐶✂️ Agenda tu cita hoy mismo y consigue un 15% de descuento en tu primera visita. #ClinicPro #PeluqueríaCanina #Mascotas',
    image: 'https://images.pexels.com/photos/6568663/pexels-photo-6568663.jpeg',
    publishDate: '2025-05-20T10:30:00',
    status: 'published',
    metrics: {
      likes: 245,
      comments: 32,
      shares: 18,
      views: 1250
    }
  },
  {
    id: '2',
    platform: 'facebook',
    content: 'Consejos para el cuidado de tu mascota en verano: Mantén a tu amigo peludo fresco e hidratado durante los meses de calor. Visita nuestra clínica para un chequeo completo antes de las vacaciones. #CuidadoMascotas #Verano',
    image: 'https://images.pexels.com/photos/6568478/pexels-photo-6568478.jpeg',
    publishDate: '2025-05-18T14:15:00',
    status: 'published',
    metrics: {
      likes: 187,
      comments: 24,
      shares: 45,
      views: 2300
    }
  },
  {
    id: '3',
    platform: 'twitter',
    content: '¿Sabías que los gatos duermen un promedio de 15 horas al día? Algunos incluso duermen hasta 20 horas. ¡Expertos en siestas! 😺 #DatosCuriosos #Gatos',
    publishDate: '2025-05-15T09:45:00',
    status: 'published',
    metrics: {
      likes: 98,
      comments: 12,
      shares: 34,
      views: 870
    }
  },
  {
    id: '4',
    platform: 'linkedin',
    content: 'Nos complace anunciar la incorporación del Dr. Miguel Torres a nuestro equipo de especialistas. Con más de 15 años de experiencia en dermatología veterinaria, el Dr. Torres refuerza nuestro compromiso con la excelencia en el cuidado de mascotas.',
    image: 'https://images.pexels.com/photos/6568501/pexels-photo-6568501.jpeg',
    publishDate: '2025-05-12T11:00:00',
    status: 'published',
    metrics: {
      likes: 76,
      comments: 8,
      shares: 15,
      views: 520
    }
  },
  {
    id: '5',
    platform: 'instagram',
    content: 'Próximamente: Jornada de vacunación gratuita para mascotas de familias con recursos limitados. Más información en nuestra web. #ResponsabilidadSocial #CuidadoAnimal',
    publishDate: '2025-05-25T16:00:00',
    status: 'scheduled',
    metrics: {
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0
    }
  },
  {
    id: '6',
    platform: 'facebook',
    content: 'Borrador para campaña de adopción responsable...',
    publishDate: '',
    status: 'draft',
    metrics: {
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0
    }
  }
];

const SocialMediaDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [accounts, setAccounts] = useState<SocialAccount[]>(mockSocialAccounts);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    // Filter posts based on search term, platform, and status
    const filteredPosts = mockPosts.filter(post => {
      const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = selectedPlatform === 'all' || post.platform === selectedPlatform;
      const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
      
      return matchesSearch && matchesPlatform && matchesStatus;
    });

  // Calculate total metrics across all connected platforms
  const totalMetrics = accounts.reduce(
    (acc, account) => {
      if (account.connected) {
        acc.followers += account.metrics.followers;
        acc.followersChange += account.metrics.followersChange;
        acc.engagement += account.metrics.engagement * account.metrics.followers;
        acc.reach += account.metrics.reach;
        acc.reachChange += account.metrics.reachChange;
        acc.clicks += account.metrics.clicks;
        acc.clicksChange += account.metrics.clicksChange;
        acc.totalAccounts += 1;
      }
      return acc;
    },
    { 
      followers: 0, 
      followersChange: 0, 
      engagement: 0, 
      reach: 0, 
      reachChange: 0, 
      clicks: 0, 
      clicksChange: 0, 
      totalAccounts: 0 
    }
  );

  // Calculate average engagement
  totalMetrics.engagement = totalMetrics.totalAccounts > 0 
    ? totalMetrics.engagement / totalMetrics.followers 
    : 0;

  // Platform icons and colors
  const platformConfig = {
    instagram: { 
      icon: <Instagram size={20} />, 
      color: 'text-pink-600', 
      bgColor: 'bg-pink-100',
      name: 'Instagram'
    },
    facebook: { 
      icon: <Facebook size={20} />, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100',
      name: 'Facebook'
    },
    twitter: { 
      icon: <Twitter size={20} />, 
      color: 'text-blue-400', 
      bgColor: 'bg-blue-50',
      name: 'Twitter'
    },
    linkedin: { 
      icon: <Linkedin size={20} />, 
      color: 'text-blue-800', 
      bgColor: 'bg-blue-50',
      name: 'LinkedIn'
    },
    youtube: { 
      icon: <Youtube size={20} />, 
      color: 'text-red-600', 
      bgColor: 'bg-red-100',
      name: 'YouTube'
    }
  };

  const statusStyles = {
    published: 'bg-green-100 text-green-800',
    scheduled: 'bg-blue-100 text-blue-800',
    draft: 'bg-gray-100 text-gray-800'
  };

  const statusLabels = {
    published: 'Publicado',
    scheduled: 'Programado',
    draft: 'Borrador'
  };

  const handleDateChange = (field: 'from' | 'to', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRefresh = () => {
    console.log('Fetching data for range:', dateRange);
    // Here you would refresh data from connected accounts
  };

  // Instagram OAuth flow
  const handleInstagramConnect = () => {
    setIsConnecting(true);

    // Build Instagram OAuth URL
    const authUrl = new URL('https://api.instagram.com/oauth/authorize');
    authUrl.searchParams.append('client_id', INSTAGRAM_CONFIG.clientId);
    authUrl.searchParams.append('redirect_uri', INSTAGRAM_CONFIG.redirectUri);
    authUrl.searchParams.append('scope', INSTAGRAM_CONFIG.scope);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('state', Date.now().toString()); // Add state for security

    // Open popup window for Instagram auth
    const popup = window.open(
      authUrl.toString(),
      'instagram-auth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );

    // Listen for the auth callback
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        setIsConnecting(false);
        // In a real implementation, you would check for the auth code
        // and complete the OAuth flow
        simulateInstagramConnection();
      }
    }, 1000);

    // Timeout after 5 minutes
    setTimeout(() => {
      if (popup && !popup.closed) {
        popup.close();
        setIsConnecting(false);
        setConnectionStatus({
          type: 'error',
          message: 'Conexión cancelada por tiempo de espera'
        });
      }
    }, 300000);
  };

  // Facebook OAuth flow
  const handleFacebookConnect = () => {
    setIsConnecting(true);

    // Build Facebook OAuth URL
    const authUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth');
    authUrl.searchParams.append('client_id', FACEBOOK_CONFIG.appId);
    authUrl.searchParams.append('redirect_uri', FACEBOOK_CONFIG.redirectUri);
    authUrl.searchParams.append('scope', FACEBOOK_CONFIG.scope);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('state', Date.now().toString()); // Add state for security

    // Open popup window for Facebook auth
    const popup = window.open(
      authUrl.toString(),
      'facebook-auth',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    );

    // Listen for the auth callback
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        setIsConnecting(false);
        // In a real implementation, you would check for the auth code
        // and complete the OAuth flow
        simulateFacebookConnection();
      }
    }, 1000);

    // Timeout after 5 minutes
    setTimeout(() => {
      if (popup && !popup.closed) {
        popup.close();
        setIsConnecting(false);
        setConnectionStatus({
          type: 'error',
          message: 'Conexión cancelada por tiempo de espera'
        });
      }
    }, 300000);
  };

  // Simulate Instagram connection (in production, this would handle the OAuth callback)
  const simulateInstagramConnection = () => {
    setTimeout(() => {
      const newAccount: SocialAccount = {
        id: Date.now().toString(),
        platform: 'instagram',
        handle: '@nuevacuenta_instagram',
        url: 'https://instagram.com/nuevacuenta_instagram',
        connected: true,
        connectedAt: new Date().toISOString(),
        userId: 'ig_user_' + Date.now(),
        accessToken: 'fake_access_token_' + Date.now(),
        metrics: {
          followers: 1250,
          followersChange: 45,
          engagement: 4.2,
          engagementChange: 0.8,
          reach: 3200,
          reachChange: 250,
          clicks: 85,
          clicksChange: 12
        }
      };

      setAccounts(prev => [...prev, newAccount]);
      setConnectionStatus({
        type: 'success',
        message: 'Cuenta de Instagram conectada exitosamente'
      });
      setShowNewAccountModal(false);

      // Clear status message after 5 seconds
      setTimeout(() => {
        setConnectionStatus({ type: null, message: '' });
      }, 5000);
    }, 1500);
  };

  // Simulate Facebook connection (in production, this would handle the OAuth callback)
  const simulateFacebookConnection = () => {
    setTimeout(() => {
      const newAccount: SocialAccount = {
        id: Date.now().toString(),
        platform: 'facebook',
        handle: 'ClinicPro Veterinaria',
        url: 'https://facebook.com/clinicpro_veterinaria',
        connected: true,
        connectedAt: new Date().toISOString(),
        userId: 'fb_user_' + Date.now(),
        accessToken: 'fake_fb_access_token_' + Date.now(),
        metrics: {
          followers: 2850,
          followersChange: 75,
          engagement: 2.9,
          engagementChange: 0.3,
          reach: 8500,
          reachChange: 650,
          clicks: 180,
          clicksChange: 28
        }
      };

      setAccounts(prev => [...prev, newAccount]);
      setConnectionStatus({
        type: 'success',
        message: 'Cuenta de Facebook conectada exitosamente'
      });
      setShowNewAccountModal(false);

      // Clear status message after 5 seconds
      setTimeout(() => {
        setConnectionStatus({ type: null, message: '' });
      }, 5000);
    }, 1500);
  };

  // Twitter/X OAuth 2.0 flow with PKCE
  const handleTwitterConnect = async () => {
    setIsConnecting(true);

    try {
      // Generate PKCE code verifier and challenge
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      
      // Store code verifier for later use
      sessionStorage.setItem('twitter_code_verifier', codeVerifier);

      // Generate state parameter for security
      const state = generateRandomString(32);
      sessionStorage.setItem('twitter_oauth_state', state);

      // Build Twitter OAuth URL according to X documentation
      const authUrl = new URL(TWITTER_CONFIG.authUrl);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('client_id', TWITTER_CONFIG.clientId);
      authUrl.searchParams.append('redirect_uri', TWITTER_CONFIG.redirectUri);
      authUrl.searchParams.append('scope', TWITTER_CONFIG.scope);
      authUrl.searchParams.append('state', state);
      authUrl.searchParams.append('code_challenge', codeChallenge);
      authUrl.searchParams.append('code_challenge_method', 'S256');

      // Open popup window for Twitter auth
      const popup = window.open(
        authUrl.toString(),
        'twitter-auth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      // Listen for the auth callback
      const handleAuthMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'twitter_auth_success') {
          const { tokenData, user } = event.data;
          
          // Create account with real data from Twitter
          const newAccount: SocialAccount = {
            id: Date.now().toString(),
            platform: 'twitter',
            handle: '@' + user.username,
            url: `https://twitter.com/${user.username}`,
            connected: true,
            connectedAt: new Date().toISOString(),
            userId: user.id,
            accessToken: tokenData.access_token,
            metrics: {
              followers: user.public_metrics?.followers_count || 0,
              followersChange: 0, // Would need historical data
              engagement: 0, // Would need to calculate from recent tweets
              engagementChange: 0,
              reach: 0, // Would need analytics data
              reachChange: 0,
              clicks: 0, // Would need analytics data
              clicksChange: 0
            }
          };

          setAccounts(prev => [...prev, newAccount]);
          setConnectionStatus({
            type: 'success',
            message: `Cuenta de Twitter @${user.username} conectada exitosamente`
          });
          setShowNewAccountModal(false);
          setIsConnecting(false);

          // Clear stored OAuth data
          sessionStorage.removeItem('twitter_code_verifier');
          sessionStorage.removeItem('twitter_oauth_state');

          // Clear status message after 5 seconds
          setTimeout(() => {
            setConnectionStatus({ type: null, message: '' });
          }, 5000);

          popup?.close();
          window.removeEventListener('message', handleAuthMessage);
        } else if (event.data.type === 'twitter_auth_error') {
          setConnectionStatus({
            type: 'error',
            message: `Error en la autenticación de Twitter/X: ${event.data.error}`
          });
          setIsConnecting(false);
          popup?.close();
          window.removeEventListener('message', handleAuthMessage);
        }
      };

      window.addEventListener('message', handleAuthMessage);

      // Check if popup is closed manually
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          setIsConnecting(false);
          window.removeEventListener('message', handleAuthMessage);
        }
      }, 1000);

      // Timeout after 5 minutes
      setTimeout(() => {
        if (popup && !popup.closed) {
          popup.close();
          setIsConnecting(false);
          setConnectionStatus({
            type: 'error',
            message: 'Conexión cancelada por tiempo de espera'
          });
          window.removeEventListener('message', handleAuthMessage);
        }
      }, 300000);

    } catch (error) {
      console.error('Error starting Twitter OAuth flow:', error);
      setIsConnecting(false);
      setConnectionStatus({
        type: 'error',
        message: 'Error al iniciar el proceso de autenticación'
      });
    }
  };

  

  // PKCE and OAuth helper functions
  const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const generateCodeChallenge = async (verifier: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const generateRandomString = (length: number) => {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
      .substring(0, length);
  };

  

  const handleDisconnectAccount = (accountId: string) => {
    setAccounts(prev => prev.filter(account => account.id !== accountId));
    setConnectionStatus({
      type: 'success',
      message: 'Cuenta desconectada exitosamente'
    });

    setTimeout(() => {
      setConnectionStatus({ type: null, message: '' });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Redes Sociales</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión y conexión de cuentas de redes sociales
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            icon={<Download size={18} />}
            className="flex-1 sm:flex-none"
          >
            Exportar
          </Button>
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            className="flex-1 sm:flex-none"
            onClick={() => setShowNewAccountModal(true)}
          >
            Nueva Cuenta
          </Button>
        </div>
      </div>

      {/* Connection Status Alert */}
      {connectionStatus.type && (
        <div className={`p-4 rounded-md flex items-center gap-3 ${
          connectionStatus.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {connectionStatus.type === 'success' ? (
            <CheckCircle size={20} className="text-green-600" />
          ) : (
            <AlertCircle size={20} className="text-red-600" />
          )}
          <span className="text-sm font-medium">{connectionStatus.message}</span>
        </div>
      )}

      {/* Date Range Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 p-2">
          <Input
            type="date"
            value={dateRange.from}
            onChange={(e) => handleDateChange('from', e.target.value)}
            label="Desde"
          />
          <Input
            type="date"
            value={dateRange.to}
            onChange={(e) => handleDateChange('to', e.target.value)}
            label="Hasta"
          />
          <Button
            variant="outline"
            icon={<RefreshCw size={18} />}
            onClick={handleRefresh}
            className="self-end"
          >
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Seguidores</h3>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{totalMetrics.followers.toLocaleString()}</p>
            <div className="mt-2 flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{totalMetrics.followersChange} nuevos</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Engagement</h3>
              <Heart className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{totalMetrics.engagement.toFixed(1)}%</p>
            <div className="mt-2 flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+0.3% vs. mes anterior</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Alcance</h3>
              <Eye className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{totalMetrics.reach.toLocaleString()}</p>
            <div className="mt-2 flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{totalMetrics.reachChange.toLocaleString()} vs. mes anterior</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Clics</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{totalMetrics.clicks.toLocaleString()}</p>
            <div className="mt-2 flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{totalMetrics.clicksChange.toLocaleString()} vs. mes anterior</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Connected Accounts */}
      <Card title="Cuentas Conectadas" icon={<Globe size={20} />}>
        <div className="p-4">
          {accounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accounts.map(account => (
                <div 
                  key={account.id} 
                  className={`border rounded-lg p-4 ${account.connected ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full ${platformConfig[account.platform].bgColor}`}>
                        {platformConfig[account.platform].icon}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">{account.handle}</h3>
                        <a 
                          href={account.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-blue-600 hover:underline flex items-center"
                        >
                          Ver perfil <ExternalLink size={12} className="ml-1" />
                        </a>
                        {account.connectedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Conectada el {new Date(account.connectedAt).toLocaleDateString('es-ES')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {account.connected ? (
                        <>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={12} className="mr-1" />
                            Conectada
                          </span>
                          <button
                            onClick={() => handleDisconnectAccount(account.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Desconectar cuenta"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowNewAccountModal(true)}
                        >
                          Conectar
                        </Button>
                      )}
                    </div>
                  </div>

                  {account.connected && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Seguidores</p>
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">{account.metrics.followers.toLocaleString()}</p>
                          <span className="ml-1 text-xs text-green-600">+{account.metrics.followersChange}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Engagement</p>
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">{account.metrics.engagement.toFixed(1)}%</p>
                          <span className={`ml-1 text-xs ${account.metrics.engagementChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {account.metrics.engagementChange >= 0 ? '+' : ''}{account.metrics.engagementChange.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Globe size={48} className="mx-auto text-gray-300" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay cuentas conectadas</h3>
              <p className="mt-1 text-sm text-gray-500">
                Conecta tus redes sociales para comenzar a gestionar tu presencia digital.
              </p>
              <div className="mt-6">
                <Button
                  variant="primary"
                  icon={<Plus size={18} />}
                  onClick={() => setShowNewAccountModal(true)}
                >
                  Conectar Primera Cuenta
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
       {/* Posts Management */}
       <Card title="Publicaciones" icon={<MessageSquare size={20} />}>
        <div className="p-4 space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Buscar publicaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} />}
              className="flex-1"
            />
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
            >
              <option value="all">Todas las plataformas</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter</option>
              <option value="linkedin">LinkedIn</option>
              <option value="youtube">YouTube</option>
            </select>
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="published">Publicados</option>
              <option value="scheduled">Programados</option>
              <option value="draft">Borradores</option>
            </select>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className={`p-2 rounded-full ${platformConfig[post.platform].bgColor} mr-3 flex-shrink-0`}>
                    {platformConfig[post.platform].icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[post.status]}`}>
                        {statusLabels[post.status]}
                      </span>
                      <div className="flex space-x-2">
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => setSelectedPost(post)}
                        >
                          <Eye size={18} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit size={18} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-900 line-clamp-2">{post.content}</p>
                    {post.status !== 'draft' && (
                      <p className="mt-1 text-xs text-gray-500">
                        {post.status === 'published' 
                          ? `Publicado el ${new Date(post.publishDate).toLocaleDateString('es-ES')}`
                          : `Programado para el ${new Date(post.publishDate).toLocaleDateString('es-ES')}`
                        }
                      </p>
                    )}
                    
                    {post.status === 'published' && (
                      <div className="mt-3 flex space-x-4">
                        <div className="flex items-center">
                          <Heart size={14} className="text-red-500 mr-1" />
                          <span className="text-xs text-gray-700">{post.metrics.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare size={14} className="text-blue-500 mr-1" />
                          <span className="text-xs text-gray-700">{post.metrics.comments}</span>
                        </div>
                        <div className="flex items-center">
                          <Share2 size={14} className="text-green-500 mr-1" />
                          <span className="text-xs text-gray-700">{post.metrics.shares}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye size={14} className="text-purple-500 mr-1" />
                          <span className="text-xs text-gray-700">{post.metrics.views}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {post.image && (
                    <div className="ml-3 flex-shrink-0">
                      <img 
                        src={post.image} 
                        alt="Post" 
                        className="h-16 w-16 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare size={48} className="mx-auto text-gray-300" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay publicaciones</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No se encontraron publicaciones que coincidan con los filtros seleccionados.
                </p>
                <div className="mt-6">
                  <Button
                    variant="primary"
                    icon={<Plus size={18} />}
                    onClick={() => setShowNewPostModal(true)}
                  >
                    Crear Nueva Publicación
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Post Details Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                {platformConfig[selectedPost.platform].icon}
                <h3 className="ml-2 text-lg font-medium text-gray-900">
                  Detalles de la Publicación
                </h3>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[selectedPost.status]}`}>
                    {statusLabels[selectedPost.status]}
                  </span>
                  {selectedPost.status !== 'draft' && (
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedPost.status === 'published' 
                        ? `Publicado el ${new Date(selectedPost.publishDate).toLocaleDateString('es-ES')}`
                        : `Programado para el ${new Date(selectedPost.publishDate).toLocaleDateString('es-ES')}`
                      }
                    </p>
                  )}
                </div>
                
                {selectedPost.image && (
                  <div className="mt-4">
                    <img 
                      src={selectedPost.image} 
                      alt="Post" 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <div className="mt-4">
                  <p className="text-gray-900 whitespace-pre-line">{selectedPost.content}</p>
                </div>
                
                {selectedPost.status === 'published' && (
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Rendimiento</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center">
                          <Heart size={20} className="text-red-500 mr-2" />
                          <span className="text-2xl font-semibold text-gray-900">{selectedPost.metrics.likes}</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Me gusta</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center">
                          <MessageSquare size={20} className="text-blue-500 mr-2" />
                          <span className="text-2xl font-semibold text-gray-900">{selectedPost.metrics.comments}</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Comentarios</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center">
                          <Share2 size={20} className="text-green-500 mr-2" />
                          <span className="text-2xl font-semibold text-gray-900">{selectedPost.metrics.shares}</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Compartidos</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center">
                          <Eye size={20} className="text-purple-500 mr-2" />
                          <span className="text-2xl font-semibold text-gray-900">{selectedPost.metrics.views}</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Visualizaciones</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                icon={<Edit size={18} />}
              >
                Editar
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedPost(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Nueva Publicación
              </h3>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plataformas
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(platformConfig).map(([platform, config]) => (
                      <label 
                        key={platform} 
                        className="inline-flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50"
                      >
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 flex items-center">
                          {config.icon}
                          <span className="ml-1 text-sm text-gray-700 capitalize">{platform}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contenido
                  </label>
                  <textarea
                    rows={5}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Escribe el contenido de tu publicación..."
                  ></textarea>
                  <p className="mt-1 text-xs text-gray-500">
                    Caracteres: 0/280
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagen
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Subir un archivo</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">o arrastrar y soltar</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Publicación
                    </label>
                    <Input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora
                    </label>
                    <Input
                      type="time"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="draft">Guardar como borrador</option>
                    <option value="scheduled">Programar publicación</option>
                    <option value="published">Publicar ahora</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowNewPostModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Account Modal */}
      {showNewAccountModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-medium text-gray-900">
                Conectar Nueva Cuenta
              </h3>
              <button
                onClick={() => setShowNewAccountModal(false)}
                className="text-gray-400 hover:text-gray-500"
                disabled={isConnecting}
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Selecciona la plataforma que deseas conectar. Serás redirigido para autorizar el acceso.
                </p>

                <div className="space-y-3">
                  {/* Instagram Connection */}
                  <button
                    onClick={handleInstagramConnect}
                    disabled={isConnecting}
                    className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-pink-100">
                        <Instagram size={20} className="text-pink-600" />
                      </div>
                      <div className="ml-3 text-left">
                        <span className="block text-sm font-medium text-gray-900">Instagram</span>
                        <span className="block text-xs text-gray-500">Conectar cuenta de Instagram</span>
                      </div>
                    </div>
                    {isConnecting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                    ) : (
                      <ExternalLink size={16} className="text-gray-400" />
                    )}
                  </button>

                  {/* Facebook Connection */}
                  <button
                    onClick={handleFacebookConnect}
                    disabled={isConnecting}
                    className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Facebook size={20} className="text-blue-600" />
                      </div>
                      <div className="ml-3 text-left">
                        <span className="block text-sm font-medium text-gray-900">Facebook</span>
                        <span className="block text-xs text-gray-500">Conectar página de Facebook</span>
                      </div>
                    </div>
                    {isConnecting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    ) : (
                      <ExternalLink size={16} className="text-gray-400" />
                    )}
                  </button>

                  {/* Twitter/X Connection */}
                  <button
                    onClick={handleTwitterConnect}
                    disabled={isConnecting}
                    className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-blue-50">
                        <Twitter size={20} className="text-blue-400" />
                      </div>
                      <div className="ml-3 text-left">
                        <span className="block text-sm font-medium text-gray-900">Twitter / X</span>
                        <span className="block text-xs text-gray-500">Conectar cuenta de Twitter/X</span>
                      </div>
                    </div>
                    {isConnecting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    ) : (
                      <ExternalLink size={16} className="text-gray-400" />
                    )}
                  </button>

                  {/* Coming Soon Platforms */}
                  <div className="space-y-2 opacity-50">
                    <p className="text-xs text-gray-400 font-medium">Próximamente:</p>

                    {['linkedin', 'youtube'].map((platform) => (
                      <div
                        key={platform}
                        className="w-full flex items-center p-3 border rounded-lg bg-gray-50 cursor-not-allowed"
                      >
                        <div className={`p-2 rounded-full ${platformConfig[platform as keyof typeof platformConfig].bgColor}`}>
                          {platformConfig[platform as keyof typeof platformConfig].icon}
                        </div>
                        <span className="ml-3 text-sm text-gray-500 capitalize">
                          {platformConfig[platform as keyof typeof platformConfig].name}
                        </span>
                        <span className="ml-auto text-xs text-gray-400">Próximamente</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">¿Qué necesitas para conectar Instagram?</h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Una cuenta de Instagram Business o Creator</li>
                      <li>• Permisos de administrador de la cuenta</li>
                      <li>• Acceso a la aplicación de Facebook asociada</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">¿Qué necesitas para conectar Facebook?</h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Una página de Facebook Business</li>
                      <li>• Rol de administrador en la página</li>
                      <li>• Aplicación de Facebook configurada</li>
                      <li>• Permisos para gestionar publicaciones y mensajes</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">¿Qué necesitas para conectar Twitter/X?</h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Una cuenta de Twitter/X Business o Creator</li>
                      <li>• Aplicación registrada en Twitter Developer Portal</li>
                      <li>• API v2 con permisos de lectura y escritura</li>
                      <li>• Acceso a Direct Messages API</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end flex-shrink-0">
              <Button
                variant="outline"
                onClick={() => setShowNewAccountModal(false)}
                disabled={isConnecting}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaDashboard;