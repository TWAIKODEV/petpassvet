import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Pill, RefreshCw, Edit, Trash, Tag, Eye, X, DollarSign, Database } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface Medication {
  id: string;
  name: string;
  activeIngredient: string;
  manufacturer: string;
  type: string;
  conditions: string[];
  species: string[];
  breeds: string[];
  sex: 'male' | 'female' | 'both';
  dosageForm: string;
  recommendedDosage: string;
  duration: string;
  contraindications: string[];
  sideEffects: string[];
  interactions: string[];
  status: 'active' | 'inactive';
  stock: number;
  minStock: number;
  price: number;
  reference?: string;
  atcVetCode?: string;
  registrationNumber?: string;
  prescriptionRequired: boolean;
  psychotropic: boolean;
  antibiotic: boolean;
  administrationRoutes: string[];
  excipients?: string[];
  withdrawalPeriod?: string;
  aiScore?: number;
}

// Mock data for medications
const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Amoxicilina 250mg',
    activeIngredient: 'Amoxicilina',
    manufacturer: 'Laboratorios MSD',
    type: 'Antibiótico',
    conditions: ['Infección bacteriana', 'Infección respiratoria'],
    species: ['Perro', 'Gato'],
    breeds: ['Todas'],
    sex: 'both',
    dosageForm: 'Comprimidos',
    recommendedDosage: '1 comprimido cada 12 horas',
    duration: '7-14 días',
    contraindications: ['Alergia a penicilinas'],
    sideEffects: ['Diarrea', 'Vómitos'],
    interactions: ['No administrar con otros antibióticos'],
    status: 'active',
    stock: 45,
    minStock: 20,
    price: 25.50,
    reference: 'MED-AMOX-250',
    atcVetCode: 'QJ01CA04',
    registrationNumber: '1234-ESP',
    prescriptionRequired: true,
    psychotropic: false,
    antibiotic: true,
    administrationRoutes: ['Oral'],
    aiScore: 95
  },
  {
    id: '2',
    name: 'Meloxicam 1.5mg/ml',
    activeIngredient: 'Meloxicam',
    manufacturer: 'Boehringer Ingelheim',
    type: 'Antiinflamatorio',
    conditions: ['Dolor', 'Inflamación', 'Artritis'],
    species: ['Perro'],
    breeds: ['Todas'],
    sex: 'both',
    dosageForm: 'Suspensión oral',
    recommendedDosage: '0.2mg/kg el primer día, luego 0.1mg/kg',
    duration: '5-7 días',
    contraindications: ['Problemas renales', 'Úlceras gástricas'],
    sideEffects: ['Problemas digestivos'],
    interactions: ['No combinar con otros AINEs'],
    status: 'active',
    stock: 32,
    minStock: 15,
    price: 18.75,
    reference: 'MED-MELOX-15',
    atcVetCode: 'QM01AC06',
    registrationNumber: '2345-ESP',
    prescriptionRequired: true,
    psychotropic: false,
    antibiotic: false,
    administrationRoutes: ['Oral'],
    aiScore: 88
  },
  {
    id: '3',
    name: 'Apoquel 16mg',
    activeIngredient: 'Oclacitinib',
    manufacturer: 'Zoetis',
    type: 'Antialérgico',
    conditions: ['Dermatitis atópica', 'Prurito'],
    species: ['Perro'],
    breeds: ['Todas'],
    sex: 'both',
    dosageForm: 'Comprimidos',
    recommendedDosage: '0.4-0.6mg/kg cada 12 horas',
    duration: 'Según respuesta',
    contraindications: ['Infecciones graves'],
    sideEffects: ['Letargia', 'Anorexia'],
    interactions: ['Inmunosupresores'],
    status: 'active',
    stock: 18,
    minStock: 10,
    price: 45.20,
    reference: 'MED-APOQ-16',
    atcVetCode: 'QD11AH90',
    registrationNumber: '3456-ESP',
    prescriptionRequired: true,
    psychotropic: false,
    antibiotic: false,
    administrationRoutes: ['Oral'],
    aiScore: 92
  },
  {
    id: '4',
    name: 'Simparica 80mg',
    activeIngredient: 'Sarolaner',
    manufacturer: 'Zoetis',
    type: 'Antiparasitario',
    conditions: ['Pulgas', 'Garrapatas', 'Ácaros'],
    species: ['Perro'],
    breeds: ['Todas'],
    sex: 'both',
    dosageForm: 'Comprimidos masticables',
    recommendedDosage: '1 comprimido mensual',
    duration: 'Mensual',
    contraindications: ['Cachorros menores de 8 semanas'],
    sideEffects: ['Vómitos', 'Diarrea (poco frecuentes)'],
    interactions: ['No conocidas'],
    status: 'active',
    stock: 25,
    minStock: 12,
    price: 32.40,
    reference: 'MED-SIMP-80',
    atcVetCode: 'QP53BE01',
    registrationNumber: '4567-ESP',
    prescriptionRequired: true,
    psychotropic: false,
    antibiotic: false,
    administrationRoutes: ['Oral'],
    aiScore: 96
  },
  {
    id: '5',
    name: 'Metacam 1.5mg/ml',
    activeIngredient: 'Meloxicam',
    manufacturer: 'Boehringer Ingelheim',
    type: 'Antiinflamatorio',
    conditions: ['Dolor', 'Inflamación', 'Artritis'],
    species: ['Perro'],
    breeds: ['Todas'],
    sex: 'both',
    dosageForm: 'Suspensión oral',
    recommendedDosage: '0.1mg/kg una vez al día',
    duration: '5-7 días',
    contraindications: ['Problemas renales', 'Úlceras gástricas'],
    sideEffects: ['Problemas digestivos'],
    interactions: ['No combinar con otros AINEs'],
    status: 'active',
    stock: 28,
    minStock: 15,
    price: 19.50,
    reference: 'MED-META-15',
    atcVetCode: 'QM01AC06',
    registrationNumber: '5678-ESP',
    prescriptionRequired: true,
    psychotropic: false,
    antibiotic: false,
    administrationRoutes: ['Oral'],
    aiScore: 90
  }
];

