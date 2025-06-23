import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, RefreshCw, FileText, Eye, Printer, X, Euro, Camera as VideoCamera } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import NewAppointmentForm from '../../components/dashboard/NewAppointmentForm';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

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

  // Convex queries and mutations
  const appointments = useQuery(api.appointments.getAppointments) || [];
  const doctors = useQuery(api.doctors.getDoctors) || [];
    const employees = useQuery(api.employees.getEmployees) || [];
  const updateAppointmentStatus = useMutation(api.appointments.updateAppointmentStatus);
  const updateAppointment = useMutation(api.appointments.updateAppointment);

  // Status styles with background opacity for better readability
  const statusStyles = {
    'pending': 'bg-orange-100 text-orange-800',
    'confirmed': 'bg-yellow-100 text-yellow-800',
    'waiting': 'bg-pink-100 text-pink-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'no_show': 'bg-red-100 text-red-800',
    'scheduled': 'bg-blue-100 text-blue-800'
  };

  // Status labels in Spanish
  const statusLabels = {
    'pending': 'Pte Confirmación',
    'confirmed': 'Confirmada',
    'waiting': 'Sala de Espera',
    'in_progress': 'En Curso',
    'completed': 'Terminada',
    'no_show': 'No Asistencia',
    'scheduled': 'Programada'
  };

  // Service areas
  const areas = [
    { id: 'all', name: 'Todas las áreas' },
    { id: 'veterinary', name: 'Veterinaria' },
    { id: 'grooming', name: 'Peluquería' },
    { id: 'administration', name: 'Administración' }
  ];

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const searchString = `${appointment.pet?.name} ${appointment.patient?.name} ${appointment.employee?.firstName} ${appointment.employee?.lastName}`.toLowerCase();

    return (
      searchString.includes(searchTerm.toLowerCase()) &&
      (selectedArea === 'all' || appointment.employee?.department === selectedArea) &&
      (selectedSpecialist === 'all' || appointment.employeeId === selectedSpecialist)
    );
  });

  const handleNewAppointment = (appointmentData: any) => {
    console.log('New appointment data:', appointmentData);
    setShowNewAppointmentForm(false);
  };

  const handleStatusChange = async (appointmentId: Id<"appointments">, newStatus: string) => {
    try {
      await updateAppointmentStatus({
        id: appointmentId,
        status: newStatus as any
      });
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const handleRefresh = () => {
    // Convex automatically refreshes data, but we can trigger a manual refresh if needed
    console.log('Data automatically refreshed by Convex...');
  };

  const toggleRow = (appointmentId: string) => {
    setExpandedRow(current => current === appointmentId ? null : appointmentId);
  };

  const handleManageAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);

    // Initialize modal form with appointment data
    const consultationKindLabels = {
      'annualReview': 'Revisión Anual',
      'followUp': 'Seguimiento',
      'checkUp': 'Chequeo',
      'emergency': 'Emergencia',
      'vaccination': 'Vacunación',
      'surgery': 'Cirugía',
      'dental': 'Dental',
      'grooming': 'Peluquería',
      'firstVisit': 'Primera Visita',
      'procedure': 'Procedimiento'
    };

    setAppointmentTitle(`${consultationKindLabels[appointment.consultationKind] || appointment.consultationKind} - ${appointment.pet?.name}`);

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

  const handleSaveAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      await updateAppointment({
        id: selectedAppointment._id,
        notes: appointmentNotes,
        date: appointmentDate,
        time: appointmentStartTime,
        status: appointmentCompleted ? 'completed' : selectedAppointment.status
      });

      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  if (!appointments) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando citas...</div>
      </div>
    );
  }

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
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todas las áreas</option>
                <option value="veterinary">Veterinaria</option>
                <option value="grooming">Peluquería</option>
                <option value="administration">Administración</option>
              </select>
            <select
                value={selectedSpecialist}
                onChange={(e) => setSelectedSpecialist(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todos los especialistas</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.firstName} {employee.lastName} - {employee.position} ({employee.department})
                  </option>
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
              {filteredAppointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-50">
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
                    <div className="text-sm font-medium text-gray-900">{appointment.pet?.name}</div>
                    <div className="text-sm text-gray-500">
                      {appointment.pet?.breed}, {appointment.pet?.age} años
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.patient?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.employee?.firstName} {appointment.employee?.lastName}</div>
                    <div className="text-sm text-gray-500">{appointment.employee?.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {appointment.employee?.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden divide-y divide-gray-200">
          {filteredAppointments.map((appointment) => {
            const isExpanded = expandedRow === appointment._id;

            return (
              <div key={appointment._id} className="p-4">
                <div 
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => toggleRow(appointment._id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.time} - {appointment.pet?.name}
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
                        {appointment.employee?.department}
                      </span>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-4">
                    <div className="border-t pt-4">
                      <div className="text-sm font-medium text-gray-700">Propietario</div>
                      <div className="mt-1 text-sm text-gray-900">{appointment.patient?.name}</div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="text-sm font-medium text-gray-700">Especialista</div>
                      <div className="mt-1 text-sm text-gray-900">{appointment.employee?.firstName} {appointment.employee?.lastName}</div>
                      <div className="text-sm text-gray-500">{appointment.employee?.position}</div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="text-sm font-medium text-gray-700">Estado</div>
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
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
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;