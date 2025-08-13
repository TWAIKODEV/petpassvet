
import React, { useState } from 'react';
import { Search, Filter, Download, PawPrint, RefreshCw, Eye, Edit, Printer } from 'lucide-react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import NewPetForm from '../components/pets/NewPetForm';
import { type NewPetFormOutput } from '../validators/formValidator';
import { Doc } from "../../convex/_generated/dataModel";

const Pets: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showNewPetForm, setShowNewPetForm] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Doc<"pets"> & { owner: { name: string; email: string; phone: string } | null } | null>(null);

  // Fetch pets from Convex
  const pets = useQuery(api.pets.getAllPets) || [];

  const filteredPets = pets.filter(pet => 
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pet.owner?.name && pet.owner.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (pet.microchipNumber && pet.microchipNumber.includes(searchTerm))
  );

  const handleNewPet = (petData: NewPetFormOutput) => {
    console.log('Nueva mascota creada:', petData);
    setShowNewPetForm(false);
  };

  const handleViewPetDetails = (pet: Doc<"pets"> & { owner: { name: string; email: string; phone: string } | null }) => {
    setSelectedPet(pet);
  };

  const calculateAge = (birthDate: string | undefined) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    return Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 365));
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mascotas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona las mascotas de la clínica
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
            variant="primary"
            icon={<PawPrint size={18} />}
            onClick={() => setShowNewPetForm(true)}
            className="flex-1 sm:flex-none"
          >
            Nueva Mascota
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            placeholder="Buscar mascotas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">Todas las especies</option>
              <option value="dog">Perros</option>
              <option value="cat">Gatos</option>
              <option value="other">Otras especies</option>
            </select>
            <div className="flex gap-2">
              <Button
                variant="outline"
                icon={<Filter size={18} />}
                className="flex-1 sm:flex-none"
              >
                Más Filtros
              </Button>
              <Button
                variant="outline"
                icon={<RefreshCw size={18} />}
                onClick={() => setSearchTerm('')}
                className="flex-1 sm:flex-none"
              >
                Resetear
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Pets List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mascota
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Especie/Raza
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Microchip
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PetPass
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seguro
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propietario
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
              {filteredPets.map((pet) => (
                <tr key={pet._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {pet.name[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{pet.name}</div>
                        <div className="text-sm text-gray-500">
                          {calculateAge(pet.birthDate)} años • {pet.sex === 'male' ? 'Macho' : pet.sex === 'female' ? 'Hembra' : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pet.species}</div>
                    <div className="text-sm text-gray-500">{pet.breed || 'No especificada'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{pet.microchipNumber || '-'}</div>
                    <div className="text-sm text-gray-500">
                      {pet.isNeutered ? 'Esterilizado' : 'No esterilizado'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pet.hasPetPass ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Activo
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">No tiene</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pet.hasInsurance ? (
                      <div>
                        <div className="text-sm text-gray-900">{pet.insuranceProvider}</div>
                        <div className="text-sm text-gray-500">{pet.insuranceNumber}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No asegurado</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pet.owner?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{pet.owner?.phone || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Activo
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <button 
                        onClick={() => handleViewPetDetails(pet)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-800"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-800"
                        title="Imprimir"
                      >
                        <Printer size={18} />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-800"
                        title="Descargar"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No se encontraron mascotas</h3>
            <p className="text-gray-500 mt-1">Prueba con otros términos de búsqueda</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button variant="outline">Anterior</Button>
          <Button variant="outline">Siguiente</Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredPets.length}</span> de{' '}
              <span className="font-medium">{filteredPets.length}</span> resultados
            </p>
          </div>
        </div>
      </div>

      {/* Pet Details Modal */}
      {selectedPet && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Ficha de la Mascota</h2>
              <button
                onClick={() => setSelectedPet(null)}
                className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Cerrar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pet Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Información de la Mascota</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nombre</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedPet.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Edad</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{calculateAge(selectedPet.birthDate)} años</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Especie</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedPet.species}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Raza</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedPet.breed || 'No especificada'}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Sexo</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                            {selectedPet.sex === 'male' ? 'Macho' : selectedPet.sex === 'female' ? 'Hembra' : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Estado</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                            {selectedPet.isNeutered ? 'Esterilizado/a' : 'No esterilizado/a'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Peso</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                            {selectedPet.weight ? `${selectedPet.weight} kg` : 'No registrado'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Altura</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                            {selectedPet.height ? `${selectedPet.height} cm` : 'No registrada'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Color</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                            {selectedPet.color || 'No especificado'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Tipo de pelaje</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                            {selectedPet.furType || 'No especificado'}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Microchip</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                          {selectedPet.microchipNumber || 'No registrado'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                          {selectedPet.observations || 'Sin observaciones'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Información Médica</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tratamientos en curso</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                          {selectedPet.currentTreatments || 'Ningún tratamiento activo'}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Alergias</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                          {selectedPet.allergies || 'Sin alergias conocidas'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Pruebas médicas</label>
                        <div className="mt-1 space-y-2">
                          {selectedPet.bloodTest?.done && (
                            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                              Análisis de sangre: {selectedPet.bloodTest.date || 'Fecha no especificada'}
                            </p>
                          )}
                          {selectedPet.xrayTest?.done && (
                            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                              Radiografía: {selectedPet.xrayTest.date || 'Fecha no especificada'}
                            </p>
                          )}
                          {selectedPet.ultrasoundTest?.done && (
                            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                              Ecografía: {selectedPet.ultrasoundTest.date || 'Fecha no especificada'}
                            </p>
                          )}
                          {selectedPet.urineTest?.done && (
                            <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                              Análisis de orina: {selectedPet.urineTest.date || 'Fecha no especificada'}
                            </p>
                          )}
                          {!selectedPet.bloodTest?.done && !selectedPet.xrayTest?.done && !selectedPet.ultrasoundTest?.done && !selectedPet.urineTest?.done && (
                            <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded border border-gray-200">
                              No hay pruebas médicas registradas
                            </p>
                          )}
                        </div>
                      </div>

                      {selectedPet.otherTests && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Otras pruebas</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                            {selectedPet.otherTests}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Owner Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Propietario</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedPet.owner?.name || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedPet.owner?.email || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedPet.owner?.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Planes y Seguros</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">PetPass</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                          {selectedPet.hasPetPass ? 'Activo' : 'No tiene'}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Seguro</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                          {selectedPet.hasInsurance ? `${selectedPet.insuranceProvider} - ${selectedPet.insuranceNumber}` : 'No tiene'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Estado</h3>
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Activo
                      </span>
                      <p className="mt-2 text-xs text-gray-500">Última actualización: {new Date(selectedPet.updatedAt).toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedPet(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Pet Form Modal */}
      {showNewPetForm && (
        <NewPetForm onClose={() => setShowNewPetForm(false)} onSubmit={handleNewPet} />
      )}
    </div>
  );
};

export default Pets;
