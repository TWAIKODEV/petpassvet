import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Search, 
  Download, 
  Filter, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  User,
  ArrowRight,
  CheckCircle,
  XCircle,
  Plus,
  X,
  CalendarDays,
  FileText
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const ControlHorario: React.FC = () => {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [activeTab, setActiveTab] = useState<'horario' | 'ausencias'>('horario');
  const [showNewAbsenceModal, setShowNewAbsenceModal] = useState(false);
  const [absenceForm, setAbsenceForm] = useState({
    employeeId: '',
    type: '',
    description: '',
    durationType: 'full_day',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    halfDayPeriod: 'morning'
  });

  // Mock data for employees
  const employees = [
    {
      id: '1',
      name: 'Dr. Alejandro Ramírez',
      department: 'Veterinaria',
      position: 'Veterinario Senior',
      schedule: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' }
      }
    },
    {
      id: '2',
      name: 'Dra. Laura Gómez',
      department: 'Veterinaria',
      position: 'Veterinaria',
      schedule: {
        monday: { start: '10:00', end: '18:00' },
        tuesday: { start: '10:00', end: '18:00' },
        wednesday: { start: '10:00', end: '18:00' },
        thursday: { start: '10:00', end: '18:00' },
        friday: { start: '10:00', end: '16:00' }
      }
    },
    {
      id: '3',
      name: 'Ana López',
      department: 'Peluquería',
      position: 'Peluquera',
      schedule: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' }
      }
    },
    {
      id: '4',
      name: 'Carlos Ruiz',
      department: 'Administración',
      position: 'Recepcionista',
      schedule: {
        monday: { start: '08:00', end: '16:00' },
        tuesday: { start: '08:00', end: '16:00' },
        wednesday: { start: '08:00', end: '16:00' },
        thursday: { start: '08:00', end: '16:00' },
        friday: { start: '08:00', end: '16:00' }
      }
    },
    {
      id: '5',
      name: 'María Sánchez',
      department: 'Administración',
      position: 'Contable',
      schedule: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' }
      }
    }
  ];

  // Fetch attendance records
  const fetchAttendanceRecords = () => {
    // In a real app, this would be an API call
    // For now, we'll generate mock data
    return generateAttendanceRecords();
  };

  // Mock data for attendance records
  const generateAttendanceRecords = () => {
    const records = [];
    const days = viewMode === 'day' ? 1 : viewMode === 'week' ? 7 : 30;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      
      for (const employee of employees) {
        // Skip weekends
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;
        
        // Get schedule for the day
        const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek].toLowerCase();
        const schedule = employee.schedule[dayName];
        
        if (!schedule) continue;
        
        // Random variation for check-in/out times (within 10 minutes)
        const randomMinutes = () => Math.floor(Math.random() * 10) - 5;
        
        const scheduledStartHour = parseInt(schedule.start.split(':')[0]);
        const scheduledStartMinute = parseInt(schedule.start.split(':')[1]);
        
        const scheduledEndHour = parseInt(schedule.end.split(':')[0]);
        const scheduledEndMinute = parseInt(schedule.end.split(':')[1]);
        
        const actualStartMinute = scheduledStartMinute + randomMinutes();
        const actualEndMinute = scheduledEndMinute + randomMinutes();
        
        const checkIn = `${scheduledStartHour.toString().padStart(2, '0')}:${Math.abs(actualStartMinute % 60).toString().padStart(2, '0')}`;
        const checkOut = `${scheduledEndHour.toString().padStart(2, '0')}:${Math.abs(actualEndMinute % 60).toString().padStart(2, '0')}`;
        
        // 5% chance of missing check-in or check-out
        const hasMissingRecord = Math.random() < 0.05;
        
        records.push({
          id: `${employee.id}-${date.toISOString().split('T')[0]}`,
          employeeId: employee.id,
          employeeName: employee.name,
          department: employee.department,
          date: date.toISOString().split('T')[0],
          checkIn: hasMissingRecord && Math.random() < 0.5 ? null : checkIn,
          checkOut: hasMissingRecord && Math.random() >= 0.5 ? null : checkOut,
          status: hasMissingRecord ? 'incomplete' : 'complete'
        });
      }
    }
    
    return records;
  };

  // Fetch absences
  const fetchAbsences = () => {
    // In a real app, this would be an API call
    // For now, we'll return mock data
    return absences;
  };

  // Mock data for absences
  const absences = [
    {
      id: '1',
      employeeId: '1',
      employeeName: 'Dr. Alejandro Ramírez',
      department: 'Veterinaria',
      type: 'vacation',
      description: 'Vacaciones de verano',
      startDate: '2025-07-15',
      endDate: '2025-07-30',
      status: 'approved',
      approvedBy: 'Dra. Carmen Jiménez',
      approvedDate: '2025-05-10'
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Dra. Laura Gómez',
      department: 'Veterinaria',
      type: 'sick_leave',
      description: 'Baja por enfermedad',
      startDate: '2025-05-25',
      endDate: '2025-05-27',
      status: 'approved',
      approvedBy: 'Dra. Carmen Jiménez',
      approvedDate: '2025-05-25'
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'Ana López',
      department: 'Peluquería',
      type: 'personal',
      description: 'Asuntos personales',
      startDate: '2025-06-10',
      endDate: '2025-06-10',
      status: 'pending',
      approvedBy: null,
      approvedDate: null
    },
    {
      id: '4',
      employeeId: '4',
      employeeName: 'Carlos Ruiz',
      department: 'Administración',
      type: 'half_day',
      description: 'Cita médica',
      startDate: '2025-06-05',
      endDate: '2025-06-05',
      status: 'approved',
      approvedBy: 'Dra. Carmen Jiménez',
      approvedDate: '2025-05-30'
    },
    {
      id: '5',
      employeeId: '5',
      employeeName: 'María Sánchez',
      department: 'Administración',
      type: 'vacation',
      description: 'Vacaciones de Semana Santa',
      startDate: '2025-04-14',
      endDate: '2025-04-18',
      status: 'completed',
      approvedBy: 'Dra. Carmen Jiménez',
      approvedDate: '2025-03-01'
    }
  ];

  // Load data on component mount and when dependencies change
  useEffect(() => {
    // In a real app, these would be API calls
    const attendanceRecords = fetchAttendanceRecords();
    const absenceRecords = fetchAbsences();
    
    // You would typically set these to state
    // setAttendanceRecords(attendanceRecords);
    // setAbsences(absenceRecords);
  }, [currentDate, viewMode]);

  const attendanceRecords = fetchAttendanceRecords();

  // Filter records based on search term, department, and view mode
  const filteredRecords = attendanceRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || record.department === selectedDepartment;
    
    // Filter by date based on view mode
    let matchesDate = true;
    if (viewMode === 'day') {
      matchesDate = record.date === currentDate.toISOString().split('T')[0];
    } else if (viewMode === 'week') {
      const recordDate = new Date(record.date);
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Start from Monday
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      matchesDate = recordDate >= startOfWeek && recordDate <= endOfWeek;
    } else if (viewMode === 'month') {
      const recordDate = new Date(record.date);
      matchesDate = recordDate.getMonth() === currentDate.getMonth() && 
                    recordDate.getFullYear() === currentDate.getFullYear();
    }
    
    return matchesSearch && matchesDepartment && matchesDate;
  });

  // Filter absences based on search term and department
  const filteredAbsences = absences.filter(absence => {
    const matchesSearch = absence.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || absence.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments
  const departments = ['all', ...new Set(employees.map(emp => emp.department))];

  // Format date range for display
  const getDateRangeText = () => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Start from Monday
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${startOfWeek.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} - ${endOfWeek.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    }
  };

  // Navigation functions
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAbsenceForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit new absence
  const handleSubmitAbsence = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New absence:', absenceForm);
    setShowNewAbsenceModal(false);
    
    // Reset form
    setAbsenceForm({
      employeeId: '',
      type: '',
      description: '',
      durationType: 'full_day',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      halfDayPeriod: 'morning'
    });
  };

  // Get absence type label
  const getAbsenceTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'vacation': 'Vacaciones',
      'sick_leave': 'Baja por Enfermedad',
      'personal': 'Asuntos Personales',
      'half_day': 'Medio Día',
      'training': 'Formación',
      'maternity': 'Baja por Maternidad',
      'paternity': 'Baja por Paternidad',
      'other': 'Otro'
    };
    return types[type] || type;
  };

  // Get absence status badge
  const getAbsenceStatusBadge = (status: string) => {
    if (status === 'approved') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={12} className="mr-1" />
          Aprobada
        </span>
      );
    } else if (status === 'pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock size={12} className="mr-1" />
          Pendiente
        </span>
      );
    } else if (status === 'rejected') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle size={12} className="mr-1" />
          Rechazada
        </span>
      );
    } else if (status === 'completed') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <CheckCircle size={12} className="mr-1" />
          Completada
        </span>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Control de Horario</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de entradas, salidas y ausencias del personal
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
            icon={activeTab === 'horario' ? <Clock size={18} /> : <Plus size={18} />}
            className="flex-1 sm:flex-none"
            onClick={() => activeTab === 'ausencias' ? setShowNewAbsenceModal(true) : null}
          >
            {activeTab === 'horario' ? 'Registrar Entrada/Salida' : 'Añadir Ausencia'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('horario')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'horario'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Horario
          </button>
          <button
            onClick={() => setActiveTab('ausencias')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'ausencias'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Ausencias
          </button>
        </nav>
      </div>

      {activeTab === 'horario' && (
        <>
          {/* Date Navigation and View Selector */}
          <Card>
            <div className="p-4 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<ChevronLeft size={16} />}
                  onClick={goToPrevious}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToToday}
                >
                  Hoy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<ChevronRight size={16} />}
                  onClick={goToNext}
                />
                <span className="text-sm font-medium text-gray-900 ml-2">
                  {getDateRangeText()}
                </span>
              </div>
              
              <div className="flex rounded-md shadow-sm ml-auto">
                <button
                  className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                    viewMode === 'day'
                      ? 'bg-blue-50 text-blue-600 border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setViewMode('day')}
                >
                  Día
                </button>
                <button
                  className={`px-3 py-2 text-sm font-medium border-t border-b ${
                    viewMode === 'week'
                      ? 'bg-blue-50 text-blue-600 border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setViewMode('week')}
                >
                  Semana
                </button>
                <button
                  className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-b border-r ${
                    viewMode === 'month'
                      ? 'bg-blue-50 text-blue-600 border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setViewMode('month')}
                >
                  Mes
                </button>
              </div>
            </div>
          </Card>

          {/* Filters */}
          <Card>
            <div className="p-4 flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Buscar empleados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
                className="flex-1"
              />
              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">Todos los departamentos</option>
                {departments.filter(d => d !== 'all').map(department => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
              <Button
                variant="outline"
                icon={<RefreshCw size={18} />}
              >
                Actualizar
              </Button>
            </div>
          </Card>

          {/* Attendance Records Table */}
          <Card title="Registros de Horario" icon={<Clock size={20} />}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empleado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Departamento
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entrada
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salida
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horas
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => {
                    // Calculate hours worked
                    let hoursWorked = '';
                    if (record.checkIn && record.checkOut) {
                      const checkInTime = record.checkIn.split(':');
                      const checkOutTime = record.checkOut.split(':');
                      
                      const checkInMinutes = parseInt(checkInTime[0]) * 60 + parseInt(checkInTime[1]);
                      const checkOutMinutes = parseInt(checkOutTime[0]) * 60 + parseInt(checkOutTime[1]);
                      
                      const diffMinutes = checkOutMinutes - checkInMinutes;
                      const hours = Math.floor(diffMinutes / 60);
                      const minutes = diffMinutes % 60;
                      
                      hoursWorked = `${hours}h ${minutes}m`;
                    }
                    
                    return (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <User size={16} className="text-blue-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{record.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(record.date).toLocaleDateString('es-ES', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {record.checkIn ? (
                            <div className="text-sm text-gray-900">{record.checkIn}</div>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Sin registro
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {record.checkOut ? (
                            <div className="text-sm text-gray-900">{record.checkOut}</div>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Sin registro
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {hoursWorked ? (
                            <div className="text-sm text-gray-900">{hoursWorked}</div>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              -
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {record.status === 'complete' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle size={12} className="mr-1" />
                              Completo
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle size={12} className="mr-1" />
                              Incompleto
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredRecords.length === 0 && (
                <div className="text-center py-12">
                  <Clock size={48} className="mx-auto text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay registros</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No se encontraron registros para el período seleccionado.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Total Empleados</h3>
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{employees.length}</p>
                <p className="mt-1 text-sm text-gray-500">empleados activos</p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Registros Completos</h3>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-green-600">
                  {filteredRecords.filter(r => r.status === 'complete').length}
                </p>
                <p className="mt-1 text-sm text-gray-500">en el período seleccionado</p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Registros Incompletos</h3>
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-red-600">
                  {filteredRecords.filter(r => r.status === 'incomplete').length}
                </p>
                <p className="mt-1 text-sm text-gray-500">en el período seleccionado</p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Horas Totales</h3>
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {(() => {
                    let totalMinutes = 0;
                    filteredRecords.forEach(record => {
                      if (record.checkIn && record.checkOut) {
                        const checkInTime = record.checkIn.split(':');
                        const checkOutTime = record.checkOut.split(':');
                        
                        const checkInMinutes = parseInt(checkInTime[0]) * 60 + parseInt(checkInTime[1]);
                        const checkOutMinutes = parseInt(checkOutTime[0]) * 60 + parseInt(checkOutTime[1]);
                        
                        totalMinutes += checkOutMinutes - checkInMinutes;
                      }
                    });
                    
                    const hours = Math.floor(totalMinutes / 60);
                    const minutes = totalMinutes % 60;
                    
                    return `${hours}h ${minutes}m`;
                  })()}
                </p>
                <p className="mt-1 text-sm text-gray-500">en el período seleccionado</p>
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'ausencias' && (
        <>
          {/* Filters for Absences */}
          <Card>
            <div className="p-4 flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Buscar empleados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
                className="flex-1"
              />
              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">Todos los departamentos</option>
                {departments.filter(d => d !== 'all').map(department => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
              <Button
                variant="outline"
                icon={<RefreshCw size={18} />}
              >
                Actualizar
              </Button>
            </div>
          </Card>

          {/* Absences Table */}
          <Card title="Ausencias y Vacaciones" icon={<CalendarDays size={20} />}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empleado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Departamento
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Inicio
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Fin
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duración
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAbsences.map((absence) => {
                    // Calculate duration in days
                    const startDate = new Date(absence.startDate);
                    const endDate = new Date(absence.endDate);
                    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    
                    return (
                      <tr key={absence.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <User size={16} className="text-blue-600" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{absence.employeeName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{absence.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {getAbsenceTypeLabel(absence.type)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(absence.startDate).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(absence.endDate).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {diffDays === 1 ? '1 día' : `${diffDays} días`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getAbsenceStatusBadge(absence.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{absence.description}</div>
                          {absence.approvedBy && (
                            <div className="text-xs text-gray-500">
                              Aprobado por: {absence.approvedBy} ({new Date(absence.approvedDate!).toLocaleDateString('es-ES')})
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredAbsences.length === 0 && (
                <div className="text-center py-12">
                  <CalendarDays size={48} className="mx-auto text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay ausencias</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No se encontraron ausencias para los filtros seleccionados.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Total Ausencias</h3>
                  <CalendarDays className="h-5 w-5 text-gray-400" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{absences.length}</p>
                <p className="mt-1 text-sm text-gray-500">registradas</p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Vacaciones</h3>
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-blue-600">
                  {absences.filter(a => a.type === 'vacation').length}
                </p>
                <p className="mt-1 text-sm text-gray-500">solicitudes</p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Bajas Médicas</h3>
                  <FileText className="h-5 w-5 text-red-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-red-600">
                  {absences.filter(a => a.type === 'sick_leave').length}
                </p>
                <p className="mt-1 text-sm text-gray-500">registradas</p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Pendientes</h3>
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-yellow-600">
                  {absences.filter(a => a.status === 'pending').length}
                </p>
                <p className="mt-1 text-sm text-gray-500">por aprobar</p>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* New Absence Modal */}
      {showNewAbsenceModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Añadir Ausencia
              </h3>
              <button
                onClick={() => setShowNewAbsenceModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitAbsence}>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empleado
                  </label>
                  <select
                    name="employeeId"
                    value={absenceForm.employeeId}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Seleccionar empleado</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} - {employee.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Ausencia
                  </label>
                  <select
                    name="type"
                    value={absenceForm.type}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="vacation">Vacaciones</option>
                    <option value="sick_leave">Baja por Enfermedad</option>
                    <option value="personal">Asuntos Personales</option>
                    <option value="half_day">Medio Día</option>
                    <option value="training">Formación</option>
                    <option value="maternity">Baja por Maternidad</option>
                    <option value="paternity">Baja por Paternidad</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={absenceForm.description}
                    onChange={handleFormChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Añade una descripción o motivo de la ausencia..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duración
                  </label>
                  <div className="mt-1 space-y-4">
                    <div className="flex items-center space-x-4">
                      <input
                        type="radio"
                        id="half_day"
                        name="durationType"
                        value="half_day"
                        checked={absenceForm.durationType === 'half_day'}
                        onChange={handleFormChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="half_day" className="text-sm text-gray-700">
                        Medio día
                      </label>
                      
                      <input
                        type="radio"
                        id="full_day"
                        name="durationType"
                        value="full_day"
                        checked={absenceForm.durationType === 'full_day'}
                        onChange={handleFormChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="full_day" className="text-sm text-gray-700">
                        Un día
                      </label>
                      
                      <input
                        type="radio"
                        id="multiple_days"
                        name="durationType"
                        value="multiple_days"
                        checked={absenceForm.durationType === 'multiple_days'}
                        onChange={handleFormChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="multiple_days" className="text-sm text-gray-700">
                        Varios días
                      </label>
                    </div>
                    
                    {absenceForm.durationType === 'half_day' && (
                      <div className="pl-6">
                        <select
                          name="halfDayPeriod"
                          value={absenceForm.halfDayPeriod}
                          onChange={handleFormChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="morning">Mañana</option>
                          <option value="afternoon">Tarde</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Inicio
                    </label>
                    <Input
                      type="date"
                      name="startDate"
                      value={absenceForm.startDate}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  {absenceForm.durationType === 'multiple_days' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Fin
                      </label>
                      <Input
                        type="date"
                        name="endDate"
                        value={absenceForm.endDate}
                        onChange={handleFormChange}
                        min={absenceForm.startDate}
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowNewAbsenceModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon={<Plus size={18} />}
                >
                  Añadir Ausencia
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlHorario;