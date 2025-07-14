import { useState } from "react";
import MainSidebar from "@/components/school/main-sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  BarChart3,
} from "lucide-react";

export default function ToolsLogsPage() {
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
      details: "Creó nuevo usuario: Carlos Ruiz (Profesor)",
      category: "user_management",
      severity: "info",
    },
    {
      id: 3,
      timestamp: "2024-01-15 10:30:12",
      user: "Miguel Santos",
      action: "ROLE_MODIFIED",
      details: "Modificó permisos del rol 'Coordinador'",
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

  // Datos de ejemplo para logs de profesores
  const teacherLogs = [
    {
      id: 1,
      timestamp: "2024-01-15 08:30:15",
      user: "Prof. Carlos Ruiz",
      action: "LOGIN",
      details: "Acceso al portal de profesores",
      category: "authentication",
      severity: "info",
    },
    {
      id: 2,
      timestamp: "2024-01-15 08:45:22",
      user: "Prof. Carlos Ruiz",
      action: "COURSE_ACCESS",
      details: "Accedió al curso 'Marketing Digital Avanzado'",
      category: "course_management",
      severity: "info",
    },
    {
      id: 3,
      timestamp: "2024-01-15 09:15:44",
      user: "Prof. María López",
      action: "GRADE_UPDATED",
      details: "Actualizó calificaciones del examen final - 23 estudiantes",
      category: "grading",
      severity: "info",
    },
    {
      id: 4,
      timestamp: "2024-01-15 10:20:33",
      user: "Prof. Carlos Ruiz",
      action: "MATERIAL_UPLOADED",
      details: "Subió material: 'Presentación Tema 5.pdf'",
      category: "content_management",
      severity: "info",
    },
  ];

  // Datos de ejemplo para logs detallados de estudiantes
  const studentLogs = [
    {
      id: 1,
      timestamp: "2024-01-15 07:45:12",
      user: "Laura Fernández",
      action: "LOGIN",
      details: "Acceso al campus virtual desde móvil",
      category: "authentication",
      severity: "info",
    },
    {
      id: 2,
      timestamp: "2024-01-15 08:00:33",
      user: "Laura Fernández",
      action: "COURSE_ACCESS",
      details: "Accedió al curso 'MBA Executive - Módulo 3'",
      category: "course_access",
      severity: "info",
    },
    {
      id: 3,
      timestamp: "2024-01-15 08:05:44",
      user: "Laura Fernández",
      action: "LESSON_START",
      details: "Inició lección: 'Estrategias de Liderazgo'",
      category: "lesson_activity",
      severity: "info",
    },
    {
      id: 4,
      timestamp: "2024-01-15 08:15:22",
      user: "Laura Fernández",
      action: "VIDEO_PLAY",
      details: "Reprodujo video: 'Introducción al Liderazgo' (00:15:30)",
      category: "video_activity",
      severity: "info",
    },
    {
      id: 5,
      timestamp: "2024-01-15 08:45:12",
      user: "Laura Fernández",
      action: "VIDEO_COMPLETE",
      details: "Completó video: 'Introducción al Liderazgo' (100%)",
      category: "video_activity",
      severity: "success",
    },
    {
      id: 6,
      timestamp: "2024-01-15 09:00:55",
      user: "Pedro Morales",
      action: "EXAM_START",
      details: "Inició examen: 'Evaluación Módulo 3' (60 minutos)",
      category: "exam_activity",
      severity: "info",
    },
    {
      id: 7,
      timestamp: "2024-01-15 09:45:33",
      user: "Pedro Morales",
      action: "EXAM_SUBMIT",
      details: "Entregó examen: 'Evaluación Módulo 3' (Calificación: 8.5/10)",
      category: "exam_activity",
      severity: "success",
    },
    {
      id: 8,
      timestamp: "2024-01-15 10:15:44",
      user: "Carmen Silva",
      action: "CERTIFICATE_ISSUED",
      details:
        "Certificado emitido: 'Finalización Módulo 2 - Marketing Digital'",
      category: "certification",
      severity: "success",
    },
    {
      id: 9,
      timestamp: "2024-01-15 11:30:22",
      user: "Roberto García",
      action: "TEAMS_JOIN",
      details:
        "Se unió a sesión de Teams: 'Clase Magistral - Finanzas Corporativas'",
      category: "video_conference",
      severity: "info",
    },
    {
      id: 10,
      timestamp: "2024-01-15 12:30:15",
      user: "Roberto García",
      action: "TEAMS_LEAVE",
      details: "Salió de sesión de Teams (Duración: 60 minutos)",
      category: "video_conference",
      severity: "info",
    },
    {
      id: 11,
      timestamp: "2024-01-15 14:15:33",
      user: "Ana Ruiz",
      action: "ATTENDANCE_MARKED",
      details: "Asistencia confirmada: 'Seminario de Casos Prácticos'",
      category: "attendance",
      severity: "success",
    },
    {
      id: 12,
      timestamp: "2024-01-15 16:45:22",
      user: "Laura Fernández",
      action: "LOGOUT",
      details: "Sesión cerrada (Tiempo activo: 8h 59m)",
      category: "authentication",
      severity: "info",
    },
  ];

  const getActivityIcon = (category: string) => {
    switch (category) {
      case "authentication":
        return <UserCheck className="w-4 h-4" />;
      case "course_access":
        return <BookOpen className="w-4 h-4" />;
      case "lesson_activity":
        return <GraduationCap className="w-4 h-4" />;
      case "video_activity":
        return <Video className="w-4 h-4" />;
      case "exam_activity":
        return <FileText className="w-4 h-4" />;
      case "certification":
        return <Award className="w-4 h-4" />;
      case "video_conference":
        return <Video className="w-4 h-4" />;
      case "attendance":
        return <CheckCircle className="w-4 h-4" />;
      case "user_management":
        return <Users className="w-4 h-4" />;
      case "role_management":
        return <Shield className="w-4 h-4" />;
      case "system":
        return <Activity className="w-4 h-4" />;
      case "course_management":
        return <BookOpen className="w-4 h-4" />;
      case "grading":
        return <Award className="w-4 h-4" />;
      case "content_management":
        return <FileText className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Éxito</Badge>;
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Advertencia</Badge>
        );
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
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          {title}
        </CardTitle>
        <CardDescription>
          Últimas {logs.length} actividades registradas
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <MainSidebar currentView="tools" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Sistema de Logs
              </h1>
              <p className="text-gray-600 mt-1">
                Seguimiento completo de actividades de usuarios, cursos y
                sistema
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button className="bg-[#8B1538] hover:bg-[#6B0F2A]">
                <Filter className="w-4 h-4 mr-2" />
                Filtros Avanzados
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Activity className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Actividades
                    </p>
                    <p className="text-2xl font-bold">2,847</p>
                    <p className="text-xs text-green-600">+12% hoy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Usuarios Activos
                    </p>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-xs text-green-600">89% del total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <GraduationCap className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Accesos a Cursos
                    </p>
                    <p className="text-2xl font-bold">1,234</p>
                    <p className="text-xs text-blue-600">Promedio: 87/día</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Award className="w-8 h-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Certificados
                    </p>
                    <p className="text-2xl font-bold">23</p>
                    <p className="text-xs text-green-600">+3 esta semana</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
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
                  <Select
                    value={selectedUserType}
                    onValueChange={setSelectedUserType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los usuarios" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los usuarios</SelectItem>
                      <SelectItem value="management">Gestión</SelectItem>
                      <SelectItem value="teachers">Profesores</SelectItem>
                      <SelectItem value="students">Estudiantes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Rango de Fecha</Label>
                  <Select
                    value={selectedDateRange}
                    onValueChange={setSelectedDateRange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Hoy</SelectItem>
                      <SelectItem value="week">Esta semana</SelectItem>
                      <SelectItem value="month">Este mes</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full bg-[#8B1538] hover:bg-[#6B0F2A]">
                    <Filter className="w-4 h-4 mr-2" />
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs Tabs */}
          <Tabs defaultValue="students" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="students" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Estudiantes
                <Badge className="bg-blue-100 text-blue-800 ml-1">
                  {studentLogs.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="teachers" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Profesores
                <Badge className="bg-green-100 text-green-800 ml-1">
                  {teacherLogs.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="management"
                className="flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Gestión
                <Badge className="bg-red-100 text-red-800 ml-1">
                  {managementLogs.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="space-y-6">
              <LogTable
                logs={studentLogs}
                title="Logs de Estudiantes - Actividad Detallada"
              />
            </TabsContent>

            <TabsContent value="teachers" className="space-y-6">
              <LogTable
                logs={teacherLogs}
                title="Logs de Profesores - Gestión de Cursos"
              />
            </TabsContent>

            <TabsContent value="management" className="space-y-6">
              <LogTable
                logs={managementLogs}
                title="Logs de Gestión - Administración del Sistema"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
