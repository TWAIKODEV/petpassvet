import React, { useState } from 'react';
import { Plus, Search, Filter, Download, PawPrint, RefreshCw, Eye, Edit, Printer } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { mockPatients } from '../data/mockData';

const Pets: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showNewPetForm, setShowNewPetForm] = useState(false);
  const [selectedPet, setSelectedPet] = useState<any>(null);

  // Transform patient data to focus on pets
  const pets = mockPatients.map(patient => ({
    id: patient.id,
    name: patient.pet.name,
    species: patient.pet.species,
    breed: patient.pet.breed,
    age: new Date().getFullYear() - new Date(patient.pet.birthDate).getFullYear(),
    sex: patient.pet.sex,
    owner: {
      name: patient.name,
      email: patient.email,
      phone: patient.phone
    },
    microchip: patient.pet.microchipNumber,
    isNeutered: patient.pet.isNeutered,
    petPass: patient.petPass?.hasPetPass || false,
    petPassPlan: patient.petPass?.plan,
    insurance: {
      provider: patient.insuranceProvider,
      number: patient.insuranceNumber
    },
    lastVisit: '2025-05-15', // Mock data
    status: 'active'
  }));

  const filteredPets = pets.filter(pet => 
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.microchip?.includes(searchTerm)
  );

  const handleNewPet = (petData: any) => {
    // Here you would typically make an API call to save the new pet
    console.log('New pet data:', petData);
    setShowNewPetForm(false);
  };

  const handleViewPetDetails = (pet: any) => {
    setSelectedPet(pet);
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
          <Input
            placeholder="Buscar mascotas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
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
                <tr key={pet.id} className="hover:bg-gray-50">
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
                          {pet.age} años • {pet.sex === 'male' ? 'Macho' : 'Hembra'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pet.species}</div>
                    <div className="text-sm text-gray-500">{pet.breed}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">{pet.microchip || '-'}</div>
                    <div className="text-sm text-gray-500">
                      {pet.isNeutered ? 'Esterilizado' : 'No esterilizado'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pet.petPass ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {pet.petPassPlan || 'Activo'}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">No tiene</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pet.insurance.provider ? (
                      <div>
                        <div className="text-sm text-gray-900">{pet.insurance.provider}</div>
                        <div className="text-sm text-gray-500">{pet.insurance.number}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No asegurado</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{pet.owner.name}</div>
                    <div className="text-sm text-gray-500">{pet.owner.phone}</div>
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
              Mostrando <span className="font-medium">1</span> a <span className="font-medium">10</span> de{' '}
              <span className="font-medium">20</span> resultados
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                <span className="sr-only">Anterior</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">1</button>
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 focus:z-20 focus:outline-offset-0">2</button>
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">3</button>
              <button className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                <span className="sr-only">Siguiente</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
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
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedPet.age} años</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Especie</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedPet.species}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Raza</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedPet.breed}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Sexo</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                            {selectedPet.sex === 'male' ? 'Macho' : 'Hembra'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Estado</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                            {selectedPet.isNeutered ? 'Esterilizado/a' : 'No esterilizado/a'}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Microchip</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                          {selectedPet.microchip || 'No registrado'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Planes y Seguros</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">PetPass</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                          {selectedPet.petPass ? `Activo - Plan ${selectedPet.petPassPlan || 'Básico'}` : 'No tiene'}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Seguro</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                          {selectedPet.insurance.provider ? `${selectedPet.insurance.provider} - ${selectedPet.insurance.number}` : 'No tiene'}
                        </p>
                      </div>
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
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedPet.owner.name}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedPet.owner.email}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedPet.owner.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Visitas</h3>
                    <div className="space-y-2">
                      <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <p className="text-sm font-medium text-gray-900">Última visita: {new Date(selectedPet.lastVisit).toLocaleDateString('es-ES')}</p>
                        <p className="text-xs text-gray-500">Consulta general</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <p className="text-sm font-medium text-gray-900">Próxima visita programada</p>
                        <p className="text-xs text-gray-500">No hay citas programadas</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Estado</h3>
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Activo
                      </span>
                      <p className="mt-2 text-xs text-gray-500">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
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
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Nueva Mascota</h2>
              <button
                onClick={() => setShowNewPetForm(false)}
                className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Cerrar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1">
              <form className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nombre de la Mascota"
                      name="petName"
                      required
                    />
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
                    <Input
                      label="Fecha de Nacimiento"
                      type="date"
                      name="birthDate"
                    />
                    <Input
                      label="Nº Microchip"
                      name="microchip"
                      placeholder="Ej: 941000024680135"
                    />
                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          name="isNeutered"
                        />
                        <span className="text-sm text-gray-700">Esterilizado/a</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Physical Characteristics */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Características Físicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Pelo
                      </label>
                      <select
                        name="furType"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="corto">Corto</option>
                        <option value="medio">Medio</option>
                        <option value="largo">Largo</option>
                        <option value="rizado">Rizado</option>
                        <option value="duro">Duro</option>
                        <option value="sin_pelo">Sin pelo</option>
                      </select>
                    </div>
                    <Input
                      label="Color de Pelo"
                      name="furColor"
                      placeholder="Ej: Negro, Marrón, Atigrado..."
                    />
                    <Input
                      label="Peso (kg)"
                      type="number"
                      name="weight"
                      step="0.1"
                      min="0"
                    />
                    <Input
                      label="Altura (cm)"
                      type="number"
                      name="height"
                      min="0"
                    />
                  </div>
                </div>

                {/* Medical Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información Médica</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vacunas Recibidas
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            name="vaccine_rabies"
                          />
                          <span className="text-sm text-gray-700">Rabia</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            name="vaccine_distemper"
                          />
                          <span className="text-sm text-gray-700">Moquillo</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            name="vaccine_parvovirus"
                          />
                          <span className="text-sm text-gray-700">Parvovirus</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            name="vaccine_leptospirosis"
                          />
                          <span className="text-sm text-gray-700">Leptospirosis</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tratamientos en Curso
                      </label>
                      <textarea
                        name="currentTreatments"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Describa los tratamientos actuales..."
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alergias Conocidas
                      </label>
                      <textarea
                        name="allergies"
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Alergias a medicamentos, alimentos, etc..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Medical Tests */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Pruebas Médicas Relevantes</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Análisis de Sangre
                        </label>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            name="test_blood"
                          />
                          <span className="text-sm text-gray-700">Realizado</span>
                          <Input
                            type="date"
                            name="test_blood_date"
                            className="ml-2"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Radiografía
                        </label>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            name="test_xray"
                          />
                          <span className="text-sm text-gray-700">Realizado</span>
                          <Input
                            type="date"
                            name="test_xray_date"
                            className="ml-2"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ecografía
                        </label>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            name="test_ultrasound"
                          />
                          <span className="text-sm text-gray-700">Realizado</span>
                          <Input
                            type="date"
                            name="test_ultrasound_date"
                            className="ml-2"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Análisis de Orina
                        </label>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            name="test_urine"
                          />
                          <span className="text-sm text-gray-700">Realizado</span>
                          <Input
                            type="date"
                            name="test_urine_date"
                            className="ml-2"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Otras Pruebas o Resultados Relevantes
                      </label>
                      <textarea
                        name="otherTests"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Describa otras pruebas realizadas y sus resultados..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información Adicional</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Propietario
                      </label>
                      <select
                        name="ownerId"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">Seleccionar propietario</option>
                        {mockPatients.map(patient => (
                          <option key={patient.id} value={patient.id}>{patient.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observaciones
                      </label>
                      <textarea
                        name="observations"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Notas adicionales sobre la mascota..."
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          name="hasPetPass"
                        />
                        <span className="text-sm text-gray-700">Tiene PetPass</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          name="hasInsurance"
                        />
                        <span className="text-sm text-gray-700">Tiene seguro</span>
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowNewPetForm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => handleNewPet({})}
              >
                Guardar Mascota
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pets;