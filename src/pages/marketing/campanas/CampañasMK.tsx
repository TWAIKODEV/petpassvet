import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  RefreshCw, 
  Eye, 
  Edit, 
  Trash, 
  BarChart2, 
  ArrowRight, 
  ArrowDown,
  ArrowUp, 
  Mail, 
  MessageSquare, 
  Phone, 
  Target, 
  Users, 
  DollarSign, 
  Megaphone, 
  Globe, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Twitter, 
  Youtube, 
  TrendingUp, 
  X,
  AtSign,
  MousePointer
} from 'lucide-react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import StatCard from '../../../components/dashboard/StatCard';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'web' | 'event' | 'referral' | 'sem';
  status: 'active' | 'scheduled' | 'completed' | 'draft';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  leads: number;
  conversions: number;
  roi: number;
  channels: string[];
  owner: string;
  description?: string;
  tags?: string[];
}

// Mock data for campaigns
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Campaña Primavera 2025',
    type: 'email',
    status: 'active',
    startDate: '2025-03-15',
    endDate: '2025-05-31',
    budget: 2500,
    spent: 1800,
    leads: 120,
    conversions: 35,
    roi: 2.8,
    channels: ['email', 'facebook', 'instagram'],
    owner: 'María López',
    description: 'Campaña de primavera para promocionar servicios de vacunación y peluquería',
    tags: ['primavera', 'vacunación', 'peluquería']
  },
  {
    id: '2',
    name: 'Lanzamiento PetPass',
    type: 'social',
    status: 'active',
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    budget: 5000,
    spent: 3200,
    leads: 250,
    conversions: 85,
    roi: 3.2,
    channels: ['facebook', 'instagram', 'twitter'],
    owner: 'Carlos Rodríguez',
    description: 'Campaña de lanzamiento del nuevo programa de suscripción PetPass',
    tags: ['lanzamiento', 'petpass', 'suscripción']
  },
  {
    id: '3',
    name: 'Webinar Nutrición Canina',
    type: 'event',
    status: 'scheduled',
    startDate: '2025-06-15',
    endDate: '2025-06-15',
    budget: 1200,
    spent: 0,
    leads: 0,
    conversions: 0,
    roi: 0,
    channels: ['email', 'web'],
    owner: 'Ana Martínez',
    description: 'Webinar educativo sobre nutrición canina con el Dr. Ramírez',
    tags: ['webinar', 'nutrición', 'educación']
  },
  {
    id: '4',
    name: 'Descuentos Verano 2025',
    type: 'web',
    status: 'draft',
    startDate: '2025-07-01',
    endDate: '2025-08-31',
    budget: 3000,
    spent: 0,
    leads: 0,
    conversions: 0,
    roi: 0,
    channels: ['web', 'email', 'facebook'],
    owner: 'Laura Sánchez',
    description: 'Campaña de descuentos para servicios durante el verano',
    tags: ['verano', 'descuentos', 'promoción']
  },
  {
    id: '5',
    name: 'Programa de Referidos',
    type: 'referral',
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    budget: 1500,
    spent: 750,
    leads: 85,
    conversions: 42,
    roi: 4.2,
    channels: ['email', 'web'],
    owner: 'Javier García',
    description: 'Programa continuo de referidos para clientes actuales',
    tags: ['referidos', 'fidelización', 'anual']
  },
  {
    id: '6',
    name: 'Campaña Navidad 2024',
    type: 'social',
    status: 'completed',
    startDate: '2024-11-15',
    endDate: '2024-12-31',
    budget: 4000,
    spent: 4000,
    leads: 180,
    conversions: 65,
    roi: 2.9,
    channels: ['facebook', 'instagram', 'email'],
    owner: 'María López',
    description: 'Campaña navideña con ofertas especiales y regalos',
    tags: ['navidad', 'regalos', 'promoción']
  },
  {
    id: '7',
    name: 'Campaña SEM Google Ads',
    type: 'sem',
    status: 'active',
    startDate: '2025-05-01',
    endDate: '2025-07-31',
    budget: 3500,
    spent: 1200,
    leads: 95,
    conversions: 28,
    roi: 3.5,
    channels: ['google'],
    owner: 'Pablo Martínez',
    description: 'Campaña de búsqueda pagada en Google para servicios veterinarios',
    tags: ['sem', 'google', 'ppc']
  },
  {
    id: '8',
    name: 'Campaña LinkedIn Profesionales',
    type: 'social',
    status: 'active',
    startDate: '2025-04-15',
    endDate: '2025-06-15',
    budget: 2800,
    spent: 1400,
    leads: 65,
    conversions: 18,
    roi: 2.4,
    channels: ['linkedin'],
    owner: 'Elena Gómez',
    description: 'Campaña dirigida a profesionales del sector veterinario',
    tags: ['linkedin', 'b2b', 'networking']
  },
  {
    id: '9',
    name: 'Campaña TikTok Jóvenes',
    type: 'social',
    status: 'scheduled',
    startDate: '2025-06-01',
    endDate: '2025-08-31',
    budget: 2200,
    spent: 0,
    leads: 0,
    conversions: 0,
    roi: 0,
    channels: ['tiktok'],
    owner: 'Sara Jiménez',
    description: 'Campaña en TikTok dirigida a jóvenes dueños de mascotas',
    tags: ['tiktok', 'jóvenes', 'tendencias']
  }
];

