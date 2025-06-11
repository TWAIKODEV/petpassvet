import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Pill, RefreshCw, Edit, Trash, Tag, Eye, X, DollarSign, Database } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface Medicine {
  _id: Id<"medicines">;
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
  createdAt: number;
  updatedAt: number;
}

const Medicamentos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medicine | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cimavetSearchTerm, setCimavetSearchTerm] = useState('');
  const [showNewMedicationForm, setShowNewMedicationForm] = useState(false);
  const [showEditMedicationForm, setShowEditMedicationForm] = useState(false);

  // Convex queries and mutations
  const medicines = useQuery(api.medicines.searchMedicines, {
    searchTerm: searchTerm || undefined,
    type: selectedType !== 'all' ? selectedType : undefined,
    species: selectedSpecies !== 'all' ? selectedSpecies : undefined,
    showInactive: showInactive,
  });

  const createMedicine = useMutation(api.medicines.createMedicine);
  const updateMedicine = useMutation(api.medicines.updateMedicine);
  const deleteMedicine = useMutation(api.medicines.deleteMedicine);

  const filteredMedications = medicines || [];

  // Get unique medication types and species
  const types = Array.from(new Set(filteredMedications.map(med => med.type)));
  const species = Array.from(new Set(filteredMedications.flatMap(med => med.species)));

  const handleCimavetSearch = () => {
    console.log('Searching CIMAVET for:', cimavetSearchTerm);
    alert(`Buscando en CIMAVET: ${cimavetSearchTerm}`);
  };

  const handleNewMedication = async (formData: any) => {
    try {
      const medicationData = {
        name: formData.name || '',
        activeIngredient: formData.activeIngredient || '',
        manufacturer: formData.manufacturer || '',
        type: formData.type || 'Otro',
        conditions: formData.conditions || [],
        species: formData.species || [],
        breeds: formData.breeds || ['Todas'],
        sex: formData.sex || 'both' as const,
        dosageForm: formData.dosageForm || '',
        recommendedDosage: formData.recommendedDosage || '',
        duration: formData.duration || '',
        contraindications: formData.contraindications || [],
        sideEffects: formData.sideEffects || [],
        interactions: formData.interactions || [],
        status: 'active' as const,
        stock: formData.stock || 0,
        minStock: formData.minStock || 0,
        price: formData.price || 0,
        reference: formData.reference,
        atcVetCode: formData.atcVetCode,
        registrationNumber: formData.registrationNumber,
        prescriptionRequired: formData.prescriptionRequired || false,
        psychotropic: formData.psychotropic || false,
        antibiotic: formData.antibiotic || false,
        administrationRoutes: formData.administrationRoutes || ['Oral'],
        excipients: formData.excipients,
        withdrawalPeriod: formData.withdrawalPeriod,
        aiScore: formData.aiScore,
      };

      await createMedicine(medicationData);
      setShowNewMedicationForm(false);
    } catch (error) {
      console.error('Error creating medicine:', error);
    }
  };

  const handleUpdateMedication = async (formData: any) => {
    if (!selectedMedication) return;

    try {
      await updateMedicine({
        id: selectedMedication._id,
        ...formData,
      });
      setShowEditMedicationForm(false);
      setSelectedMedication(null);
    } catch (error) {
      console.error('Error updating medicine:', error);
    }
  };

  const handleDeleteMedication = async (medicineId: Id<"medicines">) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este medicamento?')) {
      try {
        await deleteMedicine({ id: medicineId });
      } catch (error) {
        console.error('Error deleting medicine:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Medicamentos</h1>
                <p className="mt-2 text-lg text-gray-600">
                  Gestión de medicamentos y tratamientos veterinarios
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filters */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4 p-6">
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
              {species.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
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

        {/* Testing message */}
        <Card>
          <div className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              🚀 Página de Medicamentos Cargada Correctamente
            </div>
            <p className="text-gray-600">
              Total de medicamentos encontrados: {filteredMedications.length}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Este mensaje confirma que el archivo Medicamentos.tsx se está renderizando correctamente
            </p>
          </div>
        </Card>

        {/* Grid View */}
        {filteredMedications.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Pill size={64} className="mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No hay medicamentos</h3>
              <p className="text-gray-500 mb-4">
                No se encontraron medicamentos en la base de datos
              </p>
              <Button
                variant="primary"
                icon={<Plus size={18} />}
                onClick={() => setShowNewMedicationForm(true)}
              >
                Crear primer medicamento
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedications.map((medication) => (
              <Card key={medication._id}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{medication.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{medication.activeIngredient}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Edit size={16} />}
                      onClick={() => {
                        setSelectedMedication(medication);
                        setShowEditMedicationForm(true);
                      }}
                    >
                      Editar
                    </Button>
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
                        icon={<Eye size={16} />}
                        onClick={() => setSelectedMedication(medication)}
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Trash size={16} />}
                        onClick={() => handleDeleteMedication(medication._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* List View - Removed from the edited code */}

        {/* Medication Details Modal - Removed from the edited code */}

        {/* New Medication Form Modal */}
        {showNewMedicationForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
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
                <form 
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const data = {
                      name: formData.get('name') as string,
                      activeIngredient: formData.get('activeIngredient') as string,
                      manufacturer: formData.get('manufacturer') as string,
                      type: formData.get('type') as string,
                      dosageForm: formData.get('dosageForm') as string,
                      recommendedDosage: formData.get('recommendedDosage') as string,
                      duration: formData.get('duration') as string,
                      price: parseFloat(formData.get('price') as string) || 0,
                      stock: parseInt(formData.get('stock') as string) || 0,
                      minStock: parseInt(formData.get('minStock') as string) || 0,
                      conditions: [],
                      contraindications: [],
                      sideEffects: [],
                      interactions: [],
                      species: ['Perro'],
                      administrationRoutes: ['Oral'],
                      prescriptionRequired: false,
                      psychotropic: false,
                      antibiotic: false,
                    };
                    console.log('New medication data:', data);
                    handleNewMedication(data);
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Medicamento *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Ej: Amoxicilina 250mg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Principio Activo *
                      </label>
                      <input
                        type="text"
                        name="activeIngredient"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Ej: Amoxicilina"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fabricante *
                      </label>
                      <input
                        type="text"
                        name="manufacturer"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Ej: Laboratorios MSD"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo *
                      </label>
                      <select
                        name="type"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                        Precio (€)
                      </label>
                      <input
                        type="number"
                        name="price"
                        step="0.01"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Actual
                      </label>
                      <input
                        type="number"
                        name="stock"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewMedicationForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                    >
                      Guardar Medicamento
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Medication Modal - Removed from the edited code */}
      </div>
    </div>
  );
};

export default Medicamentos;