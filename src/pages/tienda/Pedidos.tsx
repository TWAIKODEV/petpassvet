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
  Pill, 
  Check, 
  Clock, 
  AlertTriangle, 
  Truck, 
  Building2, 
  DollarSign,
  Trash,
  Mail
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const Pedidos: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'medicines' | 'products'>('medicines');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [showOrderDetails, setShowOrderDetails] = useState<any>(null);
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
  });

  // Form state for new order
  const [orderForm, setOrderForm] = useState({
    providerId: '',
    orderDate: new Date().toISOString().split('T')[0],
    estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: '',
    notes: '',
    items: [{
      itemId: '',
      itemType: activeTab === 'medicines' ? 'medicine' : 'product',
      name: '',
      quantity: 1,
      price: 0,
      vat: 21
    }]
  });

  // Convex queries and mutations
  const orders = useQuery(api.orders.getOrders) || [];
  const providers = useQuery(api.providers.getProviders) || [];
  const medicines = useQuery(api.medicines.getMedicines) || [];
  const products = useQuery(api.products.getProducts) || [];
  const createOrder = useMutation(api.orders.createOrder);

  // Filter orders based on active tab
  const getFilteredOrders = () => {
    return orders.filter(order => {
      const hasItemType = order.items.some(item => 
        activeTab === 'medicines' ? item.itemType === 'medicine' : item.itemType === 'product'
      );

      const matchesSearch = searchTerm === '' || 
        order.provider?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;

      return hasItemType && matchesSearch && matchesStatus;
    });
  };

  const filteredOrders = getFilteredOrders();

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

  // Calculate order totals
  const calculateOrderTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    // Group items by VAT rate
    const vatGroups = items.reduce((groups, item) => {
      const vatRate = item.vat;
      if (!groups[vatRate]) {
        groups[vatRate] = { subtotal: 0, vatAmount: 0 };
      }
      const itemSubtotal = item.quantity * item.price;
      groups[vatRate].subtotal += itemSubtotal;
      groups[vatRate].vatAmount += itemSubtotal * (vatRate / 100);
      return groups;
    }, {});

    const totalVat = Object.values(vatGroups).reduce((sum, group) => sum + group.vatAmount, 0);
    const total = subtotal + totalVat;

    return { subtotal, vatGroups, totalVat, total };
  };

  // Handle form submission
  const handleCreateOrder = async () => {
    try {
      await createOrder({
        providerId: orderForm.providerId,
        orderDate: orderForm.orderDate,
        items: orderForm.items,
        estimatedDeliveryDate: orderForm.estimatedDeliveryDate,
        paymentMethod: orderForm.paymentMethod,
        notes: orderForm.notes
      });

      setShowNewOrderForm(false);
      setOrderForm({
        providerId: '',
        orderDate: new Date().toISOString().split('T')[0],
        estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paymentMethod: '',
        notes: '',
        items: [{
          itemId: '',
          itemType: activeTab === 'medicines' ? 'medicine' : 'product',
          name: '',
          quantity: 1,
          price: 0,
          vat: 21
        }]
      });
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  // Handle item selection
  const handleItemSelection = (index, itemId) => {
    const items = activeTab === 'medicines' ? medicines : products;
    const selectedItem = items.find(item => item._id === itemId);

    if (selectedItem) {
      const updatedItems = [...orderForm.items];
      updatedItems[index] = {
        ...updatedItems[index],
        itemId: selectedItem._id,
        name: selectedItem.name,
        price: selectedItem.basePrice,
        vat: selectedItem.vat
      };
      setOrderForm({ ...orderForm, items: updatedItems });
    }
  };

  // Add new item to order
  const addOrderItem = () => {
    setOrderForm({
      ...orderForm,
      items: [...orderForm.items, {
        itemId: '',
        itemType: activeTab === 'medicines' ? 'medicine' : 'product',
        name: '',
        quantity: 1,
        price: 0,
        vat: 21
      }]
    });
  };

  // Remove item from order
  const removeOrderItem = (index) => {
    if (orderForm.items.length > 1) {
      const updatedItems = orderForm.items.filter((_, i) => i !== index);
      setOrderForm({ ...orderForm, items: updatedItems });
    }
  };

  // Handle download order as PDF
  const handleDownloadOrderPDF = (order) => {
    // Generate and download PDF using the order data
    //const doc = generateOrderPDF(order);  //Removed this line
    //doc.save(`pedido-${order.id}.pdf`);  //Removed this line
    console.log("Download PDF");//Added this line
  };

  // Handle print order
  const handlePrintOrder = (order) => {
    // Generate PDF and open in new window for printing
    //const doc = generateOrderPDF(order); //Removed this line
    //const blobUrl = doc.output('bloburl'); //Removed this line
    //window.open(blobUrl, '_blank');  //Removed this line
    console.log("Print Order");//Added this line
  };

  // Handle email order
  const handleEmailOrder = (order) => {
    // Prepare email data with order details
    setEmailData({
      to: 'proveedor@example.com', // Placeholder email
      subject: `Pedido ORD-${order._id.slice(-6).toUpperCase()} - ClinicPro`,
      message: `Estimado proveedor,

Adjunto encontrará el pedido con número ORD-${order._id.slice(-6).toUpperCase()} con fecha ${new Date(order.orderDate).toLocaleDateString('es-ES')}.

Detalles del pedido:
${order.items.map(item => `- ${item.name}: ${item.quantity} unidades a ${item.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} cada uno`).join('\n')}

Total del pedido: ${calculateOrderTotals(order.items).total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
Fecha de entrega solicitada: ${new Date(order.estimatedDeliveryDate).toLocaleDateString('es-ES')}

Por favor, confirme la recepción de este pedido y la fecha de entrega prevista.

Saludos cordiales,
ClinicPro`
    });

    // Show email form
    setShowEmailForm(true);
  };

  // Handle send email
  const handleSendEmail = () => {
    // Here you would typically make an API call to send the email with the PDF attached
    console.log('Sending email:', emailData);
    
    // Close the form
    setShowEmailForm(false);
    
    // Show success message or notification
    alert('Email enviado correctamente');
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
            onClick={() => setActiveTab('medicines')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
              ${activeTab === 'medicines'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <Pill size={16} className="mr-2" />
            Medicamentos
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
              ${activeTab === 'products'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <Package size={16} className="mr-2" />
            Productos
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
            <p className="mt-2 text-3xl font-semibold text-gray-900">{filteredOrders.length}</p>
            <p className="mt-1 text-sm text-gray-500">pedidos registrados</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Pendientes de Entrega</h3>
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <p className="mt-2 text-3xl font-semibold text-yellow-600">
              {filteredOrders.filter(order => order.status === 'pending' || order.status === 'processing').length}
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
              {filteredOrders.reduce((sum, order) => {
                const totals = calculateOrderTotals(order.items);
                return sum + totals.total;
              }, 0).toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR'
              })}
            </p>
            <p className="mt-1 text-sm text-gray-500">en pedidos</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <Input
            placeholder={`Buscar ${activeTab === 'medicines' ? 'medicamentos' : 'productos'}...`}
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
      <Card title={`Pedidos de ${activeTab === 'medicines' ? 'Medicamentos' : 'Productos'}`} icon={activeTab === 'medicines' ? <Pill size={20} /> : <Package size={20} />}>
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
              {filteredOrders.map((order) => {
                const totals = calculateOrderTotals(order.items);
                return (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">ORD-{order._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.orderDate).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.provider?.name || 'Sin proveedor'}</div>
                      <div className="text-sm text-gray-500">
                        {order.items.length} {order.items.length === 1 ? 'artículo' : 'artículos'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {totals.total.toLocaleString('es-ES', {
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
                        order.isPaid ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {order.isPaid ? 'Pagado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.estimatedDeliveryDate).toLocaleDateString('es-ES')}
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
                          onClick={() => handlePrintOrder(order)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Imprimir"
                        >
                          <Printer size={18} />
                        </button>
                        <button
                          onClick={() => handleDownloadOrderPDF(order)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Descargar PDF"
                        >
                          <Download size={18} />
                        </button>
                        <button
                            onClick={() => handleEmailOrder(order)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Enviar por Email"
                        >
                            <Mail size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
                Detalles del Pedido ORD-{showOrderDetails._id.slice(-6).toUpperCase()}
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
                        {new Date(showOrderDetails.orderDate).toLocaleDateString('es-ES')}
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
                        showOrderDetails.isPaid ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {showOrderDetails.isPaid ? 'Pagado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Información del Proveedor</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Proveedor:</span>
                      <span className="text-sm font-medium text-gray-900">{showOrderDetails.provider?.name || 'Sin proveedor'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Fecha de Entrega:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(showOrderDetails.estimatedDeliveryDate).toLocaleDateString('es-ES')}
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
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IVA
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {item.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {item.vat}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {(item.quantity * item.price).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {(() => {
                const totals = calculateOrderTotals(showOrderDetails.items);
                return (
                  <div className="mt-6 flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Subtotal:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {totals.subtotal.toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </span>
                      </div>
                      {Object.entries(totals.vatGroups).map(([vatRate, vatData]) => (
                        <div key={vatRate} className="flex justify-between">
                          <span className="text-sm text-gray-500">IVA ({vatRate}%):</span>
                          <span className="text-sm font-medium text-gray-900">
                            {vatData.vatAmount.toLocaleString('es-ES', {
                              style: 'currency',
                              currency: 'EUR'
                            })}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-900">Total:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {totals.total.toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

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
                          ? 'Entregado'
                          : showOrderDetails.status === 'processing'
                          ? 'En proceso - Entrega estimada: ' + new Date(showOrderDetails.estimatedDeliveryDate).toLocaleDateString('es-ES')
                          : 'Pendiente - Entrega estimada: ' + new Date(showOrderDetails.estimatedDeliveryDate).toLocaleDateString('es-ES')
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
                      {showOrderDetails.isPaid ? (
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <Clock className="h-5 w-5 text-orange-500 mr-2" />
                      )}
                      <span className="text-sm text-gray-900">
                        {showOrderDetails.isPaid ? 'Pagado' : 'Pendiente de pago'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                icon={<Mail size={18} />}
                onClick={() => handleEmailOrder(showOrderDetails)}
              >
                Enviar por Email
              </Button>
              <Button
                variant="outline"
                icon={<Printer size={18} />}
                onClick={() => handlePrintOrder(showOrderDetails)}
              >
                Imprimir
              </Button>
              <Button
                variant="outline"
                icon={<Download size={18} />}
                onClick={() => handleDownloadOrderPDF(showOrderDetails)}
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
                Nuevo Pedido de {activeTab === 'medicines' ? 'Medicamentos' : 'Productos'}
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
                      value={orderForm.providerId}
                      onChange={(e) => setOrderForm({ ...orderForm, providerId: e.target.value })}
                      required
                    >
                      <option value="">Seleccionar proveedor</option>
                      {providers
                        .filter(provider => provider.area === (activeTab === 'medicines' ? 'medicamentos' : 'productos'))
                        .map(provider => (
                          <option key={provider._id} value={provider._id}>{provider.name}</option>
                        ))
                      }
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Pedido
                    </label>
                    <Input
                      type="date"
                      value={orderForm.orderDate}
                      onChange={(e) => setOrderForm({ ...orderForm, orderDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Artículos</h4>

                  <div className="space-y-4">
                    {orderForm.items.map((item, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Artículo
                            </label>
                            <select
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              value={item.itemId}
                              onChange={(e) => handleItemSelection(index, e.target.value)}
                              required
                            >
                              <option value="">Seleccionar artículo</option>
                              {(activeTab === 'medicines' ? medicines : products).map(product => (
                                <option key={product._id} value={product._id}>{product.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Cantidad
                            </label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const updatedItems = [...orderForm.items];
                                updatedItems[index].quantity = parseInt(e.target.value) || 1;
                                setOrderForm({ ...orderForm, items: updatedItems });
                              }}
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
                              value={item.price}
                              onChange={(e) => {
                                const updatedItems = [...orderForm.items];
                                updatedItems[index].price = parseFloat(e.target.value) || 0;
                                setOrderForm({ ...orderForm, items: updatedItems });
                              }}
                              required
                            />
                          </div>
                          <div className="col-span-2 flex items-end">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full"
                              icon={<Trash size={16} />}
                              onClick={() => removeOrderItem(index)}
                              disabled={orderForm.items.length === 1}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      icon={<Plus size={16} />}
                      onClick={addOrderItem}
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
                        value={orderForm.estimatedDeliveryDate}
                        onChange={(e) => setOrderForm({ ...orderForm, estimatedDeliveryDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Método de Pago
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={orderForm.paymentMethod}
                        onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })}
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
                    value={orderForm.notes}
                    onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
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
                onClick={handleCreateOrder}
                disabled={!orderForm.providerId || !orderForm.paymentMethod}
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

export default Pedidos;