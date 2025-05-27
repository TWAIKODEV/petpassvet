import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon, Filter, Plus, Search, Users, Euro, Camera as VideoCamera, X } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Calendar: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentStartTime, setAppointmentStartTime] = useState('');
  const [appointmentEndTime, setAppointmentEndTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('llamada');
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [appointmentCompleted, setAppointmentCompleted] = useState(false);
  const [draggingAppointment, setDraggingAppointment] = useState<any>(null);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Staff members
  const staffMembers = [
    { id: '1', name: 'Dr. García', role: 'Veterinario', color: 'bg-blue-100' },
    { id: '2', name: 'Dr. Martínez', role: 'Veterinario', color: 'bg-green-100' },
    { id: '3', name: 'Ana López', role: 'Peluquera', color: 'bg-purple-100' },
    { id: '4', name: 'Carlos Ruiz', role: 'Auxiliar', color: 'bg-yellow-100' }
  ];

  // Service types with their colors
  const serviceTypes = [
    { id: 'vaccination', name: 'Vacunación', color: 'bg-blue-100 text-blue-800' },
    { id: 'consultation', name: 'Consulta', color: 'bg-green-100 text-green-800' },
    { id: 'treatment', name: 'Curas', color: 'bg-purple-100 text-purple-800' },
    { id: 'surgery', name: 'Cirugía', color: 'bg-red-100 text-red-800' },
    { id: 'checkup', name: 'Revisión', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'grooming', name: 'Peluquería', color: 'bg-pink-100 text-pink-800' },
    { id: 'other', name: 'Otros', color: 'bg-gray-100 text-gray-800' }
  ];

  // Generate time slots from 9am to 8pm
  const timeSlots = Array.from({ length: 23 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  });

  // Mock appointments data
  const [appointments, setAppointments] = useState([
    {
      id: '1',
      time: '09:30',
      title: 'Luna - Pablo',
      type: 'checkup',
      duration: 30,
      staffId: '1',
      color: 'bg-yellow-100 text-yellow-800',
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '2',
      time: '10:00',
      title: 'Max - Ana',
      type: 'grooming',
      duration: 60,
      staffId: '3',
      color: 'bg-pink-100 text-pink-800',
      date: new Date().toISOString().split('T')[0]
    },
    {
      id: '3',
      time: '11:00',
      title: 'Sombra - Carolina',
      type: 'vaccination',
      duration: 30,
      staffId: '2',
      color: 'bg-blue-100 text-blue-800',
      date: new Date().toISOString().split('T')[0]
    }
  ]);

  // Filter appointments based on selected staff
  const filteredAppointments = appointments.filter(app => 
    selectedStaff.length === 0 || selectedStaff.includes(app.staffId)
  );

  // Get week dates
  const getWeekDates = () => {
    const dates = [];
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Start from Monday
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Get month dates
  const getMonthDates = () => {
    const dates = [];
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Add dates from previous month to start from Monday
    const firstDayOfWeek = firstDay.getDay() || 7;
    for (let i = 1; i < firstDayOfWeek; i++) {
      const date = new Date(firstDay);
      date.setDate(date.getDate() - i);
      dates.unshift(date);
    }
    
    // Add all dates of current month
    for (let date = new Date(firstDay); date <= lastDay; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date));
    }
    
    // Add dates from next month to complete the grid
    const remainingDays = 42 - dates.length; // 6 rows * 7 days
    const lastDate = new Date(lastDay);
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(lastDate);
      date.setDate(lastDate.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const handlePrevDate = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (view === 'day') {
        newDate.setDate(prev.getDate() - 1);
      } else if (view === 'week') {
        newDate.setDate(prev.getDate() - 7);
      } else {
        newDate.setMonth(prev.getMonth() - 1);
      }
      return newDate;
    });
  };

  const handleNextDate = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (view === 'day') {
        newDate.setDate(prev.getDate() + 1);
      } else if (view === 'week') {
        newDate.setDate(prev.getDate() + 7);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatDate = (date: Date, format: 'short' | 'long' = 'long') => {
    if (format === 'short') {
      return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'short'
      }).format(date);
    }
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(date);
  };

  const handleStaffToggle = (staffId: string) => {
    setSelectedStaff(prev => {
      if (prev.includes(staffId)) {
        return prev.filter(id => id !== staffId);
      }
      return [...prev, staffId];
    });
  };

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    
    // Initialize modal form with appointment data
    setAppointmentTitle(appointment.title);
    setAppointmentDate(appointment.date);
    setAppointmentStartTime(appointment.time);
    
    // Calculate end time based on duration
    const [hours, minutes] = appointment.time.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours, minutes + appointment.duration);
    const endTimeString = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;
    setAppointmentEndTime(endTimeString);
    
    setAppointmentType('llamada');
    setAppointmentNotes('');
    setIsAllDay(false);
    setAppointmentCompleted(false);
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

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, appointment: any) => {
    setDraggingAppointment(appointment);
    e.dataTransfer.setData('text/plain', JSON.stringify(appointment));
    e.dataTransfer.effectAllowed = 'move';
    
    // Add a dragging class to the element
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('opacity-50');
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggingAppointment(null);
    
    // Remove the dragging class
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('opacity-50');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, date: Date, staffId?: string) => {
    e.preventDefault();
    
    if (!draggingAppointment) return;
    
    try {
      // Update the appointment with the new date
      const updatedAppointments = appointments.map(app => {
        if (app.id === draggingAppointment.id) {
          return {
            ...app,
            date: date.toISOString().split('T')[0],
            staffId: staffId || app.staffId
          };
        }
        return app;
      });
      
      setAppointments(updatedAppointments);
      console.log(`Moved appointment ${draggingAppointment.id} to ${date.toISOString().split('T')[0]}`);
    } catch (error) {
      console.error('Error dropping appointment:', error);
    }
  };

  const renderDayView = () => (
    <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
      <div className="flex flex-1 min-h-0">
        {/* Time Column */}
        <div className="w-20 flex-shrink-0 border-r border-gray-200 bg-gray-50">
          <div className="h-12 border-b border-gray-200"></div>
          {timeSlots.map((time) => (
            <div
              key={time}
              className="h-12 border-b border-gray-200 px-2 py-1"
            >
              <span className="text-xs text-gray-500">{time}</span>
            </div>
          ))}
        </div>

        {/* Staff Columns */}
        <div className="flex-1 grid grid-cols-4">
          {/* Headers */}
          {staffMembers.map(staff => (
            <div key={staff.id} className="h-12 border-b border-r border-gray-200 px-4 py-3 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-900">{staff.name}</h3>
              <p className="text-xs text-gray-500">{staff.role}</p>
            </div>
          ))}

          {/* Time slots for each staff member */}
          {staffMembers.map((staff) => (
            <div 
              key={staff.id} 
              className="relative"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, currentDate, staff.id)}
            >
              {timeSlots.map((time, timeIndex) => (
                <div
                  key={`${staff.id}-${timeIndex}`}
                  className="h-12 border-b border-r border-gray-200"
                ></div>
              ))}
              
              {/* Appointments */}
              {filteredAppointments
                .filter(appointment => 
                  appointment.staffId === staff.id && 
                  appointment.date === currentDate.toISOString().split('T')[0]
                )
                .map(appointment => {
                  const startMinutes = 
                    parseInt(appointment.time.split(':')[0]) * 60 +
                    parseInt(appointment.time.split(':')[1]);
                  const startFromTop = ((startMinutes - 9 * 60) / 30) * 48;
                  
                  return (
                    <div
                      key={appointment.id}
                      className={`absolute left-0 right-1 mx-1 p-2 rounded ${appointment.color} cursor-pointer hover:shadow-md transition-shadow`}
                      style={{
                        top: `${startFromTop}px`,
                        height: `${appointment.duration}px`
                      }}
                      onClick={() => handleAppointmentClick(appointment)}
                      draggable
                      onDragStart={(e) => handleDragStart(e, appointment)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="text-xs font-medium truncate">
                        {appointment.title}
                      </div>
                      <div className="text-xs truncate opacity-75">
                        {serviceTypes.find(s => s.id === appointment.type)?.name}
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWeekView = () => {
    const weekDates = getWeekDates();
    return (
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-8 border-b">
          <div className="p-4 text-center border-r bg-gray-50">
            <div className="text-sm font-medium text-gray-900">Staff</div>
          </div>
          {weekDates.map((date, index) => (
            <div
              key={index}
              className={`p-4 text-center border-r ${
                date.toDateString() === new Date().toDateString()
                  ? 'bg-blue-50'
                  : 'bg-white'
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, date)}
            >
              <div className="text-sm font-medium text-gray-900">
                {formatDate(date, 'short')}
              </div>
            </div>
          ))}
        </div>
        <div className="divide-y">
          {staffMembers.map(staff => (
            <div key={staff.id} className="grid grid-cols-8">
              <div className="p-4 border-r bg-gray-50">
                <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                <div className="text-xs text-gray-500">{staff.role}</div>
              </div>
              {weekDates.map((date, index) => (
                <div 
                  key={index} 
                  className="p-2 border-r min-h-[100px] relative"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, date, staff.id)}
                >
                  {filteredAppointments
                    .filter(app => 
                      app.staffId === staff.id && 
                      app.date === date.toISOString().split('T')[0]
                    )
                    .map(app => (
                      <div
                        key={app.id}
                        className={`${app.color} p-1 rounded text-xs mb-1 cursor-pointer`}
                        onClick={() => handleAppointmentClick(app)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, app)}
                        onDragEnd={handleDragEnd}
                      >
                        {app.time} - {app.title}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthDates = getMonthDates();
    return (
      <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center">
              <span className="text-sm font-medium text-gray-900">{day}</span>
            </div>
          ))}
          {monthDates.map((date, index) => (
            <div
              key={index}
              className={`bg-white p-2 min-h-[120px] ${
                date.getMonth() !== currentDate.getMonth()
                  ? 'text-gray-400 bg-gray-50'
                  : 'text-gray-900'
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, date)}
            >
              <span className="text-sm">{date.getDate()}</span>
              <div className="mt-1 space-y-1">
                {filteredAppointments
                  .filter(app => app.date === date.toISOString().split('T')[0])
                  .map(app => {
                    const staff = staffMembers.find(s => s.id === app.staffId);
                    return (
                      <div
                        key={app.id}
                        className={`${app.color} p-1 rounded text-xs cursor-pointer`}
                        onClick={() => handleAppointmentClick(app)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, app)}
                        onDragEnd={handleDragEnd}
                      >
                        {app.time} - {app.title}
                        <div className="text-xs opacity-75">{staff?.name}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!mounted) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePrevDate}
              icon={<ChevronLeft size={18} />}
            />
            <Button
              variant="outline"
              onClick={handleNextDate}
              icon={<ChevronRight size={18} />}
            />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 capitalize">
            {formatDate(currentDate)}
          </h1>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="flex rounded-md shadow-sm flex-1 sm:flex-initial">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                view === 'day'
                  ? 'bg-blue-50 text-blue-600 border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setView('day')}
            >
              Día
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-t border-b ${
                view === 'week'
                  ? 'bg-blue-50 text-blue-600 border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setView('week')}
            >
              Semana
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                view === 'month'
                  ? 'bg-blue-50 text-blue-600 border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setView('month')}
            >
              Mes
            </button>
          </div>
          
          <Button
            variant="outline"
            icon={<Filter size={18} />}
          >
            Filtros
          </Button>
          
          <Button
            variant="primary"
            icon={<Plus size={18} />}
          >
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* Service Types and Staff Filter */}
      <div className="space-y-4 mb-4">
        {/* Service Types */}
        <Card>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Tipos de Servicio</h3>
            <div className="flex flex-wrap gap-2">
              {serviceTypes.map(service => (
                <div
                  key={service.id}
                  className={`px-3 py-1 rounded-full text-sm ${service.color}`}
                >
                  {service.name}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Staff Filter */}
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Especialistas</h3>
              <Button
                variant="text"
                size="sm"
                onClick={() => setSelectedStaff([])}
              >
                Ver todos
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {staffMembers.map(staff => (
                <label
                  key={staff.id}
                  className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded border"
                >
                  <input
                    type="checkbox"
                    checked={selectedStaff.includes(staff.id)}
                    onChange={() => handleStaffToggle(staff.id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                    <div className="text-xs text-gray-500">{staff.role}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Calendar View */}
      {view === 'day' && renderDayView()}
      {view === 'week' && renderWeekView()}
      {view === 'month' && renderMonthView()}

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

export default Calendar;