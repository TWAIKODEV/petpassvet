import React, { useState } from 'react';
import { Plus, Filter, Search, MoreHorizontal, Calendar, Mail, Phone, List, LayoutGrid, Globe, Instagram, Facebook, Linkedin, MessageSquare, Phone as PhoneIcon, AtSign, GitBranch as BrandTiktok } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import NewOpportunityForm from '../components/opportunities/NewOpportunityForm';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  product: string;
  date: string;
  source: 'web' | 'email' | 'telemarketing' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok';
  status: string;
}

const mockLeads: Lead[] = [
  {
    id: '1',
    firstName: 'Sandra',
    lastName: 'Sánchez',
    email: 'sandra.sanchez@example.com',
    phone: '+34 666 777 888',
    product: 'Programa Certificación Experto',
    date: '21/05/2023',
    source: 'web',
    status: 'sin_asignar'
  },
  {
    id: '2',
    firstName: 'Jesús',
    lastName: 'Barreto',
    email: 'jehg2193@gmail.com',
    phone: '+34 666 888 999',
    product: 'Programa Máster Executive Avanzado',
    date: '17/05/2023',
    source: 'instagram',
    status: 'seguimiento'
  }
];

const columns = [
  { id: 'sin_asignar', title: 'Sin Asignar', color: 'bg-blue-100' },
  { id: 'seguimiento', title: 'Seguimiento', color: 'bg-yellow-100' },
  { id: 'cita_clinica', title: 'Cita Clínica', color: 'bg-green-100' },
  { id: 'consulta_online', title: 'Consulta Online', color: 'bg-pink-100' },
  { id: 'descartado', title: 'Descartado', color: 'bg-gray-300' }
];

const statusStyles = {
  'sin_asignar': 'bg-blue-100 text-blue-800',
  'seguimiento': 'bg-yellow-100 text-yellow-800',
  'cita_clinica': 'bg-green-100 text-green-800',
  'consulta_online': 'bg-pink-100 text-pink-800',
  'descartado': 'bg-gray-300 text-gray-800'
};

const statusLabels = {
  'sin_asignar': 'Sin Asignar',
  'seguimiento': 'Seguimiento',
  'cita_clinica': 'Cita Clínica',
  'consulta_online': 'Consulta Online',
  'descartado': 'Descartado'
};

const sourceIcons = {
  'web': { icon: Globe, className: 'text-blue-600', label: 'Web' },
  'email': { icon: AtSign, className: 'text-purple-600', label: 'Email MK' },
  'telemarketing': { icon: PhoneIcon, className: 'text-green-600', label: 'Telemarketing' },
  'instagram': { icon: Instagram, className: 'text-pink-600', label: 'Instagram' },
  'facebook': { icon: Facebook, className: 'text-blue-600', label: 'Facebook' },
  'linkedin': { icon: Linkedin, className: 'text-blue-800', label: 'LinkedIn' },
  'tiktok': { icon: MessageSquare, className: 'text-black', label: 'TikTok' }
};

const Opportunities: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [showNewForm, setShowNewForm] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: '21/04/2025',
    to: '21/05/2025'
  });

  const filteredLeads = leads.filter(lead => 
    (selectedStatus === 'all' || lead.status === selectedStatus) &&
    (selectedSource === 'all' || lead.source === selectedSource)
  );

  const handleNewOpportunity = (data: any) => {
    const newLead: Lead = {
      id: Date.now().toString(),
      ...data,
      status: 'sin_asignar'
    };
    setLeads(prev => [newLead, ...prev]);
    setShowNewForm(false);
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text');
    
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: columnId }
          : lead
      )
    );
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Oportunidades</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de leads y proceso de admisión
          </p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="flex rounded-md shadow-sm">
            <button
              className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                view === 'kanban'
                  ? 'bg-blue-50 text-blue-600 border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setView('kanban')}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-b border-r ${
                view === 'table'
                  ? 'bg-blue-50 text-blue-600 border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setView('table')}
            >
              <List size={18} />
            </button>
          </div>

          <Button
            variant="outline"
            icon={<Filter size={18} />}
          >
            Filtros
          </Button>
          
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            onClick={() => setShowNewForm(true)}
          >
            Nueva Oportunidad
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="mb-4">
        <div className="p-4">
          <Input
            placeholder="Buscar por nombre, email, teléfono..."
            icon={<Search size={18} />}
            className="w-full"
          />
        </div>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 p-4">
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
          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option>Todos los agentes</option>
            <option>Agente 1</option>
            <option>Agente 2</option>
          </select>
          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option>Filtrar productos</option>
            <option>Producto 1</option>
            <option>Producto 2</option>
          </select>
          <select 
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            {columns.map(column => (
              <option key={column.id} value={column.id}>
                {column.title}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            <option value="all">Todos los canales</option>
            {Object.entries(sourceIcons).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {view === 'kanban' ? (
        <div className="flex-1 overflow-hidden">
          <div className="h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-4 overflow-auto">
            {columns.map(column => (
              <div
                key={column.id}
                className="flex flex-col bg-gray-50 rounded-lg h-full"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className={`p-3 ${column.color} rounded-t-lg sticky top-0 z-10`}>
                  <h3 className="font-medium text-gray-900">{column.title}</h3>
                  <div className="mt-1 text-sm text-gray-600">
                    {filteredLeads.filter(lead => lead.status === column.id).length} leads
                  </div>
                </div>

                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                  {filteredLeads
                    .filter(lead => lead.status === column.id)
                    .map(lead => {
                      const SourceIcon = sourceIcons[lead.source].icon;
                      return (
                        <div
                          key={lead.id}
                          className="bg-white p-3 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow"
                          draggable
                          onDragStart={(e) => handleDragStart(e, lead.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {lead.firstName} {lead.lastName}
                              </h4>
                              <p className="mt-1 text-xs text-gray-500">
                                <Calendar size={14} className="inline mr-1" />
                                {lead.date}
                              </p>
                              <p className="mt-2 text-sm font-semibold text-gray-900 line-clamp-2">
                                {lead.product}
                              </p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2">
                              <MoreHorizontal size={16} />
                            </button>
                          </div>

                          <div className="mt-2 space-y-1">
                            <div className="flex items-center text-xs text-gray-500">
                              <Phone size={14} className="mr-1 flex-shrink-0" />
                              <span className="truncate">{lead.phone}</span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Mail size={14} className="mr-1 flex-shrink-0" />
                              <span className="truncate">{lead.email}</span>
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-gray-100">
                            <div className="flex items-center">
                              <SourceIcon 
                                size={16} 
                                className={`${sourceIcons[lead.source].className}`} 
                              />
                              <span className="ml-1 text-xs font-medium">
                                {sourceIcons[lead.source].label}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Canal
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => {
                const SourceIcon = sourceIcons[lead.source].icon;
                return (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {`${lead.firstName[0]}${lead.lastName[0]}`}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.firstName} {lead.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{lead.date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">{lead.product}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{lead.email}</div>
                      <div className="text-sm text-gray-500">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[lead.status]}`}>
                        {statusLabels[lead.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <SourceIcon 
                          size={16} 
                          className={`${sourceIcons[lead.source].className}`} 
                        />
                        <span className="ml-1 text-sm">
                          {sourceIcons[lead.source].label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button 
                        variant="primary"
                        size="sm"
                      >
                        Gestionar
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* New Opportunity Form Modal */}
      {showNewForm && (
        <NewOpportunityForm
          onClose={() => setShowNewForm(false)}
          onSubmit={handleNewOpportunity}
        />
      )}
    </div>
  );
};

export default Opportunities;