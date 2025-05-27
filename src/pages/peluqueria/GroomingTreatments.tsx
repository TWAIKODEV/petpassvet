import React, { useState } from 'react';
import { Search, Filter, Download, Plus, Scissors, RefreshCw, Edit, Trash, Tag, Eye, X } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface GroomingTreatment {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  petTypes: string[];
  suitableFor: string[];
  status: 'active' | 'inactive';
}

// Mock data for grooming treatments
const mockGroomingTreatments: GroomingTreatment[] = [
  {
    id: '1',
    name: 'Corte Completo - Perro Pequeño',
    category: 'Corte',
    description: 'Corte completo para perros de razas pequeñas (hasta 10kg)',
    price: 35.00,
    duration: 60,
    petTypes: ['Perro'],
    suitableFor: ['Yorkshire Terrier', 'Bichón Maltés', 'Shih Tzu', 'Caniche Toy'],
    status: 'active'
  },
  {
    id: '2',
    name: 'Corte Completo - Perro Mediano',
    category: 'Corte',
    description: 'Corte completo para perros de razas medianas (10-25kg)',
    price: 45.00,
    duration: 75,
    petTypes: ['Perro'],
    suitableFor: ['Cocker Spaniel', 'Schnauzer', 'Caniche Mediano', 'Bichón Frisé'],
    status: 'active'
  },
  {
    id: '3',
    name: 'Corte Completo - Perro Grande',
    category: 'Corte',
    description: 'Corte completo para perros de razas grandes (más de 25kg)',
    price: 55.00,
    duration: 90,
    petTypes: ['Perro'],
    suitableFor: ['Golden Retriever', 'Labrador', 'Pastor Alemán', 'Husky Siberiano'],
    status: 'active'
  },
  {
    id: '4',
    name: 'Baño y Cepillado - Perro Pequeño',
    category: 'Baño',
    description: 'Baño, secado y cepillado para perros de razas pequeñas',
    price: 25.00,
    duration: 45,
    petTypes: ['Perro'],
    suitableFor: ['Todas las razas pequeñas'],
    status: 'active'
  },
  {
    id: '5',
    name: 'Baño y Cepillado - Perro Mediano',
    category: 'Baño',
    description: 'Baño, secado y cepillado para perros de razas medianas',
    price: 30.00,
    duration: 60,
    petTypes: ['Perro'],
    suitableFor: ['Todas las razas medianas'],
    status: 'active'
  },
  {
    id: '6',
    name: 'Baño y Cepillado - Perro Grande',
    category: 'Baño',
    description: 'Baño, secado y cepillado para perros de razas grandes',
    price: 40.00,
    duration: 75,
    petTypes: ['Perro'],
    suitableFor: ['Todas las razas grandes'],
    status: 'active'
  },
  {
    id: '7',
    name: 'Baño y Cepillado - Gato',
    category: 'Baño',
    description: 'Baño, secado y cepillado para gatos',
    price: 35.00,
    duration: 60,
    petTypes: ['Gato'],
    suitableFor: ['Todas las razas'],
    status: 'active'
  },
  {
    id: '8',
    name: 'Corte de Uñas',
    category: 'Servicios Adicionales',
    description: 'Corte de uñas para perros y gatos',
    price: 15.00,
    duration: 15,
    petTypes: ['Perro', 'Gato'],
    suitableFor: ['Todas las razas'],
    status: 'active'
  },
  {
    id: '9',
    name: 'Limpieza de Oídos',
    category: 'Servicios Adicionales',
    description: 'Limpieza de oídos para perros y gatos',
    price: 12.00,
    duration: 15,
    petTypes: ['Perro', 'Gato'],
    suitableFor: ['Todas las razas'],
    status: 'active'
  },
  {
    id: '10',
    name: 'Tratamiento Antipulgas',
    category: 'Servicios Adicionales',
    description: 'Aplicación de tratamiento antipulgas',
    price: 18.00,
    duration: 10,
    petTypes: ['Perro', 'Gato'],
    suitableFor: ['Todas las razas'],
    status: 'active'
  },
  {
    id: '11',
    name: 'Deslanado Profesional',
    category: 'Servicios Especiales',
    description: 'Eliminación del subpelo muerto para razas de doble capa',
    price: 45.00,
    duration: 60,
    petTypes: ['Perro'],
    suitableFor: ['Golden Retriever', 'Husky Siberiano', 'Pastor Alemán', 'Samoyedo'],
    status: 'active'
  },
  {
    id: '12',
    name: 'Tratamiento de Spa',
    category: 'Servicios Especiales',
    description: 'Baño con productos premium, masaje y aromaterapia',
    price: 50.00,
    duration: 90,
    petTypes: ['Perro', 'Gato'],
    suitableFor: ['Todas las razas'],
    status: 'active'
  }
];

const GroomingTreatments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPetType, setSelectedPetType] = useState('all');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<GroomingTreatment | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique categories
  const categories = Array.from(new Set(mockGroomingTreatments.map(t => t.category)));

  // Filter treatments based on search, category, pet type and status
  const filteredTreatments = mockGroomingTreatments.filter(treatment => {
    const matchesSearch = treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         treatment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || treatment.category === selectedCategory;
    const matchesPetType = selectedPetType === 'all' || treatment.petTypes.includes(selectedPetType);
    const matchesStatus = showInactive ? true : treatment.status === 'active';
    return matchesSearch && matchesCategory && matchesPetType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tratamientos de Peluquería</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de servicios y tratamientos de peluquería
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
            Nuevo Tratamiento
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <Input
            placeholder="Buscar tratamientos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
            className="flex-1"
          />
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedPetType}
            onChange={(e) => setSelectedPetType(e.target.value)}
          >
            <option value="all">Todos los animales</option>
            <option value="Perro">Perros</option>
            <option value="Gato">Gatos</option>
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
            icon={<RefreshCw size={18} />}
          >
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Treatments Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTreatments.map((treatment) => (
            <Card key={treatment.id}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{treatment.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{treatment.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Edit size={16} />}
                    >
                      Editar
                    </Button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Trash size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {treatment.category}
                  </span>
                  {treatment.petTypes.map(type => (
                    <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {type}
                    </span>
                  ))}
                  {treatment.status === 'inactive' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Inactivo
                    </span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Precio</p>
                    <p className="text-sm font-medium text-gray-900">
                      {treatment.price.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duración</p>
                    <p className="text-sm font-medium text-gray-900">{treatment.duration} min</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Adecuado para:</p>
                  <div className="flex flex-wrap gap-1">
                    {treatment.suitableFor.map((breed, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {breed}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye size={16} />}
                      onClick={() => setSelectedTreatment(treatment)}
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Tag size={16} />}
                    >
                      Precios Especiales
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Treatments List View */}
      {viewMode === 'list' && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tratamiento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de Mascota
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duración
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
                {filteredTreatments.map((treatment) => (
                  <tr key={treatment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{treatment.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{treatment.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {treatment.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {treatment.petTypes.map(type => (
                          <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {type}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {treatment.price.toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{treatment.duration} min</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        treatment.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {treatment.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Eye size={16} />}
                          onClick={() => setSelectedTreatment(treatment)}
                        >
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Edit size={16} />}
                        >
                          Editar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Treatment Details Modal */}
      {selectedTreatment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Detalles del Tratamiento
              </h3>
              <button
                onClick={() => setSelectedTreatment(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Nombre</h4>
                  <p className="mt-1 text-base font-medium text-gray-900">{selectedTreatment.name}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Descripción</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedTreatment.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Categoría</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedTreatment.category}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Tipo de Mascota</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedTreatment.petTypes.map((type, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Precio</h4>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {selectedTreatment.price.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Duración</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedTreatment.duration} minutos</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Adecuado para</h4>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedTreatment.suitableFor.map((breed, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {breed}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Estado</h4>
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedTreatment.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedTreatment.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </p>
                </div>
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
                onClick={() => setSelectedTreatment(null)}
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

export default GroomingTreatments;