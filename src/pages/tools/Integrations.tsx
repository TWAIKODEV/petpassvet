
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  RefreshCw, 
  FileText, 
  Eye, 
  Printer, 
  X, 
  Plus, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Check, 
  AlertTriangle,
  FileCheck,
  MessageSquare,
  Users,
  Edit,
  Trash,
  Database,
  Cloud,
  Shield,
  Zap,
  Settings,
  CheckCircle,
  ExternalLink,
  Key,
  Plug
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

// Componente Switch personalizado
const Switch = ({ checked, onChange }: { checked: boolean, onChange: (checked: boolean) => void }) => {
  return (
    <button
      type="button"
      className={`${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`${
          checked ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
};

// Componente Label personalizado
const Label = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className}`}>
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
    <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
      {React.Children.map(children, child => 
        React.cloneElement(child as React.ReactElement, { activeTab, setActiveTab })
      )}
    </div>
  );
};

const TabsTrigger = ({ children, value, activeTab, setActiveTab }: any) => {
  return (
    <button
      className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        activeTab === value 
          ? 'bg-white text-gray-900 shadow-sm' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, value, activeTab }: any) => {
  if (activeTab !== value) return null;
  return <div className="mt-4">{children}</div>;
};

export default function Integrations() {
  const [integrations, setIntegrations] = useState([
    {
      id: "sendgrid",
      name: "SendGrid",
      description: "Servicio de email marketing y transaccional",
      category: "email",
      icon: Mail,
      color: "bg-blue-500",
      status: "connected",
      config: {
        apiKey: "SG.*********************",
        fromEmail: "noreply@sagardoy.com",
        verified: true,
      },
    },
    {
      id: "twilio",
      name: "Twilio",
      description: "SMS y comunicaciones por teléfono",
      category: "communication",
      icon: MessageSquare,
      color: "bg-red-500",
      status: "disconnected",
      config: {
        accountSid: "",
        authToken: "",
        phoneNumber: "",
      },
    },
    {
      id: "google-calendar",
      name: "Google Calendar",
      description: "Sincronización de eventos y calendarios",
      category: "productivity",
      icon: Calendar,
      color: "bg-green-500",
      status: "connected",
      config: {
        clientId: "*********************",
        synced: true,
        lastSync: "Hace 5 minutos",
      },
    },
    {
      id: "google-drive",
      name: "Google Drive",
      description: "Almacenamiento en la nube para documentos",
      category: "storage",
      icon: Cloud,
      color: "bg-yellow-500",
      status: "pending",
      config: {
        folderId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
        permissions: "read-write",
      },
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Procesamiento de pagos online",
      category: "payments",
      icon: Shield,
      color: "bg-purple-500",
      status: "disconnected",
      config: {
        publishableKey: "",
        webhookEndpoint: "",
      },
    },
    {
      id: "zapier",
      name: "Zapier",
      description: "Automatización de flujos de trabajo",
      category: "automation",
      icon: Zap,
      color: "bg-orange-500",
      status: "connected",
      config: {
        webhooks: 3,
        activeZaps: 12,
      },
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Conectado</Badge>;
      case "disconnected":
        return <Badge className="bg-red-100 text-red-800">Desconectado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "disconnected":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "pending":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const categories = [
    { id: "all", name: "Todas", count: integrations.length },
    {
      id: "email",
      name: "Email",
      count: integrations.filter((i) => i.category === "email").length,
    },
    {
      id: "communication",
      name: "Comunicación",
      count: integrations.filter((i) => i.category === "communication").length,
    },
    {
      id: "productivity",
      name: "Productividad",
      count: integrations.filter((i) => i.category === "productivity").length,
    },
    {
      id: "storage",
      name: "Almacenamiento",
      count: integrations.filter((i) => i.category === "storage").length,
    },
    {
      id: "payments",
      name: "Pagos",
      count: integrations.filter((i) => i.category === "payments").length,
    },
    {
      id: "automation",
      name: "Automatización",
      count: integrations.filter((i) => i.category === "automation").length,
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIntegration, setSelectedIntegration] = useState(integrations[0]);

  const filteredIntegrations =
    selectedCategory === "all"
      ? integrations
      : integrations.filter((integration) => integration.category === selectedCategory);

  const connectIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? { ...integration, status: "connected" }
          : integration,
      ),
    );
  };

  const disconnectIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? { ...integration, status: "disconnected" }
          : integration,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Integraciones</h1>
            <p className="text-gray-600 mt-1">
              Conecta y configura servicios externos para ampliar la funcionalidad del sistema
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plug className="w-4 h-4 mr-2" />
            Explorar Integraciones
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conectadas</p>
                <p className="text-2xl font-bold">
                  {integrations.filter((i) => i.status === "connected").length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold">
                  {integrations.filter((i) => i.status === "pending").length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Desconectadas</p>
                <p className="text-2xl font-bold">
                  {integrations.filter((i) => i.status === "disconnected").length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center">
              <Database className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{integrations.length}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Categorías</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <span>{category.name}</span>
                    <Badge
                      variant="outline"
                      className={
                        selectedCategory === category.id
                          ? "bg-white text-blue-600"
                          : ""
                      }
                    >
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Integrations List */}
          <div className="lg:col-span-5">
            <Card className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Integraciones Disponibles</h3>
                <p className="text-gray-600 text-sm">
                  {selectedCategory === "all"
                    ? "Todas las integraciones"
                    : `Categoría: ${categories.find((c) => c.id === selectedCategory)?.name}`}
                </p>
              </div>
              <div className="space-y-4">
                {filteredIntegrations.map((integration) => {
                  const IconComponent = integration.icon;
                  return (
                    <div
                      key={integration.id}
                      onClick={() => setSelectedIntegration(integration)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedIntegration.id === integration.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 ${integration.color} text-white rounded-lg flex items-center justify-center`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">{integration.name}</h4>
                            <p className="text-sm text-gray-600">
                              {integration.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(integration.status)}
                          {getStatusBadge(integration.status)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Integration Details */}
          <div className="lg:col-span-4">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div
                  className={`w-12 h-12 ${selectedIntegration.color} text-white rounded-lg flex items-center justify-center`}
                >
                  <selectedIntegration.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedIntegration.name}</h3>
                  <p className="text-gray-600 text-sm">{selectedIntegration.description}</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="font-medium">Estado:</span>
                  {getStatusBadge(selectedIntegration.status)}
                </div>

                {/* Configuration */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Configuración
                  </h4>

                  {Object.entries(selectedIntegration.config).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label className="capitalize">
                        {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                      </Label>
                      {key.includes("Key") || key.includes("Token") ? (
                        <div className="flex items-center space-x-2">
                          <Key className="w-4 h-4 text-gray-400" />
                          <Input
                            type="password"
                            value={value as string}
                            placeholder={`Ingresa tu ${key}`}
                            readOnly
                          />
                        </div>
                      ) : (
                        <Input value={value as string} readOnly />
                      )}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t">
                  {selectedIntegration.status === "connected" ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => disconnectIntegration(selectedIntegration.id)}
                      >
                        Desconectar
                      </Button>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => connectIntegration(selectedIntegration.id)}
                    >
                      <Plug className="w-4 h-4 mr-2" />
                      Conectar
                    </Button>
                  )}

                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Documentación
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
