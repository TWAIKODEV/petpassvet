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
  X
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
}

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
    youtube: { icon: <Youtube size={20} />, color: 'text-red-600', bgColor: 'bg-red-100' }
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
            variant="primary"
            icon={<Plus size={18} />}
            className="flex-1 sm:flex-none"
            onClick={() => setShowNewPostModal(true)}
          >
            Nueva Publicación
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSocialAccounts.map(account => (
              <div 
                key={account.id} 
                className={`border rounded-lg p-4 ${account.connected ? '' : 'opacity-60'}`}
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
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Ver perfil
                      </a>
                    </div>
                  </div>
                  <div>
                    {account.connected ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Conectada
                      </span>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowAccountModal(true)}
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
                  {Object.entries(platformConfig).map(([platform, config]) => (
                    <button
                      key={platform}
                      className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className={`p-2 rounded-full ${platform === 'instagram' ? 'bg-pink-100' : platform === 'facebook' ? 'bg-blue-100' : platform === 'twitter' ? 'bg-blue-50' : platform === 'linkedin' ? 'bg-blue-50' : 'bg-red-100'}`}>
                        {config.icon}
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-900 capitalize">
                        Conectar con {platform}
                      </span>
                    </button>
                  ))}
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
    </div>
  );
};

export default SocialMediaDashboard;