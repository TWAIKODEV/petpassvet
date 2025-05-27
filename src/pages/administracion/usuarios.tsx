
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
  Unlock,
  Settings,
  Save,
  Plus,
  Minus
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { User, UserRole, Permission } from '../../types';

const Usuarios: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showRoleManagement, setShowRoleManagement] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<User | null>(null);

  // Permisos disponibles del sistema
  const [availablePermissions] = useState<Permission[]>([
    // Dashboard
    { id: 'dashboard_view', name: 'Ver Dashboard', description: 'Acceso al panel principal', module: 'dashboard', action: 'view' },
    
    // Inbox
    { id: 'inbox_view', name: 'Ver Inbox', description: 'Ver mensajes entrantes', module: 'inbox', action: 'view' },
    { id: 'inbox_reply', name: 'Responder Mensajes', description: 'Responder a mensajes', module: 'inbox', action: 'edit' },
    
    // Agenda
    { id: 'agenda_view', name: 'Ver Agenda', description: 'Ver calendario de citas', module: 'agenda', action: 'view' },
    { id: 'agenda_create', name: 'Crear Citas', description: 'Agendar nuevas citas', module: 'agenda', action: 'create' },
    { id: 'agenda_edit', name: 'Editar Citas', description: 'Modificar citas existentes', module: 'agenda', action: 'edit' },
    { id: 'agenda_delete', name: 'Eliminar Citas', description: 'Cancelar o eliminar citas', module: 'agenda', action: 'delete' },
    
    // Clientes
    { id: 'clients_view', name: 'Ver Clientes', description: 'Ver lista de clientes', module: 'clients', action: 'view' },
    { id: 'clients_create', name: 'Crear Clientes', description: 'Registrar nuevos clientes', module: 'clients', action: 'create' },
    { id: 'clients_edit', name: 'Editar Clientes', description: 'Modificar datos de clientes', module: 'clients', action: 'edit' },
    { id: 'clients_delete', name: 'Eliminar Clientes', description: 'Eliminar clientes del sistema', module: 'clients', action: 'delete' },
    
    // Pacientes/Mascotas
    { id: 'patients_view', name: 'Ver Pacientes', description: 'Ver historiales médicos', module: 'patients', action: 'view' },
    { id: 'patients_create', name: 'Crear Pacientes', description: 'Registrar nuevas mascotas', module: 'patients', action: 'create' },
    { id: 'patients_edit', name: 'Editar Pacientes', description: 'Modificar datos médicos', module: 'patients', action: 'edit' },
    
    // Consultorio
    { id: 'consultorio_view', name: 'Ver Consultorio', description: 'Acceso al área médica', module: 'consultorio', action: 'view' },
    { id: 'consultorio_manage', name: 'Gestionar Consultas', description: 'Realizar y gestionar consultas', module: 'consultorio', action: 'manage' },
    
    // Peluquería
    { id: 'grooming_view', name: 'Ver Peluquería', description: 'Acceso al área de peluquería', module: 'grooming', action: 'view' },
    { id: 'grooming_manage', name: 'Gestionar Peluquería', description: 'Realizar servicios de peluquería', module: 'grooming', action: 'manage' },
    
    // Finanzas
    { id: 'finances_view', name: 'Ver Finanzas', description: 'Ver información financiera', module: 'finances', action: 'view' },
    { id: 'finances_manage', name: 'Gestionar Finanzas', description: 'Gestión completa financiera', module: 'finances', action: 'manage' },
    
    // Administración
    { id: 'admin_view', name: 'Ver Administración', description: 'Ver configuración del sistema', module: 'admin', action: 'view' },
    { id: 'admin_manage', name: 'Gestionar Sistema', description: 'Administración completa del sistema', module: 'admin', action: 'manage' },
    { id: 'users_manage', name: 'Gestionar Usuarios', description: 'Crear y gestionar usuarios', module: 'admin', action: 'manage' },
    
    // Informes
    { id: 'reports_view', name: 'Ver Informes', description: 'Acceso a reportes', module: 'reports', action: 'view' },
    { id: 'reports_export', name: 'Exportar Informes', description: 'Exportar datos y reportes', module: 'reports', action: 'edit' }
  ]);

  // Roles predefinidos con permisos
  const [roles, setRoles] = useState<UserRole[]>([
    {
      id: 'admin',
      name: 'admin',
      displayName: 'Administrador',
      permissions: availablePermissions,
      isEditable: false
    },
    {
      id: 'manager',
      name: 'manager',
      displayName: 'Manager',
      permissions: availablePermissions.filter(p => !p.id.includes('admin_manage') && !p.id.includes('users_manage')),
      isEditable: true
    },
    {
      id: 'veterinarian',
      name: 'veterinarian',
      displayName: 'Veterinario',
      permissions: availablePermissions.filter(p => 
        p.module === 'dashboard' || 
        p.module === 'agenda' || 
        p.module === 'clients' || 
        p.module === 'patients' || 
        p.module === 'consultorio' ||
        (p.module === 'inbox' && p.action === 'view')
      ),
      isEditable: true
    },
    {
      id: 'vet_assistant',
      name: 'vet_assistant',
      displayName: 'Asistente Veterinario',
      permissions: availablePermissions.filter(p => 
        p.module === 'dashboard' || 
        (p.module === 'agenda' && p.action !== 'delete') || 
        p.module === 'clients' || 
        (p.module === 'patients' && p.action !== 'edit') || 
        (p.module === 'consultorio' && p.action === 'view')
      ),
      isEditable: true
    },
    {
      id: 'receptionist',
      name: 'receptionist',
      displayName: 'Auxiliar Oficina',
      permissions: availablePermissions.filter(p => 
        p.module === 'dashboard' || 
        p.module === 'agenda' || 
        p.module === 'clients' || 
        (p.module === 'patients' && p.action === 'view') || 
        p.module === 'inbox' ||
        (p.module === 'finances' && p.action === 'view')
      ),
      isEditable: true
    },
    {
      id: 'groomer',
      name: 'groomer',
      displayName: 'Peluquero',
      permissions: availablePermissions.filter(p => 
        p.module === 'dashboard' || 
        (p.module === 'agenda' && p.action !== 'delete') || 
        (p.module === 'clients' && p.action !== 'delete') || 
        (p.module === 'patients' && p.action === 'view') || 
        p.module === 'grooming'
      ),
      isEditable: true
    }
  ]);

  // Departamentos para dropdown
  const departments = [
    'Dirección',
    'Veterinaria',
    'Peluquería',
    'Administración',
    'Recepción',
    'Tienda'
  ];

  // Mock data para usuarios
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Dr. Alejandro Ramírez',
      email: 'alejandro.ramirez@clinica.com',
      phone: '+34 666 123 456',
      role: roles.find(r => r.id === 'veterinarian')!,
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
      role: roles.find(r => r.id === 'veterinarian')!,
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
      role: roles.find(r => r.id === 'groomer')!,
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
      role: roles.find(r => r.id === 'receptionist')!,
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
      role: roles.find(r => r.id === 'receptionist')!,
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
      role: roles.find(r => r.id === 'admin')!,
      department: 'Dirección',
      position: 'Directora',
      status: 'active',
      lastLogin: '2025-05-21T11:10:00'
    }
  ]);

  // Filtrar usuarios
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
    console.log('New user data:', userData);
    setShowNewUserForm(false);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleManageUserPermissions = (user: User) => {
    setSelectedUserForPermissions(user);
  };

  const handleResetPassword = (userId: string) => {
    console.log('Resetting password for user:', userId);
    alert('Se ha enviado un enlace de restablecimiento de contraseña al usuario.');
  };

  const handleToggleUserStatus = (userId: string, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus as 'active' | 'inactive' } 
          : user
      )
    );
  };

  const handleUpdateUserPermissions = (userId: string, newPermissions: Permission[]) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, customPermissions: newPermissions }
          : user
      )
    );
    setSelectedUserForPermissions(null);
  };

  const handleAddRole = () => {
    const newRoleId = `role_${Date.now()}`;
    setRoles(prev => [
      ...prev,
      {
        id: newRoleId,
        name: 'manager',
        displayName: 'Nuevo Rol',
        permissions: [],
        isEditable: true
      }
    ]);
  };

  const handleUpdateRole = (roleId: string, updatedRole: Partial<UserRole>) => {
    setRoles(prev =>
      prev.map(role =>
        role.id === roleId
          ? { ...role, ...updatedRole }
          : role
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra usuarios, roles y permisos del sistema
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            icon={<Settings size={18} />}
            onClick={() => setShowRoleManagement(true)}
            className="flex-1 sm:flex-none"
          >
            Gestionar Roles
          </Button>
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
              <option key={role.id} value={role.id}>{role.displayName}</option>
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

      {/* Users Table */}
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
                  Permisos
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
                      {user.role.displayName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.customPermissions ? 'Personalizado' : 'Por rol'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {(user.customPermissions || user.role.permissions).length} permisos
                    </div>
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
                        onClick={() => handleManageUserPermissions(user)}
                        className="text-purple-600 hover:text-purple-800"
                        title="Gestionar permisos"
                      >
                        <Shield size={18} />
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
                        <Lock size={18} />
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
                    <Input label="Nombre" name="firstName" required />
                    <Input label="Apellidos" name="lastName" required />
                    <Input label="Email" type="email" name="email" required />
                    <Input label="Teléfono" type="tel" name="phone" required />
                    <Input label="DNI/NIE" name="idNumber" required />
                    <Input label="Fecha de Nacimiento" type="date" name="birthDate" />
                  </div>
                </div>

                {/* Role and Access */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Rol y Acceso</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                      <select
                        name="role"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">Seleccionar rol</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.displayName}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
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
                    <Input label="Puesto" name="position" required />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
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
                    <Input label="Contraseña" type="password" name="password" required />
                    <Input label="Confirmar Contraseña" type="password" name="confirmPassword" required />
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
              </form>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowNewUserForm(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={() => handleNewUser({})}>
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
                            {selectedUser.role.displayName}
                          </span>
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Departamento</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">{selectedUser.department}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Permisos Activos</label>
                        <div className="mt-1 max-h-40 overflow-y-auto bg-gray-50 p-2 rounded border border-gray-200">
                          {(selectedUser.customPermissions || selectedUser.role.permissions).map(permission => (
                            <div key={permission.id} className="text-xs text-gray-700 py-1 border-b border-gray-200 last:border-b-0">
                              <span className="font-medium">{permission.name}</span>
                              <span className="text-gray-500 ml-2">({permission.module})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Cerrar
              </Button>
              <Button
                variant="primary"
                icon={<Shield size={18} />}
                onClick={() => {
                  setSelectedUser(null);
                  handleManageUserPermissions(selectedUser);
                }}
              >
                Gestionar Permisos
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* User Permissions Management Modal */}
      {selectedUserForPermissions && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Gestionar Permisos - {selectedUserForPermissions.name}
              </h2>
              <button
                onClick={() => setSelectedUserForPermissions(null)}
                className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1">
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Shield size={20} className="text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Rol actual: {selectedUserForPermissions.role.displayName}
                      </p>
                      <p className="text-xs text-blue-700">
                        {selectedUserForPermissions.customPermissions 
                          ? 'Este usuario tiene permisos personalizados que sobrescriben el rol base.'
                          : 'Este usuario utiliza los permisos estándar del rol asignado.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Permisos por módulo */}
                {Object.values(
                  availablePermissions.reduce((acc, permission) => {
                    if (!acc[permission.module]) {
                      acc[permission.module] = [];
                    }
                    acc[permission.module].push(permission);
                    return acc;
                  }, {} as Record<string, Permission[]>)
                ).map((modulePermissions, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3 capitalize">
                      {modulePermissions[0].module}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {modulePermissions.map(permission => {
                        const currentPermissions = selectedUserForPermissions.customPermissions || selectedUserForPermissions.role.permissions;
                        const hasPermission = currentPermissions.some(p => p.id === permission.id);
                        
                        return (
                          <label key={permission.id} className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={hasPermission}
                              onChange={(e) => {
                                const currentPerms = selectedUserForPermissions.customPermissions || selectedUserForPermissions.role.permissions;
                                const newPermissions = e.target.checked
                                  ? [...currentPerms, permission]
                                  : currentPerms.filter(p => p.id !== permission.id);
                                
                                handleUpdateUserPermissions(selectedUserForPermissions.id, newPermissions);
                              }}
                              className="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <div className="flex-1">
                              <span className="text-sm font-medium text-gray-900">
                                {permission.name}
                              </span>
                              <p className="text-xs text-gray-500">{permission.description}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  // Restablecer a permisos del rol
                  setUsers(prev =>
                    prev.map(user =>
                      user.id === selectedUserForPermissions.id
                        ? { ...user, customPermissions: undefined }
                        : user
                    )
                  );
                }}
              >
                Restablecer a Rol Base
              </Button>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setSelectedUserForPermissions(null)}>
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  icon={<Save size={18} />}
                  onClick={() => setSelectedUserForPermissions(null)}
                >
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Management Modal */}
      {showRoleManagement && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Roles</h2>
              <button
                onClick={() => setShowRoleManagement(false)}
                className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1">
              <div className="mb-6">
                <Button
                  variant="outline"
                  icon={<Plus size={18} />}
                  onClick={handleAddRole}
                >
                  Añadir Nuevo Rol
                </Button>
              </div>

              <div className="space-y-6">
                {roles.map(role => (
                  <div key={role.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        {role.isEditable ? (
                          <Input
                            value={role.displayName}
                            onChange={(e) => handleUpdateRole(role.id, { displayName: e.target.value })}
                            className="text-lg font-medium"
                          />
                        ) : (
                          <h3 className="text-lg font-medium text-gray-900">{role.displayName}</h3>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          {role.permissions.length} permisos asignados
                        </p>
                      </div>
                      {role.isEditable && (
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Trash size={16} />}
                          onClick={() => {
                            if (confirm('¿Estás seguro de que quieres eliminar este rol?')) {
                              setRoles(prev => prev.filter(r => r.id !== role.id));
                            }
                          }}
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.values(
                        availablePermissions.reduce((acc, permission) => {
                          if (!acc[permission.module]) {
                            acc[permission.module] = [];
                          }
                          acc[permission.module].push(permission);
                          return acc;
                        }, {} as Record<string, Permission[]>)
                      ).map((modulePermissions, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <h4 className="font-medium text-gray-900 mb-2 capitalize">
                            {modulePermissions[0].module}
                          </h4>
                          <div className="space-y-2">
                            {modulePermissions.map(permission => {
                              const hasPermission = role.permissions.some(p => p.id === permission.id);
                              
                              return (
                                <label key={permission.id} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={hasPermission}
                                    disabled={!role.isEditable}
                                    onChange={(e) => {
                                      if (!role.isEditable) return;
                                      
                                      const newPermissions = e.target.checked
                                        ? [...role.permissions, permission]
                                        : role.permissions.filter(p => p.id !== permission.id);
                                      
                                      handleUpdateRole(role.id, { permissions: newPermissions });
                                    }}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                  />
                                  <span className="text-xs text-gray-700">{permission.name}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button
                variant="primary"
                icon={<Save size={18} />}
                onClick={() => {
                  console.log('Guardando roles:', roles);
                  setShowRoleManagement(false);
                  alert('Roles guardados correctamente');
                }}
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
