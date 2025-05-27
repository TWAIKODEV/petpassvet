import React, { useState } from 'react';
import { 
  Calculator, 
  DollarSign, 
  FileText, 
  Download, 
  BarChart2, 
  Calendar, 
  Plus, 
  Filter, 
  Search, 
  RefreshCw, 
  ArrowUp, 
  ArrowDown, 
  X as XIcon,
  Check,
  Clock,
  AlertTriangle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Contabilidad: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ingresos' | 'gastos' | 'impuestos' | 'informes'>('ingresos');
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [showTaxModal, setShowTaxModal] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contabilidad</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión contable y financiera de la clínica
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
            Presentar Impuestos
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
            onClick={() => setActiveTab('ingresos')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'ingresos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Ingresos
          </button>
          <button
            onClick={() => setActiveTab('gastos')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'gastos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Gastos
          </button>
          <button
            onClick={() => setActiveTab('impuestos')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'impuestos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Impuestos
          </button>
          <button
            onClick={() => setActiveTab('informes')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'informes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Informes
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'ingresos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Ingresos Totales</h3>
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">125.750,00 €</p>
                <div className="mt-2 flex items-center">
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">8.3% vs. mes anterior</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Facturas Emitidas</h3>
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">1.567</p>
                <div className="mt-2 flex items-center">
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">5.8% vs. mes anterior</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Ticket Medio</h3>
                  <Calculator className="h-5 w-5 text-gray-400" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">80,25 €</p>
                <div className="mt-2 flex items-center">
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">2.1% vs. mes anterior</span>
                </div>
              </div>
            </Card>
          </div>

          <Card title="Ingresos por Categoría" icon={<BarChart2 size={20} />}>
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Consultas Veterinarias</span>
                    <span className="font-medium">45.600,00 € (36%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '36%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Medicamentos</span>
                    <span className="font-medium">35.200,00 € (28%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-600 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Peluquería</span>
                    <span className="font-medium">25.300,00 € (20%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-600 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Tienda</span>
                    <span className="font-medium">19.650,00 € (16%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-orange-600 rounded-full" style={{ width: '16%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'gastos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Gastos Totales</h3>
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">87.500,00 €</p>
                <div className="mt-2 flex items-center">
                  <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">4.2% vs. mes anterior</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Facturas Recibidas</h3>
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">234</p>
                <div className="mt-2 flex items-center">
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">3.4% vs. mes anterior</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Gasto Medio</h3>
                  <Calculator className="h-5 w-5 text-gray-400" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">374,00 €</p>
                <div className="mt-2 flex items-center">
                  <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">1.5% vs. mes anterior</span>
                </div>
              </div>
            </Card>
          </div>

          <Card title="Gastos por Categoría" icon={<BarChart2 size={20} />}>
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Personal</span>
                    <span className="font-medium">48.125,00 € (55%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '55%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Compras</span>
                    <span className="font-medium">17.500,00 € (20%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-600 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Alquiler y Suministros</span>
                    <span className="font-medium">13.125,00 € (15%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-600 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Otros</span>
                    <span className="font-medium">8.750,00 € (10%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-orange-600 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'impuestos' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">IVA Trimestral</h3>
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">8.032,50 €</p>
                <div className="mt-2 flex items-center">
                  <span className="text-sm text-gray-500">Próxima presentación: 20/07/2025</span>
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Pendiente
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">IRPF Trimestral</h3>
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">5.250,00 €</p>
                <div className="mt-2 flex items-center">
                  <span className="text-sm text-gray-500">Próxima presentación: 20/07/2025</span>
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Pendiente
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Impuesto Sociedades</h3>
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">12.750,00 €</p>
                <div className="mt-2 flex items-center">
                  <span className="text-sm text-gray-500">Próxima presentación: 25/07/2025</span>
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Presentado
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <Card title="Calendario Fiscal" icon={<Calendar size={20} />}>
            <div className="p-4 space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Impuesto
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Periodo
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">IVA (Mod. 303)</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">2T 2025</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">20/07/2025</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">8.032,50 €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Pendiente
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">IRPF (Mod. 130)</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">2T 2025</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">20/07/2025</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">5.250,00 €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Pendiente
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Impuesto Sociedades (Mod. 200)</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Anual 2024</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">25/07/2025</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">12.750,00 €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Presentado
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Retenciones (Mod. 111)</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">2T 2025</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">20/07/2025</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">3.750,00 €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Urgente
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'informes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Informes Disponibles" icon={<FileText size={20} />}>
              <div className="p-4 space-y-4">
                <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Balance de Situación</h3>
                      <p className="text-xs text-gray-500 mt-1">Informe completo del estado financiero de la empresa</p>
                    </div>
                    <Download className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Cuenta de Resultados</h3>
                      <p className="text-xs text-gray-500 mt-1">Informe de pérdidas y ganancias</p>
                    </div>
                    <Download className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Libro Mayor</h3>
                      <p className="text-xs text-gray-500 mt-1">Registro detallado de todas las cuentas</p>
                    </div>
                    <Download className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Libro Diario</h3>
                      <p className="text-xs text-gray-500 mt-1">Registro cronológico de todas las operaciones</p>
                    </div>
                    <Download className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Indicadores Financieros" icon={<BarChart2 size={20} />}>
              <div className="p-4 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Rentabilidad</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-semibold">30.4%</span>
                    <span className="text-sm text-green-600">↑ 2.1%</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-600 rounded-full" style={{ width: '30.4%' }}></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Liquidez</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-semibold">2.4</span>
                    <span className="text-sm text-green-600">↑ 0.3</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Endeudamiento</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-semibold">35.7%</span>
                    <span className="text-sm text-green-600">↓ 1.8%</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-yellow-600 rounded-full" style={{ width: '35.7%' }}></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">ROI</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-semibold">22.5%</span>
                    <span className="text-sm text-green-600">↑ 1.2%</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-600 rounded-full" style={{ width: '22.5%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Modal de Presentación de Impuestos */}
      {showTaxModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Presentación Telemática de Impuestos
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowTaxModal(false)}
              >
                {/* Icono de cerrar, por ejemplo XIcon */}
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="px-6 py-4">
              {/* Contenido del modal: formulario, inputs, etc. */}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <Button onClick={handleSubmitTax}>Enviar</Button>
              <Button variant="secondary" onClick={() => setShowTaxModal(false)} className="ml-2">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contabilidad;