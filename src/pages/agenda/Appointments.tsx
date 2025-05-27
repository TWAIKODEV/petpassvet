import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, RefreshCw, FileText, Eye, Printer, X, Euro, Camera as VideoCamera } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import NewAppointmentForm from '../../components/dashboard/NewAppointmentForm';
import { mockAppointments, mockPatients, mockDoctors } from '../../data/mockData';

const Appointments = () => {
  const [showNewAppointmentForm, setShowNewAppointmentForm] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedSpecialist, setSelectedSpecialist] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentStartTime, setAppointmentStartTime] = useState('');
  const [appointmentEndTime, setAppointmentEndTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('llamada');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [appointmentCompleted, setAppointmentCompleted] = useState(false);

  // Get patient and doctor info for each appointment
  const getPatientById = (id: string) => mockPatients.find(patient => patient.id === id);
  const getDoctorById = (id: string) => mockDoctors.find(doctor => doctor.id === id);
  
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

  // Service areas
  const areas = [
    { id: 'all', name: 'Todas las áreas' },
    { id: 'veterinary', name: 'Veterinaria' },
    { id: 'grooming', name: 'Peluquería' },
    { id: 'rehabilitation', name: 'Rehabilitación' },
    { id: 'hospitalization', name: 'Hospitalización' }
  ];

  // Filter appointments
  const filteredAppointments = mockAppointments.filter(appointment => {
    const patient = getPatientById(appointment.patientId);
    const doctor = getDoctorById(appointment.doctorId);
    const searchString = `${appointment.petName} ${patient?.name} ${doctor?.name}`.toLowerCase();
    
    return (
      searchString.includes(searchTerm.toLowerCase()) &&
      (selectedArea === 'all' || appointment.serviceType === selectedArea) &&
      (selectedSpecialist === 'all' || appointment.doctorId === selectedSpecialist)
    );
  });

  const handleNewAppointment = (appointmentData: any) => {
    // Here you would typically make an API call to save the new appointment
    console.log('New appointment data:', appointmentData);
    setShowNewAppointmentForm(false);
  };

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

  const handleManageAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    
    // Initialize modal form with appointment data
    const patient = getPatientById(appointment.patientId);
    const doctor = getDoctorById(appointment.doctorId);
    
    setAppointmentTitle(`${appointment.consultationKind === 'annualReview' ? 'Revisión Anual' : 
                          appointment.consultationKind === 'followUp' ? 'Seguimiento' : 
                          appointment.consultationKind === 'checkUp' ? 'Chequeo' : 
                          appointment.consultationKind === 'emergency' ? 'Emergencia' : 
                          appointment.consultationKind === 'vaccination' ? 'Vacunación' : 
                          appointment.consultationKind === 'surgery' ? 'Cirugía' : 
                          appointment.consultationKind === 'dental' ? 'Dental' : 'Peluquería'} - ${appointment.petName}`);
    
    setAppointmentDate(appointment.date);
    setAppointmentStartTime(appointment.time);
    
    // Calculate end time based on duration
    const [hours, minutes] = appointment.time.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours, minutes + appointment.duration);
    const endTimeString = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
    setAppointmentEndTime(endTimeString);
    
    setAppointmentType(appointment.serviceType === 'veterinary' ? 'reunion' : 
                      appointment.serviceType === 'grooming' ? 'comida' : 'llamada');
    
    setAppointmentNotes(appointment.notes || '');
    setIsAllDay(false);
    setAppointmentCompleted(appointment.status === 'completed');
  };

  const handleSaveAppointment = () => {
    // Here you would typically make an API call to update the appointment
    console.log('Saving appointment with data:', {
      id: selectedAppointment?.id,
      title: appointmentTitle,
      date: appointmentDate,
      startTime: appointmentStartTime,
      endTime: appointmentEndTime,
      type: appointmentType,
      notes: appointmentNotes,
      isAllDay,
      completed: appointmentCompleted
    });
    
    // Close the modal
    setSelectedAppointment(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Citas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de citas y consultas
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Calendar size={18} />}
          onClick={() => setShowNewAppointmentForm(true)}
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
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              {areas.map(area => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={selectedSpecialist}
              onChange={(e) => setSelectedSpecialist(e.target.value)}
            >
              <option value="all">Todos los especialistas</option>
              {mockDoctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-4">
            <Input
              placeholder="Buscar por mascota, propietario o doctor..."
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
                  Especialista
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
                const doctor = getDoctorById(appointment.doctorId);
                
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
                      <div className="text-sm text-gray-900">{doctor?.name}</div>
                      <div className="text-sm text-gray-500">{doctor?.specialization}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {appointment.serviceType}
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
                        onClick={() => handleManageAppointment(appointment)}
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
            const doctor = getDoctorById(appointment.doctorId);
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {appointment.serviceType}
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
                      <div className="text-sm font-medium text-gray-700">Especialista</div>
                      <div className="mt-1 text-sm text-gray-900">{doctor?.name}</div>
                      <div className="text-sm text-gray-500">{doctor?.specialization}</div>
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
                        onClick={() => handleManageAppointment(appointment)}
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

      {/* New Appointment Form Modal */}
      {showNewAppointmentForm && (
        <NewAppointmentForm
          onClose={() => setShowNewAppointmentForm(false)}
          onSubmit={handleNewAppointment}
        />
      )}

      {/* Appointment Management Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Gestionar Cita
              </h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título de la actividad
                  </label>
                  <Input
                    value={appointmentTitle}
                    onChange={(e) => setAppointmentTitle(e.target.value)}
                    placeholder="Título de la cita"
                  />
                </div>

                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-5 sm:col-span-1 flex flex-col items-center justify-center">
                    <button 
                      className={`w-14 h-14 rounded-full flex items-center justify-center ${appointmentType === 'llamada' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                      onClick={() => setAppointmentType('llamada')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </button>
                    <span className="mt-2 text-xs text-center">Llamada</span>
                  </div>
                  <div className="col-span-5 sm:col-span-1 flex flex-col items-center justify-center">
                    <button 
                      className={`w-14 h-14 rounded-full flex items-center justify-center ${appointmentType === 'reunion' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                      onClick={() => setAppointmentType('reunion')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </button>
                    <span className="mt-2 text-xs text-center">Cambiar Cita</span>
                  </div>
                  <div className="col-span-5 sm:col-span-1 flex flex-col items-center justify-center">
                    <button 
                      className={`w-14 h-14 rounded-full flex items-center justify-center ${appointmentType === 'vuelo' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                      onClick={() => setAppointmentType('vuelo')}
                    >
                      <VideoCamera size={24} />
                    </button>
                    <span className="mt-2 text-xs text-center">Cita Online</span>
                  </div>
                  <div className="col-span-5 sm:col-span-1 flex flex-col items-center justify-center">
                    <button 
                      className={`w-14 h-14 rounded-full flex items-center justify-center ${appointmentType === 'comida' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                      onClick={() => setAppointmentType('comida')}
                    >
                      <Euro size={24} />
                    </button>
                    <span className="mt-2 text-xs text-center">Facturar</span>
                  </div>
                  <div className="col-span-5 sm:col-span-1 flex flex-col items-center justify-center">
                    <button 
                      className={`w-14 h-14 rounded-full flex items-center justify-center ${appointmentType === 'cena' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                      onClick={() => setAppointmentType('cena')}
                    >
                      <X size={24} />
                    </button>
                    <span className="mt-2 text-xs text-center">No Asistido</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allDay"
                    checked={isAllDay}
                    onChange={(e) => setIsAllDay(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allDay" className="ml-2 block text-sm text-gray-700">
                    Día entero
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Inicio
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        disabled={isAllDay}
                      />
                      <Input
                        type="time"
                        value={appointmentStartTime}
                        onChange={(e) => setAppointmentStartTime(e.target.value)}
                        disabled={isAllDay}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Final
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        disabled={isAllDay}
                      />
                      <Input
                        type="time"
                        value={appointmentEndTime}
                        onChange={(e) => setAppointmentEndTime(e.target.value)}
                        disabled={isAllDay}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Programar alerta vía email
                  </label>
                  <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    <span className="text-sm text-blue-700">30 minutos antes</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asignado a
                  </label>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-medium">
                      JM
                    </div>
                    <button className="ml-2 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 hover:bg-blue-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invitar personas
                  </label>
                  <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span className="text-sm text-blue-700">Añadir invitados</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enlazar contacto
                  </label>
                  <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-blue-700">Seleccionar contacto</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Añadir notas
                  </label>
                  <textarea
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Añade notas o comentarios relevantes..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="completed"
                    checked={appointmentCompleted}
                    onChange={(e) => setAppointmentCompleted(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="completed" className="ml-2 block text-sm text-gray-700">
                    Completada
                  </label>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button
                variant="primary"
                onClick={handleSaveAppointment}
              >
                Crear
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;