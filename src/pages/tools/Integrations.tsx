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
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  Database,
  Mail,
  MessageSquare,
  Calendar,
  Cloud,
  Shield,
  Zap,
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Key,
  Plug,
} from "lucide-react";

export default function ToolsIntegrationsPage() {
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
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "disconnected":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
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
  const [selectedIntegration, setSelectedIntegration] = useState(
    integrations[0],
  );

  const filteredIntegrations =
    selectedCategory === "all"
      ? integrations
      : integrations.filter(
          (integration) => integration.category === selectedCategory,
        );

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
    <div className="flex h-screen bg-gray-50">
      <MainSidebar currentView="tools" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Integraciones
              </h1>
              <p className="text-gray-600 mt-1">
                Conecta y configura servicios externos para ampliar la
                funcionalidad del sistema
              </p>
            </div>
            <Button className="bg-[#8B1538] hover:bg-[#6B0F2A]">
              <Plug className="w-4 h-4 mr-2" />
              Explorar Integraciones
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Conectadas
                    </p>
                    <p className="text-2xl font-bold">
                      {
                        integrations.filter((i) => i.status === "connected")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertCircle className="w-8 h-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Pendientes
                    </p>
                    <p className="text-2xl font-bold">
                      {
                        integrations.filter((i) => i.status === "pending")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Desconectadas
                    </p>
                    <p className="text-2xl font-bold">
                      {
                        integrations.filter((i) => i.status === "disconnected")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Database className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-bold">{integrations.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Categories Sidebar */}
            <div className="col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Categorías</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? "bg-[#8B1538] text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <span>{category.name}</span>
                      <Badge
                        variant="outline"
                        className={
                          selectedCategory === category.id
                            ? "bg-white text-[#8B1538]"
                            : ""
                        }
                      >
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Integrations List */}
            <div className="col-span-5">
              <Card>
                <CardHeader>
                  <CardTitle>Integraciones Disponibles</CardTitle>
                  <CardDescription>
                    {selectedCategory === "all"
                      ? "Todas las integraciones"
                      : `Categoría: ${categories.find((c) => c.id === selectedCategory)?.name}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {filteredIntegrations.map((integration) => {
                    const IconComponent = integration.icon;
                    return (
                      <div
                        key={integration.id}
                        onClick={() => setSelectedIntegration(integration)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedIntegration.id === integration.id
                            ? "border-[#8B1538] bg-red-50"
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
                              <h3 className="font-medium">
                                {integration.name}
                              </h3>
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
                </CardContent>
              </Card>
            </div>

            {/* Integration Details */}
            <div className="col-span-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 ${selectedIntegration.color} text-white rounded-lg flex items-center justify-center`}
                    >
                      <selectedIntegration.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle>{selectedIntegration.name}</CardTitle>
                      <CardDescription>
                        {selectedIntegration.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
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

                    {Object.entries(selectedIntegration.config).map(
                      ([key, value]) => (
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
                      ),
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-4 border-t">
                    {selectedIntegration.status === "connected" ? (
                      <>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            disconnectIntegration(selectedIntegration.id)
                          }
                        >
                          Desconectar
                        </Button>
                        <Button className="w-full bg-[#8B1538] hover:bg-[#6B0F2A]">
                          <Settings className="w-4 h-4 mr-2" />
                          Configurar
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="w-full bg-[#8B1538] hover:bg-[#6B0F2A]"
                        onClick={() =>
                          connectIntegration(selectedIntegration.id)
                        }
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
