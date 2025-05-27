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
  Check
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';

const RegistrarEntradaSalida: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

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

  // Format date as weekday, day month year
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Mock data for employees
  const employees = [
    {
      id: '1',
      name: 'Dr. Alejandro Ramírez',
      department: 'Veterinaria',
      position: 'Veterinario Senior',
      avatar: null,
      status: 'in', // 'in', 'out', or null for no record today
      lastCheckIn: '09:05:23',
      lastCheckOut: null
    },
    {
      id: '2',
      name: 'Dra. Laura Gómez',
      department: 'Veterinaria',
      position: 'Veterinaria',
      avatar: null,
      status: 'out',
      lastCheckIn: '10:02:45',
      lastCheckOut: '14:30:12'
    },
    {
      id: '3',
      name: 'Ana López',
      department: 'Peluquería',
      position: 'Peluquera',
      avatar: null,
      status: null,
      lastCheckIn: null,
      lastCheckOut: null
    },
    {
      id: '4',
      name: 'Carlos Ruiz',
      department: 'Administración',
      position: 'Recepcionista',
      avatar: null,
      status: 'in',
      lastCheckIn: '08:03:17',
      lastCheckOut: null
    },
    {
      id: '5',
      name: 'María Sánchez',
      department: 'Administración',
      position: 'Contable',
      avatar: null,
      status: 'out',
      lastCheckIn: '09:00:45',
      lastCheckOut: '17:05:32'
    }
  ];

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle check-in/out
  const handleCheckInOut = (employeeId: string, action: 'in' | 'out') => {
    // In a real app, this would make an API call to record the check-in/out
    console.log(`Employee ${employeeId} checked ${action} at ${formatTime(currentTime)}`);
    
    // Update the employee status in our mock data
    const employeeIndex = employees.findIndex(emp => emp.id === employeeId);
    if (employeeIndex !== -1) {
      if (action === 'in') {
        employees[employeeIndex].status = 'in';
        employees[employeeIndex].lastCheckIn = formatTime(currentTime);
      } else {
        employees[employeeIndex].status = 'out';
        employees[employeeIndex].lastCheckOut = formatTime(currentTime);
      }
    }
    
    // Show success message
    setSuccessMessage(`${employees[employeeIndex].name} ha registrado su ${action === 'in' ? 'entrada' : 'salida'} correctamente a las ${formatTime(currentTime)}`);
    
    // Clear selected employee
    setSelectedEmployee(null);
  };

  // Get status badge
  const getStatusBadge = (status: string | null) => {
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
        <div className="p-4">
          <Input
            placeholder="Buscar empleados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
            className="w-full"
          />
        </div>
      </Card>

      {/* Employee List */}
      <Card title="Empleados" icon={<User size={20} />}>
        <div className="divide-y divide-gray-200">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="p-4 hover:bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {employee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                    <p className="text-xs text-gray-500">{employee.department} • {employee.position}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <div className="flex flex-col items-start">
                    {getStatusBadge(employee.status)}
                    <div className="mt-1 text-xs text-gray-500">
                      {employee.lastCheckIn && (
                        <span>Entrada: {employee.lastCheckIn}</span>
                      )}
                      {employee.lastCheckIn && employee.lastCheckOut && (
                        <span> • </span>
                      )}
                      {employee.lastCheckOut && (
                        <span>Salida: {employee.lastCheckOut}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {employee.status !== 'in' && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<LogIn size={16} />}
                        onClick={() => handleCheckInOut(employee.id, 'in')}
                      >
                        Marcar Entrada
                      </Button>
                    )}
                    
                    {employee.status === 'in' && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<LogOut size={16} />}
                        onClick={() => handleCheckInOut(employee.id, 'out')}
                      >
                        Marcar Salida
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredEmployees.length === 0 && (
            <div className="p-8 text-center">
              <User size={48} className="mx-auto text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron empleados</h3>
              <p className="mt-1 text-sm text-gray-500">
                Prueba con otros términos de búsqueda
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Check In/Out for Current User */}
      <Card title="Mi Registro" icon={<Clock size={20} />}>
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium text-xl">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'AR'}
                </span>
              </div>
              <div className="ml-4">
                <p className="text-lg font-medium text-gray-900">{user?.name || 'Dr. Alejandro Ramírez'}</p>
                <p className="text-sm text-gray-500">Veterinario Senior • Veterinaria</p>
                <div className="mt-1">
                  {getStatusBadge(employees[0].status)}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="primary"
                icon={<LogIn size={18} />}
                disabled={employees[0].status === 'in'}
                onClick={() => handleCheckInOut('1', 'in')}
              >
                Marcar Entrada
              </Button>
              <Button
                variant="outline"
                icon={<LogOut size={18} />}
                disabled={employees[0].status !== 'in'}
                onClick={() => handleCheckInOut('1', 'out')}
              >
                Marcar Salida
              </Button>
            </div>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Mis últimos registros</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Hoy</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(new Date())}
                  </p>
                </div>
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-gray-500">Entrada</p>
                    <p className="text-sm font-medium text-gray-900">{employees[0].lastCheckIn || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Salida</p>
                    <p className="text-sm font-medium text-gray-900">{employees[0].lastCheckOut || '-'}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Ayer</p>
                  <p className="text-xs text-gray-500">
                    {new Date(Date.now() - 86400000).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-gray-500">Entrada</p>
                    <p className="text-sm font-medium text-gray-900">09:02:45</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Salida</p>
                    <p className="text-sm font-medium text-gray-900">17:05:12</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Anteayer</p>
                  <p className="text-xs text-gray-500">
                    {new Date(Date.now() - 172800000).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-gray-500">Entrada</p>
                    <p className="text-sm font-medium text-gray-900">08:58:32</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Salida</p>
                    <p className="text-sm font-medium text-gray-900">17:03:45</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RegistrarEntradaSalida;