const campaignTypeIcons = {
  'email': { icon: Mail, className: 'text-blue-600', label: 'Email' },
  'social': { icon: MessageSquare, className: 'text-purple-600', label: 'Redes Sociales' },
  'web': { icon: Globe, className: 'text-green-600', label: 'Web' },
  'event': { icon: Calendar, className: 'text-orange-600', label: 'Evento' },
  'referral': { icon: Users, className: 'text-teal-600', label: 'Referidos' },
  'sem': { icon: MousePointer, className: 'text-red-600', label: 'SEM' }
};

const statusStyles = {
  'active': 'bg-green-100 text-green-800',
  'scheduled': 'bg-blue-100 text-blue-800',
  'completed': 'bg-gray-100 text-gray-800',
  'draft': 'bg-yellow-100 text-yellow-800'
};

const statusLabels = {
  'active': 'Activa',
  'scheduled': 'Programada',
  'completed': 'Completada',
  'draft': 'Borrador'
};

const channelIcons = {
  'email': <Mail size={16} className="text-blue-600" />,
  'facebook': <Facebook size={16} className="text-blue-600" />,
  'instagram': <Instagram size={16} className="text-pink-600" />,
  'twitter': <Twitter size={16} className="text-blue-400" />,
  'linkedin': <Linkedin size={16} className="text-blue-800" />,
  'youtube': <Youtube size={16} className="text-red-600" />,
  'web': <Globe size={16} className="text-green-600" />,
  'google': <AtSign size={16} className="text-red-500" />,
  'tiktok': <MessageSquare size={16} className="text-black" />
};

