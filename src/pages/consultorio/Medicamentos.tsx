import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Pill, RefreshCw, Edit, Trash, Tag, Eye, X, DollarSign, Database, AlertTriangle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

interface Medication {
  _id: Id<"medicines">;
  name: string;
  activeIngredient: string;
  manufacturer: string;
  type: string;
  dosageForm: string;
  species: string[];
  recommendedDosage: string;
  duration: string;
  registrationNumber?: string;
  reference?: string;
  stock: number;
  minStock: number;
  price: number;
  conditions: string[];
  contraindications: string[];
  sideEffects: string[];
  interactions: string[];
  status: 'active' | 'inactive';
  atcVetCode?: string;
  prescriptionRequired?: boolean;
  psychotropic?: boolean;
  antibiotic?: boolean;
  administrationRoutes?: string[];
  excipients?: string[];
  withdrawalPeriod?: string;
  aiScore?: number;
  createdAt: number;
  updatedAt: number;
}

const Medicamentos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cimavetSearchTerm, setCimavetSearchTerm] = useState('');
  const [showNewMedicationForm, setShowNewMedicationForm] = useState(false);
  const [showEditMedicationForm, setShowEditMedicationForm] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Convex queries and mutations
  const medications = useQuery(api.medicines.getMedicines) || [];
  const createMedicine = useMutation(api.medicines.createMedicine);
  const updateMedicine = useMutation(api.medicines.updateMedicine);
  const deleteMedicine = useMutation(api.medicines.deleteMedicine);

  // Form state for new/edit medication
  const [formData, setFormData] = useState({
    name: '',
    activeIngredient: '',
    manufacturer: '',
    type: '',
    dosageForm: '',
    species: [] as string[],
    recommendedDosage: '',
    duration: '',
    registrationNumber: '',
    reference: '',
    stock: 0,
    minStock: 0,
    price: 0,
    conditions: [] as string[],
    contraindications: [] as string[],
    sideEffects: [] as string[],
    interactions: [] as string[],
    status: 'active' as 'active' | 'inactive',
    atcVetCode: '',
    prescriptionRequired: false,
    psychotropic: false,
    antibiotic: false,
    administrationRoutes: [] as string[],
  });

  // Get unique medication types and species
  const types = Array.from(new Set(medications.map(med => med.type)));
  const species = Array.from(new Set(medications.flatMap(med => med.species)));

  // Filter medications based on search, type, species, and status
  const filteredMedications = medications.filter(medication => {
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
    console.log('Searching CIMAVET for:', cimavetSearchTerm);
    alert(`Buscando en CIMAVET: ${cimavetSearchTerm}`);
  };

  const handleCreateMedication = async () => {
    try {
      await createMedicine({
        name: formData.name,
        activeIngredient: formData.activeIngredient,
        manufacturer: formData.manufacturer,
        type: formData.type,
        dosageForm: formData.dosageForm,
        species: formData.species,
        recommendedDosage: formData.recommendedDosage,
        duration: formData.duration,
        registrationNumber: formData.registrationNumber || undefined,
        reference: formData.reference || undefined,
        stock: formData.stock,
        minStock: formData.minStock,
        price: formData.price,
        conditions: formData.conditions,
        contraindications: formData.contraindications,
        sideEffects: formData.sideEffects,
        interactions: formData.interactions,
        status: formData.status,
        atcVetCode: formData.atcVetCode || undefined,
        prescriptionRequired: formData.prescriptionRequired,
        psychotropic: formData.psychotropic,
        antibiotic: formData.antibiotic,
        administrationRoutes: formData.administrationRoutes,
      });
      setShowNewMedicationForm(false);
      resetForm();
    } catch (error) {
      console.error('Error creating medication:', error);
    }
  };

  const handleUpdateMedication = async () => {
    if (!selectedMedication) return;

    try {
      await updateMedicine({
        id: selectedMedication._id,
        name: formData.name,
        activeIngredient: formData.activeIngredient,
        manufacturer: formData.manufacturer,
        type: formData.type,
        dosageForm: formData.dosageForm,
        species: formData.species,
        recommendedDosage: formData.recommendedDosage,
        duration: formData.duration,
        registrationNumber: formData.registrationNumber || undefined,
        reference: formData.reference || undefined,
        stock: formData.stock,
        minStock: formData.minStock,
        price: formData.price,
        conditions: formData.conditions,
        contraindications: formData.contraindications,
        sideEffects: formData.sideEffects,
        interactions: formData.interactions,
        status: formData.status,
        atcVetCode: formData.atcVetCode || undefined,
        prescriptionRequired: formData.prescriptionRequired,
        psychotropic: formData.psychotropic,
        antibiotic: formData.antibiotic,
        administrationRoutes: formData.administrationRoutes,
      });
      setShowEditMedicationForm(false);
      setSelectedMedication(null);
      resetForm();
    } catch (error) {
      console.error('Error updating medication:', error);
    }
  };

  const handleDeleteMedication = async () => {
    if (!selectedMedication) return;

    try {
      await deleteMedicine({ id: selectedMedication._id });
      setShowDeleteConfirmation(false);
      setSelectedMedication(null);
    } catch (error) {
      console.error('Error deleting medication:', error);
    }
  };

  const handleEditClick = (medication: Medication) => {
    setSelectedMedication(medication);
    setFormData({
      name: medication.name,
      activeIngredient: medication.activeIngredient,
      manufacturer: medication.manufacturer,
      type: medication.type,
      dosageForm: medication.dosageForm,
      species: medication.species,
      recommendedDosage: medication.recommendedDosage,
      duration: medication.duration,
      registrationNumber: medication.registrationNumber || '',
      reference: medication.reference || '',
      stock: medication.stock,
      minStock: medication.minStock,
      price: medication.price,
      conditions: medication.conditions,
      contraindications: medication.contraindications,
      sideEffects: medication.sideEffects,
      interactions: medication.interactions,
      status: medication.status,
      atcVetCode: medication.atcVetCode || '',
      prescriptionRequired: medication.prescriptionRequired || false,
      psychotropic: medication.psychotropic || false,
      antibiotic: medication.antibiotic || false,
      administrationRoutes: medication.administrationRoutes || [],
    });
    setShowEditMedicationForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      activeIngredient: '',
      manufacturer: '',
      type: '',
      dosageForm: '',
      species: [],
      recommendedDosage: '',
      duration: '',
      registrationNumber: '',
      reference: '',
      stock: 0,
      minStock: 0,
      price: 0,
      conditions: [],
      contraindications: [],
      sideEffects: [],
      interactions: [],
      status: 'active',
      atcVetCode: '',
      prescriptionRequired: false,
      psychotropic: false,
      antibiotic: false,
      administrationRoutes: [],
    });
  };

  const totalMedications = medications.length;
  const lowStockMedications = medications.filter(med => med.stock <= med.minStock).length;
  const totalValue = medications.reduce((sum, med) => sum + (med.stock * med.price), 0);

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
            <p className="mt-2 text-3xl font-semibold text-gray-900">{totalMedications}</p>
            <p className="mt-1 text-sm text-gray-500">medicamentos en inventario</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Stock Bajo</h3>
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-yellow-600">{lowStockMedications}</p>
            <p className="mt-1 text-sm text-gray-500">medicamentos por debajo del mínimo</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Valor Total</h3>
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-green-600">
              {totalValue.toLocaleString('es-ES', {
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
            <Card key={medication._id}>
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
                      onClick={() => handleEditClick(medication)}
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
                  <tr key={medication._id} className="hover:bg-gray-50">
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
                          onClick={() => handleEditClick(medication)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMedication(medication);
                            setShowDeleteConfirmation(true);
                          }}
                          className="text-red-400 hover:text-red-600"
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

      {/* New Medication Modal */}
      {showNewMedicationForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Nuevo Medicamento
              </h3>
              <button
                onClick={() => {
                  setShowNewMedicationForm(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nombre del Medicamento"
                  placeholder="Ej: Amoxicilina 250mg"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <Input
                  label="Principio Activo"
                  placeholder="Ej: Amoxicilina"
                  value={formData.activeIngredient}
                  onChange={(e) => setFormData({...formData, activeIngredient: e.target.value})}
                  required
                />
                <Input
                  label="Fabricante"
                  placeholder="Ej: Laboratorios MSD"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Forma Farmacéutica</label>
                  <select
                    value={formData.dosageForm}
                    onChange={(e) => setFormData({...formData, dosageForm: e.target.value})}
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
                <Input
                  label="Posología Recomendada"
                  placeholder="Ej: 10-20 mg/kg cada 12h"
                  value={formData.recommendedDosage}
                  onChange={(e) => setFormData({...formData, recommendedDosage: e.target.value})}
                  required
                />
                <Input
                  label="Duración Recomendada"
                  placeholder="Ej: 7-10 días"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  required
                />
                <Input
                  label="Número de Registro"
                  placeholder="Ej: 2568 ESP"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                />
                <Input
                  label="Referencia"
                  placeholder="Ej: AMX250-100"
                  value={formData.reference}
                  onChange={(e) => setFormData({...formData, reference: e.target.value})}
                />
                <Input
                  label="Stock Actual"
                  type="number"
                  value={formData.stock.toString()}
                  onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                  required
                />
                <Input
                  label="Stock Mínimo"
                  type="number"
                  value={formData.minStock.toString()}
                  onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                  required
                />
                <Input
                  label="Precio"
                  type="number"
                  step="0.01"
                  value={formData.price.toString()}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especies</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Perro', 'Gato', 'Conejo', 'Hurón', 'Ave', 'Reptil', 'Roedor', 'Équido'].map((species) => (
                    <label key={species} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.species.includes(species)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, species: [...formData.species, species]});
                          } else {
                            setFormData({...formData, species: formData.species.filter(s => s !== species)});
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">{species}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Indicaciones</label>
                  <textarea
                    rows={3}
                    value={formData.conditions.join('\n')}
                    onChange={(e) => setFormData({...formData, conditions: e.target.value.split('\n').filter(c => c.trim())})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Una indicación por línea..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraindicaciones</label>
                  <textarea
                    rows={3}
                    value={formData.contraindications.join('\n')}
                    onChange={(e) => setFormData({...formData, contraindications: e.target.value.split('\n').filter(c => c.trim())})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Una contraindicación por línea..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Efectos Secundarios</label>
                  <textarea
                    rows={3}
                    value={formData.sideEffects.join('\n')}
                    onChange={(e) => setFormData({...formData, sideEffects: e.target.value.split('\n').filter(c => c.trim())})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-smfocus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Un efecto secundario por línea..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interacciones</label>
                  <textarea
                    rows={3}
                    value={formData.interactions.join('\n')}
                    onChange={(e) => setFormData({...formData, interactions: e.target.value.split('\n').filter(c => c.trim())})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Una interacción por línea..."
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="medicationStatus"
                  checked={formData.status === 'active'}
                  onChange={(e) => setFormData({...formData, status: e.target.checked ? 'active' : 'inactive'})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="medicationStatus" className="ml-2 text-sm text-gray-700">
                  Activo
                </label>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewMedicationForm(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateMedication}
              >
                Guardar Medicamento
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Medication Modal */}
      {showEditMedicationForm && selectedMedication && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Editar Medicamento
              </h3>
              <button
                onClick={() => {
                  setShowEditMedicationForm(false);
                  setSelectedMedication(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Nombre del Medicamento"
                  placeholder="Ej: Amoxicilina 250mg"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
                <Input
                  label="Principio Activo"
                  placeholder="Ej: Amoxicilina"
                  value={formData.activeIngredient}
                  onChange={(e) => setFormData({...formData, activeIngredient: e.target.value})}
                  required
                />
                <Input
                  label="Fabricante"
                  placeholder="Ej: Laboratorios MSD"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Forma Farmacéutica</label>
                  <select
                    value={formData.dosageForm}
                    onChange={(e) => setFormData({...formData, dosageForm: e.target.value})}
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
                <Input
                  label="Posología Recomendada"
                  placeholder="Ej: 10-20 mg/kg cada 12h"
                  value={formData.recommendedDosage}
                  onChange={(e) => setFormData({...formData, recommendedDosage: e.target.value})}
                  required
                />
                <Input
                  label="Duración Recomendada"
                  placeholder="Ej: 7-10 días"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  required
                />
                <Input
                  label="Número de Registro"
                  placeholder="Ej: 2568 ESP"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                />
                <Input
                  label="Referencia"
                  placeholder="Ej: AMX250-100"
                  value={formData.reference}
                  onChange={(e) => setFormData({...formData, reference: e.target.value})}
                />
                <Input
                  label="Stock Actual"
                  type="number"
                  value={formData.stock.toString()}
                  onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                  required
                />
                <Input
                  label="Stock Mínimo"
                  type="number"
                  value={formData.minStock.toString()}
                  onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                  required
                />
                <Input
                  label="Precio"
                  type="number"
                  step="0.01"
                  value={formData.price.toString()}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especies</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Perro', 'Gato', 'Conejo', 'Hurón', 'Ave', 'Reptil', 'Roedor', 'Équido'].map((species) => (
                    <label key={species} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.species.includes(species)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, species: [...formData.species, species]});
                          } else {
                            setFormData({...formData, species: formData.species.filter(s => s !== species)});
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">{species}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Indicaciones</label>
                  <textarea
                    rows={3}
                    value={formData.conditions.join('\n')}
                    onChange={(e) => setFormData({...formData, conditions: e.target.value.split('\n').filter(c => c.trim())})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Una indicación por línea..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraindicaciones</label>
                  <textarea
                    rows={3}
                    value={formData.contraindications.join('\n')}
                    onChange={(e) => setFormData({...formData, contraindications: e.target.value.split('\n').filter(c => c.trim())})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Una contraindicación por línea..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Efectos Secundarios</label>
                  <textarea
                    rows={3}
                    value={formData.sideEffects.join('\n')}
                    onChange={(e) => setFormData({...formData, sideEffects: e.target.value.split('\n').filter(c => c.trim())})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Un efecto secundario por línea..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interacciones</label>
                  <textarea
                    rows={3}
                    value={formData.interactions.join('\n')}
                    onChange={(e) => setFormData({...formData, interactions: e.target.value.split('\n').filter(c => c.trim())})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Una interacción por línea..."
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editMedicationStatus"
                  checked={formData.status === 'active'}
                  onChange={(e) => setFormData({...formData, status: e.target.checked ? 'active' : 'inactive'})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="editMedicationStatus" className="ml-2 text-sm text-gray-700">
                  Activo
                </label>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditMedicationForm(false);
                  setSelectedMedication(null);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateMedication}
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
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setSelectedMedication(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteMedication}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Medication Details Modal */}
      {selectedMedication && !showEditMedicationForm && !showDeleteConfirmation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
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
                    {selectedMedication.administrationRoutes && selectedMedication.administrationRoutes.length > 0 && (
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
                    )}
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
                onClick={() => handleEditClick(selectedMedication)}
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