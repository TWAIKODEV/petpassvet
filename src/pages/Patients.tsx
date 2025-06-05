import React, { useState } from 'react';
import { Plus, Search, Filter, Download, UserPlus, RefreshCw, Eye, Edit, Printer } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import NewPatientForm from '../components/patients/NewPatientForm';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  // Fetch patients from Convex
  const patients = useQuery(api.patients.getPatients) || [];
  const deletePatient = useMutation(api.patients.deletePatient);

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.pet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewPatient = (patientData: any) => {
    // Here you would typically make an API call to save the new patient
    console.log('New patient data:', patientData);
    setShowNewPatientForm(false);
  };

  const handleViewPatientDetails = (patient: any) => {
    setSelectedPatient(patient);
  };

  const handleDeletePatient = async (patientId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este paciente?')) {
      try {
        await deletePatient({ id: patientId as any });
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Propietarios</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona los propietarios de mascotas
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
            icon={<UserPlus size={18} />}
            onClick={() => setShowNewPatientForm(true)}
            className="flex-1 sm:flex-none"
          >
            Nuevo Propietario
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Buscar propietarios..."
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
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
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

      {/* Owners List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propietario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mascota
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seguro
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Visita
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
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(patient.birthDate).toLocaleDateString('es-ES')} • {patient.gender === 'female' ? 'F' : 'M'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{patient.pet.name}</div>
                    <div className="text-sm text-gray-500">
                      {patient.pet.species} • {patient.pet.breed}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.email}</div>
                    <div className="text-sm text-gray-500">{patient.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.insuranceProvider || 'No asegurado'}</div>
                    <div className="text-sm text-gray-500">{patient.insuranceNumber || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Hace 2 semanas
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Activo
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <button 
                        onClick={() => handleViewPatientDetails(patient)}
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
                      <button
                        onClick={() => handleDeletePatient(patient._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No se encontraron propietarios</h3>
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

      {/* New Owner Form Modal */}
      {showNewPatientForm && (
        <NewPatientForm
          onClose={() => setShowNewPatientForm(false)}
          onSubmit={handleNewPatient}
        />
      )}

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Ficha del Propietario</h2>
              <button
                onClick={() => setSelectedPatient(null)}
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
                {/* Owner Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nombre</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedPatient.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                            {new Date(selectedPatient.birthDate).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedPatient.email}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedPatient.phone}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Dirección</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedPatient.address}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Contacto Preferido</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200 capitalize">{selectedPatient.preferredContact}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Marketing y Comunicaciones</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded ${selectedPatient.marketing.acceptsDataProtection ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="ml-2 text-sm text-gray-700">Acepta protección de datos</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded ${selectedPatient.marketing.acceptsEmailMarketing ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="ml-2 text-sm text-gray-700">Acepta marketing por email</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded ${selectedPatient.marketing.acceptsWhatsAppComm ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="ml-2 text-sm text-gray-700">Acepta comunicaciones por WhatsApp</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pet Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Información de la Mascota</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nombre</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedPatient.pet.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Especie</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedPatient.pet.species}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Raza</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedPatient.pet.breed}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Sexo</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                            {selectedPatient.pet.sex === 'male' ? 'Macho' : 'Hembra'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                            {new Date(selectedPatient.pet.birthDate).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Microchip</label>
                          <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                            {selectedPatient.pet.microchipNumber || 'No registrado'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                          {selectedPatient.pet.isNeutered ? 'Esterilizado/a' : 'No esterilizado/a'}
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
                          {selectedPatient.petPass.hasPetPass ? `Activo - Plan ${selectedPatient.petPass.plan || 'Básico'}` : 'No tiene'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Seguro</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                          {selectedPatient.insuranceProvider ? `${selectedPatient.insuranceProvider} - ${selectedPatient.insuranceNumber}` : 'No tiene'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Servicios Adicionales</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded ${selectedPatient.services.wantsGrooming ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="ml-2 text-sm text-gray-700">Servicio de Peluquería</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded ${selectedPatient.services.wantsFoodDelivery ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="ml-2 text-sm text-gray-700">Servicio de Comida a Domicilio</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded ${selectedPatient.services.wantsHotelService ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="ml-2 text-sm text-gray-700">Servicio de Hotel para Viajes</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`h-4 w-4 rounded ${selectedPatient.services.wantsTraining ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="ml-2 text-sm text-gray-700">Servicio de Entrenamiento</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Historial Médico</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {selectedPatient.medicalHistory.map((item: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedPatient(null)}
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

export default Patients;