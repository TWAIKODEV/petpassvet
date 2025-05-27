import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  RefreshCw, 
  BarChart2, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Globe, 
  Smartphone, 
  Tablet, 
  Monitor, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Clock, 
  X, 
  Plus, 
  Edit, 
  Trash, 
  Save, 
  FileText, 
  Mail, 
  MessageSquare, 
  Facebook, 
  Instagram, 
  Search as SearchIcon, 
  MapPin, 
  Settings, 
  Layout, 
  Image, 
  List, 
  User, 
  Star, 
  Phone, 
  Menu
} from 'lucide-react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import StatCard from '../../../components/dashboard/StatCard';

const WebDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    from: '2025-05-01',
    to: '2025-05-31'
  });
  const [activeTab, setActiveTab] = useState<'resumen' | 'trafico' | 'formularios' | 'keywords' | 'area' | 'configurador'>('resumen');
  const [showHeatmapModal, setShowHeatmapModal] = useState(false);
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [activeConfigSection, setActiveConfigSection] = useState<string>('header');
  const [searchTerm, setSearchTerm] = useState('');

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

  // Traffic sources data
  const trafficSources = [
    { source: 'Búsqueda orgánica', visits: 3245, percentage: 42, change: 8.3, isPositive: true },
    { source: 'Directo', visits: 1876, percentage: 24, change: 2.1, isPositive: true },
    { source: 'Redes sociales', visits: 1245, percentage: 16, change: 15.7, isPositive: true },
    { source: 'Referencias', visits: 876, percentage: 11, change: -3.2, isPositive: false },
    { source: 'Email', visits: 543, percentage: 7, change: 5.4, isPositive: true }
  ];

  // Device data
  const deviceData = [
    { device: 'Móvil', icon: <Smartphone size={16} />, visits: 4256, percentage: 55 },
    { device: 'Escritorio', icon: <Monitor size={16} />, visits: 2765, percentage: 36 },
    { device: 'Tablet', icon: <Tablet size={16} />, visits: 698, percentage: 9 }
  ];

  // Top pages data
  const topPages = [
    { url: '/servicios/veterinaria', title: 'Servicios Veterinarios', visits: 1245, timeOnPage: '2:35' },
    { url: '/', title: 'Página de Inicio', visits: 987, timeOnPage: '1:47' },
    { url: '/contacto', title: 'Contacto', visits: 765, timeOnPage: '1:23' },
    { url: '/servicios/peluqueria', title: 'Servicios de Peluquería', visits: 654, timeOnPage: '2:12' },
    { url: '/blog/cuidados-mascota-verano', title: 'Cuidados para tu mascota en verano', visits: 543, timeOnPage: '3:45' }
  ];

  // Traffic channels data
  const trafficChannels = [
    { 
      channel: 'Búsqueda orgánica', 
      icon: <SearchIcon size={16} className="text-blue-600" />, 
      visits: 3245, 
      conversions: 98, 
      conversionRate: 3.02,
      change: 8.3,
      isPositive: true
    },
    { 
      channel: 'Redes sociales', 
      icon: <Facebook size={16} className="text-blue-800" />, 
      visits: 1245, 
      conversions: 42, 
      conversionRate: 3.37,
      change: 15.7,
      isPositive: true
    },
    { 
      channel: 'Email marketing', 
      icon: <Mail size={16} className="text-purple-600" />, 
      visits: 543, 
      conversions: 31, 
      conversionRate: 5.71,
      change: 5.4,
      isPositive: true
    },
    { 
      channel: 'Directo', 
      icon: <Globe size={16} className="text-green-600" />, 
      visits: 1876, 
      conversions: 45, 
      conversionRate: 2.40,
      change: 2.1,
      isPositive: true
    },
    { 
      channel: 'Referencias', 
      icon: <ArrowRight size={16} className="text-orange-600" />, 
      visits: 876, 
      conversions: 28, 
      conversionRate: 3.20,
      change: -3.2,
      isPositive: false
    }
  ];

  // Forms data
  const formsData = [
    { 
      id: 'form-1',
      name: 'Formulario de Contacto', 
      location: '/contacto', 
      submissions: 87, 
      conversionRate: 4.2,
      change: 5.7,
      isPositive: true,
      fields: ['Nombre', 'Email', 'Teléfono', 'Mensaje']
    },
    { 
      id: 'form-2',
      name: 'Solicitud de Cita', 
      location: '/citas', 
      submissions: 124, 
      conversionRate: 8.5,
      change: 12.3,
      isPositive: true,
      fields: ['Nombre', 'Email', 'Teléfono', 'Mascota', 'Servicio', 'Fecha preferida']
    },
    { 
      id: 'form-3',
      name: 'Suscripción Newsletter', 
      location: '/blog', 
      submissions: 56, 
      conversionRate: 2.8,
      change: -1.2,
      isPositive: false,
      fields: ['Email']
    },
    { 
      id: 'form-4',
      name: 'Consulta Veterinaria Online', 
      location: '/servicios/consulta-online', 
      submissions: 42, 
      conversionRate: 5.3,
      change: 8.9,
      isPositive: true,
      fields: ['Nombre', 'Email', 'Teléfono', 'Mascota', 'Síntomas', 'Foto']
    }
  ];

  // Recent form submissions
  const recentSubmissions = [
    { 
      id: 'sub-1',
      formName: 'Formulario de Contacto',
      date: '2025-05-30',
      name: 'María García',
      email: 'maria.garcia@example.com',
      phone: '+34 666 777 888',
      message: 'Me gustaría información sobre los servicios de peluquería canina.'
    },
    { 
      id: 'sub-2',
      formName: 'Solicitud de Cita',
      date: '2025-05-29',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@example.com',
      phone: '+34 666 888 999',
      pet: 'Rocky (Perro)',
      service: 'Vacunación',
      preferredDate: '2025-06-05'
    },
    { 
      id: 'sub-3',
      formName: 'Consulta Veterinaria Online',
      date: '2025-05-28',
      name: 'Ana Martínez',
      email: 'ana.martinez@example.com',
      phone: '+34 666 999 000',
      pet: 'Milo (Gato)',
      symptoms: 'Mi gato ha estado vomitando desde ayer y no quiere comer.'
    }
  ];

  // Keywords data
  const keywordsData = [
    { 
      keyword: 'veterinario madrid', 
      position: 3, 
      volume: 2400, 
      difficulty: 67,
      relevance: 95,
      change: -1,
      isPositive: false
    },
    { 
      keyword: 'peluquería canina', 
      position: 5, 
      volume: 1800, 
      difficulty: 58,
      relevance: 90,
      change: 2,
      isPositive: true
    },
    { 
      keyword: 'vacunación perros', 
      position: 7, 
      volume: 1200, 
      difficulty: 45,
      relevance: 85,
      change: 0,
      isPositive: true
    },
    { 
      keyword: 'veterinario urgencias', 
      position: 12, 
      volume: 980, 
      difficulty: 72,
      relevance: 80,
      change: 3,
      isPositive: true
    },
    { 
      keyword: 'clínica veterinaria cerca', 
      position: 8, 
      volume: 2200, 
      difficulty: 65,
      relevance: 92,
      change: -2,
      isPositive: false
    },
    { 
      keyword: 'precio vacuna rabia', 
      position: 4, 
      volume: 850, 
      difficulty: 40,
      relevance: 75,
      change: 1,
      isPositive: true
    }
  ];

  // Keyword suggestions
  const keywordSuggestions = [
    { keyword: 'veterinario económico madrid', volume: 720, difficulty: 42, relevance: 78 },
    { keyword: 'peluquería gatos madrid', volume: 480, difficulty: 35, relevance: 82 },
    { keyword: 'castración perros precio', volume: 890, difficulty: 38, relevance: 80 },
    { keyword: 'veterinario abierto domingos', volume: 650, difficulty: 55, relevance: 85 }
  ];

  // Competitors data
  const competitorsData = [
    { name: 'Clínica Veterinaria Mascotas Felices', distance: '1.2 km', rating: 4.7, reviews: 128, website: 'mascotasfelices.com' },
    { name: 'Centro Veterinario San Bernardo', distance: '2.5 km', rating: 4.5, reviews: 95, website: 'vetsanbernardo.es' },
    { name: 'Hospital Veterinario 24h Madrid', distance: '3.8 km', rating: 4.8, reviews: 215, website: 'hospitalvet24h.com' },
    { name: 'Peluquería Canina Guau', distance: '1.5 km', rating: 4.6, reviews: 87, website: 'peluqueriacaninaguau.es' }
  ];

  // Demographics data
  const demographicsData = {
    population: 125000,
    petOwners: 42000,
    averageIncome: '38.500€',
    ageGroups: [
      { group: '18-30', percentage: 22 },
      { group: '31-45', percentage: 35 },
      { group: '46-60', percentage: 28 },
      { group: '60+', percentage: 15 }
    ]
  };

  // Website sections for configurator
  const websiteSections = [
    { id: 'header', name: 'Cabecera', icon: <Menu size={16} /> },
    { id: 'hero', name: 'Hero', icon: <Image size={16} /> },
    { id: 'services', name: 'Servicios', icon: <List size={16} /> },
    { id: 'about', name: 'Sobre Nosotros', icon: <User size={16} /> },
    { id: 'testimonials', name: 'Testimonios', icon: <Star size={16} /> },
    { id: 'contact', name: 'Contacto', icon: <Phone size={16} /> },
    { id: 'footer', name: 'Footer', icon: <Layout size={16} /> }
  ];

  // Filter keywords based on search term
  const filteredKeywords = keywordsData.filter(keyword => 
    keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketing Web</h1>
          <p className="mt-1 text-sm text-gray-500">
            Análisis y configuración de la presencia web
          </p>
        </div>
        <Card className="w-full sm:w-auto">
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
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('resumen')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'resumen'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveTab('trafico')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'trafico'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Tráfico
          </button>
          <button
            onClick={() => setActiveTab('formularios')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'formularios'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Formularios
          </button>
          <button
            onClick={() => setActiveTab('keywords')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'keywords'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Palabras Clave
          </button>
          <button
            onClick={() => setActiveTab('area')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'area'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Área de Influencia
          </button>
          <button
            onClick={() => setActiveTab('configurador')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'configurador'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Configurador
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'resumen' && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Visitas Totales"
              value="7,719"
              icon={<Eye size={24} />}
              change={{ value: 12.5, isPositive: true }}
            />
            <StatCard
              title="Tasa de Rebote"
              value="32.4%"
              icon={<ArrowRight size={24} />}
              change={{ value: 2.1, isPositive: false }}
            />
            <StatCard
              title="Tiempo en el Sitio"
              value="2m 45s"
              icon={<Clock size={24} />}
              change={{ value: 8.3, isPositive: true }}
            />
            <StatCard
              title="Conversiones"
              value="245"
              icon={<Users size={24} />}
              change={{ value: 15.7, isPositive: true }}
            />
          </div>

          {/* Traffic Sources */}
          <Card title="Fuentes de Tráfico" icon={<Globe size={20} />}>
            <div className="p-4 space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{source.source}</span>
                    <div className="flex items-center">
                      <span className="font-medium">{source.visits.toLocaleString()} ({source.percentage}%)</span>
                      <span className={`ml-2 flex items-center ${source.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {source.isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        {Math.abs(source.change)}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-600' :
                        index === 1 ? 'bg-green-600' :
                        index === 2 ? 'bg-purple-600' :
                        index === 3 ? 'bg-orange-600' :
                        'bg-red-600'
                      }`} 
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Devices */}
            <Card title="Dispositivos" icon={<Smartphone size={20} />}>
              <div className="p-4 space-y-4">
                {deviceData.map((device, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        {device.icon}
                        <span className="ml-2">{device.device}</span>
                      </div>
                      <span className="font-medium">{device.visits.toLocaleString()} ({device.percentage}%)</span>
                    </div>
                    <div className="mt-1 h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-blue-600' :
                          index === 1 ? 'bg-green-600' :
                          'bg-purple-600'
                        }`} 
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Pages */}
            <Card title="Páginas Más Visitadas" icon={<FileText size={20} />}>
              <div className="p-4">
                <div className="space-y-4">
                  {topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{page.title}</p>
                        <p className="text-xs text-gray-500">{page.url}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{page.visits.toLocaleString()} visitas</p>
                        <p className="text-xs text-gray-500">{page.timeOnPage} tiempo medio</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    Ver todas las páginas →
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Heatmap Preview */}
          <Card title="Mapa de Calor" icon={<BarChart2 size={20} />}>
            <div className="p-4">
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Website Heatmap Preview" 
                  className="w-full h-64 object-cover rounded-lg opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 via-yellow-500/30 to-green-500/30 rounded-lg"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="primary"
                    onClick={() => setShowHeatmapModal(true)}
                  >
                    Ver Mapa de Calor Completo
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'trafico' && (
        <>
          {/* Traffic Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Visitas Totales"
              value="7,719"
              icon={<Eye size={24} />}
              change={{ value: 12.5, isPositive: true }}
            />
            <StatCard
              title="Visitantes Únicos"
              value="5,432"
              icon={<Users size={24} />}
              change={{ value: 8.7, isPositive: true }}
            />
            <StatCard
              title="Páginas por Sesión"
              value="3.2"
              icon={<FileText size={24} />}
              change={{ value: 4.3, isPositive: true }}
            />
            <StatCard
              title="Conversiones"
              value="245"
              icon={<TrendingUp size={24} />}
              change={{ value: 15.7, isPositive: true }}
            />
          </div>

          {/* Traffic Channels */}
          <Card title="Canales de Tráfico" icon={<Globe size={20} />}>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Canal
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Visitas
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conversiones
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tasa de Conversión
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cambio
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trafficChannels.map((channel, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {channel.icon}
                            <span className="ml-2 text-sm font-medium text-gray-900">{channel.channel}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{channel.visits.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{channel.conversions}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{channel.conversionRate.toFixed(2)}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center text-sm ${channel.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {channel.isPositive ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
                            {Math.abs(channel.change)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* Traffic Over Time */}
          <Card title="Tráfico a lo Largo del Tiempo" icon={<TrendingUp size={20} />}>
            <div className="p-4">
              <div className="h-64 w-full bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                {/* This would be a chart in a real implementation */}
                <div className="text-center">
                  <BarChart2 size={48} className="mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Gráfico de tráfico a lo largo del tiempo</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Heatmap */}
          <Card title="Mapa de Calor" icon={<BarChart2 size={20} />}>
            <div className="p-4">
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Website Heatmap" 
                  className="w-full h-96 object-cover rounded-lg opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 via-yellow-500/30 to-green-500/30 rounded-lg"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="primary"
                    onClick={() => setShowHeatmapModal(true)}
                  >
                    Ver Mapa de Calor Completo
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>El mapa de calor muestra las áreas de mayor interacción en tu sitio web. Las zonas rojas indican mayor actividad, mientras que las verdes indican menor actividad.</p>
                <p className="mt-2">Observaciones clave:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>La sección de "Servicios" recibe la mayor atención de los usuarios.</li>
                  <li>El botón de "Solicitar Cita" tiene un alto nivel de interacción.</li>
                  <li>La sección de testimonios recibe menos atención que otras áreas.</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Conversion Funnel */}
          <Card title="Embudo de Conversión" icon={<Filter size={20} />}>
            <div className="p-4">
              <div className="max-w-3xl mx-auto">
                {/* Funnel visualization */}
                <div className="relative pt-8 pb-12">
                  {/* Visitors */}
                  <div className="w-full bg-blue-100 rounded-t-lg p-4 text-center">
                    <p className="font-medium text-blue-800">Visitantes</p>
                    <p className="text-2xl font-bold text-blue-900">7,719</p>
                  </div>
                  <div className="w-0 h-0 border-l-[150px] border-r-[150px] border-t-[30px] border-l-transparent border-r-transparent border-t-blue-100 mx-auto"></div>
                  
                  {/* Leads */}
                  <div className="w-4/5 mx-auto bg-green-100 p-4 text-center -mt-1">
                    <p className="font-medium text-green-800">Leads</p>
                    <p className="text-2xl font-bold text-green-900">1,245</p>
                    <p className="text-sm text-green-700">16.1% de visitantes</p>
                  </div>
                  <div className="w-0 h-0 border-l-[120px] border-r-[120px] border-t-[30px] border-l-transparent border-r-transparent border-t-green-100 mx-auto"></div>
                  
                  {/* Qualified Leads */}
                  <div className="w-3/5 mx-auto bg-yellow-100 p-4 text-center -mt-1">
                    <p className="font-medium text-yellow-800">Leads Cualificados</p>
                    <p className="text-2xl font-bold text-yellow-900">542</p>
                    <p className="text-sm text-yellow-700">43.5% de leads</p>
                  </div>
                  <div className="w-0 h-0 border-l-[90px] border-r-[90px] border-t-[30px] border-l-transparent border-r-transparent border-t-yellow-100 mx-auto"></div>
                  
                  {/* Opportunities */}
                  <div className="w-2/5 mx-auto bg-orange-100 p-4 text-center -mt-1">
                    <p className="font-medium text-orange-800">Oportunidades</p>
                    <p className="text-2xl font-bold text-orange-900">325</p>
                    <p className="text-sm text-orange-700">60.0% de leads cualificados</p>
                  </div>
                  <div className="w-0 h-0 border-l-[60px] border-r-[60px] border-t-[30px] border-l-transparent border-r-transparent border-t-orange-100 mx-auto"></div>
                  
                  {/* Customers */}
                  <div className="w-1/5 mx-auto bg-red-100 rounded-b-lg p-4 text-center -mt-1">
                    <p className="font-medium text-red-800">Clientes</p>
                    <p className="text-2xl font-bold text-red-900">245</p>
                    <p className="text-sm text-red-700">75.4% de oportunidades</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'formularios' && (
        <>
          {/* Forms Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Formularios"
              value={formsData.length.toString()}
              icon={<FileText size={24} />}
            />
            <StatCard
              title="Envíos Totales"
              value={formsData.reduce((sum, form) => sum + form.submissions, 0).toString()}
              icon={<Mail size={24} />}
              change={{ value: 8.3, isPositive: true }}
            />
            <StatCard
              title="Tasa de Conversión"
              value={`${(formsData.reduce((sum, form) => sum + form.conversionRate, 0) / formsData.length).toFixed(1)}%`}
              icon={<TrendingUp size={24} />}
              change={{ value: 5.2, isPositive: true }}
            />
            <div className="flex justify-end items-center">
              <Button
                variant="primary"
                icon={<Plus size={18} />}
                onClick={() => setShowFormModal(true)}
              >
                Nuevo Formulario
              </Button>
            </div>
          </div>

          {/* Forms Table */}
          <Card title="Formularios" icon={<FileText size={20} />}>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ubicación
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Envíos
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tasa de Conversión
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cambio
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formsData.map((form, index) => (
                      <tr key={form.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{form.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{form.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{form.submissions}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{form.conversionRate.toFixed(1)}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center text-sm ${form.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {form.isPositive ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
                            {Math.abs(form.change)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2 justify-end">
                            <button className="text-blue-600 hover:text-blue-800" title="Ver detalles">
                              <Eye size={18} />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600" title="Editar">
                              <Edit size={18} />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600" title="Eliminar">
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* Recent Submissions */}
          <Card title="Envíos Recientes" icon={<Mail size={20} />}>
            <div className="p-4 space-y-6">
              {recentSubmissions.map((submission) => (
                <div key={submission.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{submission.formName}</h3>
                      <p className="text-xs text-gray-500">{new Date(submission.date).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" title="Ver detalles">
                        <Eye size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-800" title="Eliminar">
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500">Nombre</p>
                      <p className="text-sm text-gray-900">{submission.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{submission.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Teléfono</p>
                      <p className="text-sm text-gray-900">{submission.phone}</p>
                    </div>
                    {submission.pet && (
                      <div>
                        <p className="text-xs text-gray-500">Mascota</p>
                        <p className="text-sm text-gray-900">{submission.pet}</p>
                      </div>
                    )}
                    {submission.service && (
                      <div>
                        <p className="text-xs text-gray-500">Servicio</p>
                        <p className="text-sm text-gray-900">{submission.service}</p>
                      </div>
                    )}
                    {submission.preferredDate && (
                      <div>
                        <p className="text-xs text-gray-500">Fecha Preferida</p>
                        <p className="text-sm text-gray-900">{submission.preferredDate}</p>
                      </div>
                    )}
                    {submission.symptoms && (
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500">Síntomas</p>
                        <p className="text-sm text-gray-900">{submission.symptoms}</p>
                      </div>
                    )}
                    {submission.message && (
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-500">Mensaje</p>
                        <p className="text-sm text-gray-900">{submission.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {activeTab === 'keywords' && (
        <>
          {/* Keywords Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Palabras Clave Rastreadas"
              value={keywordsData.length.toString()}
              icon={<SearchIcon size={24} />}
            />
            <StatCard
              title="Posición Media"
              value={(keywordsData.reduce((sum, kw) => sum + kw.position, 0) / keywordsData.length).toFixed(1)}
              icon={<BarChart2 size={24} />}
              change={{ value: 0.8, isPositive: true }}
            />
            <StatCard
              title="Volumen de Búsquedas"
              value={(keywordsData.reduce((sum, kw) => sum + kw.volume, 0)).toLocaleString()}
              icon={<TrendingUp size={24} />}
            />
            <div className="flex justify-end items-center">
              <Button
                variant="primary"
                icon={<Plus size={18} />}
                onClick={() => setShowKeywordModal(true)}
              >
                Añadir Palabra Clave
              </Button>
            </div>
          </div>

          {/* Keywords Search */}
          <Card>
            <div className="p-4">
              <Input
                placeholder="Buscar palabras clave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
                className="w-full"
              />
            </div>
          </Card>

          {/* Keywords Table */}
          <Card title="Palabras Clave" icon={<SearchIcon size={20} />}>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Palabra Clave
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Posición
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Volumen
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dificultad
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Relevancia
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cambio
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredKeywords.map((keyword, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{keyword.keyword}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900">{keyword.position}</span>
                            {keyword.change !== 0 && (
                              <span className={`ml-2 flex items-center ${keyword.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {keyword.isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                                {Math.abs(keyword.change)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{keyword.volume.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  keyword.difficulty < 40 ? 'bg-green-600' :
                                  keyword.difficulty < 70 ? 'bg-yellow-600' :
                                  'bg-red-600'
                                }`} 
                                style={{ width: `${keyword.difficulty}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-900">{keyword.difficulty}/100</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${keyword.relevance}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-900">{keyword.relevance}/100</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center text-sm ${keyword.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {keyword.isPositive ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
                            {Math.abs(keyword.change)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2 justify-end">
                            <button className="text-gray-400 hover:text-gray-600" title="Editar">
                              <Edit size={18} />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600" title="Eliminar">
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* Keyword Suggestions */}
          <Card title="Sugerencias de Palabras Clave" icon={<Plus size={20} />}>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Palabra Clave
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Volumen
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dificultad
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Relevancia
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {keywordSuggestions.map((keyword, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{keyword.keyword}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{keyword.volume.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  keyword.difficulty < 40 ? 'bg-green-600' :
                                  keyword.difficulty < 70 ? 'bg-yellow-600' :
                                  'bg-red-600'
                                }`} 
                                style={{ width: `${keyword.difficulty}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-900">{keyword.difficulty}/100</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${keyword.relevance}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-900">{keyword.relevance}/100</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="outline"
                            size="sm"
                          >
                            Añadir
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'area' && (
        <>
          {/* Area Map */}
          <Card title="Área de Influencia" icon={<MapPin size={20} />}>
            <div className="p-4">
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/4116218/pexels-photo-4116218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Area Map" 
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-blue-500/20 rounded-lg"></div>
                <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md">
                  <h3 className="text-sm font-medium text-gray-900">ClinicPro</h3>
                  <p className="text-xs text-gray-500">Radio de influencia: 5 km</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>El mapa muestra el área de influencia de tu clínica, basado en la ubicación de tus clientes actuales y el radio de acción típico para este tipo de negocio.</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Competitors */}
            <Card title="Competidores en la Zona" icon={<Users size={20} />}>
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Distancia
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valoración
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reseñas
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {competitorsData.map((competitor, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{competitor.name}</div>
                            <div className="text-xs text-gray-500">{competitor.website}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{competitor.distance}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900">{competitor.rating}</span>
                              <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{competitor.reviews}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            {/* Demographics */}
            <Card title="Datos Demográficos" icon={<Users size={20} />}>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Población</p>
                    <p className="text-lg font-medium text-gray-900">{demographicsData.population.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Propietarios de Mascotas</p>
                    <p className="text-lg font-medium text-gray-900">{demographicsData.petOwners.toLocaleString()} ({Math.round(demographicsData.petOwners / demographicsData.population * 100)}%)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Renta Media</p>
                    <p className="text-lg font-medium text-gray-900">{demographicsData.averageIncome}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Grupos de Edad</p>
                  <div className="space-y-2">
                    {demographicsData.ageGroups.map((group, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between text-sm">
                          <span>{group.group} años</span>
                          <span>{group.percentage}%</span>
                        </div>
                        <div className="mt-1 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${
                              index === 0 ? 'bg-blue-600' :
                              index === 1 ? 'bg-green-600' :
                              index === 2 ? 'bg-purple-600' :
                              'bg-orange-600'
                            }`} 
                            style={{ width: `${group.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Potencial de Mercado</p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Basado en la población de propietarios de mascotas y la competencia en la zona, se estima un potencial de mercado de <span className="font-bold">8,400</span> clientes potenciales en tu área de influencia.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Customer Distribution */}
          <Card title="Distribución de Clientes" icon={<MapPin size={20} />}>
            <div className="p-4">
              <div className="h-64 w-full bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                {/* This would be a chart in a real implementation */}
                <div className="text-center">
                  <BarChart2 size={48} className="mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Gráfico de distribución de clientes por código postal</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>La distribución de clientes muestra que la mayoría de tus clientes actuales provienen de los códigos postales 28040, 28015 y 28008, que corresponden a las zonas más cercanas a tu clínica.</p>
                <p className="mt-2">Recomendaciones:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Intensificar las campañas de marketing en los códigos postales 28020 y 28003, donde hay un alto potencial de clientes pero baja penetración actual.</li>
                  <li>Considerar ofertas especiales para clientes que vienen de zonas más alejadas.</li>
                </ul>
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'configurador' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sections Navigation */}
          <div className="lg:col-span-1">
            <Card title="Secciones" icon={<Layout size={20} />}>
              <div className="p-4">
                <div className="space-y-2">
                  {websiteSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveConfigSection(section.id)}
                      className={`flex items-center w-full p-3 rounded-lg text-left ${
                        activeConfigSection === section.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="mr-3">{section.icon}</span>
                      <span className="text-sm font-medium">{section.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Configuration Panel */}
          <div className="lg:col-span-3">
            <Card title={`Configuración: ${websiteSections.find(s => s.id === activeConfigSection)?.name}`} icon={<Settings size={20} />}>
              <div className="p-4">
                {activeConfigSection === 'header' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Logo
                      </label>
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <Stethoscope size={24} />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-4"
                        >
                          Cambiar Logo
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre de la Clínica
                      </label>
                      <Input
                        defaultValue="ClinicPro"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Menú de Navegación
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Input
                            defaultValue="Inicio"
                            className="mr-2"
                          />
                          <Input
                            defaultValue="/"
                            className="mr-2"
                          />
                          <button className="text-red-600 hover:text-red-800">
                            <Trash size={18} />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <Input
                            defaultValue="Servicios"
                            className="mr-2"
                          />
                          <Input
                            defaultValue="/servicios"
                            className="mr-2"
                          />
                          <button className="text-red-600 hover:text-red-800">
                            <Trash size={18} />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <Input
                            defaultValue="Sobre Nosotros"
                            className="mr-2"
                          />
                          <Input
                            defaultValue="/sobre-nosotros"
                            className="mr-2"
                          />
                          <button className="text-red-600 hover:text-red-800">
                            <Trash size={18} />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <Input
                            defaultValue="Contacto"
                            className="mr-2"
                          />
                          <Input
                            defaultValue="/contacto"
                            className="mr-2"
                          />
                          <button className="text-red-600 hover:text-red-800">
                            <Trash size={18} />
                          </button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Plus size={16} />}
                        >
                          Añadir Elemento
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Botón de Acción Principal
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          defaultValue="Solicitar Cita"
                          placeholder="Texto del botón"
                        />
                        <Input
                          defaultValue="/citas"
                          placeholder="URL"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeConfigSection === 'hero' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imagen de Fondo
                      </label>
                      <div className="relative">
                        <img 
                          src="https://images.pexels.com/photos/6235688/pexels-photo-6235688.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                          alt="Hero Background" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute bottom-2 right-2"
                        >
                          Cambiar Imagen
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título Principal
                      </label>
                      <Input
                        defaultValue="Cuidamos de tu mascota como si fuera nuestra"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subtítulo
                      </label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows={3}
                        defaultValue="Clínica veterinaria con más de 15 años de experiencia. Ofrecemos servicios de veterinaria, peluquería y tienda especializada."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Botones de Acción
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Input
                            defaultValue="Solicitar Cita"
                            className="mr-2"
                            placeholder="Texto del botón"
                          />
                          <Input
                            defaultValue="/citas"
                            className="mr-2"
                            placeholder="URL"
                          />
                          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                            <option value="primary">Principal</option>
                            <option value="secondary">Secundario</option>
                          </select>
                        </div>
                        <div className="flex items-center">
                          <Input
                            defaultValue="Nuestros Servicios"
                            className="mr-2"
                            placeholder="Texto del botón"
                          />
                          <Input
                            defaultValue="/servicios"
                            className="mr-2"
                            placeholder="URL"
                          />
                          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                            <option value="secondary">Secundario</option>
                            <option value="primary">Principal</option>
                          </select>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Plus size={16} />}
                        >
                          Añadir Botón
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeConfigSection === 'services' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título de la Sección
                      </label>
                      <Input
                        defaultValue="Nuestros Servicios"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows={2}
                        defaultValue="Ofrecemos una amplia gama de servicios para el cuidado integral de tu mascota."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Servicios
                      </label>
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <Input
                                defaultValue="Consulta Veterinaria"
                                className="mb-2"
                                placeholder="Título del servicio"
                              />
                              <textarea
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                rows={2}
                                defaultValue="Consultas generales, vacunaciones, tratamientos y seguimientos para todo tipo de mascotas."
                                placeholder="Descripción del servicio"
                              ></textarea>
                            </div>
                            <button className="text-red-600 hover:text-red-800 ml-2">
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <Input
                                defaultValue="Peluquería Canina y Felina"
                                className="mb-2"
                                placeholder="Título del servicio"
                              />
                              <textarea
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                rows={2}
                                defaultValue="Servicio profesional de peluquería para perros y gatos. Baños, cortes, cepillado y tratamientos específicos."
                                placeholder="Descripción del servicio"
                              ></textarea>
                            </div>
                            <button className="text-red-600 hover:text-red-800 ml-2">
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <Input
                                defaultValue="Tienda Especializada"
                                className="mb-2"
                                placeholder="Título del servicio"
                              />
                              <textarea
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                rows={2}
                                defaultValue="Alimentación, accesorios, juguetes y todo lo que tu mascota necesita con el asesoramiento de nuestros profesionales."
                                placeholder="Descripción del servicio"
                              ></textarea>
                            </div>
                            <button className="text-red-600 hover:text-red-800 ml-2">
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Plus size={16} />}
                        >
                          Añadir Servicio
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeConfigSection === 'about' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título de la Sección
                      </label>
                      <Input
                        defaultValue="Sobre Nosotros"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imagen
                      </label>
                      <div className="relative">
                        <img 
                          src="https://images.pexels.com/photos/7469214/pexels-photo-7469214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                          alt="About Us" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute bottom-2 right-2"
                        >
                          Cambiar Imagen
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Historia
                      </label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows={4}
                        defaultValue="Fundada en 2010, ClinicPro nació con la misión de ofrecer servicios veterinarios de la más alta calidad en Madrid. Nuestro equipo de profesionales altamente cualificados trabaja cada día para garantizar la salud y el bienestar de tus mascotas."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Misión
                      </label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows={2}
                        defaultValue="Proporcionar atención veterinaria excepcional y personalizada, mejorando la calidad de vida de las mascotas y fortaleciendo el vínculo con sus propietarios."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Visión
                      </label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows={2}
                        defaultValue="Ser la clínica veterinaria de referencia en Madrid, reconocida por su excelencia en el cuidado animal, innovación y compromiso con el bienestar de las mascotas."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Equipo
                      </label>
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <Input
                                defaultValue="Dr. Alejandro Ramírez"
                                className="mb-2"
                                placeholder="Nombre"
                              />
                              <Input
                                defaultValue="Director Veterinario"
                                className="mb-2"
                                placeholder="Cargo"
                              />
                              <textarea
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                rows={2}
                                defaultValue="Licenciado en Veterinaria con más de 15 años de experiencia. Especialista en medicina interna y cirugía de pequeños animales."
                                placeholder="Biografía"
                              ></textarea>
                            </div>
                            <button className="text-red-600 hover:text-red-800 ml-2">
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <Input
                                defaultValue="Dra. Laura Gómez"
                                className="mb-2"
                                placeholder="Nombre"
                              />
                              <Input
                                defaultValue="Veterinaria"
                                className="mb-2"
                                placeholder="Cargo"
                              />
                              <textarea
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                rows={2}
                                defaultValue="Especialista en dermatología y nutrición animal. Apasionada por la medicina preventiva y el bienestar animal."
                                placeholder="Biografía"
                              ></textarea>
                            </div>
                            <button className="text-red-600 hover:text-red-800 ml-2">
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Plus size={16} />}
                        >
                          Añadir Miembro
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeConfigSection === 'testimonials' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título de la Sección
                      </label>
                      <Input
                        defaultValue="Lo que dicen nuestros clientes"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows={2}
                        defaultValue="Descubre las experiencias de quienes han confiado en nosotros para el cuidado de sus mascotas."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Testimonios
                      </label>
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <Input
                                defaultValue="María García"
                                className="mb-2"
                                placeholder="Nombre"
                              />
                              <div className="flex items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700 mr-2">
                                  Valoración:
                                </label>
                                <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                  <option value="5">5 estrellas</option>
                                  <option value="4">4 estrellas</option>
                                  <option value="3">3 estrellas</option>
                                  <option value="2">2 estrellas</option>
                                  <option value="1">1 estrella</option>
                                </select>
                              </div>
                              <textarea
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                rows={3}
                                defaultValue="Excelente atención para mi perro Luna. El Dr. Ramírez es muy profesional y cariñoso con los animales. Totalmente recomendable."
                                placeholder="Testimonio"
                              ></textarea>
                            </div>
                            <button className="text-red-600 hover:text-red-800 ml-2">
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <Input
                                defaultValue="Carlos Rodríguez"
                                className="mb-2"
                                placeholder="Nombre"
                              />
                              <div className="flex items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700 mr-2">
                                  Valoración:
                                </label>
                                <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                  <option value="5">5 estrellas</option>
                                  <option value="4">4 estrellas</option>
                                  <option value="3">3 estrellas</option>
                                  <option value="2">2 estrellas</option>
                                  <option value="1">1 estrella</option>
                                </select>
                              </div>
                              <textarea
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                rows={3}
                                defaultValue="Llevo a mi gato Milo desde hace años y siempre recibimos un trato excepcional. El servicio de peluquería también es fantástico."
                                placeholder="Testimonio"
                              ></textarea>
                            </div>
                            <button className="text-red-600 hover:text-red-800 ml-2">
                              <Trash size={18} />
                            </button>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Plus size={16} />}
                        >
                          Añadir Testimonio
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeConfigSection === 'contact' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título de la Sección
                      </label>
                      <Input
                        defaultValue="Contacta con Nosotros"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows={2}
                        defaultValue="Estamos aquí para ayudarte. No dudes en contactarnos para cualquier consulta o para solicitar una cita."
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dirección
                        </label>
                        <Input
                          defaultValue="Calle de Beatriz de Bobadilla, 9, 28040 Madrid"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono
                        </label>
                        <Input
                          defaultValue="+34 912 345 678"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <Input
                          defaultValue="info@clinicpro.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Horario
                        </label>
                        <Input
                          defaultValue="Lunes a Viernes: 9:00 - 20:00, Sábados: 10:00 - 14:00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mapa
                      </label>
                      <div className="relative">
                        <img 
                          src="https://images.pexels.com/photos/4116218/pexels-photo-4116218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                          alt="Location Map" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute bottom-2 right-2"
                        >
                          Configurar Mapa
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Formulario de Contacto
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Input
                            defaultValue="Nombre"
                            className="mr-2"
                          />
                          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                            <option value="text">Texto</option>
                            <option value="email">Email</option>
                            <option value="tel">Teléfono</option>
                            <option value="textarea">Área de texto</option>
                            <option value="select">Selector</option>
                          </select>
                          <div className="ml-2 flex items-center">
                            <input
                              type="checkbox"
                              id="required-name"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              defaultChecked
                            />
                            <label htmlFor="required-name" className="ml-2 text-sm text-gray-700">
                              Requerido
                            </label>
                          </div>
                          <button className="text-red-600 hover:text-red-800 ml-2">
                            <Trash size={18} />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <Input
                            defaultValue="Email"
                            className="mr-2"
                          />
                          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                            <option value="email">Email</option>
                            <option value="text">Texto</option>
                            <option value="tel">Teléfono</option>
                            <option value="textarea">Área de texto</option>
                            <option value="select">Selector</option>
                          </select>
                          <div className="ml-2 flex items-center">
                            <input
                              type="checkbox"
                              id="required-email"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              defaultChecked
                            />
                            <label htmlFor="required-email" className="ml-2 text-sm text-gray-700">
                              Requerido
                            </label>
                          </div>
                          <button className="text-red-600 hover:text-red-800 ml-2">
                            <Trash size={18} />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <Input
                            defaultValue="Teléfono"
                            className="mr-2"
                          />
                          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                            <option value="tel">Teléfono</option>
                            <option value="text">Texto</option>
                            <option value="email">Email</option>
                            <option value="textarea">Área de texto</option>
                            <option value="select">Selector</option>
                          </select>
                          <div className="ml-2 flex items-center">
                            <input
                              type="checkbox"
                              id="required-phone"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="required-phone" className="ml-2 text-sm text-gray-700">
                              Requerido
                            </label>
                          </div>
                          <button className="text-red-600 hover:text-red-800 ml-2">
                            <Trash size={18} />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <Input
                            defaultValue="Mensaje"
                            className="mr-2"
                          />
                          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                            <option value="textarea">Área de texto</option>
                            <option value="text">Texto</option>
                            <option value="email">Email</option>
                            <option value="tel">Teléfono</option>
                            <option value="select">Selector</option>
                          </select>
                          <div className="ml-2 flex items-center">
                            <input
                              type="checkbox"
                              id="required-message"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              defaultChecked
                            />
                            <label htmlFor="required-message" className="ml-2 text-sm text-gray-700">
                              Requerido
                            </label>
                          </div>
                          <button className="text-red-600 hover:text-red-800 ml-2">
                            <Trash size={18} />
                          </button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Plus size={16} />}
                        >
                          Añadir Campo
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeConfigSection === 'footer' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Logo
                      </label>
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <Stethoscope size={24} />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-4"
                        >
                          Cambiar Logo
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        rows={3}
                        defaultValue="ClinicPro es una clínica veterinaria comprometida con la salud y el bienestar de tu mascota. Ofrecemos servicios veterinarios, peluquería y tienda especializada."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Información de Contacto
                      </label>
                      <div className="space-y-2">
                        <Input
                          defaultValue="Calle de Beatriz de Bobadilla, 9, 28040 Madrid"
                          placeholder="Dirección"
                        />
                        <Input
                          defaultValue="+34 912 345 678"
                          placeholder="Teléfono"
                        />
                        <Input
                          defaultValue="info@clinicpro.com"
                          placeholder="Email"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Redes Sociales
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm mr-2">
                            <option value="facebook">Facebook</option>
                            <option value="instagram">Instagram</option>
                            <option value="twitter">Twitter</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="youtube">YouTube</option>
                          </select>
                          <Input
                            defaultValue="https://facebook.com/clinicpro"
                            className="mr-2"
                            placeholder="URL"
                          />
                          <button className="text-red-600 hover:text-red-800">
                            <Trash size={18} />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm mr-2">
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                            <option value="twitter">Twitter</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="youtube">YouTube</option>
                          </select>
                          <Input
                            defaultValue="https://instagram.com/clinicpro"
                            className="mr-2"
                            placeholder="URL"
                          />
                          <button className="text-red-600 hover:text-red-800">
                            <Trash size={18} />
                          </button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Plus size={16} />}
                        >
                          Añadir Red Social
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Enlaces Rápidos
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Input
                            defaultValue="Política de Privacidad"
                            className="mr-2"
                            placeholder="Texto del enlace"
                          />
                          <Input
                            defaultValue="/privacidad"
                            className="mr-2"
                            placeholder="URL"
                          />
                          <button className="text-red-600 hover:text-red-800">
                            <Trash size={18} />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <Input
                            defaultValue="Términos y Condiciones"
                            className="mr-2"
                            placeholder="Texto del enlace"
                          />
                          <Input
                            defaultValue="/terminos"
                            className="mr-2"
                            placeholder="URL"
                          />
                          <button className="text-red-600 hover:text-red-800">
                            <Trash size={18} />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <Input
                            defaultValue="Mapa del Sitio"
                            className="mr-2"
                            placeholder="Texto del enlace"
                          />
                          <Input
                            defaultValue="/sitemap"
                            className="mr-2"
                            placeholder="URL"
                          />
                          <button className="text-red-600 hover:text-red-800">
                            <Trash size={18} />
                          </button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Plus size={16} />}
                        >
                          Añadir Enlace
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Texto de Copyright
                      </label>
                      <Input
                        defaultValue="© 2025 ClinicPro. Todos los derechos reservados."
                      />
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    icon={<Save size={18} />}
                  >
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            </Card>

            {/* Preview */}
            <div className="mt-6">
              <Card title="Vista Previa" icon={<Eye size={20} />}>
                <div className="p-4">
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <p className="text-gray-500">Vista previa no disponible. Guarda los cambios para ver una vista previa actualizada.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      Ver Vista Previa
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Heatmap Modal */}
      {showHeatmapModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Mapa de Calor Completo
              </h3>
              <button
                onClick={() => setShowHeatmapModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="relative">
                  <img 
                    src="https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                    alt="Website Heatmap Full" 
                    className="w-full object-cover rounded-lg opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 via-yellow-500/30 to-green-500/30 rounded-lg"></div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>El mapa de calor muestra las áreas de mayor interacción en tu sitio web. Las zonas rojas indican mayor actividad, mientras que las verdes indican menor actividad.</p>
                  <p className="mt-2">Observaciones clave:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>La sección de "Servicios" recibe la mayor atención de los usuarios.</li>
                    <li>El botón de "Solicitar Cita" tiene un alto nivel de interacción.</li>
                    <li>La sección de testimonios recibe menos atención que otras áreas.</li>
                    <li>Los usuarios tienden a hacer scroll hasta la mitad de la página, pero pocos llegan al final.</li>
                    <li>El menú de navegación superior recibe un buen nivel de interacción, especialmente los enlaces a "Servicios" y "Contacto".</li>
                  </ul>
                  <p className="mt-2">Recomendaciones:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Colocar la información más importante en la parte superior de la página.</li>
                    <li>Añadir más llamadas a la acción en la sección media de la página.</li>
                    <li>Mejorar la visibilidad de la sección de testimonios para aumentar su interacción.</li>
                    <li>Considerar la reorganización del contenido para que los elementos más importantes estén en las zonas de mayor interacción.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowHeatmapModal(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Keyword Modal */}
      {showKeywordModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Añadir Palabra Clave
              </h3>
              <button
                onClick={() => setShowKeywordModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Palabra Clave
                  </label>
                  <Input
                    placeholder="Ej: veterinario madrid centro"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Volumen de Búsquedas
                    </label>
                    <Input
                      type="number"
                      placeholder="Ej: 1200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dificultad (1-100)
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="Ej: 65"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relevancia para el Negocio (1-100)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Ej: 85"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas
                  </label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    rows={3}
                    placeholder="Notas adicionales sobre esta palabra clave..."
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowKeywordModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowKeywordModal(false)}
              >
                Añadir
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Nuevo Formulario
              </h3>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Formulario
                  </label>
                  <Input
                    placeholder="Ej: Formulario de Contacto"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ubicación en el Sitio
                  </label>
                  <Input
                    placeholder="Ej: /contacto"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    rows={2}
                    placeholder="Breve descripción del propósito del formulario..."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Campos del Formulario
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Input
                        defaultValue="Nombre"
                        className="mr-2"
                        placeholder="Nombre del campo"
                      />
                      <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm mr-2">
                        <option value="text">Texto</option>
                        <option value="email">Email</option>
                        <option value="tel">Teléfono</option>
                        <option value="textarea">Área de texto</option>
                        <option value="select">Selector</option>
                      </select>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="required-field-1"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="required-field-1" className="ml-2 text-sm text-gray-700">
                          Requerido
                        </label>
                      </div>
                      <button className="text-red-600 hover:text-red-800 ml-2">
                        <Trash size={18} />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <Input
                        defaultValue="Email"
                        className="mr-2"
                        placeholder="Nombre del campo"
                      />
                      <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm mr-2">
                        <option value="email">Email</option>
                        <option value="text">Texto</option>
                        <option value="tel">Teléfono</option>
                        <option value="textarea">Área de texto</option>
                        <option value="select">Selector</option>
                      </select>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="required-field-2"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="required-field-2" className="ml-2 text-sm text-gray-700">
                          Requerido
                        </label>
                      </div>
                      <button className="text-red-600 hover:text-red-800 ml-2">
                        <Trash size={18} />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <Input
                        defaultValue="Mensaje"
                        className="mr-2"
                        placeholder="Nombre del campo"
                      />
                      <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm mr-2">
                        <option value="textarea">Área de texto</option>
                        <option value="text">Texto</option>
                        <option value="email">Email</option>
                        <option value="tel">Teléfono</option>
                        <option value="select">Selector</option>
                      </select>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="required-field-3"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="required-field-3" className="ml-2 text-sm text-gray-700">
                          Requerido
                        </label>
                      </div>
                      <button className="text-red-600 hover:text-red-800 ml-2">
                        <Trash size={18} />
                      </button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Plus size={16} />}
                    >
                      Añadir Campo
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Texto del Botón de Envío
                  </label>
                  <Input
                    defaultValue="Enviar Mensaje"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje de Confirmación
                  </label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    rows={2}
                    defaultValue="¡Gracias por contactarnos! Te responderemos lo antes posible."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notificaciones
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="notify-email"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="notify-email" className="ml-2 text-sm text-gray-700">
                        Enviar notificación por email
                      </label>
                    </div>
                    <Input
                      defaultValue="notificaciones@clinicpro.com"
                      placeholder="Email para notificaciones"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowFormModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => setShowFormModal(false)}
              >
                Crear Formulario
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Stethoscope icon component for the logo
const Stethoscope = (props) => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  );
};

export default WebDashboard;