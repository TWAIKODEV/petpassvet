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
  Package, 
  ShoppingBag, 
  Briefcase, 
  Pill, 
  Check, 
  Clock, 
  AlertTriangle, 
  Truck, 
  Building2, 
  DollarSign,
  Trash
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

// Mock data for orders
const mockMedicationOrders = [
  {
    id: 'MED-2025-001',
    date: '2025-05-15',
    supplier: 'VetSupplies S.L.',
    items: [
      { name: 'Amoxicilina 250mg', quantity: 20, price: 25.50 },
      { name: 'Meloxicam 1.5mg/ml', quantity: 10, price: 18.75 }
    ],
    total: 570.39,
    status: 'delivered',
    paymentStatus: 'paid',
    deliveryDate: '2025-05-17'
  },
  {
    id: 'MED-2025-002',
    date: '2025-05-20',
    supplier: 'MedVet Distribución',
    items: [
      { name: 'Apoquel 16mg', quantity: 5, price: 45.20 },
      { name: 'Simparica 80mg', quantity: 15, price: 32.40 }
    ],
    total: 712.50,
    status: 'processing',
    paymentStatus: 'pending',
    deliveryDate: '2025-05-25'
  },
  {
    id: 'MED-2025-003',
    date: '2025-05-22',
    supplier: 'Laboratorios Syva',
    items: [
      { name: 'Nobivac Rabia', quantity: 30, price: 12.80 },
      { name: 'Nobivac DHPPi', quantity: 25, price: 15.60 }
    ],
    total: 774.00,
    status: 'pending',
    paymentStatus: 'pending',
    deliveryDate: '2025-05-30'
  }
];

const mockStoreOrders = [
  {
    id: 'STO-2025-001',
    date: '2025-05-14',
    supplier: 'PetFood Distribución',
    items: [
      { name: 'Pienso Premium 12kg', quantity: 15, price: 65.50 },
      { name: 'Snacks Dentales', quantity: 30, price: 8.25 }
    ],
    total: 1230.00,
    status: 'delivered',
    paymentStatus: 'paid',
    deliveryDate: '2025-05-16'
  },
  {
    id: 'STO-2025-002',
    date: '2025-05-18',
    supplier: 'PetAccessories Inc.',
    items: [
      { name: 'Collares Ajustables', quantity: 25, price: 12.50 },
      { name: 'Camas Medianas', quantity: 10, price: 45.75 }
    ],
    total: 770.00,
    status: 'processing',
    paymentStatus: 'pending',
    deliveryDate: '2025-05-26'
  }
];

const mockOfficeOrders = [
  {
    id: 'OFF-2025-001',
    date: '2025-05-10',
    supplier: 'OfficeSupplies S.A.',
    items: [
      { name: 'Papel A4 (Cajas)', quantity: 10, price: 22.50 },
      { name: 'Tóner Impresora', quantity: 5, price: 85.00 }
    ],
    total: 650.00,
    status: 'delivered',
    paymentStatus: 'paid',
    deliveryDate: '2025-05-12'
  },
  {
    id: 'OFF-2025-002',
    date: '2025-05-21',
    supplier: 'Mobiliario Clínico',
    items: [
      { name: 'Sillas de Oficina', quantity: 4, price: 120.00 },
      { name: 'Archivadores', quantity: 2, price: 95.50 }
    ],
    total: 671.00,
    status: 'processing',
    paymentStatus: 'pending',
    deliveryDate: '2025-06-01'
  }
];

