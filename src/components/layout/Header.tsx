import React, { useState } from 'react';
import { Search, Bell, Menu, Settings, User, LogOut, Bell as BellIcon, HelpCircle, RefreshCw, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';

interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, title }) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  const handleNotificationClick = () => {
    navigate('/inbox');
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                type="button" 
                className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
                onClick={toggleSidebar}
              >
                <Menu size={24} />
              </button>
              <h1 className="ml-2 md:ml-0 text-xl font-semibold text-gray-900">{title}</h1>
            </div>
            
            <div className="flex-1 max-w-md mx-auto px-4 sm:px-6 md:px-8 hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <button 
                onClick={handleNotificationClick}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Ver notificaciones</span>
                <div className="relative">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </div>
              </button>
              
              {user && (
                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center focus:outline-none"
                    >
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                        {user.name.substring(0, 1)}
                      </div>
                      <span className="hidden md:inline-block ml-2 text-sm font-medium text-gray-700">
                        {user.name.split(' ')[0]}
                      </span>
                    </button>
                  </div>

                  {showProfileMenu && (
                    <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                      <div className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                          {user.role.name}
                        </span>
                      </div>

                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowProfileSettings(true);
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <User size={16} className="mr-3" />
                          Perfil
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <BellIcon size={16} className="mr-3" />
                          Notificaciones Push
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <HelpCircle size={16} className="mr-3" />
                          Centro de Ayuda
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <RefreshCw size={16} className="mr-3" />
                          Actualizaciones
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                        >
                          <Building2 size={16} className="mr-3" />
                          Clínica Demo
                        </button>
                      </div>

                      <div className="py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
                        >
                          <LogOut size={16} className="mr-3" />
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Profile Settings Modal */}
      {showProfileSettings && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Configuración del Perfil</h2>
              <button
                onClick={() => setShowProfileSettings(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Cerrar</span>
                <Settings size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
                  <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <Input
                      label="Nombre"
                      defaultValue={user.name}
                    />
                    <Input
                      label="Email"
                      type="email"
                      defaultValue={user.email}
                    />
                    <Input
                      label="Teléfono"
                      type="tel"
                      placeholder="+34 XXX XXX XXX"
                    />
                    <Input
                      label="Idioma"
                      type="select"
                      defaultValue="es"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900">Notificaciones</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifications_email"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="notifications_email" className="font-medium text-gray-700">
                          Notificaciones por email
                        </label>
                        <p className="text-gray-500 text-sm">Recibe actualizaciones sobre tus citas y pacientes.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifications_push"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="notifications_push" className="font-medium text-gray-700">
                          Notificaciones push
                        </label>
                        <p className="text-gray-500 text-sm">Recibe notificaciones en tiempo real.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900">Configuración de la Clínica</h3>
                  <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <Input
                      label="Nombre de la Clínica"
                      defaultValue="Clínica Demo"
                    />
                    <Input
                      label="CIF/NIF"
                      placeholder="B12345678"
                    />
                    <Input
                      label="Dirección"
                      className="sm:col-span-2"
                      defaultValue="Calle de Beatriz de Bobadilla, 9. Madrid"
                    />
                    <Input
                      label="Teléfono de la Clínica"
                      type="tel"
                      placeholder="+34 XXX XXX XXX"
                    />
                    <Input
                      label="Email de la Clínica"
                      type="email"
                      placeholder="info@clinica.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 rounded-b-lg">
              <Button
                variant="outline"
                onClick={() => setShowProfileSettings(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // Here you would typically save the changes
                  setShowProfileSettings(false);
                }}
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;