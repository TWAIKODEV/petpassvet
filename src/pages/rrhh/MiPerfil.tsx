import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign,
  FileText,
  Shield,
  Activity,
  Pill,
  Syringe,
  Scissors,
  Heart,
  AlertTriangle,
  Download,
  Printer,
  Edit,
  Plus,
  BarChart2,
  CheckCircle,
  LogIn,
  LogOut,
  Upload,
  Camera,
  Save,
  X,
  Eye,
  ArrowRight,
  CalendarDays,
  Building2,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  BookOpen
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';

const MiPerfil: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'personal' | 'laboral' | 'formacion' | 'documentos'>('personal');
  const [isUploading, setIsUploading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state for edit modal
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    contractType: '',
    workingHours: '',
    location: '',
    startDate: ''
  });
  
  // Mock data for the employee profile
  const employeeData = {
    personal: {
      name: user?.name || 'Dr. Alejandro Ramírez',
      email: user?.email || 'alejandro.ramirez@clinica.com',
      phone: '+34 666 777 888',
      address: 'Calle Principal 123, Madrid',
      birthDate: '1985-06-15',
      dni: '12345678A',
      socialSecurity: '123456789012',
      nationality: 'Española',
      maritalStatus: 'Casado/a',
      children: 2,
      emergencyContact: {
        name: 'María Rodríguez',
        relationship: 'Cónyuge',
        phone: '+34 666 888 999'
      }
    },
    employment: {
      position: 'Veterinario Senior',
      department: 'Veterinaria',
      startDate: '2024-01-15',
      contractType: 'Indefinido',
      workingHours: 40,
      schedule: 'Lunes a Viernes, 9:00 - 17:00',
      location: 'Sede Central Madrid',
      manager: 'Dra. Carmen Jiménez',
      salary: {
        gross: 45000,
        net: 36450,
        paymentPeriods: 14
      },
      benefits: [
        'Seguro médico privado',
        'Plan de pensiones',
        'Formación continua',
        'Descuentos en servicios'
      ],
      vacationDays: {
        total: 23,
        used: 5,
        pending: 18
      }
    },
    education: {
      degrees: [
        {
          title: 'Licenciatura en Veterinaria',
          institution: 'Universidad Complutense de Madrid',
          year: '2010'
        },
        {
          title: 'Máster en Dermatología Veterinaria',
          institution: 'Universidad de Barcelona',
          year: '2012'
        }
      ],
      certifications: [
        {
          title: 'Especialista en Cirugía de Pequeños Animales',
          institution: 'Colegio Oficial de Veterinarios',
          year: '2015',
          expiration: '2025'
        },
        {
          title: 'Certificación en Ecografía Avanzada',
          institution: 'Instituto Veterinario Europeo',
          year: '2018',
          expiration: '2023'
        }
      ],
      languages: [
        { language: 'Español', level: 'Nativo' },
        { language: 'Inglés', level: 'C1' },
        { language: 'Francés', level: 'B1' }
      ],
      skills: [
        'Cirugía general',
        'Dermatología',
        'Diagnóstico por imagen',
        'Medicina interna',
        'Gestión de equipos'
      ]
    },
    documents: [
      {
        name: 'Contrato laboral',
        type: 'PDF',
        date: '2024-01-15',
        size: '1.2 MB'
      },
      {
        name: 'Título universitario',
        type: 'PDF',
        date: '2010-06-30',
        size: '2.5 MB'
      },
      {
        name: 'Certificado de colegiación',
        type: 'PDF',
        date: '2010-09-15',
        size: '0.8 MB'
      },
      {
        name: 'Última nómina',
        type: 'PDF',
        date: '2025-05-30',
        size: '0.5 MB'
      }
    ],
    payrolls: [
      {
        id: '1',
        period: 'Mayo 2025',
        date: '2025-05-30',
        amount: 3037.50,
        status: 'paid'
      },
      {
        id: '2',
        period: 'Abril 2025',
        date: '2025-04-30',
        amount: 3037.50,
        status: 'paid'
      },
      {
        id: '3',
        period: 'Marzo 2025',
        date: '2025-03-30',
        amount: 3037.50,
        status: 'paid'
      }
    ],
    attendance: {
      today: {
        date: new Date().toISOString().split('T')[0],
        checkIn: '09:05:23',
        checkOut: null,
        status: 'in'
      },
      yesterday: {
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        checkIn: '09:02:45',
        checkOut: '17:05:12',
        status: 'complete'
      },
      weekSummary: {
        hoursWorked: 32,
        daysPresent: 4,
        averageCheckIn: '09:03',
        averageCheckOut: '17:04'
      }
    }
  };

  // Format time as HH:MM:SS
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Current time state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Initialize form data when modal opens
  useEffect(() => {
    if (showEditModal) {
      setFormData({
        name: employeeData.personal.name,
        position: employeeData.employment.position,
        email: employeeData.personal.email,
        phone: employeeData.personal.phone,
        address: employeeData.personal.address,
        birthDate: new Date(employeeData.personal.birthDate).toISOString().split('T')[0],
        contractType: employeeData.employment.contractType,
        workingHours: employeeData.employment.workingHours.toString(),
        location: employeeData.employment.location,
        startDate: new Date(employeeData.employment.startDate).toISOString().split('T')[0]
      });
    }
  }, [showEditModal]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false);
      // In a real app, you would upload the file to a server and update the avatar URL
      console.log('File uploaded:', file.name);
    }, 2000);
  };

  const handleModalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview URL for the selected image
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call to update profile
    console.log('Updating profile with data:', formData);
    console.log('New avatar:', avatarPreview);
    
    // Show loading state
    const loadingTimeout = setTimeout(() => {
      // Close modal and show success message
      setShowEditModal(false);
      setAvatarPreview(null);
      
      // In a real app, you would update the user data here
      alert('Perfil actualizado correctamente');
    }, 1500);
    
    return () => clearTimeout(loadingTimeout);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="mt-1 text-sm text-gray-500">
            Información personal y profesional
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={<Download size={18} />}
          >
            Exportar
          </Button>
          <Button
            variant="primary"
            icon={<Edit size={18} />}
            onClick={() => setShowEditModal(true)}
          >
            Editar Perfil
          </Button>
        </div>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
          <div className="flex-shrink-0 flex flex-col items-center">
            <div 
              className="relative h-32 w-32 rounded-full bg-red-500 flex items-center justify-center text-white text-4xl font-bold cursor-pointer group"
              onClick={handleAvatarClick}
            >
              {employeeData.personal.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
                <Camera size={32} className="text-white" />
              </div>
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">{employeeData.personal.name}</h2>
            <p className="text-sm text-gray-500">{employeeData.employment.position}</p>
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {employeeData.employment.department}
              </span>
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">{employeeData.personal.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">{employeeData.personal.phone}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">{employeeData.personal.address}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Fecha de nacimiento: {new Date(employeeData.personal.birthDate).toLocaleDateString('es-ES')}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Contrato: {employeeData.employment.contractType}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Jornada: {employeeData.employment.workingHours}h semanales</span>
              </div>
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Centro: {employeeData.employment.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Fecha de incorporación: {new Date(employeeData.employment.startDate).toLocaleDateString('es-ES')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mi Zona - Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Control Horario Card */}
        <Card title="Control Horario" icon={<Clock size={20} />}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-3xl font-bold text-gray-900">{formatTime(currentTime)}</div>
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">Estado actual</p>
                  {employeeData.attendance.today.status === 'in' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle size={12} className="mr-1" />
                      Trabajando
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Fuera
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Entrada</p>
                  <p className="text-sm font-medium text-gray-900">
                    {employeeData.attendance.today.checkIn || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Salida</p>
                  <p className="text-sm font-medium text-gray-900">
                    {employeeData.attendance.today.checkOut || '-'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="primary"
                icon={<LogIn size={16} />}
                disabled={employeeData.attendance.today.status === 'in'}
                fullWidth
              >
                Marcar Entrada
              </Button>
              <Button
                variant="outline"
                icon={<LogOut size={16} />}
                disabled={employeeData.attendance.today.status !== 'in'}
                fullWidth
              >
                Marcar Salida
              </Button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Resumen semanal</p>
                <p className="text-sm font-medium text-gray-900">
                  {employeeData.attendance.weekSummary.hoursWorked}h trabajadas
                </p>
              </div>
              <a 
                href="/rrhh/control-horario" 
                className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                Ver control de horario completo
                <ArrowRight size={16} className="ml-1" />
              </a>
            </div>
          </div>
        </Card>
        
        {/* Vacaciones Card */}
        <Card title="Vacaciones" icon={<CalendarDays size={20} />}>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {employeeData.employment.vacationDays.pending}
                </div>
                <p className="text-sm text-blue-600">Días disponibles</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-gray-600">
                  {employeeData.employment.vacationDays.used}
                </div>
                <p className="text-sm text-gray-600">Días usados</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Próximas ausencias</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Vacaciones de verano</p>
                    <p className="text-xs text-gray-500">15 Jul - 30 Jul</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle size={12} className="mr-1" />
                    Aprobada
                  </span>
                </div>
              </div>
            </div>
            
            <Button
              variant="primary"
              icon={<Calendar size={16} />}
              fullWidth
            >
              Solicitar días libres
            </Button>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <a 
                href="/rrhh/control-horario" 
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                Ver calendario de ausencias
                <ArrowRight size={16} className="ml-1" />
              </a>
            </div>
          </div>
        </Card>
        
        {/* Nóminas Card */}
        <Card title="Nóminas" icon={<FileText size={20} />}>
          <div className="p-6">
            <div className="space-y-3 mb-4">
              {employeeData.payrolls.slice(0, 3).map((payroll) => (
                <div key={payroll.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{payroll.period}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(payroll.date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900 mr-3">
                      {payroll.amount.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Download size={16} />}
                    >
                      PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <a 
                href="#" 
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                Ver todas las nóminas
                <ArrowRight size={16} className="ml-1" />
              </a>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('personal')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'personal'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Información Personal
          </button>
          <button
            onClick={() => setActiveTab('laboral')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'laboral'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Información Laboral
          </button>
          <button
            onClick={() => setActiveTab('formacion')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'formacion'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Formación y Habilidades
          </button>
          <button
            onClick={() => setActiveTab('documentos')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'documentos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Documentos
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'personal' && (
          <>
            <Card title="Datos Personales" icon={<User size={20} />}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Nombre Completo</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.personal.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.personal.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Teléfono</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.personal.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Dirección</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.personal.address}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">DNI/NIE</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.personal.dni}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Número Seguridad Social</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.personal.socialSecurity}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Fecha de Nacimiento</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(employeeData.personal.birthDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Nacionalidad</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.personal.nationality}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Información Familiar" icon={<User size={20} />}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Estado Civil</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.personal.maritalStatus}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Hijos</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.personal.children}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Contacto de Emergencia</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.personal.emergencyContact.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Relación</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.personal.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Teléfono de Emergencia</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.personal.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}

        {activeTab === 'laboral' && (
          <>
            <Card title="Información del Puesto" icon={<Briefcase size={20} />}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Puesto</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.employment.position}</p>
                  
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Departamento</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.employment.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Fecha de Incorporación</label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(employeeData.employment.startDate).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Tipo de Contrato</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.employment.contractType}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Jornada Laboral</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.employment.workingHours} horas semanales</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Horario</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.employment.schedule}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Centro de Trabajo</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.employment.location}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Responsable</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.employment.manager}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Información Salarial" icon={<DollarSign size={20} />}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Salario Bruto Anual</label>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {employeeData.employment.salary.gross.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Salario Neto Anual</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {employeeData.employment.salary.net.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Pagas</label>
                    <p className="mt-1 text-sm text-gray-900">{employeeData.employment.salary.paymentPeriods} pagas</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Beneficios</label>
                    <ul className="mt-1 text-sm text-gray-900 list-disc list-inside">
                      {employeeData.employment.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Vacaciones y Ausencias" icon={<CalendarDays size={20} />}>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600">{employeeData.employment.vacationDays.total}</div>
                    <p className="text-sm text-blue-600">Días totales</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-600">{employeeData.employment.vacationDays.used}</div>
                    <p className="text-sm text-green-600">Días disfrutados</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-purple-600">{employeeData.employment.vacationDays.pending}</div>
                    <p className="text-sm text-purple-600">Días pendientes</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="primary"
                    icon={<Calendar size={18} />}
                  >
                    Solicitar días libres
                  </Button>
                </div>
              </div>
            </Card>
          </>
        )}

        {activeTab === 'formacion' && (
          <>
            <Card title="Formación Académica" icon={<GraduationCap size={20} />}>
              <div className="p-6">
                <div className="space-y-6">
                  {employeeData.education.degrees.map((degree, index) => (
                    <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{degree.title}</h4>
                          <p className="mt-1 text-sm text-gray-500">{degree.institution}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {degree.year}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card title="Certificaciones" icon={<Award size={20} />}>
              <div className="p-6">
                <div className="space-y-6">
                  {employeeData.education.certifications.map((cert, index) => (
                    <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{cert.title}</h4>
                          <p className="mt-1 text-sm text-gray-500">{cert.institution}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {cert.year}
                          </span>
                          {cert.expiration && (
                            <p className="mt-1 text-xs text-gray-500">Válido hasta: {cert.expiration}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Idiomas" icon={<Globe size={20} />}>
                <div className="p-6">
                  <div className="space-y-4">
                    {employeeData.education.languages.map((lang, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-900">{lang.language}</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {lang.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <Card title="Habilidades" icon={<BookOpen size={20} />}>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {employeeData.education.skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'documentos' && (
          <>
            <Card title="Nóminas" icon={<DollarSign size={20} />}>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Período
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Importe
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
                      {employeeData.payrolls.map((payroll) => (
                        <tr key={payroll.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{payroll.period}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(payroll.date).toLocaleDateString('es-ES')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {payroll.amount.toLocaleString('es-ES', {
                                style: 'currency',
                                currency: 'EUR'
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle size={12} className="mr-1" />
                              Pagada
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center space-x-2 justify-end">
                              <button
                                className="text-blue-600 hover:text-blue-800"
                                title="Ver"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                className="text-gray-400 hover:text-gray-600"
                                title="Descargar"
                              >
                                <Download size={18} />
                              </button>
                              <button
                                className="text-gray-400 hover:text-gray-600"
                                title="Imprimir"
                              >
                                <Printer size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            <Card title="Documentos" icon={<FileText size={20} />}>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tamaño
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Acciones</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {employeeData.documents.map((doc, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {doc.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(doc.date).toLocaleDateString('es-ES')}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{doc.size}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center space-x-2 justify-end">
                              <button
                                className="text-blue-600 hover:text-blue-800"
                                title="Ver"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                className="text-gray-400 hover:text-gray-600"
                                title="Descargar"
                              >
                                <Download size={18} />
                              </button>
                              <button
                                className="text-gray-400 hover:text-gray-600"
                                title="Imprimir"
                              >
                                <Printer size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Editar Perfil
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setAvatarPreview(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <form onSubmit={handleSubmitForm}>
                <div className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center">
                    <div 
                      className="relative h-32 w-32 rounded-full bg-red-500 flex items-center justify-center text-white text-4xl font-bold cursor-pointer group overflow-hidden"
                      onClick={() => modalFileInputRef.current?.click()}
                    >
                      {avatarPreview ? (
                        <img 
                          src={avatarPreview} 
                          alt="Avatar preview" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        formData.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
                        <Camera size={32} className="text-white" />
                      </div>
                    </div>
                    <input 
                      type="file" 
                      ref={modalFileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleModalFileChange}
                    />
                    <p className="mt-2 text-sm text-gray-500">Haz clic para cambiar la foto</p>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Nombre Completo"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="Cargo"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="Teléfono"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="Dirección"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="md:col-span-2"
                      />
                      <Input
                        label="Fecha de Nacimiento"
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Employment Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Información Laboral</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Contrato
                        </label>
                        <select
                          name="contractType"
                          value={formData.contractType}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        >
                          <option value="Indefinido">Indefinido</option>
                          <option value="Temporal">Temporal</option>
                          <option value="Prácticas">Prácticas</option>
                          <option value="Formación">Formación</option>
                          <option value="Obra y Servicio">Obra y Servicio</option>
                        </select>
                      </div>
                      <Input
                        label="Jornada (horas semanales)"
                        type="number"
                        name="workingHours"
                        value={formData.workingHours}
                        onChange={handleInputChange}
                        min="1"
                        max="40"
                        required
                      />
                      <Input
                        label="Centro de Trabajo"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="Fecha de Incorporación"
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEditModal(false);
                      setAvatarPreview(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    icon={<Save size={18} />}
                  >
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiPerfil;