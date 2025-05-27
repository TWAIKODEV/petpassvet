import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  UserPlus, 
  Eye, 
  Edit, 
  Trash, 
  Mail, 
  Phone, 
  Shield, 
  Calendar, 
  X, 
  Check, 
  Lock, 
  Unlock
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: {
    id: string;
    name: string;
  };
  department: string;
  position: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  avatar?: string;
}

const Usuarios: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Mock data for users
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Dr. Alejandro Ramírez',
      email: 'alejandro.ramirez@clinica.com',
      phone: '+34 666 123 456',
      role: {
        id: 'veterinarian',
        name: 'Veterinario'
      },
      department: 'Veterinaria',
      position: 'Veterinario Senior',
      status: 'active',
      lastLogin: '2025-05-21T10:30:00'
    },
    {
      id: '2',
      name: 'Dra. Laura Gómez',
      email: 'laura.gomez@clinica.com',
      phone: '+34 666 234 567',
      role: {
        id: 'veterinarian',
        name: 'Veterinario'
      },
      department: 'Veterinaria',
      position: 'Veterinaria',
      status: 'active',
      lastLogin: '2025-05-21T09:15:00'
    },
    {
      id: '3',
      name: 'Ana López',
      email: 'ana.lopez@clinica.com',
      phone: '+34 666 345 678',
      role: {
        id: 'groomer',
        name: 'Peluquero'
      },
      department: 'Peluquería',
      position: 'Peluquera',
      status: 'active',
      lastLogin: '2025-05-20T16:45:00'
    },
    {
      id: '4',
      name: 'Carlos Ruiz',
      email: 'carlos.ruiz@clinica.com',
      phone: '+34 666 456 789',
      role: {
        id: 'receptionist',
        name: 'Auxiliar Oficina'
      },
      department: 'Administración',
      position: 'Recepcionista',
      status: 'active',
      lastLogin: '2025-05-21T08:30:00'
    },
    {
      id: '5',
      name: 'María Sánchez',
      email: 'maria.sanchez@clinica.com',
      phone: '+34 666 567 890',
      role: {
        id: 'receptionist',
        name: 'Auxiliar Oficina'
      },
      department: 'Administración',
      position: 'Contable',
      status: 'active',
      lastLogin: '2025-05-20T14:20:00'
    },
    {
      id: '6',
      name: 'Dra. Carmen Jiménez',
      email: 'carmen.jimenez@clinica.com',
      phone: '+34 666 678 901',
      role: {
        id: 'admin',
        name: 'Administrador'
      },
      department: 'Dirección',
      position: 'Directora',
      status: 'active',
      lastLogin: '2025-05-21T11:10:00'
    },
    {
      id: '7',
      name: 'Miguel Torres',
      email: 'miguel.torres@clinica.com',
      phone: '+34 666 789 012',
      role: {
        id: 'vet_assistant',
        name: 'Asistente Veterinario'
      },
      department: 'Veterinaria',
      position: 'Auxiliar Veterinario',
      status: 'active',
      lastLogin: '2025-05-21T09:45:00'
    },
    {
      id: '8',
      name: 'Javier Martínez',
      email: 'javier.martinez@clinica.com',
      phone: '+34 666 890 123',
      role: {
        id: 'manager',
        name: 'Manager'
      },
      department: 'Dirección',
      position: 'Gerente',
      status: 'inactive',
      lastLogin: '2025-05-15T10:30:00'
    }
  ]);

  // Roles for dropdown
  const roles = [
    { id: 'admin', name: 'Administrador' },
    { id: 'manager', name: 'Manager' },
    { id: 'veterinarian', name: 'Veterinario' },
    { id: 'vet_assistant', name: 'Asistente Veterinario' },
    { id: 'receptionist', name: 'Auxiliar Oficina' },
    { id: 'groomer', name: 'Peluquero' }
  ];

  // Departments for dropdown
  const departments = [
    'Dirección',
    'Veterinaria',
    'Peluquería',
    'Administración',
    'Recepción',
    'Tienda'
  ];

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role.id === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleNewUser = (userData: any) => {
    // Here you would typically make an API call to save the new user
    console.log('New user data:', userData);
    setShowNewUserForm(false);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleResetPassword = (userId: string) => {
    // Here you would typically make an API call to reset the user's password
    console.log('Resetting password for user:', userId);
    alert('Se ha enviado un enlace de restablecimiento de contraseña al usuario.');
  };

  const handleToggleUserStatus = (userId: string, currentStatus: 'active' | 'inactive') => {
    // Here you would typically make an API call to toggle the user's status
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    console.log('Toggling status for user:', userId, 'to', newStatus);
    
    // Update the user's status in the local state
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus as 'active' | 'inactive' } 
          : user
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de usuarios y permisos del sistema
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
            onClick={() => setShowNewUserForm(true)}
            className="flex-1 sm:flex-none"
          >
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <Input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
            className="flex-1"
          />
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">Todos los roles</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
          <Button
            variant="outline"
            icon={<RefreshCw size={18} />}
            onClick={() => {
              setSearchTerm('');
              setSelectedRole('all');
              setSelectedStatus('all');
            }}
          >
            Resetear
          </Button>
        </div>
      </Card>

      {/* Users List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departamento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Acceso
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
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.role.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Nunca'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2 justify-end">
                      <button
                        onClick={() => handleViewUser(user)}
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
                        onClick={() => handleResetPassword(user.id)}
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Resetear contraseña"
                      >
                        {user.status === 'active' ? <Lock size={18} /> : <Unlock size={18} />}
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(user.id, user.status)}
                        className={`${user.status === 'active' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                        title={user.status === 'active' ? 'Desactivar' : 'Activar'}
                      >
                        {user.status === 'active' ? <X size={18} /> : <Check size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Users size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No se encontraron usuarios</h3>
            <p className="text-gray-500 mt-1">Prueba con otros términos de búsqueda o cambia los filtros</p>
          </div>
        )}
      </div>

      {/* New User Form Modal */}
      {showNewUserForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Nuevo Usuario</h2>
              <button
                onClick={() => setShowNewUserForm(false)}
                className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Cerrar"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1">
              <form className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nombre"
                      name="firstName"
                      required
                    />
                    <Input
                      label="Apellidos"
                      name="lastName"
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      required
                    />
                    <Input
                      label="Teléfono"
                      type="tel"
                      name="phone"
                      required
                    />
                    <Input
                      label="DNI/NIE"
                      name="idNumber"
                      required
                    />
                    <Input
                      label="Fecha de Nacimiento"
                      type="date"
                      name="birthDate"
                    />
                  </div>
                </div>

                {/* Role and Access */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Rol y Acceso</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rol
                      </label>
                      <select
                        name="role"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">Seleccionar rol</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departamento
                      </label>
                      <select
                        name="department"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">Seleccionar departamento</option>
                        {departments.map(department => (
                          <option key={department} value={department}>{department}</option>
                        ))}
                      </select>
                    </div>
                    <Input
                      label="Puesto"
                      name="position"
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                      </label>
                      <select
                        name="status"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      >
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contraseña</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Contraseña"
                      type="password"
                      name="password"
                      required
                    />
                    <Input
                      label="Confirmar Contraseña"
                      type="password"
                      name="confirmPassword"
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        name="sendPasswordEmail"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Enviar email con credenciales al usuario
                      </span>
                    </label>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información Adicional</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Añade notas o comentarios relevantes..."
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowNewUserForm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => handleNewUser({})}
              >
                Guardar Usuario
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Detalles del Usuario</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Cerrar"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-xl">
                            {selectedUser.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">{selectedUser.name}</h4>
                          <p className="text-sm text-gray-500">{selectedUser.position}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedUser.email}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedUser.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Actividad</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Último Acceso</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                          {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Nunca'}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <p className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            selectedUser.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedUser.status === 'active' ? 'Activo' : 'Inactivo'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Role and Permissions */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Rol y Permisos</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Rol</label>
                        <p className="mt-1 flex items-center">
                          <Shield size={16} className="text-blue-600 mr-2" />
                          <span className="text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200 flex-1">
                            {selectedUser.role.name}
                          </span>
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Departamento</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedUser.department}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Puesto</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedUser.position}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones</h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        icon={<Edit size={18} />}
                        fullWidth
                      >
                        Editar Usuario
                      </Button>
                      <Button
                        variant="outline"
                        icon={<Lock size={18} />}
                        fullWidth
                        onClick={() => handleResetPassword(selectedUser.id)}
                      >
                        Resetear Contraseña
                      </Button>
                      <Button
                        variant={selectedUser.status === 'active' ? 'outline' : 'primary'}
                        icon={selectedUser.status === 'active' ? <X size={18} /> : <Check size={18} />}
                        fullWidth
                        onClick={() => handleToggleUserStatus(selectedUser.id, selectedUser.status)}
                      >
                        {selectedUser.status === 'active' ? 'Desactivar Usuario' : 'Activar Usuario'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Actividad</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-500 mr-2" />
                      <p className="text-sm text-gray-900">Último inicio de sesión</p>
                      <p className="ml-auto text-sm text-gray-500">
                        {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Nunca'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-500 mr-2" />
                      <p className="text-sm text-gray-900">Fecha de creación</p>
                      <p className="ml-auto text-sm text-gray-500">01/01/2025</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <Lock size={16} className="text-gray-500 mr-2" />
                      <p className="text-sm text-gray-900">Último cambio de contraseña</p>
                      <p className="ml-auto text-sm text-gray-500">15/04/2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedUser(null)}
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

export default Usuarios;