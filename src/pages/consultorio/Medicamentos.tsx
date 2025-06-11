
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
                      onClick={() => {
                        setSelectedMedication(medication);
                        setShowEditMedicationForm(true);
                      }}
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
                          onClick={() => {
                            setSelectedMedication(medication);
                            setShowEditMedicationForm(true);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteMedication(medication._id)}
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

      {/* Medication Details Modal */}
      {selectedMedication && !showEditMedicationForm && (
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
                onClick={() => setShowEditMedicationForm(true)}
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

      {/* New Medication Form Modal */}
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
                    registrationNumber: formData.get('registrationNumber') as string,
                    reference: formData.get('reference') as string,
                    price: parseFloat(formData.get('price') as string) || 0,
                    stock: parseInt(formData.get('stock') as string) || 0,
                    minStock: parseInt(formData.get('minStock') as string) || 0,
                    conditions: (formData.get('conditions') as string).split('\n').filter(Boolean),
                    contraindications: (formData.get('contraindications') as string).split('\n').filter(Boolean),
                    sideEffects: (formData.get('sideEffects') as string).split('\n').filter(Boolean),
                    interactions: (formData.get('interactions') as string).split('\n').filter(Boolean),
                    species: Array.from(formData.getAll('species')) as string[],
                    administrationRoutes: Array.from(formData.getAll('administrationRoutes')) as string[],
                    prescriptionRequired: formData.get('prescriptionRequired') === 'on',
                    psychotropic: formData.get('psychotropic') === 'on',
                    antibiotic: formData.get('antibiotic') === 'on',
                  };
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
                      Forma Farmacéutica
                    </label>
                    <input
                      type="text"
                      name="dosageForm"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Ej: Comprimidos"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posología Recomendada
                    </label>
                    <input
                      type="text"
                      name="recommendedDosage"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Ej: 1 comprimido cada 12 horas"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duración Recomendada
                    </label>
                    <input
                      type="text"
                      name="duration"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Ej: 7-14 días"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Registro
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Ej: 1234-ESP"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Referencia
                    </label>
                    <input
                      type="text"
                      name="reference"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Ej: MED-AMOX-250"
                    />
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Mínimo
                    </label>
                    <input
                      type="number"
                      name="minStock"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="0"
                    />
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
                            name="species"
                            value={species}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700">{species}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vías de Administración
                    </label>
                    <div className="mt-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['Oral', 'Inyectable', 'Tópica', 'Oftálmica', 'Ótica', 'Nasal', 'Rectal', 'Vaginal'].map((route) => (
                        <label key={route} className="inline-flex items-center">
                          <input
                            type="checkbox"
                            name="administrationRoutes"
                            value={route}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700">{route}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Indicaciones (una por línea)
                    </label>
                    <textarea
                      name="conditions"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Infección bacteriana&#10;Infección respiratoria"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraindicaciones (una por línea)
                    </label>
                    <textarea
                      name="contraindications"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Alergia a penicilinas&#10;Problemas renales"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Efectos Secundarios (uno por línea)
                    </label>
                    <textarea
                      name="sideEffects"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Diarrea&#10;Vómitos"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interacciones (una por línea)
                    </label>
                    <textarea
                      name="interactions"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="No administrar con otros antibióticos"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Características Especiales</h3>
                    <div className="flex space-x-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="prescriptionRequired"
                          id="prescriptionRequired"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="prescriptionRequired" className="ml-2 text-sm text-gray-700">
                          Requiere Receta
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="psychotropic"
                          id="psychotropic"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="psychotropic" className="ml-2 text-sm text-gray-700">
                          Psicotrópico
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="antibiotic"
                          id="antibiotic"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="antibiotic" className="ml-2 text-sm text-gray-700">
                          Antibiótico
                        </label>
                      </div>
                    </div>
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

      {/* Edit Medication Modal */}
      {showEditMedicationForm && selectedMedication && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Editar Medicamento</h2>
              <button
                onClick={() => {
                  setShowEditMedicationForm(false);
                  setSelectedMedication(null);
                }}
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
                    registrationNumber: formData.get('registrationNumber') as string,
                    reference: formData.get('reference') as string,
                    price: parseFloat(formData.get('price') as string) || selectedMedication.price,
                    stock: parseInt(formData.get('stock') as string) || selectedMedication.stock,
                    minStock: parseInt(formData.get('minStock') as string) || selectedMedication.minStock,
                    conditions: (formData.get('conditions') as string).split('\n').filter(Boolean),
                    contraindications: (formData.get('contraindications') as string).split('\n').filter(Boolean),
                    sideEffects: (formData.get('sideEffects') as string).split('\n').filter(Boolean),
                    interactions: (formData.get('interactions') as string).split('\n').filter(Boolean),
                    species: Array.from(formData.getAll('species')) as string[],
                    administrationRoutes: Array.from(formData.getAll('administrationRoutes')) as string[],
                    status: formData.get('status') === 'on' ? 'active' as const : 'inactive' as const,
                    prescriptionRequired: formData.get('prescriptionRequired') === 'on',
                    psychotropic: formData.get('psychotropic') === 'on',
                    antibiotic: formData.get('antibiotic') === 'on',
                  };
                  handleUpdateMedication(data);
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
                      defaultValue={selectedMedication.name}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Principio Activo *
                    </label>
                    <input
                      type="text"
                      name="activeIngredient"
                      defaultValue={selectedMedication.activeIngredient}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fabricante *
                    </label>
                    <input
                      type="text"
                      name="manufacturer"
                      defaultValue={selectedMedication.manufacturer}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo *
                    </label>
                    <select
                      name="type"
                      defaultValue={selectedMedication.type}
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
                      defaultValue={selectedMedication.price}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Actual
                    </label>
                    <input
                      type="number"
                      name="stock"
                      defaultValue={selectedMedication.stock}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Mínimo
                    </label>
                    <input
                      type="number"
                      name="minStock"
                      defaultValue={selectedMedication.minStock}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
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
                            name="species"
                            value={species}
                            defaultChecked={selectedMedication.species.includes(species)}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700">{species}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Estado</h3>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="status"
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

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEditMedicationForm(false);
                      setSelectedMedication(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medicamentos;
