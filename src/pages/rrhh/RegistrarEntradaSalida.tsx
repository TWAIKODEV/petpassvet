
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Search, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  User,
  LogIn,
  LogOut,
  Calendar,
  AlertCircle,
  Check,
  Filter
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

const RegistrarEntradaSalida: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Convex queries and mutations
  const employees = useQuery(api.employees.getEmployees) || [];
  const todayRecords = useQuery(api.timeRecording.getTimeRecordsByDate, { 
    recordDate: getCurrentDate() 
  }) || [];
  
  const recordEntry = useMutation(api.timeRecording.recordEntry);
  const recordDeparture = useMutation(api.timeRecording.recordDeparture);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Format time as HH:MM:SS
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Format time as HH:MM for storage
  const formatTimeForStorage = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date as weekday, day month year
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get employee's today record
  const getEmployeeRecord = (employeeId: string) => {
    return todayRecords.find(record => record.employee?._id === employeeId);
  };

  // Get employee status
  const getEmployeeStatus = (employeeId: string) => {
    const record = getEmployeeRecord(employeeId);
    if (!record) return null;
    
    if (record.entryDate && !record.departureDate) return 'in';
    if (record.entryDate && record.departureDate) return 'out';
    if (!record.entryDate && record.departureDate) return 'out';
    
    return null;
  };

  // Filter employees based on search term and department
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  // Handle check-in/out
  const handleCheckInOut = async (employeeId: string, action: 'in' | 'out') => {
    setIsLoading(true);
    try {
      const currentTimeFormatted = formatTimeForStorage(currentTime);
      const currentDate = getCurrentDate();
      
      if (action === 'in') {
        await recordEntry({
          employeeId: employeeId as any,
          entryTime: currentTimeFormatted,
          recordDate: currentDate,
        });
      } else {
        await recordDeparture({
          employeeId: employeeId as any,
          departureTime: currentTimeFormatted,
          recordDate: currentDate,
        });
      }
      
      const employee = employees.find(emp => emp._id === employeeId);
      setSuccessMessage(`${employee?.firstName} ${employee?.lastName} ha registrado su ${action === 'in' ? 'entrada' : 'salida'} correctamente a las ${formatTimeForStorage(currentTime)}`);
      
    } catch (error) {
      console.error('Error recording time:', error);
      setSuccessMessage('Error al registrar el tiempo. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get status badge
  const getStatusBadge = (employeeId: string) => {
    const status = getEmployeeStatus(employeeId);
    const record = getEmployeeRecord(employeeId);
    
    if (status === 'in') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={12} className="mr-1" />
          Trabajando
        </span>
      );
    } else if (status === 'out') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <XCircle size={12} className="mr-1" />
          Fuera
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle size={12} className="mr-1" />
          Sin registros hoy
        </span>
      );
    }
  };

  // Get current user's employee record
  const currentUserEmployee = employees.find(emp => emp.email === user?.email);
  const currentUserStatus = currentUserEmployee ? getEmployeeStatus(currentUserEmployee._id) : null;
  const currentUserRecord = currentUserEmployee ? getEmployeeRecord(currentUserEmployee._id) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registrar Entrada/Salida</h1>
          <p className="mt-1 text-sm text-gray-500">
            Control de entradas y salidas del personal
          </p>
        </div>
      </div>

      {/* Current Date and Time Card */}
      <Card>
        <div className="p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Calendar size={24} className="text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Fecha actual</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {formatDate(currentTime)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock size={24} className="text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Hora actual</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(currentTime)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
          <Check size={20} className="text-green-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-800 font-medium">{successMessage}</p>
            <p className="text-green-700 text-sm">El registro se ha guardado correctamente.</p>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <Card>
        <div className="p-4 space-y-4">
          <Input
            placeholder="Buscar empleados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
            className="w-full"
          />
          
          {/* Department Filter */}
          <div className="flex items-center gap-4">
            <Filter size={18} className="text-gray-500" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los departamentos</option>
              <option value="veterinary">Veterinaria</option>
              <option value="grooming">Peluquería</option>
              <option value="administration">Administración</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Quick Check In/Out for Current User */}
      {currentUserEmployee && (
        <Card title="Mi Registro" icon={<Clock size={20} />}>
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-xl">
                    {`${currentUserEmployee.firstName[0]}${currentUserEmployee.lastName[0]}`}
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">
                    {`${currentUserEmployee.firstName} ${currentUserEmployee.lastName}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentUserEmployee.position} • {currentUserEmployee.department}
                  </p>
                  <div className="mt-1">
                    {getStatusBadge(currentUserEmployee._id)}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  icon={<LogIn size={18} />}
                  disabled={currentUserStatus === 'in' || isLoading}
                  onClick={() => handleCheckInOut(currentUserEmployee._id, 'in')}
                >
                  Marcar Entrada
                </Button>
                <Button
                  variant="outline"
                  icon={<LogOut size={18} />}
                  disabled={currentUserStatus !== 'in' || isLoading}
                  onClick={() => handleCheckInOut(currentUserEmployee._id, 'out')}
                >
                  Marcar Salida
                </Button>
              </div>
            </div>
            
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Mi registro de hoy</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(new Date())}
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs text-gray-500">Entrada</p>
                      <p className="text-sm font-medium text-gray-900">
                        {currentUserRecord?.entryDate || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Salida</p>
                      <p className="text-sm font-medium text-gray-900">
                        {currentUserRecord?.departureDate || '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Employee List */}
      <Card title="Empleados" icon={<User size={20} />}>
        <div className="divide-y divide-gray-200">
          {filteredEmployees.map((employee) => {
            const record = getEmployeeRecord(employee._id);
            const status = getEmployeeStatus(employee._id);
            
            return (
              <div key={employee._id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {`${employee.firstName[0]}${employee.lastName[0]}`}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {`${employee.firstName} ${employee.lastName}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {employee.department} • {employee.position}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <div className="flex flex-col items-start">
                      {getStatusBadge(employee._id)}
                      <div className="mt-1 text-xs text-gray-500">
                        {record?.entryDate && (
                          <span>Entrada: {record.entryDate}</span>
                        )}
                        {record?.entryDate && record?.departureDate && (
                          <span> • </span>
                        )}
                        {record?.departureDate && (
                          <span>Salida: {record.departureDate}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {status !== 'in' && (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<LogIn size={16} />}
                          disabled={isLoading}
                          onClick={() => handleCheckInOut(employee._id, 'in')}
                        >
                          Marcar Entrada
                        </Button>
                      )}
                      
                      {status === 'in' && (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<LogOut size={16} />}
                          disabled={isLoading}
                          onClick={() => handleCheckInOut(employee._id, 'out')}
                        >
                          Marcar Salida
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredEmployees.length === 0 && (
            <div className="p-8 text-center">
              <User size={48} className="mx-auto text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron empleados</h3>
              <p className="mt-1 text-sm text-gray-500">
                Prueba con otros términos de búsqueda o cambia el filtro de departamento
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Instructions */}
      <Card title="Instrucciones" icon={<AlertCircle size={20} />}>
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Cómo registrar entradas y salidas</h4>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-2">
              <li>Cada empleado debe registrar su entrada al comenzar su jornada laboral.</li>
              <li>Al finalizar la jornada, debe registrar su salida.</li>
              <li>Los registros se guardan automáticamente en el sistema.</li>
              <li>Si olvidas registrar tu entrada o salida, contacta con el departamento de RRHH.</li>
              <li>Los registros pueden realizarse desde cualquier dispositivo conectado a la red de la clínica.</li>
              <li>El filtro de departamentos te permite encontrar empleados más fácilmente.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RegistrarEntradaSalida;
