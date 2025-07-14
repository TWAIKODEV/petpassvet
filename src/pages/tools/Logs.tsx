
import React, { useState } from 'react';
import { 
  Activity,
  Users,
  GraduationCap,
  Shield,
  Clock,
  Calendar,
  Download,
  Filter,
  Search,
  Eye,
  Play,
  FileText,
  Award,
  UserCheck,
  Video,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  XCircle,
  BarChart3
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

// Componente Badge personalizado
const Badge = ({ children, className = "", variant = "default" }: { 
  children: React.ReactNode, 
  className?: string, 
  variant?: "default" | "outline" 
}) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variantClasses = variant === "outline" 
    ? "border border-gray-300 bg-white text-gray-700"
    : "bg-gray-100 text-gray-800";
  
  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};

// Componente Select personalizado
const Select = ({ children, value, onValueChange }: { 
  children: React.ReactNode, 
  value: string, 
  onValueChange: (value: string) => void 
}) => {
  return (
    <select
      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      {children}
    </select>
  );
};

const SelectOption = ({ value, children }: { value: string, children: React.ReactNode }) => {
  return <option value={value}>{children}</option>;
};

// Componente Label personalizado
const Label = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>
      {children}
    </label>
  );
};

// Componente Tabs personalizado
const Tabs = ({ children, defaultValue }: { children: React.ReactNode, defaultValue: string }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <div className="w-full">
      {React.Children.map(children, child => 
        React.cloneElement(child as React.ReactElement, { activeTab, setActiveTab })
      )}
    </div>
  );
};

const TabsList = ({ children, activeTab, setActiveTab }: any) => {
  return (
    <div className="grid w-full grid-cols-3 rounded-lg bg-gray-100 p-1">
      {React.Children.map(children, child => 
        React.cloneElement(child as React.ReactElement, { activeTab, setActiveTab })
      )}
    </div>
  );
};