const Medicamentos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cimavetSearchTerm, setCimavetSearchTerm] = useState('');

  // Get unique medication types and species
  const types = Array.from(new Set(mockMedications.map(med => med.type)));
  const species = Array.from(new Set(mockMedications.flatMap(med => med.species)));

  // Filter medications based on search, type, species, and status
  const filteredMedications = mockMedications.filter(medication => {
    const matchesSearch = 
      medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medication.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medication.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medication.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medication.conditions.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || medication.type === selectedType;
    const matchesSpecies = selectedSpecies === 'all' || medication.species.includes(selectedSpecies);
    const matchesStatus = showInactive ? true : medication.status === 'active';
    
    return matchesSearch && matchesType && matchesSpecies && matchesStatus;
  });

  const handleCimavetSearch = () => {
    // In a real app, this would search the CIMAVET API
    console.log('Searching CIMAVET for:', cimavetSearchTerm);
    // For demo purposes, we'll just show an alert
    alert(`Buscando en CIMAVET: ${cimavetSearchTerm}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicamentos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de medicamentos y tratamientos
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Input
            placeholder="Buscar en CIMAVET..."
            value={cimavetSearchTerm}
            onChange={(e) => setCimavetSearchTerm(e.target.value)}
            className="w-48"
          />
          <Button
            variant="outline"
            icon={<Database size={18} />}
            onClick={handleCimavetSearch}
          >
            CIMAVET
          </Button>
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
            Nuevo Medicamento
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <Input
            placeholder="Buscar medicamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
            className="flex-1"
          />
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">Todos los tipos</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
          >
            <option value="all">Todas las especies</option>
            {species.map(species => (
              <option key={species} value={species}>{species}</option>
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
            icon={<RefreshCw size={18} />}
          >
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedications.map((medication) => (
            <Card key={medication.id}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{medication.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{medication.activeIngredient}</p>
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

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {medication.type}
                  </span>
                  {medication.species.map(species => (
                    <span key={species} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {species}
                    </span>
                  ))}
                  {medication.status === 'inactive' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Inactivo
                    </span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Precio</p>
                    <p className="text-sm font-medium text-gray-900">
                      {medication.price.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Stock</p>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        medication.stock === 0
                          ? 'bg-red-100 text-red-800'
                          : medication.stock <= medication.minStock
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {medication.stock} uds
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Tag size={16} />}
                    >
                      Precios Especiales
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye size={16} />}
                      onClick={() => setSelectedMedication(medication)}
                    >
                      Ver Detalles
                    </Button>
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
                    Medicamento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especies
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
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
                {filteredMedications.map((medication) => (
                  <tr key={medication.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{medication.name}</div>
                      <div className="text-xs text-gray-500">{medication.activeIngredient} • {medication.manufacturer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {medication.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {medication.species.map(species => (
                          <span key={species} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {species}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {medication.price.toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        medication.stock === 0
                          ? 'bg-red-100 text-red-800'
                          : medication.stock <= medication.minStock
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {medication.stock} uds
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        medication.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {medication.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2 justify-end">
                        <button
                          onClick={() => setSelectedMedication(medication)}
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredMedications.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Pill size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No se encontraron medicamentos</h3>
              <p className="text-gray-500 mt-1">Prueba con otros términos de búsqueda o cambia los filtros</p>
            </div>
          )}
        </div>
      )}

      {/* Medication Details Modal */}
      {selectedMedication && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Detalles del Medicamento
              </h3>
              <button
                onClick={() => setSelectedMedication(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Información Básica</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nombre</p>
                      <p className="mt-1 text-base font-medium text-gray-900">{selectedMedication.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Principio Activo</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedMedication.activeIngredient}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fabricante</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedMedication.manufacturer}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tipo</p>
                      <p className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {selectedMedication.type}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Especies</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedMedication.species.map((species, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {species}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Forma Farmacéutica</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedMedication.dosageForm}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Vías de Administración</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedMedication.administrationRoutes.map((route, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {route}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dosage and Usage */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Dosificación y Uso</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Posología Recomendada</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedMedication.recommendedDosage}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Duración del Tratamiento</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedMedication.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Indicaciones</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedMedication.conditions.map((condition, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Contraindicaciones</p>
                      <ul className="mt-1 text-sm text-gray-900 list-disc list-inside">
                        {selectedMedication.contraindications.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Efectos Secundarios</p>
                      <ul className="mt-1 text-sm text-gray-900 list-disc list-inside">
                        {selectedMedication.sideEffects.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Interacciones</p>
                      <ul className="mt-1 text-sm text-gray-900 list-disc list-inside">
                        {selectedMedication.interactions.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Información de Stock</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Stock Actual</p>
                        <p className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedMedication.stock === 0
                              ? 'bg-red-100 text-red-800'
                              : selectedMedication.stock <= selectedMedication.minStock
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {selectedMedication.stock} unidades
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Stock Mínimo</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedMedication.minStock} unidades</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Precio</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {selectedMedication.price.toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Información Regulatoria</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Nº Registro</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedMedication.registrationNumber || 'No disponible'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Código ATC Vet</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedMedication.atcVetCode || 'No disponible'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Referencia</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedMedication.reference || 'No disponible'}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Características Especiales</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Requiere Receta</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedMedication.prescriptionRequired ? 'Sí' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Psicotrópico</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedMedication.psychotropic ? 'Sí' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Antibiótico</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedMedication.antibiotic ? 'Sí' : 'No'}</p>
                      </div>
                      {selectedMedication.aiScore && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">Puntuación IA</p>
                          <p className="mt-1 text-sm text-gray-900">{selectedMedication.aiScore}/100</p>
                        </div>
                      )}
                    </div>
                  </div>
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
                onClick={() => setSelectedMedication(null)}
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

export default Medicamentos;