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
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

const Usuarios: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newUserForm, setNewUserForm] = useState({
    employeeId: '',
    roleId: '',
    status: 'active' as 'active' | 'inactive',
    password: '',
    confirmPassword: ''
  });

  // Convex queries and mutations
  const users = useQuery(api.users.getUsers) || [];
  const roles = useQuery(api.roles.getRoles) || [];
  const employeesWithoutUser = useQuery(api.employees.getEmployeesWithoutUser) || [];
  const createUser = useMutation(api.users.createUser);
  const updateUser = useMutation(api.users.updateUser);
  const deleteUser = useMutation(api.users.deleteUser);

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    if (!user.employee || !user.role) return false;

    const fullName = `${user.employee.firstName} ${user.employee.lastName}`;
    const matchesSearch = 
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employee.phone.includes(searchTerm) ||
      user.employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employee.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === 'all' || user.roleId === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleNewUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newUserForm.password !== newUserForm.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (!newUserForm.employeeId || !newUserForm.roleId || !newUserForm.password) {
      alert('Todos los campos son obligatorios');
      return;
    }

    try {
      await createUser({
        employeeId: newUserForm.employeeId as Id<"employees">,
        roleId: newUserForm.roleId as Id<"roles">,
        status: newUserForm.status,
        password: newUserForm.password,
      });

      setShowNewUserForm(false);
      setNewUserForm({
        employeeId: '',
        roleId: '',
        status: 'active',
        password: '',
        confirmPassword: ''
      });

      alert('Usuario creado correctamente');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error al crear el usuario');
    }
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
  };

  const handleResetPassword = (userId: string) => {
    console.log('Resetting password for user:', userId);
    alert('Se ha enviado un enlace de restablecimiento de contraseña al usuario.');
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await updateUser({
        id: userId as Id<"users">,
        status: newStatus
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Error al actualizar el estado del usuario');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await deleteUser({ id: userId as Id<"users"> });
        alert('Usuario eliminado correctamente');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error al eliminar el usuario');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra usuarios del sistema
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
              <option key={role._id} value={role._id}>{role.displayName}</option>
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
                  Estado
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {user.employee.firstName[0]}{user.employee.lastName[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.employee.firstName} {user.employee.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.employee.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.employee.email}</div>
                    <div className="text-sm text-gray-500">{user.employee.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.role.displayName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.employee.department === 'veterinary' ? 'Veterinaria' : 
                     user.employee.department === 'grooming' ? 'Peluquería' : 
                     'Administración'}
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
                        onClick={() => handleResetPassword(user._id)}
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Resetear contraseña"
                      >
                        <Lock size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(user._id, user.status)}
                        className={`${user.status === 'active' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                        title={user.status === 'active' ? 'Desactivar' : 'Activar'}
                      >
                        {user.status === 'active' ? <X size={18} /> : <Check size={18} />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        <Trash size={18} />
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
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
              <form onSubmit={handleNewUser} className="space-y-6">
                {/* Employee Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Empleado</label>
                  <select
                    value={newUserForm.employeeId}
                    onChange={(e) => setNewUserForm({...newUserForm, employeeId: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Seleccionar empleado</option>
                    {employeesWithoutUser.map(employee => (
                      <option key={employee._id} value={employee._id}>
                        {employee.firstName} {employee.lastName} - {employee.position}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <select
                    value={newUserForm.roleId}
                    onChange={(e) => setNewUserForm({...newUserForm, roleId: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Seleccionar rol</option>
                    {roles.map(role => (
                      <option key={role._id} value={role._id}>{role.displayName}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={newUserForm.status}
                    onChange={(e) => setNewUserForm({...newUserForm, status: e.target.value as 'active' | 'inactive'})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>

                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Contraseña" 
                    type="password" 
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                    required 
                  />
                  <Input 
                    label="Confirmar Contraseña" 
                    type="password" 
                    value={newUserForm.confirmPassword}
                    onChange={(e) => setNewUserForm({...newUserForm, confirmPassword: e.target.value})}
                    required 
                  />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowNewUserForm(false)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleNewUser}>
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
                            {selectedUser.employee.firstName[0]}{selectedUser.employee.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">
                            {selectedUser.employee.firstName} {selectedUser.employee.lastName}
                          </h4>
                          <p className="text-sm text-gray-500">{selectedUser.employee.position}</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                          {selectedUser.employee.email}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                          {selectedUser.employee.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role and Status */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Rol y Estado</h3>
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
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                          {selectedUser.employee.department === 'veterinary' ? 'Veterinaria' : 
                           selectedUser.employee.department === 'grooming' ? 'Peluquería' : 
                           'Administración'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Estado</label>
                        <p className="mt-1">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
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