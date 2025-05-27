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
  DollarSign, 
  BarChart2, 
  Check, 
  Clock, 
  AlertTriangle,
  FileCheck,
  FileWarning,
  FilePlus,
  Calculator
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Impuestos: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'resumen' | 'modelos' | 'calendario'>('resumen');
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [selectedTaxForm, setSelectedTaxForm] = useState<any>(null);

  // Mock data for tax declarations
  const taxDeclarations = [
    {
      id: '1',
      model: '303',
      name: 'IVA Trimestral',
      period: '2T 2025',
      dueDate: '2025-07-20',
      amount: 8032.50,
      status: 'pending',
      result: 'a pagar'
    },
    {
      id: '2',
      model: '130',
      name: 'Pago Fraccionado IRPF',
      period: '2T 2025',
      dueDate: '2025-07-20',
      amount: 5250.00,
      status: 'pending',
      result: 'a pagar'
    },
    {
      id: '3',
      model: '111',
      name: 'Retenciones IRPF',
      period: '2T 2025',
      dueDate: '2025-07-20',
      amount: 3750.00,
      status: 'pending',
      result: 'a pagar'
    },
    {
      id: '4',
      model: '200',
      name: 'Impuesto Sociedades',
      period: 'Anual 2024',
      dueDate: '2025-07-25',
      amount: 12750.00,
      status: 'completed',
      result: 'a pagar'
    },
    {
      id: '5',
      model: '303',
      name: 'IVA Trimestral',
      period: '1T 2025',
      dueDate: '2025-04-20',
      amount: 7850.25,
      status: 'completed',
      result: 'a pagar'
    },
    {
      id: '6',
      model: '130',
      name: 'Pago Fraccionado IRPF',
      period: '1T 2025',
      dueDate: '2025-04-20',
      amount: 4950.00,
      status: 'completed',
      result: 'a pagar'
    }
  ];

  // Mock data for tax models
  const taxModels = [
    {
      id: '1',
      model: '303',
      name: 'Autoliquidación IVA',
      description: 'Declaración trimestral del Impuesto sobre el Valor Añadido',
      frequency: 'Trimestral',
      dueDates: '20 de abril, 20 de julio, 20 de octubre, 30 de enero',
      lastFiled: '2025-04-20',
      nextDue: '2025-07-20'
    },
    {
      id: '2',
      model: '130',
      name: 'Pago Fraccionado IRPF',
      description: 'Pago a cuenta del Impuesto sobre la Renta de las Personas Físicas',
      frequency: 'Trimestral',
      dueDates: '20 de abril, 20 de julio, 20 de octubre, 30 de enero',
      lastFiled: '2025-04-20',
      nextDue: '2025-07-20'
    },
    {
      id: '3',
      model: '111',
      name: 'Retenciones e Ingresos a Cuenta IRPF',
      description: 'Declaración de retenciones e ingresos a cuenta del IRPF',
      frequency: 'Trimestral',
      dueDates: '20 de abril, 20 de julio, 20 de octubre, 30 de enero',
      lastFiled: '2025-04-20',
      nextDue: '2025-07-20'
    },
    {
      id: '4',
      model: '115',
      name: 'Retenciones por Arrendamiento',
      description: 'Retenciones e ingresos a cuenta sobre determinadas rentas procedentes del arrendamiento de inmuebles urbanos',
      frequency: 'Trimestral',
      dueDates: '20 de abril, 20 de julio, 20 de octubre, 30 de enero',
      lastFiled: '2025-04-20',
      nextDue: '2025-07-20'
    },
    {
      id: '5',
      model: '200',
      name: 'Impuesto sobre Sociedades',
      description: 'Declaración anual del Impuesto sobre Sociedades',
      frequency: 'Anual',
      dueDates: '25 de julio',
      lastFiled: '2024-07-25',
      nextDue: '2025-07-25'
    },
    {
      id: '6',
      model: '390',
      name: 'Resumen Anual IVA',
      description: 'Declaración-resumen anual del Impuesto sobre el Valor Añadido',
      frequency: 'Anual',
      dueDates: '30 de enero',
      lastFiled: '2025-01-30',
      nextDue: '2026-01-30'
    },
    {
      id: '7',
      model: '347',
      name: 'Declaración Anual Operaciones con Terceros',
      description: 'Declaración anual de operaciones con terceras personas',
      frequency: 'Anual',
      dueDates: '28 de febrero',
      lastFiled: '2025-02-28',
      nextDue: '2026-02-28'
    }
  ];

  // Mock data for tax calendar
  const taxCalendar = [
    {
      id: '1',
      date: '2025-07-20',
      models: ['303', '130', '111', '115'],
      description: 'Declaraciones trimestrales 2T 2025',
      status: 'upcoming'
    },
    {
      id: '2',
      date: '2025-07-25',
      models: ['200'],
      description: 'Impuesto sobre Sociedades 2024',
      status: 'upcoming'
    },
    {
      id: '3',
      date: '2025-10-20',
      models: ['303', '130', '111', '115'],
      description: 'Declaraciones trimestrales 3T 2025',
      status: 'future'
    },
    {
      id: '4',
      date: '2026-01-30',
      models: ['303', '130', '111', '115', '390'],
      description: 'Declaraciones trimestrales 4T 2025 y resumen anual',
      status: 'future'
    },
    {
      id: '5',
      date: '2025-04-20',
      models: ['303', '130', '111', '115'],
      description: 'Declaraciones trimestrales 1T 2025',
      status: 'completed'
    }
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
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

  const handleSubmitTax = () => {
    // Handle tax submission
    console.log('Submitting tax declaration');
    setShowTaxModal(false);
  };

  const handleViewTaxForm = (taxForm: any) => {
    setSelectedTaxForm(taxForm);
    setShowTaxModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Impuestos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de declaraciones fiscales y obligaciones tributarias
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
            onClick={() => setShowTaxModal(true)}
          >
            Presentar Impuesto
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('resumen')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'resumen'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Resumen Presentaciones
          </button>
          <button
            onClick={() => setActiveTab('modelos')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'modelos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Modelos
          </button>
          <button
            onClick={() => setActiveTab('calendario')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'calendario'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Calendario Fiscal
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'resumen' && (
        <div className="space-y-6">
          {/* Tax Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Pendientes</h3>
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-yellow-600">
                  {taxDeclarations.filter(tax => tax.status === 'pending').length}
                </p>
                <p className="mt-1 text-sm text-gray-500">declaraciones por presentar</p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Presentadas</h3>
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-green-600">
                  {taxDeclarations.filter(tax => tax.status === 'completed').length}
                </p>
                <p className="mt-1 text-sm text-gray-500">declaraciones completadas</p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Importe Pendiente</h3>
                  <DollarSign className="h-5 w-5 text-red-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-red-600">
                  {formatCurrency(
                    taxDeclarations
                      .filter(tax => tax.status === 'pending')
                      .reduce((sum, tax) => sum + tax.amount, 0)
                  )}
                </p>
                <p className="mt-1 text-sm text-gray-500">a pagar próximamente</p>
              </div>
            </Card>
          </div>

          {/* Tax Declarations Table */}
          <Card title="Declaraciones Fiscales" icon={<FileText size={20} />}>
            <div className="p-4">
              <div className="mb-4">
                <Input
                  placeholder="Buscar declaraciones..."
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
                        Modelo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Período
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha Límite
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
                    {taxDeclarations.map((tax) => (
                      <tr key={tax.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Modelo {tax.model}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{tax.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{tax.period}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(tax.dueDate).toLocaleDateString('es-ES')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(tax.amount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {tax.result}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tax.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {tax.status === 'completed' ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {tax.status === 'completed' ? 'Presentado' : 'Pendiente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Eye size={16} />}
                            onClick={() => handleViewTaxForm(tax)}
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
        </div>
      )}

      {activeTab === 'modelos' && (
        <div className="space-y-6">
          {/* Tax Models */}
          <Card title="Modelos Fiscales" icon={<FileText size={20} />}>
            <div className="p-4">
              <div className="mb-4">
                <Input
                  placeholder="Buscar modelos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={18} />}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {taxModels.map((model) => (
                  <div key={model.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">Modelo {model.model}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {model.frequency}
                      </span>
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-medium text-gray-900">{model.name}</h4>
                      <p className="mt-1 text-sm text-gray-500">{model.description}</p>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-start">
                          <Calendar className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Fechas de presentación</p>
                            <p className="text-sm text-gray-900">{model.dueDates}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Última presentación</p>
                            <p className="text-sm text-gray-900">
                              {new Date(model.lastFiled).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Clock className="h-4 w-4 text-yellow-500 mt-0.5 mr-2" />
                          <div>
                            <p className="text-xs text-gray-500">Próxima presentación</p>
                            <p className="text-sm text-gray-900">
                              {new Date(model.nextDue).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<FilePlus size={16} />}
                          onClick={() => handleViewTaxForm({
                            model: model.model,
                            name: model.name,
                            period: model.frequency === 'Trimestral' ? '2T 2025' : 'Anual 2025',
                            dueDate: model.nextDue,
                            amount: 0,
                            status: 'pending',
                            result: 'a pagar'
                          })}
                        >
                          Presentar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'calendario' && (
        <div className="space-y-6">
          {/* Tax Calendar */}
          <Card title="Calendario Fiscal" icon={<Calendar size={20} />}>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Modelos
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
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
                    {taxCalendar.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(event.date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {event.models.map((model, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {model}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{event.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            event.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : event.status === 'upcoming'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {event.status === 'completed' ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : event.status === 'upcoming' ? (
                              <Clock className="h-3 w-3 mr-1" />
                            ) : (
                              <Calendar className="h-3 w-3 mr-1" />
                            )}
                            {event.status === 'completed' 
                              ? 'Completado' 
                              : event.status === 'upcoming'
                              ? 'Próximo'
                              : 'Futuro'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {event.status !== 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<FilePlus size={16} />}
                            >
                              Preparar
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* Tax Calendar Visual */}
          <Card title="Vista de Calendario" icon={<Calendar size={20} />}>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-yellow-900">Próximos 30 días</h4>
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-600">
                        20
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-yellow-900">20 de Julio, 2025</p>
                        <p className="text-xs text-yellow-700">Modelos 303, 130, 111, 115 (2T 2025)</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-600">
                        25
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-yellow-900">25 de Julio, 2025</p>
                        <p className="text-xs text-yellow-700">Modelo 200 (Anual 2024)</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-blue-900">Próximos 90 días</h4>
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-600">
                        20
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-900">20 de Octubre, 2025</p>
                        <p className="text-xs text-blue-700">Modelos 303, 130, 111, 115 (3T 2025)</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-green-900">Completados Recientemente</h4>
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-200 flex items-center justify-center text-green-600">
                        20
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-900">20 de Abril, 2025</p>
                        <p className="text-xs text-green-700">Modelos 303, 130, 111, 115 (1T 2025)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Calendario Anual 2025</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {['Enero', 'Abril', 'Julio', 'Octubre'].map((month, index) => (
                    <div key={month} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b">
                        <h5 className="text-sm font-medium text-gray-900">{month}</h5>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center">
                          {index === 0 ? (
                            <>
                              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <Check size={12} />
                              </div>
                              <div className="ml-2">
                                <p className="text-xs font-medium text-gray-900">30 de Enero</p>
                                <p className="text-xs text-gray-500">Modelos 4T y Resumen Anual</p>
                              </div>
                            </>
                          ) : index === 1 ? (
                            <>
                              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <Check size={12} />
                              </div>
                              <div className="ml-2">
                                <p className="text-xs font-medium text-gray-900">20 de Abril</p>
                                <p className="text-xs text-gray-500">Modelos 1T</p>
                              </div>
                            </>
                          ) : index === 2 ? (
                            <>
                              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                                <Clock size={12} />
                              </div>
                              <div className="ml-2">
                                <p className="text-xs font-medium text-gray-900">20 de Julio</p>
                                <p className="text-xs text-gray-500">Modelos 2T</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                <Calendar size={12} />
                              </div>
                              <div className="ml-2">
                                <p className="text-xs font-medium text-gray-900">20 de Octubre</p>
                                <p className="text-xs text-gray-500">Modelos 3T</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tax Form Modal */}
      {showTaxModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedTaxForm ? `Modelo ${selectedTaxForm.model} - ${selectedTaxForm.period}` : 'Presentar Declaración'}
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => {
                  setShowTaxModal(false);
                  setSelectedTaxForm(null);
                }}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="px-6 py-4">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modelo
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      defaultValue={selectedTaxForm?.model || '303'}
                    >
                      <option value="303">303 - IVA Trimestral</option>
                      <option value="130">130 - Pago Fraccionado IRPF</option>
                      <option value="111">111 - Retenciones IRPF</option>
                      <option value="115">115 - Retenciones Alquiler</option>
                      <option value="200">200 - Impuesto Sociedades</option>
                      <option value="390">390 - Resumen Anual IVA</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Período
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      defaultValue={selectedTaxForm?.period || '2T 2025'}
                    >
                      <option value="1T 2025">1T 2025</option>
                      <option value="2T 2025">2T 2025</option>
                      <option value="3T 2025">3T 2025</option>
                      <option value="4T 2025">4T 2025</option>
                      <option value="Anual 2025">Anual 2025</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Presentación
                  </label>
                  <Input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resultado
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      defaultValue={selectedTaxForm?.result || 'a pagar'}
                    >
                      <option value="a pagar">A Pagar</option>
                      <option value="a devolver">A Devolver</option>
                      <option value="sin actividad">Sin Actividad</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Importe
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      defaultValue={selectedTaxForm?.amount.toString() || "0.00"}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Forma de Pago
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="domiciliacion">Domiciliación</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="nrc">NRC (Pago en Banco)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cuenta de Cargo
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="1">Cuenta Principal - ES12 3456 7890 1234 5678 9012</option>
                    <option value="2">Cuenta Pagos - ES45 6789 0123 4567 8901 2345</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observaciones
                  </label>
                  <textarea
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Añade notas o comentarios relevantes..."
                  />
                </div>
              </form>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowTaxModal(false);
                  setSelectedTaxForm(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                icon={<FileCheck size={18} />}
                onClick={handleSubmitTax}
              >
                Presentar Declaración
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Impuestos;