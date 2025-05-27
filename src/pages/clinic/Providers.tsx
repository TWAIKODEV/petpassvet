import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Download, Phone, Mail, Globe, MapPin, Edit, Trash, Eye, ShoppingBag, Scissors, Building2, X, User, Briefcase, CreditCard, Truck, DollarSign, FileText } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const mockProviders = [
  {
    id: '1',
    name: 'VetSupplies S.L.',
    type: 'Medicamentos',
    area: 'Clínica',
    family: 'Farmacéuticos',
    contact: 'Ana García',
    email: 'ana.garcia@vetsupplies.com',
    phone: '+34 912 345 678',
    address: 'Calle Comercial 123, Madrid',
    website: 'www.vetsupplies.com',
    status: 'active'
  },
  {
    id: '2',
    name: 'PetFood Distribución',
    type: 'Alimentación',
    area: 'Tienda',
    family: 'Alimentación',
    contact: 'Carlos Ruiz',
    email: 'carlos@petfood.es',
    phone: '+34 913 456 789',
    address: 'Avenida Industrial 45, Barcelona',
    website: 'www.petfood.es',
    status: 'active'
  },
  {
    id: '3',
    name: 'MedVet Distribución',
    type: 'Material Clínico',
    area: 'Clínica',
    family: 'Material Médico',
    contact: 'Laura Martínez',
    email: 'laura@medvet.com',
    phone: '+34 914 567 890',
    address: 'Calle Médica 78, Valencia',
    website: 'www.medvet.com',
    status: 'active'
  },
  {
    id: '4',
    name: 'Laboratorios Syva',
    type: 'Medicamentos',
    area: 'Clínica',
    family: 'Farmacéuticos',
    contact: 'Miguel Fernández',
    email: 'miguel@syva.es',
    phone: '+34 915 678 901',
    address: 'Polígono Industrial 12, León',
    website: 'www.syva.es',
    status: 'active'
  },
  {
    id: '5',
    name: 'PetAccessories Inc.',
    type: 'Accesorios',
    area: 'Tienda',
    family: 'Accesorios',
    contact: 'Sofía López',
    email: 'sofia@petaccessories.com',
    phone: '+34 916 789 012',
    address: 'Calle Comercio 56, Madrid',
    website: 'www.petaccessories.com',
    status: 'inactive'
  },
  {
    id: '6',
    name: 'OfficeSupplies S.A.',
    type: 'Material de Oficina',
    area: 'Clínica',
    family: 'Papelería',
    contact: 'Javier Rodríguez',
    email: 'javier@officesupplies.es',
    phone: '+34 917 890 123',
    address: 'Avenida Oficina 34, Barcelona',
    website: 'www.officesupplies.es',
    status: 'active'
  },
  {
    id: '7',
    name: 'GroomingSupplies Co.',
    type: 'Material de Peluquería',
    area: 'Peluquería',
    family: 'Herramientas',
    contact: 'Elena Gómez',
    email: 'elena@groomingsupplies.com',
    phone: '+34 918 901 234',
    address: 'Calle Estilista 23, Madrid',
    website: 'www.groomingsupplies.com',
    status: 'active'
  },
  {
    id: '8',
    name: 'PetToys Wholesale',
    type: 'Juguetes',
    area: 'Tienda',
    family: 'Juguetes',
    contact: 'Pablo Sánchez',
    email: 'pablo@pettoys.es',
    phone: '+34 919 012 345',
    address: 'Polígono Comercial 8, Valencia',
    website: 'www.pettoys.es',
    status: 'active'
  }
];

