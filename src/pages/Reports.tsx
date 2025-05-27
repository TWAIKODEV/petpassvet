import React, { useState } from 'react';
import { User, Calendar, DollarSign, TrendingUp, BarChart2, Users, Building2, Stethoscope, Search, FileText, Pill, Package, RefreshCw, ShoppingCart, CreditCard, Receipt, PieChart, ArrowUpRight, ArrowDownRight, Wallet, Check as BankCheck } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { mockDashboardSummary } from '../data/mockData';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [activeTab, setActiveTab] = useState<'general' | 'ventas' | 'compras' | 'gastos' | 'resultado'>('general');

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Informes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Vista general del rendimiento de la clínica
          </p>
        </div>
        <Card className="w-full sm:w-auto">
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
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('ventas')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'ventas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Ventas
          </button>
          <button
            onClick={() => setActiveTab('compras')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'compras'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Compras
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
            onClick={() => setActiveTab('resultado')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'resultado'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Resultado
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Clientes Activos"
              value="1,234"
              icon={<Users size={24} />}
              change={{ value: 5.2, isPositive: true }}
            />
            <StatCard
              title="Ventas Totales"
              value={formatCurrency(125750)}
              icon={<DollarSign size={24} />}
              change={{ value: 8.3, isPositive: true }}
            />
            <StatCard
              title="Ticket Medio"
              value={formatCurrency(85.50)}
              icon={<FileText size={24} />}
              change={{ value: 2.1, isPositive: true }}
            />
            <StatCard
              title="Ingresos por Cliente"
              value={formatCurrency(245.75)}
              icon={<TrendingUp size={24} />}
              change={{ value: 3.7, isPositive: true }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Facturación y Pagos" icon={<DollarSign size={20} />}>
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Facturación Total</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-semibold">{formatCurrency(157890)}</span>
                    <span className="text-sm text-green-600">↑ 12.5%</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Pagos Pendientes</h4>
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-semibold text-orange-600">{formatCurrency(12450)}</span>
                      <span className="text-sm text-orange-600">15 facturas</span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-orange-600 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Descuentos Realizados</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-semibold text-purple-600">{formatCurrency(3567)}</span>
                    <span className="text-sm text-purple-600">45 aplicados</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Actividad Clínica" icon={<Stethoscope size={20} />}>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Nº Visitas</h4>
                    <div className="mt-2 flex items-center">
                      <Calendar size={20} className="text-blue-500" />
                      <span className="ml-2 text-2xl font-semibold">847</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Nº Recetas</h4>
                    <div className="mt-2 flex items-center">
                      <Pill size={20} className="text-green-500" />
                      <span className="ml-2 text-2xl font-semibold">623</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tipos de Servicio</h4>
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Consultas Generales</span>
                        <span className="font-medium">456 (54%)</span>
                      </div>
                      <div className="mt-1 h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-blue-600 rounded-full" style={{ width: '54%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Vacunaciones</span>
                        <span className="font-medium">187 (22%)</span>
                      </div>
                      <div className="mt-1 h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-green-600 rounded-full" style={{ width: '22%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Cirugías</span>
                        <span className="font-medium">98 (12%)</span>
                      </div>
                      <div className="mt-1 h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-purple-600 rounded-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Otros Servicios</span>
                        <span className="font-medium">106 (12%)</span>
                      </div>
                      <div className="mt-1 h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-orange-600 rounded-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'ventas' && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Ventas Totales"
              value={formatCurrency(125750)}
              icon={<ShoppingCart size={24} />}
              change={{ value: 8.3, isPositive: true }}
            />
            <StatCard
              title="Ticket Medio"
              value={formatCurrency(85.50)}
              icon={<Receipt size={24} />}
              change={{ value: 2.1, isPositive: true }}
            />
            <StatCard
              title="Nº Transacciones"
              value="1,567"
              icon={<CreditCard size={24} />}
              change={{ value: 5.8, isPositive: true }}
            />
            <StatCard
              title="Devoluciones"
              value={formatCurrency(2450)}
              icon={<ArrowDownRight size={24} />}
              change={{ value: 1.2, isPositive: false }}
            />
          </div>

          <Card title="Ventas por Categoría" icon={<PieChart size={20} />}>
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Consultas Veterinarias</span>
                    <span className="font-medium">{formatCurrency(45600)} (36%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '36%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Medicamentos</span>
                    <span className="font-medium">{formatCurrency(35200)} (28%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-600 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Peluquería</span>
                    <span className="font-medium">{formatCurrency(25300)} (20%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-600 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Productos</span>
                    <span className="font-medium">{formatCurrency(19650)} (16%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-orange-600 rounded-full" style={{ width: '16%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'compras' && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Compras Totales"
              value={formatCurrency(87500)}
              icon={<Package size={24} />}
              change={{ value: 6.2, isPositive: true }}
            />
            <StatCard
              title="Pedidos Realizados"
              value="234"
              icon={<ShoppingCart size={24} />}
              change={{ value: 3.4, isPositive: true }}
            />
            <StatCard
              title="Proveedores Activos"
              value="45"
              icon={<Building2 size={24} />}
              change={{ value: 0, isPositive: true }}
            />
            <StatCard
              title="Devoluciones"
              value={formatCurrency(1850)}
              icon={<ArrowDownRight size={24} />}
              change={{ value: 0.8, isPositive: false }}
            />
          </div>

          <Card title="Compras por Categoría" icon={<PieChart size={20} />}>
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Medicamentos</span>
                    <span className="font-medium">{formatCurrency(42000)} (48%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '48%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Material Clínico</span>
                    <span className="font-medium">{formatCurrency(26250)} (30%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-600 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Productos de Venta</span>
                    <span className="font-medium">{formatCurrency(13125)} (15%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-600 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Otros</span>
                    <span className="font-medium">{formatCurrency(6125)} (7%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-orange-600 rounded-full" style={{ width: '7%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'gastos' && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Gastos Totales"
              value={formatCurrency(45600)}
              icon={<Wallet size={24} />}
              change={{ value: 4.2, isPositive: false }}
            />
            <StatCard
              title="Gastos Fijos"
              value={formatCurrency(32400)}
              icon={<BankCheck size={24} />}
              change={{ value: 0, isPositive: true }}
            />
            <StatCard
              title="Gastos Variables"
              value={formatCurrency(13200)}
              icon={<ArrowUpRight size={24} />}
              change={{ value: 2.8, isPositive: false }}
            />
            <StatCard
              title="Gastos por Empleado"
              value={formatCurrency(2850)}
              icon={<Users size={24} />}
              change={{ value: 1.5, isPositive: false }}
            />
          </div>

          <Card title="Gastos por Categoría" icon={<PieChart size={20} />}>
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Personal</span>
                    <span className="font-medium">{formatCurrency(25080)} (55%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '55%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Alquiler y Suministros</span>
                    <span className="font-medium">{formatCurrency(9120)} (20%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-600 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Marketing</span>
                    <span className="font-medium">{formatCurrency(6840)} (15%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-600 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Otros</span>
                    <span className="font-medium">{formatCurrency(4560)} (10%)</span>
                  </div>
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-orange-600 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}

      {activeTab === 'resultado' && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Ingresos Totales"
              value={formatCurrency(125750)}
              icon={<ArrowUpRight size={24} />}
              change={{ value: 8.3, isPositive: true }}
            />
            <StatCard
              title="Gastos Totales"
              value={formatCurrency(87500)}
              icon={<ArrowDownRight size={24} />}
              change={{ value: 4.2, isPositive: false }}
            />
            <StatCard
              title="Beneficio Neto"
              value={formatCurrency(38250)}
              icon={<TrendingUp size={24} />}
              change={{ value: 12.5, isPositive: true }}
            />
            <StatCard
              title="Margen"
              value="30.4%"
              icon={<PieChart size={24} />}
              change={{ value: 2.1, isPositive: true }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Evolución Mensual" icon={<BarChart2 size={20} />}>
              <div className="p-4">
                <div className="space-y-4">
                  {[
                    { month: 'Enero', income: 98500, expenses: 72300 },
                    { month: 'Febrero', income: 105600, expenses: 76800 },
                    { month: 'Marzo', income: 112400, expenses: 79500 },
                    { month: 'Abril', income: 118900, expenses: 83200 },
                    { month: 'Mayo', income: 125750, expenses: 87500 }
                  ].map((month) => (
                    <div key={month.month}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{month.month}</span>
                        <span className="text-sm font-medium text-green-600">
                          {formatCurrency(month.income - month.expenses)}
                        </span>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                              Ingresos: {formatCurrency(month.income)}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                              Gastos: {formatCurrency(month.expenses)}
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                          <div
                            style={{ width: `${(month.income / (month.income + month.expenses)) * 100}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                          ></div>
                          <div
                            style={{ width: `${(month.expenses / (month.income + month.expenses)) * 100}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card title="Indicadores Financieros" icon={<DollarSign size={20} />}>
              <div className="p-4 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">ROI</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-semibold">43.7%</span>
                    <span className="text-sm text-green-600">↑ 5.2%</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-600 rounded-full" style={{ width: '43.7%' }}></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Margen Bruto</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-semibold">65.3%</span>
                    <span className="text-sm text-green-600">↑ 2.8%</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '65.3%' }}></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Margen Operativo</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-semibold">30.4%</span>
                    <span className="text-sm text-green-600">↑ 1.5%</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-600 rounded-full" style={{ width: '30.4%' }}></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Ratio de Liquidez</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-semibold">2.4</span>
                    <span className="text-sm text-green-600">↑ 0.3</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-orange-600 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;