const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'medications' | 'store' | 'office'>('medications');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [showOrderDetails, setShowOrderDetails] = useState<any>(null);
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);

  // Get the appropriate orders based on the active tab
  const getOrders = () => {
    switch (activeTab) {
      case 'medications':
        return mockMedicationOrders;
      case 'store':
        return mockStoreOrders;
      case 'office':
        return mockOfficeOrders;
      default:
        return [];
    }
  };

  // Filter orders based on search term, status, and supplier
  const filteredOrders = getOrders().filter(order => 
    (selectedStatus === 'all' || order.status === selectedStatus) &&
    (selectedSupplier === 'all' || order.supplier.toLowerCase().includes(selectedSupplier.toLowerCase())) &&
    (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Get tab title based on active tab
  const getTabTitle = () => {
    switch (activeTab) {
      case 'medications':
        return 'Pedidos de Medicamentos';
      case 'store':
        return 'Pedidos de Tienda';
      case 'office':
        return 'Pedidos de Oficina';
      default:
        return 'Pedidos';
    }
  };

  // Get tab icon based on active tab
  const getTabIcon = () => {
    switch (activeTab) {
      case 'medications':
        return <Pill size={20} />;
      case 'store':
        return <ShoppingBag size={20} />;
      case 'office':
        return <Briefcase size={20} />;
      default:
        return <Package size={20} />;
    }
  };

  // Status styles and labels
  const statusStyles = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'processing': 'bg-blue-100 text-blue-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    'pending': 'Pendiente',
    'processing': 'En Proceso',
    'delivered': 'Entregado',
    'cancelled': 'Cancelado'
  };

  // Payment status styles and labels
  const paymentStatusStyles = {
    'pending': 'bg-orange-100 text-orange-800',
    'paid': 'bg-green-100 text-green-800',
    'partial': 'bg-blue-100 text-blue-800',
    'cancelled': 'bg-red-100 text-red-800'
  };

  const paymentStatusLabels = {
    'pending': 'Pendiente',
    'paid': 'Pagado',
    'partial': 'Pago Parcial',
    'cancelled': 'Cancelado'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de pedidos a proveedores
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
            onClick={() => setShowNewOrderForm(true)}
          >
            Nuevo Pedido
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('medications')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
              ${activeTab === 'medications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <Pill size={16} className="mr-2" />
            Medicamentos
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
              ${activeTab === 'store'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <ShoppingBag size={16} className="mr-2" />
            Tienda
          </button>
          <button
            onClick={() => setActiveTab('office')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
              ${activeTab === 'office'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <Briefcase size={16} className="mr-2" />
            Oficina
          </button>
        </nav>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Pedidos Totales</h3>
              <Package className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{getOrders().length}</p>
            <p className="mt-1 text-sm text-gray-500">pedidos en el último mes</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Pendientes de Entrega</h3>
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-yellow-600">
              {getOrders().filter(order => order.status === 'pending' || order.status === 'processing').length}
            </p>
            <p className="mt-1 text-sm text-gray-500">pedidos en proceso</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Gasto Total</h3>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {getOrders().reduce((sum, order) => sum + order.total, 0).toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR'
              })}
            </p>
            <p className="mt-1 text-sm text-gray-500">en el último mes</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <Input
            placeholder={`Buscar ${activeTab === 'medications' ? 'medicamentos' : activeTab === 'store' ? 'productos' : 'material de oficina'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
            className="flex-1"
          />
          <Input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
            icon={<Calendar size={18} />}
          />
          <Input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
            icon={<Calendar size={18} />}
          />
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="processing">En Proceso</option>
            <option value="delivered">Entregados</option>
            <option value="cancelled">Cancelados</option>
          </select>
          <Button
            variant="outline"
            icon={<RefreshCw size={18} />}
          >
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Orders Table */}
      <Card title={getTabTitle()} icon={getTabIcon()}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nº Pedido
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importe
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pago
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entrega
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{order.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(order.date).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.supplier}</div>
                    <div className="text-sm text-gray-500">
                      {order.items.length} {order.items.length === 1 ? 'artículo' : 'artículos'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.total.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      statusStyles[order.status]
                    }`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      paymentStatusStyles[order.paymentStatus]
                    }`}>
                      {paymentStatusLabels[order.paymentStatus]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(order.deliveryDate).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowOrderDetails(order)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
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

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pedidos</h3>
            <p className="mt-1 text-sm text-gray-500">
              No se encontraron pedidos que coincidan con los filtros seleccionados.
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                icon={<Plus size={18} />}
                onClick={() => setShowNewOrderForm(true)}
              >
                Crear Nuevo Pedido
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Order Details Modal */}
      {showOrderDetails && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Detalles del Pedido #{showOrderDetails.id}
              </h3>
              <button
                onClick={() => setShowOrderDetails(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Información del Pedido</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Fecha del Pedido:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(showOrderDetails.date).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Estado:</span>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusStyles[showOrderDetails.status]
                      }`}>
                        {statusLabels[showOrderDetails.status]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Estado de Pago:</span>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        paymentStatusStyles[showOrderDetails.paymentStatus]
                      }`}>
                        {paymentStatusLabels[showOrderDetails.paymentStatus]}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Información del Proveedor</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Proveedor:</span>
                      <span className="text-sm font-medium text-gray-900">{showOrderDetails.supplier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Fecha de Entrega:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(showOrderDetails.deliveryDate).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="text-sm font-medium text-gray-500 mb-2">Artículos</h4>
              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Artículo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio Unitario
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {showOrderDetails.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.price.toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(item.quantity * item.price).toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Subtotal:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {(showOrderDetails.total / 1.21).toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">IVA (21%):</span>
                    <span className="text-sm font-medium text-gray-900">
                      {(showOrderDetails.total - (showOrderDetails.total / 1.21)).toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-900">Total:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {showOrderDetails.total.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-blue-500 mr-2" />
                    <h4 className="text-sm font-medium text-blue-900">Estado de Entrega</h4>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center">
                      {showOrderDetails.status === 'delivered' ? (
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                      ) : showOrderDetails.status === 'processing' ? (
                        <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                      )}
                      <span className="text-sm text-gray-900">
                        {showOrderDetails.status === 'delivered' 
                          ? 'Entregado el ' + new Date(showOrderDetails.deliveryDate).toLocaleDateString('es-ES')
                          : showOrderDetails.status === 'processing'
                          ? 'En proceso - Entrega estimada: ' + new Date(showOrderDetails.deliveryDate).toLocaleDateString('es-ES')
                          : 'Pendiente - Entrega estimada: ' + new Date(showOrderDetails.deliveryDate).toLocaleDateString('es-ES')
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-green-50 rounded-lg p-4 border border-green-100">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                    <h4 className="text-sm font-medium text-green-900">Estado de Pago</h4>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center">
                      {showOrderDetails.paymentStatus === 'paid' ? (
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <Clock className="h-5 w-5 text-orange-500 mr-2" />
                      )}
                      <span className="text-sm text-gray-900">
                        {showOrderDetails.paymentStatus === 'paid' 
                          ? 'Pagado'
                          : 'Pendiente de pago'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                icon={<Printer size={18} />}
              >
                Imprimir
              </Button>
              <Button
                variant="outline"
                icon={<Download size={18} />}
              >
                Descargar PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowOrderDetails(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Order Form Modal */}
      {showNewOrderForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Nuevo Pedido de {activeTab === 'medications' ? 'Medicamentos' : activeTab === 'store' ? 'Tienda' : 'Oficina'}
              </h3>
              <button
                onClick={() => setShowNewOrderForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proveedor
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    >
                      <option value="">Seleccionar proveedor</option>
                      {activeTab === 'medications' && (
                        <>
                          <option value="VetSupplies S.L.">VetSupplies S.L.</option>
                          <option value="MedVet Distribución">MedVet Distribución</option>
                          <option value="Laboratorios Syva">Laboratorios Syva</option>
                        </>
                      )}
                      {activeTab === 'store' && (
                        <>
                          <option value="PetFood Distribución">PetFood Distribución</option>
                          <option value="PetAccessories Inc.">PetAccessories Inc.</option>
                        </>
                      )}
                      {activeTab === 'office' && (
                        <>
                          <option value="OfficeSupplies S.A.">OfficeSupplies S.A.</option>
                          <option value="Mobiliario Clínico">Mobiliario Clínico</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Pedido
                    </label>
                    <Input
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Artículos</h4>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Artículo
                          </label>
                          <select
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                          >
                            <option value="">Seleccionar artículo</option>
                            {activeTab === 'medications' && (
                              <>
                                <option value="Amoxicilina 250mg">Amoxicilina 250mg</option>
                                <option value="Meloxicam 1.5mg/ml">Meloxicam 1.5mg/ml</option>
                                <option value="Apoquel 16mg">Apoquel 16mg</option>
                                <option value="Simparica 80mg">Simparica 80mg</option>
                                <option value="Nobivac Rabia">Nobivac Rabia</option>
                                <option value="Nobivac DHPPi">Nobivac DHPPi</option>
                              </>
                            )}
                            {activeTab === 'store' && (
                              <>
                                <option value="Pienso Premium 12kg">Pienso Premium 12kg</option>
                                <option value="Snacks Dentales">Snacks Dentales</option>
                                <option value="Collares Ajustables">Collares Ajustables</option>
                                <option value="Camas Medianas">Camas Medianas</option>
                              </>
                            )}
                            {activeTab === 'office' && (
                              <>
                                <option value="Papel A4 (Cajas)">Papel A4 (Cajas)</option>
                                <option value="Tóner Impresora">Tóner Impresora</option>
                                <option value="Sillas de Oficina">Sillas de Oficina</option>
                                <option value="Archivadores">Archivadores</option>
                              </>
                            )}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cantidad
                          </label>
                          <Input
                            type="number"
                            min="1"
                            defaultValue="1"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Precio
                          </label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            required
                          />
                        </div>
                        <div className="col-span-2 flex items-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            icon={<Trash size={16} />}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      icon={<Plus size={16} />}
                    >
                      Añadir Artículo
                    </Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Entrega Estimada
                      </label>
                      <Input
                        type="date"
                        defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Método de Pago
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      >
                        <option value="">Seleccionar método</option>
                        <option value="transfer">Transferencia Bancaria</option>
                        <option value="card">Tarjeta de Crédito</option>
                        <option value="direct_debit">Domiciliación Bancaria</option>
                        <option value="credit">Crédito (30 días)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notas
                  </label>
                  <textarea
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Añade notas o instrucciones especiales..."
                  />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowNewOrderForm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // Here you would typically submit the form
                  setShowNewOrderForm(false);
                }}
              >
                Crear Pedido
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;