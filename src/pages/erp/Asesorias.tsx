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
  Trash
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Asesorias: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);

  // Mock data for advisors
  const advisors = [
    {
      id: '1',
      name: 'Asesores Fiscales S.L.',
      type: 'Fiscal',
      contact: 'Juan Pérez',
      email: 'juan.perez@asesoresfiscales.com',
      phone: '+34 912 345 678',
      address: 'Calle Fiscal 123, Madrid',
      website: 'www.asesoresfiscales.com',
      status: 'active'
    },
    {
      id: '2',
      name: 'Contaplus Asesoría',
      type: 'Contable',
      contact: 'María Rodríguez',
      email: 'maria@contaplus.es',
      phone: '+34 913 456 789',
      address: 'Avenida Contable 45, Madrid',
      website: 'www.contaplus.es',
      status: 'active'
    },
    {
      id: '3',
      name: 'Laborales Asociados',
      type: 'Laboral',
      contact: 'Carlos Gómez',
      email: 'carlos@laborales.com',
      phone: '+34 914 567 890',
      address: 'Plaza Laboral 78, Madrid',
      website: 'www.laborales.com',
      status: 'active'
    },
    {
      id: '4',
      name: 'Jurídica Empresarial',
      type: 'Jurídica',
      contact: 'Laura Martínez',
      email: 'laura@juridica.es',
      phone: '+34 915 678 901',
      address: 'Calle Jurídica 56, Madrid',
      website: 'www.juridica.es',
      status: 'active'
    }
  ];

  // Mock data for consultations
  const consultations = [
    {
      id: '1',
      date: '2025-05-21',
      advisor: 'Asesores Fiscales S.L.',
      subject: 'Consulta sobre IVA en servicios veterinarios',
      description: 'Consulta sobre la aplicación del IVA en servicios veterinarios específicos y posibles exenciones.',
      status: 'pending',
      priority: 'high',
      dueDate: '2025-05-25',
      documents: [
        { name: 'Consulta_IVA.pdf', size: '245 KB', date: '2025-05-21' }
      ],
      responses: []
    },
    {
      id: '2',
      date: '2025-05-18',
      advisor: 'Contaplus Asesoría',
      subject: 'Revisión de cuentas trimestrales',
      description: 'Solicitud de revisión de las cuentas del primer trimestre de 2025 para verificar su corrección.',
      status: 'in_progress',
      priority: 'medium',
      dueDate: '2025-05-28',
      documents: [
        { name: 'Cuentas_1T_2025.xlsx', size: '1.2 MB', date: '2025-05-18' },
        { name: 'Balance_1T_2025.pdf', size: '350 KB', date: '2025-05-18' }
      ],
      responses: [
        { 
          date: '2025-05-20', 
          from: 'María Rodríguez', 
          content: 'Hemos recibido la documentación y estamos procediendo a su revisión. Les informaremos en cuanto tengamos los resultados.',
          attachments: []
        }
      ]
    },
    {
      id: '3',
      date: '2025-05-15',
      advisor: 'Laborales Asociados',
      subject: 'Consulta sobre contratación temporal',
      description: 'Necesitamos asesoramiento sobre las condiciones para realizar contratos temporales para la campaña de verano.',
      status: 'completed',
      priority: 'medium',
      dueDate: '2025-05-20',
      documents: [
        { name: 'Plantilla_Personal.xlsx', size: '180 KB', date: '2025-05-15' }
      ],
      responses: [
        { 
          date: '2025-05-17', 
          from: 'Carlos Gómez', 
          content: 'Tras revisar su solicitud, le informamos que para la campaña de verano puede utilizar contratos por circunstancias de la producción con una duración máxima de 6 meses. Adjuntamos modelo de contrato recomendado.',
          attachments: [
            { name: 'Modelo_Contrato_Temporal.docx', size: '65 KB' }
          ]
        },
        { 
          date: '2025-05-18', 
          from: 'Admin', 
          content: 'Gracias por la información. Procederemos según sus indicaciones.',
          attachments: []
        }
      ]
    },
    {
      id: '4',
      date: '2025-05-10',
      advisor: 'Jurídica Empresarial',
      subject: 'Revisión de contratos con proveedores',
      description: 'Necesitamos que revisen los nuevos contratos con proveedores de material veterinario para asegurar que cumplen con la normativa vigente.',
      status: 'completed',
      priority: 'low',
      dueDate: '2025-05-17',
      documents: [
        { name: 'Contrato_Proveedor1.pdf', size: '420 KB', date: '2025-05-10' },
        { name: 'Contrato_Proveedor2.pdf', size: '385 KB', date: '2025-05-10' }
      ],
      responses: [
        { 
          date: '2025-05-16', 
          from: 'Laura Martínez', 
          content: 'Hemos revisado los contratos y encontramos algunas cláusulas que deberían modificarse para cumplir con la normativa actual. Adjuntamos informe con las recomendaciones.',
          attachments: [
            { name: 'Informe_Revision_Contratos.pdf', size: '280 KB' }
          ]
        }
      ]
    }
  ];

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDateChange = (field: 'from' | 'to', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRefresh = () => {
    // Here you would typically fetch new data with the selected date range
    console.log('Fetching data for range:', dateRange);
  };

  const handleViewConsultation = (consultation: any) => {
    setSelectedConsultation(consultation);
    setShowConsultationModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asesorías</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de asesorías externas y consultas
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
            icon={<Plus size={18} />}
            className="flex-1 sm:flex-none"
            onClick={() => setShowConsultationModal(true)}
          >
            Nueva Consulta
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 p-2">
          <Input
            type="date"
            value={dateRange.from}
            onChange={(e) => handleDateChange('from', e.target.value)}
            label="Desde"
          />
          <Input
            type="date"
            value={dateRange.to}
            onChange={(e) => handleDateChange('to', e.target.value)}
            label="Hasta"
          />
          <Button
            variant="outline"
            icon={<RefreshCw size={18} />}
            onClick={handleRefresh}
            className="self-end"
          >
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Advisors */}
      <Card title="Asesorías Externas" icon={<Building2 size={20} />}>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {advisors.map((advisor) => (
              <div key={advisor.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="text-lg font-medium text-gray-900">{advisor.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {advisor.type}
                  </span>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{advisor.contact}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <a href={`mailto:${advisor.email}`} className="text-gray-600 hover:text-gray-900">
                        {advisor.email}
                      </a>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <a href={`tel:${advisor.phone}`} className="text-gray-600 hover:text-gray-900">
                        {advisor.phone}
                      </a>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{advisor.address}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<MessageSquare size={16} />}
                      onClick={() => setShowConsultationModal(true)}
                    >
                      Consultar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Consultations */}
      <Card title="Consultas" icon={<MessageSquare size={20} />}>
        <div className="p-4">
          <div className="mb-4">
            <Input
              placeholder="Buscar consultas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} />}
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asesoría
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asunto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Respuestas
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {consultations.map((consultation) => (
                  <tr key={consultation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(consultation.date)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Vence: {formatDate(consultation.dueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{consultation.advisor}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{consultation.subject}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{consultation.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        consultation.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : consultation.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {consultation.priority === 'high' ? 'Alta' : 
                         consultation.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        consultation.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : consultation.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {consultation.status === 'completed' ? (
                          <Check className="h-3 w-3 mr-1" />
                        ) : consultation.status === 'in_progress' ? (
                          <Clock className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {consultation.status === 'completed' 
                          ? 'Completada' 
                          : consultation.status === 'in_progress'
                          ? 'En Proceso'
                          : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{consultation.responses.length}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Eye size={16} />}
                        onClick={() => handleViewConsultation(consultation)}
                      >
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Consultation Modal */}
      {showConsultationModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedConsultation ? selectedConsultation.subject : 'Nueva Consulta'}
              </h3>
              <button
                onClick={() => {
                  setShowConsultationModal(false);
                  setSelectedConsultation(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {selectedConsultation ? (
                <div className="space-y-6">
                  {/* Consultation Details */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Detalles de la Consulta</h4>
                        <p className="mt-1 text-xs text-gray-500">
                          Creada el {formatDate(selectedConsultation.date)} • Vence el {formatDate(selectedConsultation.dueDate)}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedConsultation.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : selectedConsultation.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedConsultation.status === 'completed' 
                          ? 'Completada' 
                          : selectedConsultation.status === 'in_progress'
                          ? 'En Proceso'
                          : 'Pendiente'}
                      </span>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Asesoría</p>
                        <p className="text-sm font-medium text-gray-900">{selectedConsultation.advisor}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Prioridad</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedConsultation.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : selectedConsultation.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {selectedConsultation.priority === 'high' ? 'Alta' : 
                           selectedConsultation.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-xs text-gray-500">Descripción</p>
                      <p className="text-sm text-gray-900">{selectedConsultation.description}</p>
                    </div>
                  </div>
                  
                  {/* Documents */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Documentos Adjuntos</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nombre
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tamaño
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fecha
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Acciones</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedConsultation.documents.map((doc, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{doc.size}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {formatDate(doc.date)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-800">
                                  Descargar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Conversation */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Conversación</h4>
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 font-medium">
                              A
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-blue-900">Admin</p>
                              <p className="text-xs text-blue-700">{formatDate(selectedConsultation.date)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-blue-800">{selectedConsultation.description}</p>
                        </div>
                        {selectedConsultation.documents.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-blue-200">
                            <p className="text-xs font-medium text-blue-900">Documentos adjuntos:</p>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {selectedConsultation.documents.map((doc, index) => (
                                <div key={index} className="flex items-center bg-blue-100 px-2 py-1 rounded text-xs">
                                  <FileText className="h-3 w-3 text-blue-600 mr-1" />
                                  <span className="text-blue-800">{doc.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {selectedConsultation.responses.map((response, index) => (
                        <div key={index} className={`rounded-lg p-4 border ${
                          response.from === 'Admin' 
                            ? 'bg-blue-50 border-blue-100' 
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-medium ${
                                response.from === 'Admin'
                                  ? 'bg-blue-200 text-blue-600'
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {response.from[0]}
                              </div>
                              <div className="ml-3">
                                <p className={`text-sm font-medium ${
                                  response.from === 'Admin'
                                    ? 'text-blue-900'
                                    : 'text-gray-900'
                                }`}>{response.from}</p>
                                <p className={`text-xs ${
                                  response.from === 'Admin'
                                    ? 'text-blue-700'
                                    : 'text-gray-500'
                                }`}>{formatDate(response.date)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className={`text-sm ${
                              response.from === 'Admin'
                                ? 'text-blue-800'
                                : 'text-gray-800'
                            }`}>{response.content}</p>
                          </div>
                          {response.attachments && response.attachments.length > 0 && (
                            <div className={`mt-2 pt-2 border-t ${
                              response.from === 'Admin'
                                ? 'border-blue-200'
                                : 'border-gray-200'
                            }`}>
                              <p className={`text-xs font-medium ${
                                response.from === 'Admin'
                                  ? 'text-blue-900'
                                  : 'text-gray-900'
                              }`}>Documentos adjuntos:</p>
                              <div className="mt-1 flex flex-wrap gap-2">
                                {response.attachments.map((attachment, idx) => (
                                  <div key={idx} className={`flex items-center px-2 py-1 rounded text-xs ${
                                    response.from === 'Admin'
                                      ? 'bg-blue-100'
                                      : 'bg-gray-100'
                                  }`}>
                                    <FileText className={`h-3 w-3 mr-1 ${
                                      response.from === 'Admin'
                                        ? 'text-blue-600'
                                        : 'text-gray-600'
                                    }`} />
                                    <span className={
                                      response.from === 'Admin'
                                        ? 'text-blue-800'
                                        : 'text-gray-800'
                                    }>{attachment.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Reply Form */}
                  {selectedConsultation.status !== 'completed' && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Responder</h4>
                      <div className="space-y-4">
                        <textarea
                          rows={4}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="Escribe tu respuesta aquí..."
                        ></textarea>
                        
                        <div className="flex items-center">
                          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <FileText className="h-4 w-4 mr-2" />
                            Adjuntar Archivo
                          </button>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button
                            variant="primary"
                            icon={<MessageSquare size={18} />}
                          >
                            Enviar Respuesta
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* New Consultation Form */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Detalles de la Consulta</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Asesoría
                        </label>
                        <select
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="">Seleccionar asesoría</option>
                          {advisors.map(advisor => (
                            <option key={advisor.id} value={advisor.id}>
                              {advisor.name} - {advisor.type}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Asunto
                        </label>
                        <Input
                          type="text"
                          placeholder="Ej: Consulta sobre IVA en servicios veterinarios"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descripción
                        </label>
                        <textarea
                          rows={4}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="Describe detalladamente tu consulta..."
                        ></textarea>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prioridad
                          </label>
                          <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          >
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha Límite
                          </label>
                          <Input
                            type="date"
                            defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Documentos Adjuntos
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
                                <span>Subir archivos</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                              </label>
                              <p className="pl-1">o arrastrar y soltar</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PDF, Word, Excel hasta 10MB
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConsultationModal(false);
                  setSelectedConsultation(null);
                }}
              >
                Cancelar
              </Button>
              {selectedConsultation ? (
                selectedConsultation.status !== 'completed' && (
                  <Button
                    variant="primary"
                    icon={<FileCheck size={18} />}
                    onClick={() => {
                      setShowConsultationModal(false);
                      setSelectedConsultation(null);
                    }}
                  >
                    Marcar como Completada
                  </Button>
                )
              ) : (
                <Button
                  variant="primary"
                  icon={<MessageSquare size={18} />}
                  onClick={() => {
                    setShowConsultationModal(false);
                  }}
                >
                  Enviar Consulta
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Asesorias;