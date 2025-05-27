import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Phone, Mail, Calendar, RefreshCw, Eye, Edit, Trash, AlertTriangle, CheckCircle, Clock, Globe, Instagram, Facebook, Linkedin, MessageSquare, AtSign, X } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import NewPatientForm from '../../components/patients/NewPatientForm';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  pet: {
    name: string;
    species: string;
    breed: string;
    age?: number;
    sex?: 'male' | 'female';
  };
  source: 'web' | 'email' | 'telemarketing' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok';
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  insurance?: string;
  status: 'new' | 'contacted' | 'scheduled' | 'converted' | 'lost';
  notes?: string;
}

// Mock data for leads
const mockLeads: Lead[] = [
  {
    id: '1',
    firstName: 'Sandra',
    lastName: 'Sánchez',
    email: 'sandra.sanchez@example.com',
    phone: '+34 666 777 888',
    date: '2025-05-21',
    pet: {
      name: 'Toby',
      species: 'Perro',
      breed: 'Bulldog Francés',
      age: 2,
      sex: 'male'
    },
    source: 'web',
    reason: 'Consulta dermatológica',
    urgency: 'medium',
    insurance: 'Mapfre Mascotas',
    status: 'new',
    notes: 'Interesado en servicios de dermatología para su perro con problemas de piel'
  },
  {
    id: '2',
    firstName: 'Jesús',
    lastName: 'Barreto',
    email: 'jehg2193@gmail.com',
    phone: '+34 666 888 999',
    date: '2025-05-20',
    pet: {
      name: 'Mia',
      species: 'Gato',
      breed: 'Siamés',
      age: 1,
      sex: 'female'
    },
    source: 'instagram',
    reason: 'Vacunación',
    urgency: 'low',
    status: 'contacted',
    notes: 'Contactado por WhatsApp, pendiente de confirmar cita'
  },
  {
    id: '3',
    firstName: 'Laura',
    lastName: 'Martínez',
    email: 'laura.martinez@example.com',
    phone: '+34 666 999 000',
    date: '2025-05-19',
    pet: {
      name: 'Rex',
      species: 'Perro',
      breed: 'Pastor Alemán',
      age: 4,
      sex: 'male'
    },
    source: 'facebook',
    reason: 'Consulta urgente por cojera',
    urgency: 'high',
    status: 'scheduled',
    notes: 'Cita programada para el 22/05/2025 a las 10:00'
  },
  {
    id: '4',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    email: 'carlos.rodriguez@example.com',
    phone: '+34 666 000 111',
    date: '2025-05-18',
    pet: {
      name: 'Luna',
      species: 'Perro',
      breed: 'Golden Retriever',
      age: 3,
      sex: 'female'
    },
    source: 'telemarketing',
    reason: 'Interesado en servicios de peluquería',
    urgency: 'low',
    status: 'converted',
    notes: 'Convertido a cliente, primera cita realizada el 19/05/2025'
  },
  {
    id: '5',
    firstName: 'Ana',
    lastName: 'Gómez',
    email: 'ana.gomez@example.com',
    phone: '+34 666 111 222',
    date: '2025-05-17',
    pet: {
      name: 'Simba',
      species: 'Gato',
      breed: 'Persa',
      age: 2,
      sex: 'male'
    },
    source: 'email',
    reason: 'Consulta sobre nutrición felina',
    urgency: 'medium',
    status: 'lost',
    notes: 'No respondió a los intentos de contacto'
  }
];

const sourceIcons = {
  'web': { icon: Globe, className: 'text-blue-600', label: 'Web' },
  'email': { icon: AtSign, className: 'text-purple-600', label: 'Email MK' },
  'telemarketing': { icon: Phone, className: 'text-green-600', label: 'Telemarketing' },
  'instagram': { icon: Instagram, className: 'text-pink-600', label: 'Instagram' },
  'facebook': { icon: Facebook, className: 'text-blue-600', label: 'Facebook' },
  'linkedin': { icon: Linkedin, className: 'text-blue-800', label: 'LinkedIn' },
  'tiktok': { icon: MessageSquare, className: 'text-black', label: 'TikTok' }
};

const statusStyles = {
  'new': 'bg-blue-100 text-blue-800',
  'contacted': 'bg-yellow-100 text-yellow-800',
  'scheduled': 'bg-purple-100 text-purple-800',
  'converted': 'bg-green-100 text-green-800',
  'lost': 'bg-red-100 text-red-800'
};