const Providers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showInactive, setShowInactive] = useState(false);
  const [showNewProviderModal, setShowNewProviderModal] = useState(false);

  // Get unique provider areas
  const providerAreas = Array.from(new Set(mockProviders.map(p => p.area)));

  // Filter providers based on search term, area, and status
  const filteredProviders = mockProviders.filter(provider => {
    const matchesSearch = 
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.phone.includes(searchTerm);
    
    const matchesArea = selectedArea === 'all' || provider.area === selectedArea;
    const matchesStatus = showInactive ? true : provider.status === 'active';
    
    return matchesSearch && matchesArea && matchesStatus;
  });

  const handleViewDetails = (providerId: string) => {
    navigate(`/compras/proveedores/${providerId}`);
  };

  // Get area icon
  const getAreaIcon = (area: string) => {
    switch (area) {
      case 'Clínica':
        return <Building2 size={16} className="text-blue-600" />;
      case 'Tienda':
        return <ShoppingBag size={16} className="text-green-600" />;
      case 'Peluquería':
        return <Scissors size={16} className="text-purple-600" />;
      default:
        return <Building2 size={16} className="text-gray-600" />;
    }
  };

  const handleNewProvider = (providerData: any) => {
    // Here you would typically make an API call to save the new provider
    console.log('New provider data:', providerData);
    setShowNewProviderModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proveedores</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de proveedores y distribuidores
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
            onClick={() => setShowNewProviderModal(true)}
          >
            Nuevo Proveedor
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <Input
            placeholder="Buscar proveedores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
            className="flex-1"
          />
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            <option value="all">Todas las áreas</option>
            {providerAreas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showInactive"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showInactive" className="ml-2 text-sm text-gray-700">
              Mostrar inactivos
            </label>
          </div>
          <Button
            variant="outline"
            icon={<Filter size={18} />}
          >
            Más Filtros
          </Button>
        </div>
      </Card>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map(provider => (
            <Card key={provider.id}>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center text-xs px-2 py-1 rounded-full bg-gray-100">
                        {getAreaIcon(provider.area)}
                        <span className="ml-1">{provider.area}</span>
                        <span className="mx-1">•</span>
                        <span className="text-gray-700">{provider.type}</span>
                        {provider.area === 'Tienda' && (
                          <>
                            <span className="mx-1">•</span>
                            <span className="text-gray-700">{provider.family}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    provider.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {provider.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <a href={`mailto:${provider.email}`} className="text-gray-600 hover:text-gray-900">
                      {provider.email}
                    </a>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <a href={`tel:${provider.phone}`} className="text-gray-600 hover:text-gray-900">
                      {provider.phone}
                    </a>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{provider.address}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Globe className="h-4 w-4 text-gray-400 mr-2" />
                    <a 
                      href={`https://${provider.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {provider.website}
                    </a>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Contacto: {provider.contact}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(provider.id)}
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
                </div>
              </div>
            </Card>
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
                    Proveedor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Área/Familia
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Web
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProviders.map((provider) => (
                  <tr key={provider.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getAreaIcon(provider.area)}
                        <span className="ml-1 text-sm text-gray-900">{provider.area}</span>
                        <span className="mx-1">•</span>
                        <span className="text-sm text-gray-700">{provider.type}</span>
                        {provider.area === 'Tienda' && (
                          <>
                            <span className="mx-1">•</span>
                            <span className="text-sm text-gray-700">{provider.family}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{provider.contact}</div>
                      <div className="text-sm text-gray-500">{provider.email}</div>
                      <div className="text-sm text-gray-500">{provider.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a 
                        href={`https://${provider.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {provider.website}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        provider.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {provider.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2 justify-end">
                        <button
                          onClick={() => handleViewDetails(provider.id)}
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
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProviders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No se encontraron proveedores</h3>
              <p className="text-gray-500 mt-1">Prueba con otros términos de búsqueda o cambia los filtros</p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {filteredProviders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Search size={48} className="mx-auto text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron proveedores</h3>
          <p className="mt-1 text-sm text-gray-500">
            Prueba con otros términos de búsqueda o cambia los filtros
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              icon={<Plus size={18} />}
              onClick={() => setShowNewProviderModal(true)}
            >
              Añadir Proveedor
            </Button>
          </div>
        </div>
      )}

      {/* New Provider Modal */}
      {showNewProviderModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Nuevo Proveedor
              </h3>
              <button
                onClick={() => setShowNewProviderModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <form className="space-y-6">
                {/* General Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información General</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nombre del Proveedor"
                      name="name"
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
                        <option value="Clínica">Clínica</option>
                        <option value="Tienda">Tienda</option>
                        <option value="Peluquería">Peluquería</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo
                      </label>
                      <select
                        name="type"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="Medicamentos">Medicamentos</option>
                        <option value="Material Clínico">Material Clínico</option>
                        <option value="Alimentación">Alimentación</option>
                        <option value="Accesorios">Accesorios</option>
                        <option value="Material de Peluquería">Material de Peluquería</option>
                        <option value="Material de Oficina">Material de Oficina</option>
                        <option value="Juguetes">Juguetes</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Familia
                      </label>
                      <select
                        name="family"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Seleccionar familia</option>
                        <option value="Farmacéuticos">Farmacéuticos</option>
                        <option value="Material Médico">Material Médico</option>
                        <option value="Alimentación">Alimentación</option>
                        <option value="Accesorios">Accesorios</option>
                        <option value="Herramientas">Herramientas</option>
                        <option value="Papelería">Papelería</option>
                        <option value="Juguetes">Juguetes</option>
                      </select>
                    </div>
                    <Input
                      label="CIF/NIF"
                      name="cif"
                      required
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <User className="text-blue-600 mr-3" size={24} />
                    <h3 className="text-lg font-medium text-gray-900">Información de Contacto</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nombre de Contacto"
                      name="contactName"
                      required
                    />
                    <Input
                      label="Cargo"
                      name="position"
                      placeholder="Ej: Responsable de Ventas"
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
                    <Input
                      label="Móvil"
                      type="tel"
                      name="mobile"
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="text-red-600 mr-3" size={24} />
                    <h3 className="text-lg font-medium text-gray-900">Dirección</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Dirección"
                        name="address"
                        required
                      />
                    </div>
                    <Input
                      label="Código Postal"
                      name="postalCode"
                      required
                    />
                    <Input
                      label="Ciudad"
                      name="city"
                      required
                    />
                    <Input
                      label="Provincia"
                      name="province"
                      required
                    />
                    <Input
                      label="País"
                      name="country"
                      defaultValue="España"
                      required
                    />
                    <Input
                      label="Sitio Web"
                      name="website"
                      placeholder="www.ejemplo.com"
                    />
                  </div>
                </div>

                {/* Billing Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <CreditCard className="text-green-600 mr-3" size={24} />
                    <h3 className="text-lg font-medium text-gray-900">Información de Facturación</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Método de Pago
                      </label>
                      <select
                        name="paymentMethod"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">Seleccionar método</option>
                        <option value="Transferencia bancaria">Transferencia bancaria</option>
                        <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                        <option value="Domiciliación bancaria">Domiciliación bancaria</option>
                        <option value="Crédito">Crédito</option>
                      </select>
                    </div>
                    <Input
                      label="Cuenta Bancaria"
                      name="bankAccount"
                      placeholder="ES12 3456 7890 1234 5678 9012"
                    />
                    <Input
                      label="NIF/CIF IVA"
                      name="vatNumber"
                      placeholder="ESB12345678"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Moneda
                      </label>
                      <select
                        name="currency"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      >
                        <option value="EUR">EUR - Euro</option>
                        <option value="USD">USD - Dólar Americano</option>
                        <option value="GBP">GBP - Libra Esterlina</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Condiciones de Pago
                      </label>
                      <select
                        name="paymentTerms"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">Seleccionar condiciones</option>
                        <option value="Inmediato">Inmediato</option>
                        <option value="15 días">15 días</option>
                        <option value="30 días">30 días</option>
                        <option value="60 días">60 días</option>
                        <option value="90 días">90 días</option>
                      </select>
                    </div>
                    <Input
                      label="Pedido Mínimo"
                      type="number"
                      name="minimumOrder"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Delivery Terms */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <Truck className="text-purple-600 mr-3" size={24} />
                    <h3 className="text-lg font-medium text-gray-900">Condiciones de Envío</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Método de Envío
                      </label>
                      <select
                        name="shippingMethod"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">Seleccionar método</option>
                        <option value="Transporte propio">Transporte propio</option>
                        <option value="Agencia de transporte">Agencia de transporte</option>
                        <option value="Mensajería">Mensajería</option>
                        <option value="Recogida en almacén">Recogida en almacén</option>
                      </select>
                    </div>
                    <Input
                      label="Tiempo de Entrega"
                      name="deliveryTime"
                      placeholder="Ej: 24-48 horas"
                      required
                    />
                    <Input
                      label="Gastos de Envío"
                      type="number"
                      name="shippingCost"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                    <Input
                      label="Envío Gratuito a partir de"
                      type="number"
                      name="freeShippingThreshold"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Política de Devoluciones
                      </label>
                      <select
                        name="returnPolicy"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Seleccionar política</option>
                        <option value="7 días">7 días</option>
                        <option value="14 días">14 días</option>
                        <option value="30 días">30 días</option>
                        <option value="No se aceptan devoluciones">No se aceptan devoluciones</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-4">
                    <FileText className="text-orange-600 mr-3" size={24} />
                    <h3 className="text-lg font-medium text-gray-900">Notas</h3>
                  </div>
                  <div>
                    <textarea
                      name="notes"
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Añade notas o comentarios relevantes sobre este proveedor..."
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowNewProviderModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // Here you would typically submit the form
                  handleNewProvider({});
                }}
              >
                Guardar Proveedor
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Providers;