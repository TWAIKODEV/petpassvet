import React, { useState, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus, Filter, Download } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import NewAppointmentForm from '../components/dashboard/NewAppointmentForm';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { useToastContext } from '../context/ToastContext';
import { formatDateToLocalString } from '../utils/dateUtils';

const CalendarPage = () => {
  const { showSuccess, showError } = useToastContext();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showNewAppointmentForm, setShowNewAppointmentForm] = useState(false);
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('all');
  
  // Drag & Drop state
  const [draggedAppointment, setDraggedAppointment] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverDate, setDragOverDate] = useState<Date | null>(null);

  // Convex queries and mutations
  const appointments = useQuery(api.appointments.getAppointments) || [];
  const doctors = useQuery(api.doctors.getDoctors) || [];
  const updateAppointment = useMutation(api.appointments.updateAppointment);
  const updateCalendarEvent = useAction(api.microsoft.updateMicrosoftCalendarEvent);
  const connectedAccounts = useQuery(api.microsoft.getConnectedAccounts, { userId: "current-user" }) || [];

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    const dateString = formatDateToLocalString(date);
    
    return appointments.filter(appointment => {
      const appointmentDate = appointment.date;
      const matchesDate = appointmentDate === dateString;
      const matchesDoctor = selectedDoctorFilter === 'all' || appointment.employeeId === selectedDoctorFilter;
      return matchesDate && matchesDoctor;
    });
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Format month/year display
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    }).replace(/^\w/, c => c.toUpperCase());
  };

  // Status colors
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-orange-400',
      'confirmed': 'bg-yellow-400',
      'waiting': 'bg-pink-400',
      'in_progress': 'bg-blue-400',
      'completed': 'bg-green-400',
      'no_show': 'bg-red-400',
      'scheduled': 'bg-blue-400'
    };
    return colors[status] || 'bg-gray-400';
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === today.toDateString();
  };

  const handleNewAppointment = (appointmentData: any) => {
    console.log('New appointment data:', appointmentData);
    setShowNewAppointmentForm(false);
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, appointment: any) => {
    setDraggedAppointment(appointment);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedAppointment(null);
    setDragOverDate(null);
  };

  const handleDragOver = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(date);
  };

  const handleDrop = async (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    
    if (!draggedAppointment) return;

    const newDate = formatDateToLocalString(targetDate);
    
    if (newDate === draggedAppointment.date) {
      // Same date, no need to update
      return;
    }

    setDragOverDate(null);

    try {
      // Check if there's a valid Microsoft account connected
      const validMicrosoftAccount = connectedAccounts?.find(
        account => account.platform === 'microsoft' && 
                   account.connected && 
                   account.expiresAt && 
                   Date.now() < account.expiresAt
      );

      // Update appointment in database
      await updateAppointment({
        appointmentId: draggedAppointment._id,
        date: newDate
      });

      // Update calendar event if it exists
      if (draggedAppointment.microsoftCalendarEventId && validMicrosoftAccount) {
        try {
          // Calculate new start and end times
          const appointmentDate = new Date(`${newDate}T${draggedAppointment.time}:00`);
          const endTime = new Date(appointmentDate.getTime() + (draggedAppointment.duration * 60000));

          const startDateTime = appointmentDate.toISOString();
          const endDateTime = endTime.toISOString();

          await updateCalendarEvent({
            accessToken: validMicrosoftAccount.accessToken!,
            eventId: draggedAppointment.microsoftCalendarEventId,
            subject: `Cita Petpassvet con ${draggedAppointment.pet.name}`,
            description: `Cita de ${draggedAppointment.serviceType}`,
            startDateTime,
            endDateTime,
            timeZone: 'Europe/Madrid',
            reminderMinutes: 1440
          });

          showSuccess('Cita movida exitosamente y actualizada en el calendario de Microsoft.');
        } catch (calendarError) {
          console.error('Error actualizando evento de calendario:', calendarError);
          showError('Cita movida pero hubo un error al actualizar el calendario de Microsoft.');
        }
      } else {
        showSuccess('Cita movida exitosamente.');
      }
    } catch (error) {
      console.error('Error moving appointment:', error);
      showError('Error al mover la cita. Por favor intenta de nuevo.');
    }
  };

  // Loading state
  if (!appointments || !doctors) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando calendario...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Drag & Drop Indicator */}
      {isDragging && draggedAppointment && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="text-sm font-medium">
            Arrastrando: {draggedAppointment.pet?.name} - {draggedAppointment.time}
          </div>
          <div className="text-xs opacity-90">
            Suelta en cualquier día para mover la cita
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendario</h1>
          <p className="mt-1 text-sm text-gray-500">
            Vista de calendario de citas
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            icon={<Filter size={18} />}
          >
            Filtros
          </Button>
          <Button
            variant="outline"
            icon={<Download size={18} />}
          >
            Exportar
          </Button>
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            onClick={() => setShowNewAppointmentForm(true)}
          >
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<ChevronLeft size={16} />}
                  onClick={goToPreviousMonth}
                >
                  Anterior
                </Button>
                <h2 className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
                  {formatMonthYear(currentDate)}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<ChevronRight size={16} />}
                  onClick={goToNextMonth}
                >
                  Siguiente
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
              >
                Hoy
              </Button>
            </div>

            {/* Doctor Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Doctor:
              </label>
              <select
                value={selectedDoctorFilter}
                onChange={(e) => setSelectedDoctorFilter(e.target.value)}
                className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todos los doctores</option>
                {doctors.map(doctor => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <div className="p-4">
          {/* Days of the week header */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              const dayAppointments = date ? getAppointmentsForDate(date) : [];
              const isSelected = selectedDate && date && date.toDateString() === selectedDate.toDateString();

              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border border-gray-200 cursor-pointer transition-colors
                    ${date ? 'hover:bg-gray-50' : 'bg-gray-50'}
                    ${isSelected ? 'bg-blue-50 border-blue-300' : ''}
                    ${isToday(date) ? 'bg-yellow-50 border-yellow-300' : ''}
                    ${isDragging ? 'border-dashed border-blue-400' : ''}
                    ${dragOverDate && date && dragOverDate.toDateString() === date.toDateString() ? 'bg-blue-100 border-blue-500' : ''}
                  `}
                  onClick={() => date && setSelectedDate(date)}
                  onDragOver={(e) => date && handleDragOver(e, date)}
                  onDrop={(e) => date && handleDrop(e, date)}
                >
                  {date && (
                    <>
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-medium
                          ${isToday(date) ? 'text-yellow-700' : 'text-gray-900'}
                        `}>
                          {date.getDate()}
                        </span>
                        {dayAppointments.length > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                            {dayAppointments.length}
                          </span>
                        )}
                      </div>

                      {/* Appointments for this day */}
                      <div className="space-y-1">
                        {dayAppointments.slice(0, 3).map((appointment) => (
                          <div
                            key={appointment._id}
                            className="text-xs p-1 rounded bg-white border-l-2 shadow-sm cursor-move hover:shadow-md transition-shadow"
                            style={{ borderLeftColor: getStatusColor(appointment.status).replace('bg-', '#') }}
                            draggable
                            onDragStart={(e) => handleDragStart(e, appointment)}
                            onDragEnd={handleDragEnd}
                          >
                            <div className="font-medium text-gray-800 truncate">
                              {appointment.time} - {appointment.pet?.name}
                            </div>
                            <div className="text-gray-600 truncate">
                              {appointment.employee?.name}
                            </div>
                          </div>
                        ))}
                        {dayAppointments.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayAppointments.length - 3} más
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Citas para {selectedDate.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </h3>

            {getAppointmentsForDate(selectedDate).length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay citas programadas para este día
              </p>
            ) : (
              <div className="space-y-3">
                {getAppointmentsForDate(selectedDate).map((appointment) => (
                  <div
                    key={appointment._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
                    draggable
                    onDragStart={(e) => handleDragStart(e, appointment)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(appointment.status)}`}></div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {appointment.time} - {appointment.pet?.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Propietario: {appointment.patient?.name} | Doctor: {appointment.employee?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Tipo: {appointment.serviceType} | Duración: {appointment.duration} min
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full
                        ${appointment.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          appointment.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                          appointment.status === 'no_show' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {appointment.status === 'confirmed' ? 'Confirmada' :
                         appointment.status === 'completed' ? 'Completada' :
                         appointment.status === 'in_progress' ? 'En Curso' :
                         appointment.status === 'pending' ? 'Pendiente' :
                         appointment.status === 'no_show' ? 'No Asistió' :
                         'Programada'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* New Appointment Form Modal */}
      {showNewAppointmentForm && (
        <NewAppointmentForm
          onClose={() => setShowNewAppointmentForm(false)}
          onSubmit={handleNewAppointment}
        />
      )}
    </div>
  );
};

export default CalendarPage;