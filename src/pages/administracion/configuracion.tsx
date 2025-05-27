import React, { useState } from 'react';
import { 
  Building2, 
  Save, 
  Users, 
  Shield, 
  Settings, 
  Lock, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  CreditCard, 
  Calendar, 
  Pill, 
  ShoppingBag, 
  Scissors, 
  DollarSign, 
  BarChart2, 
  MessageSquare, 
  UserPlus
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Configuracion: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'empresa' | 'usuarios' | 'permisos'>('empresa');
  const [companyData, setCompanyData] = useState({
    businessName: 'ClinicPro Veterinaria S.L.',
    tradeName: 'ClinicPro',
    cif: 'B12345678',
    address: 'Calle de Beatriz de Bobadilla, 9',
    postalCode: '28040',
    city: 'Madrid',
    province: 'Madrid',
    country: 'España',
    phone: '+34 912 345 678',
    email: 'info@clinicpro.com',
    website: 'www.clinicpro.com',
    logo: '',
    bankAccount: 'ES12 3456 7890 1234 5678 9012',
    vatNumber: 'ES-B12345678',
    registrationData: 'Inscrita en el Registro Mercantil de Madrid, Tomo 12345, Folio 67, Hoja M-123456',
    legalRepresentative: 'Carmen Jiménez Rodríguez'
  });

  // Roles predefinidos
  const [roles, setRoles] = useState([
    {
      id: 'admin',
      name: 'Administrador',
      description: 'Acceso completo a todas las funcionalidades del sistema',
      isEditable: false
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Gestión de la clínica sin acceso a configuración avanzada',
      isEditable: true
    },
    {
      id: 'veterinarian',
      name: 'Veterinario',
      description: 'Acceso a historiales médicos y gestión de citas',
      isEditable: true
    },
    {
      id: 'vet_assistant',
      name: 'Asistente Veterinario',
      description: 'Apoyo a veterinarios con acceso limitado',
      isEditable: true
    },
    {
      id: 'receptionist',
      name: 'Auxiliar Oficina',
      description: 'Gestión de citas y atención al cliente',
      isEditable: true
    },
    {
      id: 'groomer',
      name: 'Peluquero',
      description: 'Gestión de servicios de peluquería',
      isEditable: true
    }
  ]);

  // Permisos por módulo
  const [permissions, setPermissions] = useState({
    dashboard: {
      title: 'Dashboard',
      icon: <BarChart2 size={20} />,
      permissions: {
        view: {
          admin: true,
          manager: true,
          veterinarian: true,
          vet_assistant: true,
          receptionist: true,
          groomer: true
        }
      }
    },
    inbox: {
      title: 'Inbox',
      icon: <MessageSquare size={20} />,
      permissions: {
        view: {
          admin: true,
          manager: true,
          veterinarian: true,
          vet_assistant: true,
          receptionist: true,
          groomer: false
        },
        reply: {
          admin: true,
          manager: true,
          veterinarian: true,
          vet_assistant: false,
          receptionist: true,
          groomer: false
        }
      }
    },
    agenda: {
      title: 'Agenda',
      icon: <Calendar size={20} />,
      permissions: {
        view: {
          admin: true,
          manager: true,
          veterinarian: true,
          vet_assistant: true,
          receptionist: true,
          groomer: true
        },
        create: {
          admin: true,
          manager: true,
          veterinarian: true,
          vet_assistant: true,
          receptionist: true,
          groomer: true
        },
        edit: {
          admin: true,
          manager: true,
          veterinarian: true,
          vet_assistant: true,
          receptionist: true,
          groomer: false
        },
        delete: {
          admin: true,
          manager: true,
          veterinarian: false,
          vet_assistant: false,
          receptionist: false,
          groomer: false
        }
      }
    },
    clientes: {
      title: 'Clientes',
      icon: <Users size={20} />,
      permissions: {
        view: {
          admin: true,
          manager: true,
          veterinarian: true,
          vet_assistant: true,
          receptionist: true,
          groomer: true
        },
        create: {
          admin: true,
          manager: true,
          veterinarian: true,
          vet_assistant: true,
          receptionist: true,
          groomer: false
        },
        edit: {
          admin: true,
          manager: true,
          veterinarian: true,
          vet_assistant: false,
          receptionist: true,
          groomer: false
        },
        delete: {
          admin: true,
          manager: true,
          veterinarian: false,
          vet_assistant: false,
          receptionist: false,
          groomer: false
        }
      }
    },
    oportunidades: {
      title: 'Oportunidades',
      icon: <UserPlus size={20} />,
      permissions: {
        view: {
          admin: true,
          manager: true,
          veterinarian: false,
          vet_assistant: false,
          receptionist: true,
          groomer: false
        },
        create: {
          admin: true,
          manager: true,
          veterinarian: false,
          vet_assistant: false,
          receptionist: true,
          groomer: false
        },
        edit: {
          admin: true,
          manager: true,
          veterinarian: false,
          vet_assistant: false,
          receptionist: true,
          groomer: false
        }
      }
    },
    consultorio: {
      title: 'Consultorio',
      icon: <Pill size={20} />,
      permissions: {
        view: {
          admin: true,
          manager: true,
          veterinarian: true,
          vet_assistant: true,
          receptionist: false,
          groomer: false
        },
        create: {
          admin: true,
          manager: true,
          veterinarian: true,
          vet_assistant: false,
          receptionist: false,
          groomer: false
        },
        edit: {
          admin: true,
          manager: true,
          veterinarian: true,
          vet_assistant: false,
          receptionist: false,
          groomer: false
        }
      }
    },
    peluqueria: {
      title: 'Peluquería',
      icon: <Scissors size={20} />,
      permissions: {
        view: {
          admin: true,
          manager: true,
          veterinarian: true,
          vet_assistant: true,
          receptionist: true,
          groomer: true
        },
        create: {
          admin: true,
          manager: true,
          veterinarian: false,
          vet_assistant: false,
          receptionist: true,
          groomer: true
        },
        edit: {
          admin: true,
          manager: true,
          veterinarian: false,
          vet_assistant: false,
          receptionist: true,
          groomer: true
        }
      }
    },
    tienda: {
      title: 'Tienda',
      icon: <ShoppingBag size={20} />,
      permissions: {
        view: {
          admin: true,
          manager: true,
          veterinarian: true,
          vet_assistant: true,
          receptionist: true,
          groomer: false
        },
        create: {
          admin: true,
          manager: true,
          veterinarian: false,
          vet_assistant: false,
          receptionist: true,
          groomer: false
        },
        edit: {
          admin: true,
          manager: true,
          veterinarian: false,
          vet_assistant: false,
          receptionist: true,
          groomer: false
        }
      }
    },
    ventas: {
      title: 'Ventas',
      icon: <DollarSign size={20} />,
      permissions: {
        view: {
          admin: true,
          manager: true,
          veterinarian: false,
          vet_assistant: false,
          receptionist: true,
          groomer: false
        },
        create: {
          admin: true,
          manager: true,
          veterinarian: false,
          vet_assistant: false,
          receptionist: true,
          groomer: false
        }
      }
    },
    compras: {
      title: 'Compras',
      icon: <ShoppingBag size={20} />,
      permissions: {
        view: {
          admin: true,
          manager: true,
          veterinarian: false,
          vet_assistant: false,
          receptionist: false,
          groomer: false
        },
        create: {
          admin: true,
          manager: true,
          veterinarian: false,
          vet_assistant: false,
          receptionist: false,
          groomer: false
        }
      }
    },
    marketing: {
      title: 'Marketing',
      icon: <Globe size={20} />,
      permissions: {
        view: {
          admin: true,
          manager: true,
          veterinarian: false,
          vet_assistant: false,
          receptionist: false,
          groomer: false
        },
        edit: {
          admin: true,
          manager: true,
          veterinarian: false,
          vet_assistant: false,
          receptionist: false,
          groomer: false
        }
      }
    },
    rrhh: {
      title: 'RRHH',
      icon: <Users size={20} />,
      permissions: {
        view: {
          admin: true,
          manager: true,
          veterinarian: true,
          vet_assistant: true,
          receptionist: true,
          groomer: true
        },
        edit: {
          admin: true,
          manager: true,
          veterinarian: false,
          vet_assistant: false,
          receptionist: false,
          groomer: false
        }
      }
    },
    erp: {
      title: 'ERP',
      icon: <FileText size={20} />,
      permissions: {
        view: {
          admin: true,
          manager: true,
          veterinarian: false,
          vet_assistant: false,
          receptionist: false,
          groomer: false
        },
        edit: {
          admin: true,
          manager: true,
          veterinarian: false,
          vet_assistant: false,
          receptionist: false,
          groomer: false
        }
      }
    },
    informes: {
      title: 'Informes',
      icon: <BarChart2 size={20} />,
      permissions: {
        view: {
          admin: true,
          manager: true,
          veterinarian: true,
          vet_assistant: false,
          receptionist: false,
          groomer: false
        }
      }
    },
    administracion: {
      title: 'Administración',
      icon: <Settings size={20} />,
      permissions: {
        view: {
          admin: true,
          manager: true,
          veterinarian: false,
          vet_assistant: false,
          receptionist: false,
          groomer: false
        },
        edit: {
          admin: true,
          manager: false,
          veterinarian: false,
          vet_assistant: false,
          receptionist: false,
          groomer: false
        }
      }
    }
  });

  const handleCompanyDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePermissionChange = (module: string, permission: string, role: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        permissions: {
          ...prev[module].permissions,
          [permission]: {
            ...prev[module].permissions[permission],
            [role]: value
          }
        }
      }
    }));
  };

  const handleSaveConfiguration = () => {
    // Aquí se guardarían los cambios en la base de datos
    console.log('Guardando configuración de la empresa:', companyData);
    console.log('Guardando configuración de permisos:', permissions);
    
    // Mostrar mensaje de éxito
    alert('Configuración guardada correctamente');
  };

  const handleAddRole = () => {
    const newRoleId = `role_${Date.now()}`;
    setRoles(prev => [
      ...prev,
      {
        id: newRoleId,
        name: 'Nuevo Rol',
        description: 'Descripción del nuevo rol',
        isEditable: true
      }
    ]);

    // Añadir el nuevo rol a todos los permisos
    const updatedPermissions = { ...permissions };
    Object.keys(updatedPermissions).forEach(module => {
      Object.keys(updatedPermissions[module].permissions).forEach(permission => {
        updatedPermissions[module].permissions[permission][newRoleId] = false;
      });
    });
    
    setPermissions(updatedPermissions);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de la configuración de la empresa y permisos de usuarios
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Save size={18} />}
          onClick={handleSaveConfiguration}
        >
          Guardar Cambios
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('empresa')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'empresa'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Datos de la Empresa
          </button>
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'usuarios'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Tipos de Usuarios
          </button>
          <button
            onClick={() => setActiveTab('permisos')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'permisos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Permisos de Acceso
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'empresa' && (
        <div className="space-y-6">
          <Card title="Información General" icon={<Building2 size={20} />}>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Razón Social"
                  name="businessName"
                  value={companyData.businessName}
                  onChange={handleCompanyDataChange}
                  required
                />
                <Input
                  label="Nombre Comercial"
                  name="tradeName"
                  value={companyData.tradeName}
                  onChange={handleCompanyDataChange}
                  required
                />
                <Input
                  label="CIF"
                  name="cif"
                  value={companyData.cif}
                  onChange={handleCompanyDataChange}
                  required
                />
                <Input
                  label="Representante Legal"
                  name="legalRepresentative"
                  value={companyData.legalRepresentative}
                  onChange={handleCompanyDataChange}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo de la Empresa
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Subir un archivo</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">o arrastrar y soltar</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                    </div>
                  </div>
                </div>
                <Input
                  label="Datos de Registro Mercantil"
                  name="registrationData"
                  value={companyData.registrationData}
                  onChange={handleCompanyDataChange}
                />
              </div>
            </div>
          </Card>

          <Card title="Información de Contacto" icon={<Phone size={20} />}>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Dirección"
                  name="address"
                  value={companyData.address}
                  onChange={handleCompanyDataChange}
                  icon={<MapPin size={18} />}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Código Postal"
                    name="postalCode"
                    value={companyData.postalCode}
                    onChange={handleCompanyDataChange}
                    required
                  />
                  <Input
                    label="Ciudad"
                    name="city"
                    value={companyData.city}
                    onChange={handleCompanyDataChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Provincia"
                    name="province"
                    value={companyData.province}
                    onChange={handleCompanyDataChange}
                    required
                  />
                  <Input
                    label="País"
                    name="country"
                    value={companyData.country}
                    onChange={handleCompanyDataChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Input
                  label="Teléfono"
                  name="phone"
                  value={companyData.phone}
                  onChange={handleCompanyDataChange}
                  icon={<Phone size={18} />}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={companyData.email}
                  onChange={handleCompanyDataChange}
                  icon={<Mail size={18} />}
                  required
                />
                <Input
                  label="Sitio Web"
                  name="website"
                  value={companyData.website}
                  onChange={handleCompanyDataChange}
                  icon={<Globe size={18} />}
                />
              </div>
            </div>
          </Card>

          <Card title="Información Fiscal y Bancaria" icon={<CreditCard size={20} />}>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="Número de Cuenta Bancaria (IBAN)"
                  name="bankAccount"
                  value={companyData.bankAccount}
                  onChange={handleCompanyDataChange}
                  icon={<CreditCard size={18} />}
                />
                <Input
                  label="Número de IVA"
                  name="vatNumber"
                  value={companyData.vatNumber}
                  onChange={handleCompanyDataChange}
                  icon={<FileText size={18} />}
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'usuarios' && (
        <div className="space-y-6">
          <Card title="Tipos de Usuarios" icon={<Users size={20} />}>
            <div className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Roles del Sistema</h3>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<UserPlus size={16} />}
                  onClick={handleAddRole}
                >
                  Añadir Rol
                </Button>
              </div>
              
              <div className="space-y-4">
                {roles.map(role => (
                  <div key={role.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <Shield size={18} className="text-blue-600 mr-2" />
                          <h4 className="text-lg font-medium text-gray-900">
                            {role.isEditable ? (
                              <Input
                                value={role.name}
                                onChange={(e) => {
                                  const updatedRoles = roles.map(r => 
                                    r.id === role.id ? { ...r, name: e.target.value } : r
                                  );
                                  setRoles(updatedRoles);
                                }}
                                className="border-none p-0 font-medium text-lg"
                              />
                            ) : (
                              role.name
                            )}
                          </h4>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {role.isEditable ? (
                            <Input
                              value={role.description}
                              onChange={(e) => {
                                const updatedRoles = roles.map(r => 
                                  r.id === role.id ? { ...r, description: e.target.value } : r
                                );
                                setRoles(updatedRoles);
                              }}
                              className="border-none p-0 text-sm text-gray-500"
                            />
                          ) : (
                            role.description
                          )}
                        </p>
                      </div>
                      {role.isEditable && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updatedRoles = roles.filter(r => r.id !== role.id);
                            setRoles(updatedRoles);
                          }}
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'permisos' && (
        <div className="space-y-6">
          <Card title="Permisos de Acceso" icon={<Lock size={20} />}>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Módulo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Permiso
                      </th>
                      {roles.map(role => (
                        <th key={role.id} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {role.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(permissions).map(([moduleKey, moduleData]) => {
                      const permissionEntries = Object.entries(moduleData.permissions);
                      return permissionEntries.map(([permissionKey, permissionData], permIndex) => (
                        <tr key={`${moduleKey}-${permissionKey}`} className={permIndex === 0 ? 'bg-gray-50' : ''}>
                          {permIndex === 0 ? (
                            <td className="px-6 py-4 whitespace-nowrap" rowSpan={permissionEntries.length}>
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  {moduleData.icon}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{moduleData.title}</div>
                                </div>
                              </div>
                            </td>
                          ) : null}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 capitalize">
                              {permissionKey === 'view' ? 'Ver' : 
                               permissionKey === 'create' ? 'Crear' : 
                               permissionKey === 'edit' ? 'Editar' : 
                               permissionKey === 'delete' ? 'Eliminar' : 
                               permissionKey === 'reply' ? 'Responder' : permissionKey}
                            </div>
                          </td>
                          {roles.map(role => (
                            <td key={`${moduleKey}-${permissionKey}-${role.id}`} className="px-6 py-4 whitespace-nowrap text-center">
                              <label className="inline-flex items-center">
                                <input
                                  type="checkbox"
                                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                  checked={permissionData[role.id] || false}
                                  onChange={(e) => handlePermissionChange(moduleKey, permissionKey, role.id, e.target.checked)}
                                  disabled={role.id === 'admin'} // El administrador siempre tiene todos los permisos
                                />
                              </label>
                            </td>
                          ))}
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Configuracion;