const TabsTrigger = ({ children, value, activeTab, setActiveTab, className = "" }: any) => {
  return (
    <button
      className={`flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        activeTab === value 
          ? 'bg-white text-gray-900 shadow-sm' 
          : 'text-gray-500 hover:text-gray-700'
      } ${className}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value, activeTab }: any) => {
  if (activeTab !== value) return null;
  return <div className="mt-6 space-y-6">{children}</div>;
};

export default function Logs() {
  const [selectedDateRange, setSelectedDateRange] = useState("today");
  const [selectedUserType, setSelectedUserType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Datos de ejemplo para logs de gestión
  const managementLogs = [
    {
      id: 1,
      timestamp: "2024-01-15 09:15:23",
      user: "Ana García",
      action: "LOGIN",
      details: "Acceso al sistema desde IP 192.168.1.100",
      category: "authentication",
      severity: "info",
    },
    {
      id: 2,
      timestamp: "2024-01-15 09:20:45",
      user: "Ana García",
      action: "USER_CREATED",
      details: "Creó nuevo usuario: Carlos Ruiz (Empleado)",
      category: "user_management",
      severity: "info",
    },
    {
      id: 3,
      timestamp: "2024-01-15 10:30:12",
      user: "Miguel Santos",
      action: "ROLE_MODIFIED",
      details: "Modificó permisos del rol 'Administrador'",
      category: "role_management",
      severity: "warning",
    },
    {
      id: 4,
      timestamp: "2024-01-15 11:45:33",
      user: "Ana García",
      action: "SYSTEM_CONFIG",
      details: "Cambió configuración de notificaciones",
      category: "system",
      severity: "info",
    },
  ];

  // Datos de ejemplo para logs de veterinarios
  const veterinarianLogs = [
    {
      id: 1,
      timestamp: "2024-01-15 08:30:15",
      user: "Dr. Carlos Ruiz",
      action: "LOGIN",
      details: "Acceso al sistema veterinario",
      category: "authentication",
      severity: "info",
    },
    {
      id: 2,
      timestamp: "2024-01-15 08:45:22",
      user: "Dr. Carlos Ruiz",
      action: "PATIENT_ACCESS",
      details: "Accedió al historial de 'Max' (Golden Retriever)",
      category: "patient_management",
      severity: "info",
    },
    {
      id: 3,
      timestamp: "2024-01-15 09:15:44",
      user: "Dra. María López",
      action: "PRESCRIPTION_CREATED",
      details: "Creó receta para 'Luna' - Antibiótico + Antiinflamatorio",
      category: "prescription",
      severity: "info",
    },
    {
      id: 4,
      timestamp: "2024-01-15 10:20:33",
      user: "Dr. Carlos Ruiz",
      action: "TREATMENT_UPDATED",
      details: "Actualizó tratamiento de 'Rocky' - Seguimiento post-cirugía",
      category: "treatment_management",
      severity: "info",
    },
  ];

  // Datos de ejemplo para logs detallados de clientes
  const clientLogs = [
    {
      id: 1,
      timestamp: "2024-01-15 07:45:12",
      user: "Laura Fernández",
      action: "LOGIN",
      details: "Acceso al portal de clientes desde móvil",
      category: "authentication",
      severity: "info",
    },
    {
      id: 2,
      timestamp: "2024-01-15 08:00:33",
      user: "Laura Fernández",
      action: "APPOINTMENT_BOOKED",
      details: "Reservó cita para 'Max' - Consulta general (15/01 14:00)",
      category: "appointment",
      severity: "info",
    },
    {
      id: 3,
      timestamp: "2024-01-15 08:05:44",
      user: "Pedro Morales",
      action: "PAYMENT_MADE",
      details: "Pago realizado: €85.50 - Consulta + Vacuna",
      category: "payment",
      severity: "success",
    },
    {
      id: 4,
      timestamp: "2024-01-15 08:15:22",
      user: "Carmen Silva",
      action: "PRESCRIPTION_VIEWED",
      details: "Consultó receta de 'Luna' - Descarga PDF",
      category: "prescription_view",
      severity: "info",
    },
    {
      id: 5,
      timestamp: "2024-01-15 08:45:12",
      user: "Roberto García",
      action: "GROOMING_BOOKED",
      details: "Reservó sesión de peluquería para 'Bobby' (18/01 11:00)",
      category: "grooming",
      severity: "success",
    },
    {
      id: 6,
      timestamp: "2024-01-15 09:00:55",
      user: "Ana Ruiz",
      action: "MEDICAL_HISTORY_VIEWED",
      details: "Consultó historial médico completo de 'Milo'",
      category: "medical_history",
      severity: "info",
    },
    {
      id: 7,
      timestamp: "2024-01-15 09:45:33",
      user: "Miguel Torres",
      action: "APPOINTMENT_CANCELLED",
      details: "Canceló cita del 16/01 - Motivo: Emergencia familiar",
      category: "appointment",
      severity: "warning",
    },
    {
      id: 8,
      timestamp: "2024-01-15 10:15:44",
      user: "Laura Fernández",
      action: "LOGOUT",
      details: "Sesión cerrada (Tiempo activo: 2h 30m)",
      category: "authentication",
      severity: "info",
    },
  ];

  const getActivityIcon = (category: string) => {
    switch (category) {
      case "authentication":
        return <UserCheck className="w-4 h-4" />;
      case "patient_management":
        return <BookOpen className="w-4 h-4" />;
      case "appointment":
        return <Calendar className="w-4 h-4" />;
      case "prescription":
        return <FileText className="w-4 h-4" />;
      case "prescription_view":
        return <Eye className="w-4 h-4" />;
      case "payment":
        return <Award className="w-4 h-4" />;
      case "grooming":
        return <Activity className="w-4 h-4" />;
      case "medical_history":
        return <FileText className="w-4 h-4" />;
      case "user_management":
        return <Users className="w-4 h-4" />;
      case "role_management":
        return <Shield className="w-4 h-4" />;
      case "system":
        return <Activity className="w-4 h-4" />;
      case "treatment_management":
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Éxito</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Advertencia</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case "info":
      default:
        return <Badge className="bg-blue-100 text-blue-800">Info</Badge>;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "info":
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const LogTable = ({ logs, title }: { logs: any[]; title: string }) => (
    <Card>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Últimas {logs.length} actividades registradas
        </p>
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getSeverityIcon(log.severity)}
                  {getActivityIcon(log.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <p className="font-medium text-gray-900">{log.user}</p>
                    <Badge variant="outline" className="text-xs">
                      {log.action}
                    </Badge>
                    {getSeverityBadge(log.severity)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{log.details}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {log.timestamp}
                    </span>
                    <span className="capitalize">
                      {log.category.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sistema de Logs</h1>
            <p className="text-gray-600 mt-1">
              Seguimiento completo de actividades de usuarios, citas y sistema
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Filter className="w-4 h-4 mr-2" />
              Filtros Avanzados
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <Activity className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Actividades</p>
                  <p className="text-2xl font-bold">2,847</p>
                  <p className="text-xs text-green-600">+12% hoy</p>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-xs text-green-600">89% del total</p>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Citas Registradas</p>
                  <p className="text-2xl font-bold">234</p>
                  <p className="text-xs text-blue-600">Promedio: 87/día</p>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Recetas</p>
                  <p className="text-2xl font-bold">89</p>
                  <p className="text-xs text-green-600">+15 esta semana</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label>Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Usuario, acción o detalles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label>Tipo de Usuario</Label>
                <Select value={selectedUserType} onValueChange={setSelectedUserType}>
                  <SelectOption value="all">Todos los usuarios</SelectOption>
                  <SelectOption value="management">Gestión</SelectOption>
                  <SelectOption value="veterinarians">Veterinarios</SelectOption>
                  <SelectOption value="clients">Clientes</SelectOption>
                </Select>
              </div>
              <div>
                <Label>Rango de Fecha</Label>
                <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                  <SelectOption value="today">Hoy</SelectOption>
                  <SelectOption value="week">Esta semana</SelectOption>
                  <SelectOption value="month">Este mes</SelectOption>
                  <SelectOption value="custom">Personalizado</SelectOption>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Filter className="w-4 h-4 mr-2" />
                  Aplicar Filtros
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Logs Tabs */}
        <Tabs defaultValue="clients">
          <TabsList>
            <TabsTrigger value="clients">
              <Users className="w-4 h-4" />
              Clientes
              <Badge className="bg-blue-100 text-blue-800 ml-1">
                {clientLogs.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="veterinarians">
              <GraduationCap className="w-4 h-4" />
              Veterinarios
              <Badge className="bg-green-100 text-green-800 ml-1">
                {veterinarianLogs.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="management">
              <Shield className="w-4 h-4" />
              Gestión
              <Badge className="bg-red-100 text-red-800 ml-1">
                {managementLogs.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <LogTable
              logs={clientLogs}
              title="Logs de Clientes - Actividad Detallada"
            />
          </TabsContent>

          <TabsContent value="veterinarians">
            <LogTable
              logs={veterinarianLogs}
              title="Logs de Veterinarios - Gestión de Pacientes"
            />
          </TabsContent>

          <TabsContent value="management">
            <LogTable
              logs={managementLogs}
              title="Logs de Gestión - Administración del Sistema"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
