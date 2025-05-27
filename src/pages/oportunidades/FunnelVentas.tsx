import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Phone, Mail, Calendar, RefreshCw, Eye, Edit, Trash, AlertTriangle, CheckCircle, Clock, Globe, Instagram, Facebook, Linkedin, MessageSquare, AtSign, X, DollarSign, TrendingUp, Users, Target, ArrowUp, ArrowDown, BarChart2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import StatCard from '../../components/dashboard/StatCard';

interface SalesOpportunity {
  id: string;
  clientName: string;
  petName: string;
  email: string;
  phone: string;
  date: string;
  service: string;
  amount: number;
  source: 'web' | 'email' | 'telemarketing' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'referral' | 'walk-in';
  probability: number;
  stage: 'lead' | 'contact' | 'proposal' | 'closed_won' | 'closed_lost';
  assignedTo: string;
  nextAction?: string;
  nextActionDate?: string;
  notes?: string;
  campaignName?: string;
  area?: 'clinica' | 'peluqueria' | 'tienda';
}

// Mock data for sales opportunities
const mockOpportunities: SalesOpportunity[] = [
  {
    id: '1',
    clientName: 'María García',
    petName: 'Luna',
    email: 'maria.garcia@example.com',
    phone: '+34 666 777 888',
    date: '2025-05-21',
    service: 'Plan de Salud Anual',
    amount: 450.00,
    source: 'web',
    probability: 70,
    stage: 'proposal',
    assignedTo: 'Carlos Rodríguez',
    nextAction: 'Llamada de seguimiento',
    nextActionDate: '2025-05-23',
    notes: 'Interesada en el plan premium para su perro. Ha solicitado más información sobre coberturas.',
    campaignName: 'Campaña Primavera 2025',
    area: 'clinica'
  },
  {
    id: '2',
    clientName: 'Javier Martínez',
    petName: 'Rocky',
    email: 'javier.martinez@example.com',
    phone: '+34 666 888 999',
    date: '2025-05-20',
    service: 'Paquete Dental Completo',
    amount: 280.00,
    source: 'referral',
    probability: 90,
    stage: 'proposal',
    assignedTo: 'Ana López',
    nextAction: 'Enviar presupuesto final',
    nextActionDate: '2025-05-22',
    notes: 'Cliente referido por María García. Muy interesado en el paquete dental, negociando descuento por ser referido.',
    campaignName: 'Programa de Referidos',
    area: 'clinica'
  },
  {
    id: '3',
    clientName: 'Laura Sánchez',
    petName: 'Milo',
    email: 'laura.sanchez@example.com',
    phone: '+34 666 999 000',
    date: '2025-05-19',
    service: 'Cirugía Menor',
    amount: 650.00,
    source: 'instagram',
    probability: 60,
    stage: 'contact',
    assignedTo: 'Dr. Alejandro Ramírez',
    nextAction: 'Consulta presencial',
    nextActionDate: '2025-05-25',
    notes: 'Necesita evaluación para posible cirugía menor. Programada consulta con el Dr. Ramírez.',
    campaignName: 'Lanzamiento PetPass',
    area: 'clinica'
  },
  {
    id: '4',
    clientName: 'Pedro Gómez',
    petName: 'Max',
    email: 'pedro.gomez@example.com',
    phone: '+34 666 000 111',
    date: '2025-05-18',
    service: 'Plan de Vacunación',
    amount: 120.00,
    source: 'walk-in',
    probability: 95,
    stage: 'closed_won',
    assignedTo: 'Dra. Laura Gómez',
    notes: 'Cliente satisfecho, ha contratado el plan de vacunación completo para su perro.',
    area: 'clinica'
  },
  {
    id: '5',
    clientName: 'Sofía Rodríguez',
    petName: 'Nala',
    email: 'sofia.rodriguez@example.com',
    phone: '+34 666 111 222',
    date: '2025-05-17',
    service: 'Tratamiento Dermatológico',
    amount: 350.00,
    source: 'facebook',
    probability: 40,
    stage: 'contact',
    assignedTo: 'Carlos Rodríguez',
    nextAction: 'Segunda llamada',
    nextActionDate: '2025-05-24',
    notes: 'Contactada por primera vez, interesada pero indecisa. Necesita más información sobre el tratamiento.',
    campaignName: 'Campaña Primavera 2025',
    area: 'clinica'
  },
  {
    id: '6',
    clientName: 'Miguel Torres',
    petName: 'Simba',
    email: 'miguel.torres@example.com',
    phone: '+34 666 222 333',
    date: '2025-05-16',
    service: 'Peluquería Premium',
    amount: 85.00,
    source: 'email',
    probability: 20,
    stage: 'closed_lost',
    assignedTo: 'Ana López',
    notes: 'Decidió ir con otro proveedor por precio. Mantener contacto para futuras oportunidades.',
    campaignName: 'Descuentos Verano 2025',
    area: 'peluqueria'
  },
  {
    id: '7',
    clientName: 'Carmen Navarro',
    petName: 'Coco',
    email: 'carmen.navarro@example.com',
    phone: '+34 666 333 444',
    date: '2025-05-15',
    service: 'Plan Nutricional Personalizado',
    amount: 200.00,
    source: 'telemarketing',
    probability: 50,
    stage: 'lead',
    assignedTo: 'Carlos Rodríguez',
    nextAction: 'Primer contacto',
    nextActionDate: '2025-05-22',
    notes: 'Lead generado por campaña de telemarketing. Pendiente de primer contacto.',
    campaignName: 'Webinar Nutrición Canina',
    area: 'clinica'
  },
  {
    id: '8',
    clientName: 'Antonio Pérez',
    petName: 'Toby',
    email: 'antonio.perez@example.com',
    phone: '+34 666 444 555',
    date: '2025-05-14',
    service: 'Corte y Baño',
    amount: 45.00,
    source: 'instagram',
    probability: 80,
    stage: 'proposal',
    assignedTo: 'Ana López',
    nextAction: 'Confirmar cita',
    nextActionDate: '2025-05-21',
    notes: 'Interesado en servicio de peluquería completo para su perro.',
    campaignName: 'Campaña Primavera 2025',
    area: 'peluqueria'
  },
  {
    id: '9',
    clientName: 'Isabel Moreno',
    petName: 'Lola',
    email: 'isabel.moreno@example.com',
    phone: '+34 666 555 666',
    date: '2025-05-13',
    service: 'Pienso Premium',
    amount: 75.00,
    source: 'web',
    probability: 65,
    stage: 'contact',
    assignedTo: 'Carlos Rodríguez',
    nextAction: 'Enviar catálogo',
    nextActionDate: '2025-05-20',
    notes: 'Interesada en pienso premium para su gata con problemas digestivos.',
    campaignName: 'Lanzamiento PetPass',
    area: 'tienda'
  }
];

const sourceIcons = {
  'web': { icon: Globe, className: 'text-blue-600', label: 'Web' },
  'email': { icon: AtSign, className: 'text-purple-600', label: 'Email' },
  'telemarketing': { icon: Phone, className: 'text-green-600', label: 'Telemarketing' },
  'instagram': { icon: Instagram, className: 'text-pink-600', label: 'Instagram' },
  'facebook': { icon: Facebook, className: 'text-blue-600', label: 'Facebook' },
  'linkedin': { icon: Linkedin, className: 'text-blue-800', label: 'LinkedIn' },
  'tiktok': { icon: MessageSquare, className: 'text-black', label: 'TikTok' },
  'referral': { icon: Users, className: 'text-teal-600', label: 'Referido' },
  'walk-in': { icon: Users, className: 'text-orange-600', label: 'Visita Directa' }
};

const stageStyles = {
  'lead': 'bg-gray-100 text-gray-800',
  'contact': 'bg-blue-100 text-blue-800',
  'proposal': 'bg-yellow-100 text-yellow-800',
  'closed_won': 'bg-green-100 text-green-800',
  'closed_lost': 'bg-red-100 text-red-800'
};

const stageLabels = {
  'lead': 'Lead',
  'contact': 'Contactado',
  'proposal': 'Propuesta/Cita',
  'closed_won': 'Ganado',
  'closed_lost': 'Perdido'
};

const areaLabels = {
  'clinica': 'Clínica',
  'peluqueria': 'Peluquería',
  'tienda': 'Tienda'
};

const probabilityColors = (probability: number) => {
  if (probability >= 80) return 'text-green-600';
  if (probability >= 50) return 'text-yellow-600';
  if (probability >= 30) return 'text-orange-600';
  return 'text-red-600';
};