const CampañasMK: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSocialChannel, setSelectedSocialChannel] = useState<string>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dateRange, setDateRange] = useState({
    from: '2025-01-01',
    to: '2025-12-31'
  });

  // Filter campaigns based on search term, type, status, and social channel
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.owner.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || campaign.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || campaign.status === selectedStatus;
    
    // Filter by social channel if applicable
    const matchesSocialChannel = 
      selectedSocialChannel === 'all' || 
      campaign.channels.includes(selectedSocialChannel);
    
    return matchesSearch && matchesType && matchesStatus && matchesSocialChannel;
  });

  // Calculate summary statistics
  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.budget, 0);
  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spent, 0);
  const totalLeads = campaigns.reduce((sum, campaign) => sum + campaign.leads, 0);
  const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0);
  const averageROI = campaigns.length > 0 
    ? campaigns.reduce((sum, campaign) => sum + campaign.roi, 0) / campaigns.length 
    : 0;

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleStatusChange = (campaignId: string, newStatus: string) => {
    // Here you would typically make an API call to update the campaign status
    setCampaigns(prevCampaigns => 
      prevCampaigns.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, status: newStatus as any } 
          : campaign
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campañas de Marketing</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de campañas y embudo de marketing
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="flex rounded-md shadow-sm">
            <button
              className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'grid'
                  ? 'bg-blue-50 text-blue-600 border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setViewMode('grid')}
              title="Vista de tarjetas"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-b border-r ${
                viewMode === 'list'
                  ? 'bg-blue-50 text-blue-600 border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setViewMode('list')}
              title="Vista de lista"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>
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
          >
            Nueva Campaña
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Presupuesto Total"
          value={totalBudget.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          icon={<DollarSign size={24} />}
        />
        <StatCard
          title="Gasto Actual"
          value={totalSpent.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          icon={<DollarSign size={24} />}
          subtitle={`${Math.round((totalSpent / totalBudget) * 100)}% del presupuesto`}
        />
        <StatCard
          title="Leads Generados"
          value={totalLeads.toString()}
          icon={<Target size={24} />}
        />
        <StatCard
          title="Conversiones"
          value={totalConversions.toString()}
          icon={<Users size={24} />}
          subtitle={`${Math.round((totalConversions / totalLeads) * 100)}% ratio de conversión`}
        />
        <StatCard
          title="ROI Promedio"
          value={`${averageROI.toFixed(1)}x`}
          icon={<TrendingUp size={24} />}
        />
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="date"
              label="Desde"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="sm:w-40"
            />
            <Input
              type="date"
              label="Hasta"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="sm:w-40"
            />
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">Todos los tipos</option>
              <option value="email">Email</option>
              <option value="social">Redes Sociales</option>
              <option value="web">Web</option>
              <option value="event">Eventos</option>
              <option value="referral">Referidos</option>
              <option value="sem">SEM</option>
            </select>
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="scheduled">Programadas</option>
              <option value="completed">Completadas</option>
              <option value="draft">Borradores</option>
            </select>
            {(selectedType === 'all' || selectedType === 'social') && (
              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={selectedSocialChannel}
                onChange={(e) => setSelectedSocialChannel(e.target.value)}
              >
                <option value="all">Todas las redes</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
              </select>
            )}
          </div>
          
          <div className="flex gap-4">
            <Input
              placeholder="Buscar campañas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} />}
              className="flex-1"
            />
            <Button
              variant="outline"
              icon={<RefreshCw size={18} />}
              onClick={() => setSearchTerm('')}
            >
              Resetear
            </Button>
          </div>
        </div>
      </Card>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => {
            const CampaignTypeIcon = campaignTypeIcons[campaign.type].icon;
            return (
              <Card key={campaign.id}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{campaign.name}</h3>
                      <div className="mt-1 flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[campaign.status]}`}>
                          {statusLabels[campaign.status]}
                        </span>
                        <span className="mx-2 text-gray-300">•</span>
                        <CampaignTypeIcon size={16} className={campaignTypeIcons[campaign.type].className} />
                        <span className="ml-1 text-sm text-gray-500">{campaignTypeIcons[campaign.type].label}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Edit size={16} />}
                      >
                        Editar
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Fecha Inicio</p>
                      <p className="text-sm text-gray-900">
                        {new Date(campaign.startDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fecha Fin</p>
                      <p className="text-sm text-gray-900">
                        {new Date(campaign.endDate).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Presupuesto</p>
                      <p className="text-sm font-medium text-gray-900">
                        {campaign.budget.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Gastado</p>
                      <p className="text-sm text-gray-900">
                        {campaign.spent.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-gray-900">Progreso</p>
                      <p className="text-xs text-gray-500">
                        {Math.round((campaign.spent / campaign.budget) * 100)}%
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, Math.round((campaign.spent / campaign.budget) * 100))}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Leads</p>
                        <p className="text-sm font-medium text-gray-900">{campaign.leads}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Conversiones</p>
                        <p className="text-sm font-medium text-gray-900">
                          {campaign.conversions} ({Math.round((campaign.conversions / campaign.leads) * 100) || 0}%)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Canales</p>
                    <div className="flex flex-wrap gap-2">
                      {campaign.channels.map((channel) => (
                        <div key={channel} className="flex items-center">
                          {channelIcons[channel]}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <select
                        value={campaign.status}
                        onChange={(e) => handleStatusChange(campaign.id, e.target.value)}
                        className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Eye size={16} />}
                        onClick={() => handleViewCampaign(campaign)}
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaña
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fechas
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Presupuesto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resultados
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ROI
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCampaigns.map((campaign) => {
                  const CampaignTypeIcon = campaignTypeIcons[campaign.type].icon;
                  return (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <CampaignTypeIcon className={`h-5 w-5 ${campaignTypeIcons[campaign.type].className}`} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                            <div className="text-sm text-gray-500">{campaign.owner}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{campaignTypeIcons[campaign.type].label}</div>
                        <div className="text-xs text-gray-500">
                          {campaign.channels.map(channel => (
                            <span key={channel} className="inline-block mr-1">
                              {channelIcons[channel]}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(campaign.startDate).toLocaleDateString('es-ES')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(campaign.endDate).toLocaleDateString('es-ES')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {campaign.budget.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </div>
                        <div className="text-xs text-gray-500">
                          Gastado: {campaign.spent.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full" 
                            style={{ width: `${Math.min(100, Math.round((campaign.spent / campaign.budget) * 100))}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {campaign.leads} leads
                        </div>
                        <div className="text-xs text-gray-500">
                          {campaign.conversions} conversiones ({Math.round((campaign.conversions / campaign.leads) * 100) || 0}%)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {campaign.roi}x
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          {campaign.roi > 1 ? (
                            <>
                              <ArrowUp size={12} className="text-green-500 mr-1" />
                              <span className="text-green-500">Positivo</span>
                            </>
                          ) : campaign.roi === 0 ? (
                            <span>Neutral</span>
                          ) : (
                            <>
                              <ArrowDown size={12} className="text-red-500 mr-1" />
                              <span className="text-red-500">Negativo</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={campaign.status}
                          onChange={(e) => handleStatusChange(campaign.id, e.target.value)}
                          className={`text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${statusStyles[campaign.status]}`}
                        >
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <option 
                              key={value} 
                              value={value}
                              className="text-gray-900 bg-white"
                            >
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewCampaign(campaign)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Ver detalles"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            title="Eliminar"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No se encontraron campañas</h3>
              <p className="text-gray-500 mt-1">Prueba con otros términos de búsqueda o cambia los filtros</p>
            </div>
          )}
        </div>
      )}

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Detalles de la Campaña
              </h3>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campaign Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Información de la Campaña</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nombre</p>
                      <p className="mt-1 text-base font-medium text-gray-900">{selectedCampaign.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tipo</p>
                      <div className="mt-1 flex items-center">
                        {(() => {
                          const IconComponent = campaignTypeIcons[selectedCampaign.type].icon;
                          return (
                            <IconComponent size={16} className={campaignTypeIcons[selectedCampaign.type].className} />
                          );
                        })()}
                        <span className="ml-1 text-sm text-gray-900">{campaignTypeIcons[selectedCampaign.type].label}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Responsable</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedCampaign.owner}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Estado</p>
                      <p className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[selectedCampaign.status]}`}>
                          {statusLabels[selectedCampaign.status]}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Descripción</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedCampaign.description || 'Sin descripción'}</p>
                    </div>
                    {selectedCampaign.tags && selectedCampaign.tags.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Etiquetas</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {selectedCampaign.tags.map((tag, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Campaign Metrics */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Métricas de la Campaña</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Fecha de Inicio</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(selectedCampaign.startDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Fecha de Fin</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(selectedCampaign.endDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Presupuesto</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {selectedCampaign.budget.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Gastado</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedCampaign.spent.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium text-gray-500">Progreso del Presupuesto</p>
                        <p className="text-xs text-gray-500">
                          {Math.round((selectedCampaign.spent / selectedCampaign.budget) * 100)}%
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, Math.round((selectedCampaign.spent / selectedCampaign.budget) * 100))}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Leads Generados</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">{selectedCampaign.leads}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Conversiones</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedCampaign.conversions} ({Math.round((selectedCampaign.conversions / selectedCampaign.leads) * 100) || 0}%)
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">ROI</p>
                      <div className="mt-1 flex items-center">
                        <span className="text-lg font-medium text-gray-900">{selectedCampaign.roi}x</span>
                        {selectedCampaign.roi > 1 ? (
                          <span className="ml-2 text-xs text-green-600 flex items-center">
                            <ArrowUp size={12} className="mr-1" />
                            Positivo
                          </span>
                        ) : selectedCampaign.roi === 0 ? (
                          <span className="ml-2 text-xs text-gray-500">Neutral</span>
                        ) : (
                          <span className="ml-2 text-xs text-red-600 flex items-center">
                            <ArrowDown size={12} className="mr-1" />
                            Negativo
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Canales</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedCampaign.channels.map((channel) => (
                          <div key={channel} className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs">
                            {channelIcons[channel]}
                            <span className="ml-1 capitalize">{channel}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Funnel Visualization */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Embudo de Conversión</h4>
                <div className="relative max-w-xl mx-auto">
                  {/* Funnel stages */}
                  <div className="flex flex-col items-center">
                    {/* Awareness */}
                    <div className="w-full bg-blue-100 rounded-t-lg p-4 text-center">
                      <p className="font-medium text-blue-800">Conocimiento</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {(selectedCampaign.leads * 3).toLocaleString()}
                      </p>
                      <p className="text-sm text-blue-700">Impresiones</p>
                    </div>
                    <div className="w-0 h-0 border-l-[120px] border-r-[120px] border-t-[30px] border-l-transparent border-r-transparent border-t-blue-100 mx-auto"></div>
                    
                    {/* Interest */}
                    <div className="w-5/6 bg-green-100 p-4 text-center -mt-1">
                      <p className="font-medium text-green-800">Interés</p>
                      <p className="text-2xl font-bold text-green-900">
                        {(selectedCampaign.leads * 1.5).toLocaleString()}
                      </p>
                      <p className="text-sm text-green-700">Interacciones</p>
                    </div>
                    <div className="w-0 h-0 border-l-[100px] border-r-[100px] border-t-[30px] border-l-transparent border-r-transparent border-t-green-100 mx-auto"></div>
                    
                    {/* Consideration */}
                    <div className="w-4/6 bg-yellow-100 p-4 text-center -mt-1">
                      <p className="font-medium text-yellow-800">Consideración</p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {selectedCampaign.leads.toLocaleString()}
                      </p>
                      <p className="text-sm text-yellow-700">Leads</p>
                    </div>
                    <div className="w-0 h-0 border-l-[80px] border-r-[80px] border-t-[30px] border-l-transparent border-r-transparent border-t-yellow-100 mx-auto"></div>
                    
                    {/* Conversion */}
                    <div className="w-3/6 bg-red-100 p-4 text-center -mt-1">
                      <p className="font-medium text-red-800">Conversión</p>
                      <p className="text-2xl font-bold text-red-900">
                        {selectedCampaign.conversions.toLocaleString()}
                      </p>
                      <p className="text-sm text-red-700">Clientes</p>
                    </div>
                    <div className="w-0 h-0 border-l-[60px] border-r-[60px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-100 mx-auto"></div>
                    
                    {/* Loyalty */}
                    <div className="w-2/6 bg-purple-100 rounded-b-lg p-4 text-center -mt-1">
                      <p className="font-medium text-purple-800">Fidelización</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {Math.round(selectedCampaign.conversions * 0.7).toLocaleString()}
                      </p>
                      <p className="text-sm text-purple-700">Clientes recurrentes</p>
                    </div>
                  </div>
                  
                  {/* Conversion rates */}
                  <div className="mt-6 grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Impresiones → Interacciones</p>
                      <p className="text-sm font-medium text-gray-900">50%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Interacciones → Leads</p>
                      <p className="text-sm font-medium text-gray-900">67%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Leads → Clientes</p>
                      <p className="text-sm font-medium text-gray-900">
                        {Math.round((selectedCampaign.conversions / selectedCampaign.leads) * 100) || 0}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Clientes → Recurrentes</p>
                      <p className="text-sm font-medium text-gray-900">70%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <div>
                <select
                  value={selectedCampaign.status}
                  onChange={(e) => handleStatusChange(selectedCampaign.id, e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  icon={<BarChart2 size={18} />}
                >
                  Ver Análisis
                </Button>
                <Button
                  variant="outline"
                  icon={<Edit size={18} />}
                >
                  Editar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedCampaign(null)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampañasMK;