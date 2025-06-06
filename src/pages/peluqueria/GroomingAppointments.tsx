import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, RefreshCw, FileText, Eye, Printer, X, Scissors } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { mockPatients, mockDoctors } from '../../data/mockData';

// Mock data for grooming appointments
const mockGroomingAppointments = [
  {
    id: '1',
    petName: 'Luna',
    breed: 'Labrador',
    age: 3,
    sex: 'female',
    petProfileUrl: '/patients/1',
    serviceType: 'grooming',
    groomingService: 'complete',
    patientId: '1',
    groomerId: '3', // Ana López
    date: '2025-06-15',
    time: '10:00',
    duration: 60,
    status: 'confirmed',
    notes: 'Corte estándar de raza'
  },
  {
    id: '2',
    petName: 'Rocky',
    breed: 'Yorkshire Terrier',
    age: 5,
    sex: 'male',
    petProfileUrl: '/patients/2',
    serviceType: 'grooming',
    groomingService: 'bath',
    patientId: '2',
    groomerId: '3', // Ana López
    date: '2025-06-15',
    time: '12:00',
    duration: 45,
    status: 'confirmed',
    notes: 'Baño y cepillado'
  },
  {
    id: '3',
    petName: 'Milo',
    breed: 'Persian',
    age: 2,
    sex: 'male',
    petProfileUrl: '/patients/3',
    serviceType: 'grooming',
    groomingService: 'nails',
    patientId: '3',
    groomerId: '3', // Ana López
    date: '2025-06-15',
    time: '14:00',
    duration: 30,
    status: 'pending',
    notes: 'Corte de uñas y limpieza de oídos'
  }
];

const GroomingAppointments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Get patient and groomer info for each appointment
  const getPatientById = (id: string) => mockPatients.find(patient => patient.id === id);
  const getGroomerById = (id: string) => mockDoctors.find(doctor => doctor.id === id);
  
  // Status styles with background opacity for better readability
  const statusStyles = {
    'pending': 'bg-orange-100 text-orange-800',
    'confirmed': 'bg-yellow-100 text-yellow-800',
    'waiting': 'bg-pink-100 text-pink-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'no_show': 'bg-red-100 text-red-800'
  };
  
  // Status labels in Spanish
  const statusLabels = {
    'pending': 'Pte Confirmación',
    'confirmed': 'Confirmada',
    'waiting': 'Sala de Espera',
    'in_progress': 'En Curso',
    'completed': 'Terminada',
    'no_show': 'No Asistencia'
  };

  // Grooming service types
  const groomingServices = {
    'complete': 'Corte Completo',
    'bath': 'Baño y Cepillado',
    'nails': 'Corte de Uñas',
    'ears': 'Limpieza de Oídos',
    'teeth': 'Limpieza Dental',
    'dematting': 'Eliminación de Nudos',
    'deshedding': 'Deslanado'
  };

  // Filter appointments based on search term and service type
  const filteredAppointments = mockGroomingAppointments.filter(appointment => {
    const patient = getPatientById(appointment.patientId);
    const groomer = getGroomerById(appointment.groomerId);
    const searchString = `${appointment.petName} ${patient?.name} ${groomer?.name}`.toLowerCase();
    
    return (
      searchString.includes(searchTerm.toLowerCase()) &&
      (selectedService === 'all' || appointment.groomingService === selectedService)
    );
  });

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    // Here you would typically make an API call to update the appointment status
    console.log('Updating appointment', appointmentId, 'to status:', newStatus);
  };

  const handleRefresh = () => {
    // Here you would typically fetch new data
    console.log('Refreshing data...');
  };

  const toggleRow = (appointmentId: string) => {
    setExpandedRow(current => current === appointmentId ? null : appointmentId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Citas de Peluquería</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de citas y servicios de peluquería
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Calendar size={18} />}
        >
          Nueva Cita
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="date"
              label="Desde"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            />
            <Input
              type="date"
              label="Hasta"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            />
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option value="all">Todos los servicios</option>
              <option value="complete">Corte Completo</option>
              <option value="bath">Baño y Cepillado</option>
              <option value="nails">Corte de Uñas</option>
              <option value="ears">Limpieza de Oídos</option>
              <option value="teeth">Limpieza Dental</option>
              <option value="dematting">Eliminación de Nudos</option>
              <option value="deshedding">Deslanado</option>
            </select>
          </div>
          
          <div className="flex gap-4">
            <Input
              placeholder="Buscar por mascota, propietario o peluquero..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} />}
              className="flex-1"
            />
            <Button
              variant="outline"
              icon={<RefreshCw size={18} />}
              onClick={handleRefresh}
            >
              Actualizar
            </Button>
          </div>
        </div>
      </Card>

      {/* Appointments List/Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha/Hora
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mascota
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propietario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peluquero/a
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => {
                const patient = getPatientById(appointment.patientId);
                const groomer = getGroomerById(appointment.groomerId);
                
                return (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(appointment.date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.time} ({appointment.duration} min)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{appointment.petName}</div>
                      <div className="text-sm text-gray-500">
                        {appointment.breed}, {appointment.age} años
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{groomer?.name}</div>
                      <div className="text-sm text-gray-500">{groomer?.specialization}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {groomingServices[appointment.groomingService]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${statusStyles[appointment.status]}`}
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option 
                            key={value} 
                            value={value}
                            className="text-gray-900 bg-white"
                          >
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `/peluqueria/citas/${appointment.id}`}
                      >
                        Gestionar
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden divide-y divide-gray-200">
          {filteredAppointments.map((appointment) => {
            const patient = getPatientById(appointment.patientId);
            const groomer = getGroomerById(appointment.groomerId);
            const isExpanded = expandedRow === appointment.id;
            
            return (
              <div key={appointment.id} className="p-4">
                <div 
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => toggleRow(appointment.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.time} - {appointment.petName}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {new Date(appointment.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[appointment.status]}`}>
                        {statusLabels[appointment.status]}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {groomingServices[appointment.groomingService]}
                      </span>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-4">
                    <div className="border-t pt-4">
                      <div className="text-sm font-medium text-gray-700">Propietario</div>
                      <div className="mt-1 text-sm text-gray-900">{patient?.name}</div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="text-sm font-medium text-gray-700">Peluquero/a</div>
                      <div className="mt-1 text-sm text-gray-900">{groomer?.name}</div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="text-sm font-medium text-gray-700">Estado</div>
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                        className={`mt-1 text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${statusStyles[appointment.status]}`}
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option 
                            key={value} 
                            value={value}
                            className="text-gray-900 bg-white"
                          >
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="border-t pt-4 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `/peluqueria/citas/${appointment.id}`}
                        fullWidth
                      >
                        Gestionar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GroomingAppointments;