const FunnelVentas: React.FC = () => {
  const [opportunities, setOpportunities] = useState<SalesOpportunity[]>(mockOpportunities);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [showNewOpportunityForm, setShowNewOpportunityForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<SalesOpportunity | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [dateRange, setDateRange] = useState({
    from: '2025-05-01',
    to: '2025-05-31'
  });

  // Get unique campaigns
  const campaigns = Array.from(new Set(opportunities
    .filter(o => o.campaignName)
    .map(o => o.campaignName as string)
  ));

  // Get unique assignees
  const assignees = Array.from(new Set(opportunities.map(o => o.assignedTo)));

  // Filter opportunities based on search term, stage, source, assignee, campaign and area
  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = 
      opportunity.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.phone.includes(searchTerm) ||
      opportunity.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = selectedStage === 'all' || opportunity.stage === selectedStage;
    const matchesSource = selectedSource === 'all' || opportunity.source === selectedSource;
    const matchesAssignee = selectedAssignee === 'all' || opportunity.assignedTo === selectedAssignee;
    const matchesCampaign = selectedCampaign === 'all' || opportunity.campaignName === selectedCampaign;
    const matchesArea = selectedArea === 'all' || opportunity.area === selectedArea;
    
    return matchesSearch && matchesStage && matchesSource && matchesAssignee && matchesCampaign && matchesArea;
  });

  // Group opportunities by stage for kanban view
  const opportunitiesByStage = {
    lead: filteredOpportunities.filter(o => o.stage === 'lead'),
    contact: filteredOpportunities.filter(o => o.stage === 'contact'),
    proposal: filteredOpportunities.filter(o => o.stage === 'proposal'),
    closed_won: filteredOpportunities.filter(o => o.stage === 'closed_won'),
    closed_lost: filteredOpportunities.filter(o => o.stage === 'closed_lost')
  };

  // Calculate summary statistics
  const totalOpportunities = opportunities.length;
  const openOpportunities = opportunities.filter(o => !['closed_won', 'closed_lost'].includes(o.stage)).length;
  const totalPotentialValue = opportunities
    .filter(o => o.stage !== 'closed_lost')
    .reduce((sum, o) => sum + o.amount, 0);
  const weightedValue = opportunities
    .filter(o => o.stage !== 'closed_lost')
    .reduce((sum, o) => sum + (o.amount * o.probability / 100), 0);
  const wonValue = opportunities
    .filter(o => o.stage === 'closed_won')
    .reduce((sum, o) => sum + o.amount, 0);
  const conversionRate = totalOpportunities > 0 
    ? (opportunities.filter(o => o.stage === 'closed_won').length / totalOpportunities) * 100 
    : 0;

  const handleNewOpportunity = (opportunityData: any) => {
    // Here you would typically make an API call to save the new opportunity
    console.log('New opportunity data:', opportunityData);
    setShowNewOpportunityForm(false);
  };

  const handleViewOpportunity = (opportunity: SalesOpportunity) => {
    setSelectedOpportunity(opportunity);
  };

  const handleStageChange = (opportunityId: string, newStage: string) => {
    // Here you would typically make an API call to update the opportunity stage
    setOpportunities(prevOpportunities => 
      prevOpportunities.map(opportunity => 
        opportunity.id === opportunityId 
          ? { 
              ...opportunity, 
              stage: newStage as any,
              // Update probability based on stage
              probability: newStage === 'closed_won' ? 100 : 
                          newStage === 'closed_lost' ? 0 :
                          newStage === 'proposal' ? 60 :
                          newStage === 'contact' ? 30 : 10
            } 
          : opportunity
      )
    );
  };

  const handleDragStart = (e: React.DragEvent, opportunityId: string) => {
    e.dataTransfer.setData('text/plain', opportunityId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    const opportunityId = e.dataTransfer.getData('text');
    handleStageChange(opportunityId, stage);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Funnel Ventas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de oportunidades de venta y embudo de conversión
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="flex rounded-md shadow-sm">
            <button
              className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'kanban'
                  ? 'bg-blue-50 text-blue-600 border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setViewMode('kanban')}
              title="Vista Kanban"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
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
            onClick={() => setShowNewOpportunityForm(true)}
            className="flex-1 sm:flex-none"
          >
            Nueva Oportunidad
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Oportunidades Totales"
          value={totalOpportunities.toString()}
          icon={<Target size={24} />}
        />
        <StatCard
          title="Oportunidades Abiertas"
          value={openOpportunities.toString()}
          icon={<Clock size={24} />}
        />
        <StatCard
          title="Valor Potencial"
          value={totalPotentialValue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          icon={<DollarSign size={24} />}
        />
        <StatCard
          title="Valor Ponderado"
          value={weightedValue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          icon={<TrendingUp size={24} />}
          subtitle="Basado en probabilidad"
        />
        <StatCard
          title="Ratio de Conversión"
          value={`${conversionRate.toFixed(1)}%`}
          icon={<Users size={24} />}
          subtitle={`${wonValue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} ganados`}
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
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
            >
              <option value="all">Todas las etapas</option>
              <option value="lead">Lead</option>
              <option value="contact">Contactado</option>
              <option value="proposal">Propuesta/Cita</option>
              <option value="closed_won">Ganado</option>
              <option value="closed_lost">Perdido</option>
            </select>
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              <option value="all">Todos los canales</option>
              <option value="web">Web</option>
              <option value="email">Email</option>
              <option value="telemarketing">Telemarketing</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
              <option value="tiktok">TikTok</option>
              <option value="referral">Referido</option>
              <option value="walk-in">Visita Directa</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
            >
              <option value="all">Todos los responsables</option>
              {assignees.map(assignee => (
                <option key={assignee} value={assignee}>{assignee}</option>
              ))}
            </select>
            
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
            >
              <option value="all">Todas las campañas</option>
              {campaigns.map(campaign => (
                <option key={campaign} value={campaign}>{campaign}</option>
              ))}
            </select>
            
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              <option value="all">Todas las áreas</option>
              <option value="clinica">Clínica</option>
              <option value="peluqueria">Peluquería</option>
              <option value="tienda">Tienda</option>
            </select>
          </div>
          
          <div className="flex gap-4">
            <Input
              placeholder="Buscar oportunidades..."
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

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-x-auto">
          {Object.entries(opportunitiesByStage).map(([stage, stageOpportunities]) => (
            <div 
              key={stage}
              className="bg-gray-50 rounded-lg p-4 min-w-[280px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full ${stageStyles[stage].replace('text-', 'bg-').replace('-100', '-600')} mr-2`}></span>
                  <h3 className="text-sm font-medium text-gray-900">{stageLabels[stage]}</h3>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-full">
                  {stageOpportunities.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {stageOpportunities.map(opportunity => (
                  <div
                    key={opportunity.id}
                    className="bg-white p-3 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={(e) => handleDragStart(e, opportunity.id)}
                    onClick={() => handleViewOpportunity(opportunity)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{opportunity.clientName}</h4>
                        <p className="text-xs text-gray-500">{opportunity.petName}</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-xs font-medium ${probabilityColors(opportunity.probability)}`}>
                          {opportunity.probability}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-900">{opportunity.service}</p>
                      <p className="text-xs font-medium text-gray-700">
                        {opportunity.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </p>
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <Mail size={12} className="mr-1 text-gray-400" />
                        <span className="truncate">{opportunity.email}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Phone size={12} className="mr-1 text-gray-400" />
                        <span>{opportunity.phone}</span>
                      </div>
                      {opportunity.campaignName && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Target size={12} className="mr-1 text-gray-400" />
                          <span className="truncate">{opportunity.campaignName}</span>
                        </div>
                      )}
                      {opportunity.area && (
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="truncate">{areaLabels[opportunity.area]}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex items-center">
                        {(() => {
                          const SourceIcon = sourceIcons[opportunity.source].icon;
                          return <SourceIcon size={14} className={sourceIcons[opportunity.source].className} />;
                        })()}
                      </div>
                      <span className="text-xs text-gray-500">
                        {opportunity.assignedTo.split(' ')[0]}
                      </span>
                    </div>
                    
                    {opportunity.nextActionDate && (
                      <div className="mt-2 pt-2 border-t border-gray-100 flex items-center text-xs text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        <span>{new Date(opportunity.nextActionDate).toLocaleDateString('es-ES')}</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {stageOpportunities.length === 0 && (
                  <div className="bg-white p-3 rounded-lg border border-dashed border-gray-300 text-center">
                    <p className="text-xs text-gray-500">No hay oportunidades</p>
                  </div>
                )}
              </div>
            </div>
          ))}
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
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Servicio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Etapa
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Origen
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaña
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Área
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsable
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOpportunities.map((opportunity) => {
                  const SourceIcon = sourceIcons[opportunity.source].icon;
                  return (
                    <tr key={opportunity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {opportunity.clientName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{opportunity.clientName}</div>
                            <div className="text-sm text-gray-500">{opportunity.petName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail size={14} className="mr-1 text-gray-400" />
                          <span>{opportunity.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Phone size={14} className="mr-1 text-gray-400" />
                          <span>{opportunity.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{opportunity.service}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(opportunity.date).toLocaleDateString('es-ES')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {opportunity.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </div>
                        <div className="text-xs text-gray-500">
                          Ponderado: {(opportunity.amount * opportunity.probability / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={opportunity.stage}
                          onChange={(e) => handleStageChange(opportunity.id, e.target.value)}
                          className={`text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${stageStyles[opportunity.stage]}`}
                        >
                          {Object.entries(stageLabels).map(([value, label]) => (
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <SourceIcon size={16} className={sourceIcons[opportunity.source].className} />
                          <span className="ml-1 text-sm text-gray-900">
                            {sourceIcons[opportunity.source].label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{opportunity.campaignName || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{opportunity.area ? areaLabels[opportunity.area] : '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{opportunity.assignedTo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewOpportunity(opportunity)}
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
          
          {filteredOpportunities.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No se encontraron oportunidades</h3>
              <p className="text-gray-500 mt-1">Prueba con otros términos de búsqueda o cambia los filtros</p>
            </div>
          )}
        </div>
      )}

      {/* Opportunity Details Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Detalles de la Oportunidad
              </h3>
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Información del Cliente</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nombre del Cliente</p>
                      <p className="mt-1 text-base font-medium text-gray-900">{selectedOpportunity.clientName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Mascota</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedOpportunity.petName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedOpportunity.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Teléfono</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedOpportunity.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fecha de Registro</p>
                      <p className="mt-1 text-sm text-gray-900">{new Date(selectedOpportunity.date).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Canal</p>
                      <div className="mt-1 flex items-center">
                        {(() => {
                          const IconComponent = sourceIcons[selectedOpportunity.source].icon;
                          return <IconComponent size={16} className={sourceIcons[selectedOpportunity.source].className} />;
                        })()}
                        <span className="ml-1 text-sm text-gray-900">{sourceIcons[selectedOpportunity.source].label}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Opportunity Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Información de la Oportunidad</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Servicio</p>
                      <p className="mt-1 text-base font-medium text-gray-900">{selectedOpportunity.service}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Valor</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {selectedOpportunity.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Etapa</p>
                      <p className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stageStyles[selectedOpportunity.stage]}`}>
                          {stageLabels[selectedOpportunity.stage]}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Probabilidad</p>
                      <div className="mt-1 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              selectedOpportunity.probability >= 80 ? 'bg-green-600' :
                              selectedOpportunity.probability >= 50 ? 'bg-yellow-600' :
                              selectedOpportunity.probability >= 30 ? 'bg-orange-600' : 'bg-red-600'
                            }`} 
                            style={{ width: `${selectedOpportunity.probability}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${probabilityColors(selectedOpportunity.probability)}`}>
                          {selectedOpportunity.probability}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Responsable</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedOpportunity.assignedTo}</p>
                    </div>
                    {selectedOpportunity.campaignName && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Campaña</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedOpportunity.campaignName}</p>
                      </div>
                    )}
                    {selectedOpportunity.area && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Área</p>
                        <p className="mt-1 text-sm text-gray-900">{areaLabels[selectedOpportunity.area]}</p>
                      </div>
                    )}
                    {selectedOpportunity.nextAction && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Próxima Acción</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedOpportunity.nextAction}</p>
                        {selectedOpportunity.nextActionDate && (
                          <p className="text-xs text-gray-500">
                            {new Date(selectedOpportunity.nextActionDate).toLocaleDateString('es-ES')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedOpportunity.notes && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Notas</h4>
                  <p className="text-sm text-gray-900">{selectedOpportunity.notes}</p>
                </div>
              )}

              {/* Sales Funnel Visualization */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Posición en el Embudo de Ventas</h4>
                <div className="relative max-w-xl mx-auto">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-500">Inicio</div>
                    <div className="text-xs text-gray-500">Cierre</div>
                  </div>
                  
                  <div className="h-8 bg-gray-200 rounded-full overflow-hidden relative">
                    {/* Lead */}
                    <div className="absolute inset-y-0 left-0 bg-gray-400 w-1/5"></div>
                    {/* Contact */}
                    <div className="absolute inset-y-0 left-1/5 bg-blue-400 w-1/5"></div>
                    {/* Proposal */}
                    <div className="absolute inset-y-0 left-2/5 bg-yellow-400 w-1/5"></div>
                    {/* Closed Won */}
                    <div className="absolute inset-y-0 left-3/5 bg-green-400 w-1/5"></div>
                    {/* Closed Lost */}
                    <div className="absolute inset-y-0 left-4/5 bg-red-400 w-1/5"></div>
                    
                    {/* Current position marker */}
                    <div 
                      className="absolute top-0 bottom-0 w-4 h-4 bg-white border-2 border-blue-600 rounded-full transform -translate-x-1/2 translate-y-1/2"
                      style={{ 
                        left: selectedOpportunity.stage === 'lead' ? '10%' : 
                              selectedOpportunity.stage === 'contact' ? '30%' : 
                              selectedOpportunity.stage === 'proposal' ? '50%' : 
                              selectedOpportunity.stage === 'closed_won' ? '70%' : 
                              '90%'
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between mt-2">
                    <div className="text-xs text-gray-500">Lead</div>
                    <div className="text-xs text-gray-500">Contactado</div>
                    <div className="text-xs text-gray-500">Propuesta/Cita</div>
                    <div className="text-xs text-gray-500">Ganado</div>
                    <div className="text-xs text-gray-500">Perdido</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <div>
                <select
                  value={selectedOpportunity.stage}
                  onChange={(e) => handleStageChange(selectedOpportunity.id, e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  {Object.entries(stageLabels).map(([value, label]) => (
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
                  onClick={() => setSelectedOpportunity(null)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Opportunity Form Modal */}
      {showNewOpportunityForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Nueva Oportunidad de Venta
              </h3>
              <button
                onClick={() => setShowNewOpportunityForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Información del Cliente</h4>
                    <div className="space-y-4">
                      <Input
                        label="Nombre del Cliente"
                        name="clientName"
                        required
                      />
                      <Input
                        label="Nombre de la Mascota"
                        name="petName"
                        required
                      />
                      <Input
                        label="Email"
                        type="email"
                        name="email"
                        required
                      />
                      <Input
                        label="Teléfono"
                        type="tel"
                        name="phone"
                        required
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Canal
                        </label>
                        <select
                          name="source"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        >
                          <option value="">Seleccionar canal</option>
                          <option value="web">Web</option>
                          <option value="email">Email</option>
                          <option value="telemarketing">Telemarketing</option>
                          <option value="instagram">Instagram</option>
                          <option value="facebook">Facebook</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="tiktok">TikTok</option>
                          <option value="referral">Referido</option>
                          <option value="walk-in">Visita Directa</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Campaña (opcional)
                        </label>
                        <select
                          name="campaignName"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="">Seleccionar campaña</option>
                          {campaigns.map(campaign => (
                            <option key={campaign} value={campaign}>{campaign}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Información de la Oportunidad</h4>
                    <div className="space-y-4">
                      <Input
                        label="Servicio"
                        name="service"
                        required
                      />
                      <Input
                        label="Valor"
                        type="number"
                        name="amount"
                        min="0"
                        step="0.01"
                        required
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Área
                        </label>
                        <select
                          name="area"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        >
                          <option value="">Seleccionar área</option>
                          <option value="clinica">Clínica</option>
                          <option value="peluqueria">Peluquería</option>
                          <option value="tienda">Tienda</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Etapa
                        </label>
                        <select
                          name="stage"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        >
                          <option value="">Seleccionar etapa</option>
                          <option value="lead">Lead</option>
                          <option value="contact">Contactado</option>
                          <option value="proposal">Propuesta/Cita</option>
                          <option value="closed_won">Ganado</option>
                          <option value="closed_lost">Perdido</option>
                        </select>
                      </div>
                      <Input
                        label="Probabilidad (%)"
                        type="number"
                        name="probability"
                        min="0"
                        max="100"
                        required
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Responsable
                        </label>
                        <select
                          name="assignedTo"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        >
                          <option value="">Seleccionar responsable</option>
                          {assignees.map(assignee => (
                            <option key={assignee} value={assignee}>{assignee}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Seguimiento</h4>
                  <div className="space-y-4">
                    <Input
                      label="Próxima Acción"
                      name="nextAction"
                    />
                    <Input
                      label="Fecha de Próxima Acción"
                      type="date"
                      name="nextActionDate"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas
                      </label>
                      <textarea
                        name="notes"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowNewOpportunityForm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // Here you would typically submit the form
                  handleNewOpportunity({});
                }}
              >
                Guardar Oportunidad
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FunnelVentas;