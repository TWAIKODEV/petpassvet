import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  RefreshCw, 
  ArrowUp, 
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
  X
} from 'lucide-react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import ToastContainer from '../../../components/common/ToastContainer';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import TikTok from '../../../components/icon/TikTok';
import { useSocialMediaAuth } from '../../../hooks/useSocialMediaAuth';

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
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok' | 'microsoft';
  handle: string;
  url: string;
  connected: boolean;
  metrics: SocialMetrics;
}

interface Post {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok';
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

interface ConnectedAccount {
  _id: string;
  userId: string;
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'microsoft';
  username: string;
  name: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  connected: boolean;
  // Métricas sociales
  followers?: number;
  following?: number;
  posts?: number;
  views?: number;
  profileImageUrl?: string;
  verified?: boolean;
  accountCreatedAt?: string;
  email?: string;
  createdAt: number;
  updatedAt: number;
}

// Mock data for social accounts
const mockSocialAccounts: SocialAccount[] = [
  {
    id: '1',
    platform: 'instagram',
    handle: '@clinicpro_vet',
    url: 'https://instagram.com/clinicpro_vet',
    connected: true,
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
    connected: true,
    metrics: {
      followers: 8750,
      followersChange: 85,
      engagement: 2.5,
      engagementChange: -0.2,
      reach: 22400,
      reachChange: 1800,
      clicks: 540,
      clicksChange: 30
    }
  },
  {
    id: '3',
    platform: 'twitter',
    handle: '@ClinicPro',
    url: 'https://twitter.com/clinicpro',
    connected: true,
    metrics: {
      followers: 3120,
      followersChange: 45,
      engagement: 1.9,
      engagementChange: 0.3,
      reach: 9800,
      reachChange: 750,
      clicks: 210,
      clicksChange: 15
    }
  },
  {
    id: '4',
    platform: 'linkedin',
    handle: 'ClinicPro',
    url: 'https://linkedin.com/company/clinicpro',
    connected: true,
    metrics: {
      followers: 1850,
      followersChange: 35,
      engagement: 4.2,
      engagementChange: 0.8,
      reach: 5200,
      reachChange: 420,
      clicks: 180,
      clicksChange: 25
    }
  },
  {
    id: '5',
    platform: 'youtube',
    handle: 'ClinicPro Vet',
    url: 'https://youtube.com/c/clinicprovet',
    connected: false,
    metrics: {
      followers: 980,
      followersChange: 0,
      engagement: 0,
      engagementChange: 0,
      reach: 0,
      reachChange: 0,
      clicks: 0,
      clicksChange: 0
    }
  },
  {
    id: '6',
    platform: 'tiktok',
    handle: '@clinicpro_vet',
    url: 'https://tiktok.com/@clinicpro_vet',
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
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isUpdatingAccounts, setIsUpdatingAccounts] = useState(false);
  const [hasInitialUpdate, setHasInitialUpdate] = useState(false);
  
  // Use the social media auth composable
  const {
    isConnecting,
    tiktokCallbackProcessed,
    twitterCallbackProcessed,
    linkedinCallbackProcessed,
    youtubeCallbackProcessed,
    facebookCallbackProcessed,
    instagramCallbackProcessed,
    microsoftCallbackProcessed,
    handleTwitterCallback,
    handleTikTokCallback,
    handleLinkedInCallback,
    handleYouTubeCallback,
    handleFacebookCallback,
    handleInstagramCallback,
    handleMicrosoftCallback,
    handleConnectTwitter,
    handleConnectTikTok,
    handleConnectLinkedIn,
    handleConnectYouTube,
    handleConnectFacebook,
    handleConnectInstagram,
    handleConnectMicrosoft,
    handleReconnectAccount,
    updateConnectedAccounts: updateAccounts
  } = useSocialMediaAuth();
  
  // Convex queries
  const connectedAccounts = useQuery(api.twitter.getConnectedAccounts, { userId: "current-user" });
  const disconnectAccount = useMutation(api.twitter.disconnectAccount);

  // Manejar la respuesta de autenticación de redes sociales cuando se carga la página
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (code && state) {
      // Pequeño delay para asegurar que el localStorage esté disponible
      setTimeout(() => {
        // Verificar si es TikTok, Twitter, LinkedIn o YouTube basándose en el localStorage
        const twitterState = localStorage.getItem('twitter_auth_state');
        const tiktokState = localStorage.getItem('tiktok_auth_state');
        const linkedinState = localStorage.getItem('linkedin_auth_state');
        const youtubeState = localStorage.getItem('youtube_auth_state');
        const facebookState = localStorage.getItem('facebook_auth_state');
        const instagramState = localStorage.getItem('instagram_auth_state');
        const microsoftState = localStorage.getItem('microsoft_auth_state');
        
        if (state === twitterState && !twitterCallbackProcessed) {
          handleTwitterCallback();
        } else if (state === tiktokState && !tiktokCallbackProcessed) {
          handleTikTokCallback();
        } else if (state === linkedinState && !linkedinCallbackProcessed) {
          handleLinkedInCallback();
        } else if (state === youtubeState && !youtubeCallbackProcessed) {
          handleYouTubeCallback();
        } else if (state === facebookState && !facebookCallbackProcessed) {
          handleFacebookCallback();
        } else if (state === instagramState && !instagramCallbackProcessed) {
          handleInstagramCallback();
        } else if (state === microsoftState && !microsoftCallbackProcessed) {
          handleMicrosoftCallback();
        }
      }, 100);
    }
  }, [twitterCallbackProcessed, tiktokCallbackProcessed, linkedinCallbackProcessed, youtubeCallbackProcessed, facebookCallbackProcessed, instagramCallbackProcessed, microsoftCallbackProcessed, handleTwitterCallback, handleTikTokCallback, handleLinkedInCallback, handleYouTubeCallback, handleFacebookCallback, handleInstagramCallback, handleMicrosoftCallback]);

  // Actualizar datos de cuentas conectadas al cargar la página (solo una vez)
  useEffect(() => {
    if (connectedAccounts && connectedAccounts.length > 0 && !isUpdatingAccounts && !hasInitialUpdate) {
      // Solo actualizar si hay cuentas conectadas y no hemos hecho la actualización inicial
      const hasConnectedAccounts = connectedAccounts.some(account => account.connected);
      if (hasConnectedAccounts) {
        setHasInitialUpdate(true);
        setIsUpdatingAccounts(true);
        updateAccounts(connectedAccounts).finally(() => {
          setIsUpdatingAccounts(false);
        });
      }
    }
  }, [connectedAccounts?.length, isUpdatingAccounts, hasInitialUpdate, updateAccounts]); // Solo se ejecuta cuando cambia el número de cuentas

  // Filter posts based on search term, platform, and status
  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || post.platform === selectedPlatform;
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus;
    
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  // Calculate total metrics across all platforms
  const totalMetrics = mockSocialAccounts.reduce(
    (acc, account) => {
      if (account.connected) {
        acc.followers += account.metrics.followers;
        acc.followersChange += account.metrics.followersChange;
        acc.engagement += account.metrics.engagement * account.metrics.followers; // Weighted average
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
    instagram: { icon: <Instagram size={20} />, color: 'text-pink-600', bgColor: 'bg-pink-100' },
    facebook: { icon: <Facebook size={20} />, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    twitter: { icon: <Twitter size={20} />, color: 'text-blue-400', bgColor: 'bg-blue-50' },
    linkedin: { icon: <Linkedin size={20} />, color: 'text-blue-800', bgColor: 'bg-blue-50' },
    youtube: { icon: <Youtube size={20} />, color: 'text-red-600', bgColor: 'bg-red-100' },
    tiktok: { icon: <TikTok size={20} />, color: 'text-black', bgColor: 'bg-black' },
    microsoft: { 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
        </svg>
      ), 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50' 
    }
  };

  // Status styles
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
    // Here you would typically fetch new data with the selected date range
    console.log('Fetching data for range:', dateRange);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Redes Sociales</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión y análisis de redes sociales
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
            variant="outline"
            icon={<RefreshCw size={18} />}
            className="flex-1 sm:flex-none"
            onClick={() => {
              if (connectedAccounts) {
                setIsUpdatingAccounts(true);
                updateAccounts(connectedAccounts).finally(() => {
                  setIsUpdatingAccounts(false);
                });
              }
            }}
            disabled={isUpdatingAccounts}
          >
            {isUpdatingAccounts ? 'Actualizando...' : 'Actualizar Datos'}
          </Button>
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            className="flex-1 sm:flex-none"
            onClick={() => setShowAccountModal(true)}
          >
            Nueva Cuenta
          </Button>
        </div>
      </div>

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
          {/* Indicador de actualización */}
          {isUpdatingAccounts && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <RefreshCw className="h-4 w-4 text-blue-500 animate-spin mr-2" />
                <span className="text-sm text-blue-700">Actualizando datos de cuentas...</span>
              </div>
            </div>
          )}
          
          {connectedAccounts && connectedAccounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectedAccounts.map((account: ConnectedAccount) => (
                <div 
                  key={account._id} 
                  className="border rounded-lg p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className={`p-2 rounded-full flex-shrink-0 ${platformConfig[account.platform as keyof typeof platformConfig].bgColor}`}>
                        {platformConfig[account.platform as keyof typeof platformConfig].icon}
                      </div>
                      <div className="ml-3 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {account.platform === 'youtube' ? account.username : `@${account.username}`}
                          </h3>
                          {account.verified && (
                            <span className="text-blue-500 flex-shrink-0">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{account.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {account.connected ? (
                        <>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
                            Conectada
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => disconnectAccount({ accountId: account._id as Id<"socialAccounts"> })}
                            className="text-xs px-1.5 py-0.5 h-6"
                          >
                            Desconectar
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 whitespace-nowrap">
                            Desconectada
                          </span>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleReconnectAccount(account.platform)}
                            className="text-xs px-1.5 py-0.5 h-6"
                          >
                            Conectar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Métricas sociales */}
                  {account.followers !== undefined && (
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{account.followers?.toLocaleString()}</div>
                        <div className="text-gray-500">
                          {account.platform === 'facebook' ? 'Seguidores' : 'Seguidores'}
                        </div>
                      </div>
                      {account.platform === 'youtube' ? (
                        account.views !== undefined && (
                          <div className="text-center">
                            <div className="font-medium text-gray-900">{account.views?.toLocaleString()}</div>
                            <div className="text-gray-500">Visitas</div>
                          </div>
                        )
                      ) : account.platform === 'facebook' ? (
                        account.following !== undefined && (
                          <div className="text-center">
                            <div className="font-medium text-gray-900">{account.following?.toLocaleString()}</div>
                            <div className="text-gray-500">Fans</div>
                          </div>
                        )
                      ) : (
                        account.following !== undefined && (
                          <div className="text-center">
                            <div className="font-medium text-gray-900">{account.following?.toLocaleString()}</div>
                            <div className="text-gray-500">Siguiendo</div>
                          </div>
                        )
                      )}
                      {account.posts !== undefined && (
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{account.posts?.toLocaleString()}</div>
                          <div className="text-gray-500">
                            {account.platform === 'facebook' ? 'Publicaciones' : 'Publicaciones'}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4 text-xs text-gray-500">
                    {account.connected 
                      ? `Conectada el ${new Date(account.createdAt).toLocaleDateString()}`
                      : `Desconectada el ${new Date(account.updatedAt).toLocaleDateString()}`
                    }
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <Globe size={48} className="mx-auto" />
              </div>
              <p className="text-gray-500 mb-4">No hay cuentas conectadas</p>
              <Button
                variant="primary"
                onClick={() => setShowAccountModal(true)}
              >
                Conectar Primera Cuenta
              </Button>
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
              <option value="tiktok">TikTok</option>
              <option value="microsoft">Microsoft</option>
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

      {/* Connect Account Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Conectar Cuenta
              </h3>
              <button
                onClick={() => setShowAccountModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Selecciona la plataforma que deseas conectar y sigue las instrucciones para autorizar el acceso.
                </p>
                
                <div className="space-y-2">
                  {/* Botón específico para Twitter */}
                  <button
                    onClick={handleConnectTwitter}
                    disabled={isConnecting}
                    className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="p-2 rounded-full bg-blue-50">
                      <Twitter size={20} className="text-blue-400" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {isConnecting ? 'Conectando...' : 'Conectar con Twitter'}
                    </span>
                  </button>
                  
                  {/* Botón específico para TikTok */}
                  <button
                    onClick={handleConnectTikTok}
                    disabled={isConnecting}
                    className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="p-2 rounded-full bg-black">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.7-1.35 3.9-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.2.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {isConnecting ? 'Conectando...' : 'Conectar con TikTok'}
                    </span>
                  </button>
                  
                  {/* Botón específico para LinkedIn */}
                  <button
                    onClick={handleConnectLinkedIn}
                    disabled={isConnecting}
                    className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="p-2 rounded-full bg-blue-50">
                      <Linkedin size={20} className="text-blue-800" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {isConnecting ? 'Conectando...' : 'Conectar con LinkedIn'}
                    </span>
                  </button>
                  
                  {/* Botón específico para YouTube */}
                  <button
                    onClick={handleConnectYouTube}
                    disabled={isConnecting}
                    className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="p-2 rounded-full bg-red-50">
                      <Youtube size={20} className="text-red-600" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {isConnecting ? 'Conectando...' : 'Conectar con YouTube'}
                    </span>
                  </button>
                  
                  {/* Botón específico para Facebook */}
                  <button
                    onClick={handleConnectFacebook}
                    disabled={isConnecting}
                    className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="p-2 rounded-full bg-blue-50">
                      <Facebook size={20} className="text-blue-600" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {isConnecting ? 'Conectando...' : 'Conectar con Facebook'}
                    </span>
                  </button>
                  
                  {/* Botón específico para Instagram */}
                  <button
                    onClick={handleConnectInstagram}
                    disabled={isConnecting}
                    className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="p-2 rounded-full bg-pink-50">
                      <Instagram size={20} className="text-pink-600" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {isConnecting ? 'Conectando...' : 'Conectar con Instagram'}
                    </span>
                  </button>
                  
                  {/* Botón específico para Microsoft */}
                  <button
                    onClick={handleConnectMicrosoft}
                    disabled={isConnecting}
                    className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="p-2 rounded-full bg-blue-50">
                      <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
                      </svg>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {isConnecting ? 'Conectando...' : 'Conectar con Microsoft'}
                    </span>
                  </button>
                  
                  {/* Otros botones deshabilitados por ahora */}
                  {Object.entries(platformConfig).map(([platform, config]) => {
                    if (platform === 'twitter' || platform === 'tiktok' || platform === 'linkedin' || platform === 'youtube' || platform === 'facebook' || platform === 'instagram' || platform === 'microsoft') return null; // Ya incluidos arriba
                    return (
                      <button
                        key={platform}
                        disabled
                        className="w-full flex items-center p-3 border rounded-lg opacity-50 cursor-not-allowed"
                      >
                        <div className={`p-2 rounded-full ${platform === 'instagram' ? 'bg-pink-100' : 'bg-red-100'}`}>
                          {config.icon}
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-900 capitalize">
                          Conectar con {platform} (Próximamente)
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowAccountModal(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default SocialMediaDashboard;