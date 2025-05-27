import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Edit, 
  Trash, 
  Plus, 
  X, 
  Check, 
  AlertTriangle, 
  Pill, 
  Package, 
  FileText, 
  Eye, 
  ExternalLink,
  Link,
  Info,
  Loader
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import CimavetAdvancedSearch from '../../components/CimavetAdvancedSearch';
import { getMedicationDetails, importMedicationFromCimavet } from '../../utils/cimavetApi';

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
  registrationNumber?: string;
  aiScore?: number;
}

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
    stock: 150,
    minStock: 50,
    price: 25.50,
    reference: 'AMX-250',
    registrationNumber: '1234-ESP',
    aiScore: 95
  },
  {
    id: '2',
    name: 'Meloxicam 1.5mg/ml',
    activeIngredient: 'Meloxicam',
    manufacturer: 'Boehringer Ingelheim',
    type: 'Antiinflamatorio',
    conditions: ['Dolor', 'Inflamación', 'Artritis'],
    species: ['Perro', 'Gato'],
    breeds: ['Todas'],
    sex: 'both',
    dosageForm: 'Suspensión oral',
    recommendedDosage: '0.2mg/kg el primer día, luego 0.1mg/kg',
    duration: '5-7 días',
    contraindications: ['Problemas renales', 'Úlceras gástricas'],
    sideEffects: ['Problemas digestivos'],
    interactions: ['No combinar con otros AINEs'],
    status: 'active',
    stock: 75,
    minStock: 30,
    price: 18.75,
    reference: 'MLX-15',
    registrationNumber: '2345-ESP',
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
    stock: 45,
    minStock: 20,
    price: 65.80,
    reference: 'APQ-16',
    registrationNumber: '3456-ESP',
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
    stock: 60,
    minStock: 25,
    price: 32.40,
    reference: 'SMP-80',
    registrationNumber: '4567-ESP',
    aiScore: 96
  },
  {
    id: '5',
    name: 'Metacam 1.5mg/ml',
    activeIngredient: 'Meloxicam',
    manufacturer: 'Boehringer Ingelheim',
    type: 'Antiinflamatorio',
    conditions: ['Dolor', 'Inflamación', 'Artritis'],
    species: ['Perro', 'Gato'],
    breeds: ['Todas'],
    sex: 'both',
    dosageForm: 'Suspensión oral',
    recommendedDosage: '0.1mg/kg una vez al día',
    duration: '5-7 días',
    contraindications: ['Problemas renales', 'Úlceras gástricas'],
    sideEffects: ['Problemas digestivos'],
    interactions: ['No combinar con otros AINEs'],
    status: 'active',
    stock: 30,
    minStock: 15,
    price: 19.95,
    reference: 'MTC-15',
    registrationNumber: '5678-ESP',
    aiScore: 90
  }
];