const statusLabels = {
  'new': 'Nuevo',
  'contacted': 'Contactado',
  'scheduled': 'Cita Programada',
  'converted': 'Convertido',
  'lost': 'Perdido'
};

const urgencyStyles = {
  'low': 'bg-green-100 text-green-800',
  'medium': 'bg-yellow-100 text-yellow-800',
  'high': 'bg-red-100 text-red-800'
};

const urgencyLabels = {
  'low': 'Baja',
  'medium': 'Media',
  'high': 'Alta'
};

const urgencyIcons = {
  'low': <Clock size={16} className="mr-1 text-green-600" />,
  'medium': <Clock size={16} className="mr-1 text-yellow-600" />,
  'high': <AlertTriangle size={16} className="mr-1 text-red-600" />
};

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [dateRange, setDateRange] = useState({
    from: '2025-05-01',
    to: '2025-05-31'
  });

  // Filter leads based on search term, status, source, and urgency
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.pet.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    const matchesSource = selectedSource === 'all' || lead.source === selectedSource;
    const matchesUrgency = selectedUrgency === 'all' || lead.urgency === selectedUrgency;
    
    return matchesSearch && matchesStatus && matchesSource && matchesUrgency;
  });

  const handleNewLead = (leadData: any) => {
    // Here you would typically make an API call to save the new lead
    console.log('New lead data:', leadData);
    setShowNewLeadForm(false);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
  };

  const handleStatusChange = (leadId: string, newStatus: string) => {
    // Here you would typically make an API call to update the lead status
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: newStatus as any } 
          : lead
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de leads y potenciales clientes
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
            onClick={() => setShowNewLeadForm(true)}
            className="flex-1 sm:flex-none"
          >
            Nuevo Lead
          </Button>
        </div>
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
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="new">Nuevos</option>
              <option value="contacted">Contactados</option>
              <option value="scheduled">Cita Programada</option>
              <option value="converted">Convertidos</option>
              <option value="lost">Perdidos</option>
            </select>
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              <option value="all">Todos los canales</option>
              <option value="web">Web</option>
              <option value="email">Email MK</option>
              <option value="telemarketing">Telemarketing</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
              <option value="tiktok">TikTok</option>
            </select>
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
            >
              <option value="all">Todas las urgencias</option>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>
          
          <div className="flex gap-4">
            <Input
              placeholder="Buscar leads..."
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
          {filteredLeads.map((lead) => {
            const SourceIcon = sourceIcons[lead.source].icon;
            return (
              <Card key={lead.id}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{lead.firstName} {lead.lastName}</h3>
                      <div className="mt-1 flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[lead.status]}`}>
                          {statusLabels[lead.status]}
                        </span>
                        <span className="mx-2">•</span>
                        <span className="inline-flex items-center text-xs text-gray-500">
                          {new Date(lead.date).toLocaleDateString('es-ES')}
                        </span>
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

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail size={16} className="mr-2 text-gray-400" />
                      <span>{lead.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone size={16} className="mr-2 text-gray-400" />
                      <span>{lead.phone}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{lead.pet.name}</p>
                        <p className="text-xs text-gray-500">{lead.pet.species} - {lead.pet.breed}</p>
                      </div>
                      <div className="flex items-center">
                        <SourceIcon size={16} className={sourceIcons[lead.source].className} />
                        <span className="ml-1 text-xs text-gray-500">{sourceIcons[lead.source].label}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-900">Motivo de consulta</p>
                    <div className="mt-1 flex items-center">
                      {urgencyIcons[lead.urgency]}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${urgencyStyles[lead.urgency]}`}>
                        Urgencia {urgencyLabels[lead.urgency]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{lead.reason}</p>
                  </div>

                  {lead.notes && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-900">Notas</p>
                      <p className="mt-1 text-sm text-gray-500">{lead.notes}</p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
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
                        onClick={() => handleViewLead(lead)}
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
                    Lead
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mascota
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motivo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Urgencia
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Canal
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
                {filteredLeads.map((lead) => {
                  const SourceIcon = sourceIcons[lead.source].icon;
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {lead.firstName[0]}{lead.lastName[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{lead.firstName} {lead.lastName}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(lead.date).toLocaleDateString('es-ES')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.pet.name}</div>
                        <div className="text-sm text-gray-500">{lead.pet.species} - {lead.pet.breed}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.email}</div>
                        <div className="text-sm text-gray-500">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{lead.reason}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${urgencyStyles[lead.urgency]}`}>
                          {urgencyIcons[lead.urgency]}
                          {urgencyLabels[lead.urgency]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <SourceIcon size={16} className={sourceIcons[lead.source].className} />
                          <span className="ml-1 text-sm text-gray-900">
                            {sourceIcons[lead.source].label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${statusStyles[lead.status]}`}
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
                            onClick={() => handleViewLead(lead)}
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
          
          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No se encontraron leads</h3>
              <p className="text-gray-500 mt-1">Prueba con otros términos de búsqueda o cambia los filtros</p>
            </div>
          )}
        </div>
      )}

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Detalles del Lead
              </h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lead Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Información del Lead</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
                      <p className="mt-1 text-base font-medium text-gray-900">{selectedLead.firstName} {selectedLead.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedLead.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Teléfono</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedLead.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fecha de Registro</p>
                      <p className="mt-1 text-sm text-gray-900">{new Date(selectedLead.date).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Canal</p>
                      <div className="mt-1 flex items-center">
                        {(() => {
                          const IconComponent = sourceIcons[selectedLead.source]?.icon;
                          return IconComponent ? (
                            <IconComponent size={16} className={sourceIcons[selectedLead.source]?.className} />
                          ) : null;
                        })()}
                        <span className="ml-1 text-sm text-gray-900">{sourceIcons[selectedLead.source]?.label}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Estado</p>
                      <p className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[selectedLead.status]}`}>
                          {statusLabels[selectedLead.status]}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pet Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Información de la Mascota</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nombre</p>
                      <p className="mt-1 text-base font-medium text-gray-900">{selectedLead.pet.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Especie</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedLead.pet.species}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Raza</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedLead.pet.breed}</p>
                      </div>
                    </div>
                    {selectedLead.pet.age && selectedLead.pet.sex && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Edad</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedLead.pet.age} años</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Sexo</p>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedLead.pet.sex === 'male' ? 'Macho' : 'Hembra'}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedLead.insurance && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Seguro</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedLead.insurance}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Motivo de Consulta</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedLead.reason}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Urgencia</p>
                    <p className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${urgencyStyles[selectedLead.urgency]}`}>
                        {urgencyIcons[selectedLead.urgency]}
                        {urgencyLabels[selectedLead.urgency]}
                      </span>
                    </p>
                  </div>
                  {selectedLead.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Notas</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedLead.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <div>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
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
                  icon={<Edit size={18} />}
                >
                  Editar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedLead(null)}
                >
                  Cerrar
                </Button>
                <Button
                  variant="primary"
                  icon={<Calendar size={18} />}
                >
                  Programar Cita
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Lead Form Modal */}
      {showNewLeadForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Nuevo Lead
              </h3>
              <button
                onClick={() => setShowNewLeadForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Información del Lead</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Nombre"
                          name="firstName"
                          required
                        />
                        <Input
                          label="Apellidos"
                          name="lastName"
                          required
                        />
                      </div>
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
                          <option value="email">Email MK</option>
                          <option value="telemarketing">Telemarketing</option>
                          <option value="instagram">Instagram</option>
                          <option value="facebook">Facebook</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="tiktok">TikTok</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Información de la Mascota</h4>
                    <div className="space-y-4">
                      <Input
                        label="Nombre de la Mascota"
                        name="petName"
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Especie
                          </label>
                          <select
                            name="petSpecies"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                          >
                            <option value="">Seleccionar especie</option>
                            <option value="Perro">Perro</option>
                            <option value="Gato">Gato</option>
                            <option value="Conejo">Conejo</option>
                            <option value="Ave">Ave</option>
                            <option value="Reptil">Reptil</option>
                            <option value="Otro">Otro</option>
                          </select>
                        </div>
                        <Input
                          label="Raza"
                          name="petBreed"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Edad (años)"
                          type="number"
                          name="petAge"
                          min="0"
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sexo
                          </label>
                          <select
                            name="petSex"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          >
                            <option value="">Seleccionar sexo</option>
                            <option value="male">Macho</option>
                            <option value="female">Hembra</option>
                          </select>
                        </div>
                      </div>
                      <Input
                        label="Seguro (si tiene)"
                        name="insurance"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Detalles de la Consulta</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Motivo de Consulta
                      </label>
                      <textarea
                        name="reason"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Urgencia
                      </label>
                      <select
                        name="urgency"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">Seleccionar urgencia</option>
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas Adicionales
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
                onClick={() => setShowNewLeadForm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // Here you would typically submit the form
                  handleNewLead({});
                }}
              >
                Guardar Lead
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;