const Medications: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [showInactive, setShowInactive] = useState(false);
  const [showLowStock, setShowLowStock] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showNewMedicationForm, setShowNewMedicationForm] = useState(false);
  const [showEditMedicationForm, setShowEditMedicationForm] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showMedicationDetails, setShowMedicationDetails] = useState<Medication | null>(null);
  const [cimavetDetails, setCimavetDetails] = useState<any>(null);
  const [loadingCimavet, setLoadingCimavet] = useState(false);
  const [showCimavetSearch, setShowCimavetSearch] = useState(false);

  // Get unique medication types
  const medicationTypes = Array.from(new Set(medications.map(med => med.type)));
  
  // Get unique species
  const species = Array.from(new Set(medications.flatMap(med => med.species)));

  // Filter medications based on search term, type, species, and status
  const filteredMedications = medications.filter(medication => {
    const matchesSearch = medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medication.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medication.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || medication.type === selectedType;
    const matchesSpecies = selectedSpecies === 'all' || medication.species.includes(selectedSpecies);
    const matchesStatus = showInactive ? true : medication.status === 'active';
    const matchesStock = showLowStock ? medication.stock <= medication.minStock : true;
    return matchesSearch && matchesType && matchesSpecies && matchesStatus && matchesStock;
  });

  const handleEditMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    setShowEditMedicationForm(true);
  };

  const handleDeleteMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (selectedMedication) {
      setMedications(prev => prev.filter(m => m.id !== selectedMedication.id));
      setShowDeleteConfirmation(false);
      setSelectedMedication(null);
    }
  };

  const handleViewDetails = (medication: Medication) => {
    setShowMedicationDetails(medication);
    
    // Fetch CIMAVET details if registration number is available
    if (medication.registrationNumber) {
      setLoadingCimavet(true);
      getMedicationDetails(medication.registrationNumber)
        .then(data => {
          setCimavetDetails(data);
        })
        .catch(error => {
          console.error('Error fetching CIMAVET details:', error);
          setCimavetDetails(null);
        })
        .finally(() => {
          setLoadingCimavet(false);
        });
    } else {
      setCimavetDetails(null);
    }
  };

  const handleNewMedication = (medicationData: any) => {
    // Here you would typically make an API call to save the new medication
    console.log('New medication data:', medicationData);
    setShowNewMedicationForm(false);
  };

  const handleUpdateMedication = (medicationData: any) => {
    // Here you would typically make an API call to update the medication
    console.log('Updated medication data:', medicationData);
    setShowEditMedicationForm(false);
  };

  const handleImportFromCimavet = async (medicationData: any) => {
    try {
      const importedMedication = await importMedicationFromCimavet(medicationData.codigo);
      // Add to local medications list
      const newMedication: Medication = {
        id: Date.now().toString(),
        ...importedMedication,
        aiScore: 95
      };
      setMedications(prev => [...prev, newMedication]);
      setShowCimavetSearch(false);
    } catch (error) {
      console.error('Error importing medication from CIMAVET:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicamentos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión del inventario de medicamentos
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
            icon={<ExternalLink size={18} />}
            className="flex-1 sm:flex-none"
            onClick={() => setShowCimavetSearch(true)}
          >
            Cimavet
          </Button>
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            className="flex-1 sm:flex-none"
            onClick={() => setShowNewMedicationForm(true)}
          >
            Nuevo Medicamento
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Total Medicamentos</h3>
              <Pill className="h-5 w-5 text-blue-500" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{medications.length}</p>
            <p className="mt-1 text-sm text-gray-500">medicamentos en inventario</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Stock Bajo</h3>
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-yellow-600">
              {medications.filter(med => med.stock <= med.minStock).length}
            </p>
            <p className="mt-1 text-sm text-gray-500">medicamentos por debajo del mínimo</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Valor Total</h3>
              <Package className="h-5 w-5 text-green-500" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-green-600">
              {medications.reduce((sum, med) => sum + (med.stock * med.price), 0).toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR'
              })}
            </p>
            <p className="mt-1 text-sm text-gray-500">valor del inventario</p>
          </div>
        </Card>
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
            {medicationTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
          >
            <option value="all">Todas las especies</option>
            {species.map(s => (
              <option key={s} value={s}>{s}</option>
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
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showLowStock"
              checked={showLowStock}
              onChange={(e) => setShowLowStock(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showLowStock" className="ml-2 text-sm text-gray-700">
              Stock bajo
            </label>
          </div>
          <div className="flex rounded-md shadow-sm">
            <button
              className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'grid'
                  ? 'bg-blue-50 text-blue-600 border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setViewMode('grid')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-b border-r ${
                viewMode === 'table'
                  ? 'bg-blue-50 text-blue-600 border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setViewMode('table')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
          <Button
            variant="outline"
            icon={<RefreshCw size={18} />}
          >
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Medications Grid View */}
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
                      onClick={() => handleEditMedication(medication)}
                    >
                      Editar
                    </Button>
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => handleDeleteMedication(medication)}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {medication.type}
                  </span>
                  {medication.species.map((s, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {s}
                    </span>
                  ))}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    medication.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {medication.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Stock</p>
                    <p className={`text-sm font-medium ${
                      medication.stock <= medication.minStock ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {medication.stock} unidades
                      {medication.stock <= medication.minStock && (
                        <AlertTriangle size={14} className="inline ml-1 text-red-500" />
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Precio</p>
                    <p className="text-sm font-medium text-gray-900">
                      {medication.price.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      {medication.manufacturer}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye size={16} />}
                      onClick={() => handleViewDetails(medication)}
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

      {/* Medications Table View */}
      {viewMode === 'table' && (
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
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
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
                      <div className="text-sm text-gray-500">{medication.activeIngredient}</div>
                      <div className="text-xs text-gray-500">{medication.manufacturer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {medication.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {medication.species.map((species, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {species}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${
                        medication.stock <= medication.minStock ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {medication.stock} unidades
                        {medication.stock <= medication.minStock && (
                          <AlertTriangle size={14} className="inline ml-1 text-red-500" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500">Mínimo: {medication.minStock}</div>
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
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        medication.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {medication.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Eye size={16} />}
                          onClick={() => handleViewDetails(medication)}
                        >
                          Detalles
                        </Button>
                        <button 
                          className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                          onClick={() => handleEditMedication(medication)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                          onClick={() => handleDeleteMedication(medication)}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Medication Modal */}
      {showNewMedicationForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Nuevo Medicamento</h2>
              <button
                onClick={() => setShowNewMedicationForm(false)}
                className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Nombre del Medicamento"
                    placeholder="Ej: Amoxicilina 250mg"
                    required
                  />
                  
                  <Input
                    label="Principio Activo"
                    placeholder="Ej: Amoxicilina"
                    required
                  />
                  
                  <Input
                    label="Fabricante"
                    placeholder="Ej: Laboratorios MSD"
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="Antibiótico">Antibiótico</option>
                      <option value="Antiinflamatorio">Antiinflamatorio</option>
                      <option value="Antialérgico">Antialérgico</option>
                      <option value="Antiparasitario">Antiparasitario</option>
                      <option value="Analgésico">Analgésico</option>
                      <option value="Hormonal">Hormonal</option>
                      <option value="Cardiovascular">Cardiovascular</option>
                      <option value="Dermatológico">Dermatológico</option>
                      <option value="Oftalmológico">Oftalmológico</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Forma Farmacéutica
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    >
                      <option value="">Seleccionar forma</option>
                      <option value="Comprimidos">Comprimidos</option>
                      <option value="Cápsulas">Cápsulas</option>
                      <option value="Suspensión oral">Suspensión oral</option>
                      <option value="Solución oral">Solución oral</option>
                      <option value="Solución inyectable">Solución inyectable</option>
                      <option value="Pomada">Pomada</option>
                      <option value="Crema">Crema</option>
                      <option value="Gel">Gel</option>
                      <option value="Gotas">Gotas</option>
                      <option value="Spray">Spray</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Especies
                    </label>
                    <div className="mt-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['Perro', 'Gato', 'Conejo', 'Hurón', 'Ave', 'Reptil', 'Roedor', 'Équido'].map((species) => (
                        <label key={species} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700">{species}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posología Recomendada
                    </label>
                    <Input
                      placeholder="Ej: 1 comprimido cada 12 horas"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duración Recomendada
                    </label>
                    <Input
                      placeholder="Ej: 7-14 días"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Registro
                    </label>
                    <Input
                      placeholder="Ej: 1234-ESP"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Referencia
                    </label>
                    <Input
                      placeholder="Ej: AMX-250"
                    />
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Inventario</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Actual
                      </label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Mínimo
                      </label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información Clínica</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Indicaciones
                      </label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Una indicación por línea..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraindicaciones
                      </label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Una contraindicación por línea..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Efectos Secundarios
                      </label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Un efecto secundario por línea..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Interacciones
                      </label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Una interacción por línea..."
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Estado</h3>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="medicationStatus"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        defaultChecked
                      />
                      <label htmlFor="medicationStatus" className="ml-2 text-sm text-gray-700">
                        Activo
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowNewMedicationForm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => handleNewMedication({})}
              >
                Guardar Medicamento
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Medication Modal */}
      {showEditMedicationForm && selectedMedication && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Editar Medicamento</h2>
              <button
                onClick={() => setShowEditMedicationForm(false)}
                className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Nombre del Medicamento"
                    defaultValue={selectedMedication.name}
                    required
                  />
                  
                  <Input
                    label="Principio Activo"
                    defaultValue={selectedMedication.activeIngredient}
                    required
                  />
                  
                  <Input
                    label="Fabricante"
                    defaultValue={selectedMedication.manufacturer}
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      defaultValue={selectedMedication.type}
                      required
                    >
                      <option value="Antibiótico">Antibiótico</option>
                      <option value="Antiinflamatorio">Antiinflamatorio</option>
                      <option value="Antialérgico">Antialérgico</option>
                      <option value="Antiparasitario">Antiparasitario</option>
                      <option value="Analgésico">Analgésico</option>
                      <option value="Hormonal">Hormonal</option>
                      <option value="Cardiovascular">Cardiovascular</option>
                      <option value="Dermatológico">Dermatológico</option>
                      <option value="Oftalmológico">Oftalmológico</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Forma Farmacéutica
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      defaultValue={selectedMedication.dosageForm}
                      required
                    >
                      <option value="Comprimidos">Comprimidos</option>
                      <option value="Cápsulas">Cápsulas</option>
                      <option value="Suspensión oral">Suspensión oral</option>
                      <option value="Solución oral">Solución oral</option>
                      <option value="Solución inyectable">Solución inyectable</option>
                      <option value="Pomada">Pomada</option>
                      <option value="Crema">Crema</option>
                      <option value="Gel">Gel</option>
                      <option value="Gotas">Gotas</option>
                      <option value="Spray">Spray</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Especies
                    </label>
                    <div className="mt-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['Perro', 'Gato', 'Conejo', 'Hurón', 'Ave', 'Reptil', 'Roedor', 'Équido'].map((species) => (
                        <label key={species} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            defaultChecked={selectedMedication.species.includes(species)}
                          />
                          <span className="ml-2 text-sm text-gray-700">{species}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posología Recomendada
                    </label>
                    <Input
                      defaultValue={selectedMedication.recommendedDosage}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duración Recomendada
                    </label>
                    <Input
                      defaultValue={selectedMedication.duration}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Registro
                    </label>
                    <Input
                      defaultValue={selectedMedication.registrationNumber}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Referencia
                    </label>
                    <Input
                      defaultValue={selectedMedication.reference}
                    />
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Inventario</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Actual
                      </label>
                      <Input
                        type="number"
                        min="0"
                        defaultValue={selectedMedication.stock.toString()}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Mínimo
                      </label>
                      <Input
                        type="number"
                        min="0"
                        defaultValue={selectedMedication.minStock.toString()}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={selectedMedication.price.toString()}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información Clínica</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Indicaciones
                      </label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        defaultValue={selectedMedication.conditions.join('\n')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraindicaciones
                      </label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        defaultValue={selectedMedication.contraindications.join('\n')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Efectos Secundarios
                      </label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        defaultValue={selectedMedication.sideEffects.join('\n')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Interacciones
                      </label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        defaultValue={selectedMedication.interactions.join('\n')}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Estado</h3>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="editMedicationStatus"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        defaultChecked={selectedMedication.status === 'active'}
                      />
                      <label htmlFor="editMedicationStatus" className="ml-2 text-sm text-gray-700">
                        Activo
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowEditMedicationForm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => handleUpdateMedication({})}
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && selectedMedication && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="text-center">
              <AlertTriangle size={48} className="mx-auto text-red-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Confirmar Eliminación</h3>
              <p className="mt-2 text-sm text-gray-500">
                ¿Estás seguro de que deseas eliminar el medicamento "{selectedMedication.name}"? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Medication Details Modal */}
      {showMedicationDetails && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Detalles del Medicamento</h2>
              <button
                onClick={() => {
                  setShowMedicationDetails(null);
                  setCimavetDetails(null);
                }}
                className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información General</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Nombre</p>
                      <p className="text-sm font-medium text-gray-900">{showMedicationDetails.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Principio Activo</p>
                      <p className="text-sm font-medium text-gray-900">{showMedicationDetails.activeIngredient}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fabricante</p>
                      <p className="text-sm font-medium text-gray-900">{showMedicationDetails.manufacturer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tipo</p>
                      <p className="text-sm font-medium text-gray-900">{showMedicationDetails.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Forma Farmacéutica</p>
                      <p className="text-sm font-medium text-gray-900">{showMedicationDetails.dosageForm}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Especies</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {showMedicationDetails.species.map((species, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {species}
                          </span>
                        ))}
                      </div>
                    </div>
                    {showMedicationDetails.registrationNumber && (
                      <div>
                        <p className="text-sm text-gray-500">Número de Registro</p>
                        <p className="text-sm font-medium text-gray-900">{showMedicationDetails.registrationNumber}</p>
                      </div>
                    )}
                    {showMedicationDetails.reference && (
                      <div>
                        <p className="text-sm text-gray-500">Referencia</p>
                        <p className="text-sm font-medium text-gray-900">{showMedicationDetails.reference}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información Clínica</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Posología Recomendada</p>
                      <p className="text-sm font-medium text-gray-900">{showMedicationDetails.recommendedDosage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duración Recomendada</p>
                      <p className="text-sm font-medium text-gray-900">{showMedicationDetails.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Indicaciones</p>
                      <ul className="mt-1 text-sm text-gray-900 list-disc list-inside">
                        {showMedicationDetails.conditions.map((condition, index) => (
                          <li key={index}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contraindicaciones</p>
                      <ul className="mt-1 text-sm text-gray-900 list-disc list-inside">
                        {showMedicationDetails.contraindications.map((contraindication, index) => (
                          <li key={index}>{contraindication}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Efectos Secundarios</p>
                      <ul className="mt-1 text-sm text-gray-900 list-disc list-inside">
                        {showMedicationDetails.sideEffects.map((sideEffect, index) => (
                          <li key={index}>{sideEffect}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Interacciones</p>
                      <ul className="mt-1 text-sm text-gray-900 list-disc list-inside">
                        {showMedicationDetails.interactions.map((interaction, index) => (
                          <li key={index}>{interaction}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Inventario</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Stock Actual</p>
                      <p className={`text-sm font-medium ${
                        showMedicationDetails.stock <= showMedicationDetails.minStock ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {showMedicationDetails.stock} unidades
                        {showMedicationDetails.stock <= showMedicationDetails.minStock && (
                          <AlertTriangle size={14} className="inline ml-1 text-red-500" />
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Stock Mínimo</p>
                      <p className="text-sm font-medium text-gray-900">{showMedicationDetails.minStock} unidades</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Precio</p>
                      <p className="text-sm font-medium text-gray-900">
                        {showMedicationDetails.price.toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estado</p>
                      <p className="text-sm font-medium text-gray-900">
                        {showMedicationDetails.status === 'active' ? 'Activo' : 'Inactivo'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* CIMAVET Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información CIMAVET</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {showMedicationDetails.registrationNumber ? (
                      loadingCimavet ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader size={24} className="animate-spin text-blue-500 mr-2" />
                          <p className="text-sm text-gray-600">Cargando información de CIMAVET...</p>
                        </div>
                      ) : cimavetDetails ? (
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-500">Número de Registro</p>
                            <p className="text-sm font-medium text-gray-900">{cimavetDetails.registrationNumber}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Documentación</p>
                            <div className="mt-1 space-y-2">
                              {cimavetDetails.datasheet && (
                                <a 
                                  href={cimavetDetails.datasheet} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center text-blue-600 hover:text-blue-800"
                                >
                                  <FileText size={16} className="mr-1" />
                                  <span className="text-sm">Ficha Técnica</span>
                                  <ExternalLink size={12} className="ml-1" />
                                </a>
                              )}
                              {cimavetDetails.leaflet && (
                                <a 
                                  href={cimavetDetails.leaflet} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center text-blue-600 hover:text-blue-800"
                                >
                                  <FileText size={16} className="mr-1" />
                                  <span className="text-sm">Prospecto</span>
                                  <ExternalLink size={12} className="ml-1" />
                                </a>
                              )}
                              <a 
                                href={`https://cimavet.aemps.es/cimavet/medicamento.do?nregistro=${cimavetDetails.registrationNumber}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink size={16} className="mr-1" />
                                <span className="text-sm">Ver en CIMAVET</span>
                              </a>
                              <a 
                                href={`https://cimavet.aemps.es/cimavet/rest/medicamento?nregistro=${cimavetDetails.registrationNumber}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-800"
                              >
                                <Link size={16} className="mr-1" />
                                <span className="text-sm">API REST</span>
                              </a>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Especies Aprobadas</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {cimavetDetails.species.map((species, index) => (
                                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {species}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-500">Vías de Administración</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {cimavetDetails.administrationRoutes.map((route, index) => (
                                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {route}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-500">Requiere Prescripción</p>
                              <p className="text-sm font-medium text-gray-900">
                                {cimavetDetails.prescriptionRequired ? 'Sí' : 'No'}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-500">Antibiótico</p>
                              <p className="text-sm font-medium text-gray-900">
                                {cimavetDetails.antibiotic ? 'Sí' : 'No'}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-500">Comercializado</p>
                              <p className="text-sm font-medium text-gray-900">
                                {cimavetDetails.commercialized ? 'Sí' : 'No'}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm text-gray-500">Situación</p>
                              <p className="text-sm font-medium text-gray-900">
                                {cimavetDetails.situation === 'authorized' ? 'Autorizado' : 
                                 cimavetDetails.situation === 'suspended' ? 'Suspendido' : 'Revocado'}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <Info size={24} className="text-blue-500 mb-2" />
                          <p className="text-sm text-gray-600 text-center">No se pudo obtener información de CIMAVET para este medicamento.</p>
                          <p className="text-sm text-gray-500 text-center mt-1">Verifique que el número de registro sea correcto.</p>
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Info size={24} className="text-blue-500 mb-2" />
                        <p className="text-sm text-gray-600 text-center">Este medicamento no tiene un número de registro CIMAVET asociado.</p>
                        <p className="text-sm text-gray-500 text-center mt-1">Añada un número de registro para ver la información oficial.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowMedicationDetails(null);
                  setCimavetDetails(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CIMAVET Advanced Search Modal */}
      {showCimavetSearch && (
        <CimavetAdvancedSearch
          onClose={() => setShowCimavetSearch(false)}
          onImport={handleImportFromCimavet}
        />
      )}
    </div>
  );
};

export default Medications;