import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Building2,
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  FileText,
  Download,
  Printer,
  Edit,
  Tag,
  Package,
  Plus,
  ShoppingCart,
  Trash,
  Mail as MailIcon,
  X,
  Eye,
  Clock,
  AlertTriangle, 
  Truck, 
  DollarSign,
  Check,
  ShoppingBag,
  Scissors
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { generateProviderPDF, generateProviderExcel } from '../../utils/providerPdfGenerator';
import { generateOrderPDF } from '../../utils/orderPdfGenerator';

// Mock provider data
const mockProvider = {
  id: '1',
  name: 'VetSupplies S.L.',
  type: 'Medicamentos',
  area: 'Clínica',
  family: 'Farmacéuticos',
  contact: {
    name: 'Ana García',
    position: 'Responsable de Ventas',
    email: 'ana.garcia@vetsupplies.com',
    phone: '555-987-6543',
    mobile: '555-234-5678'
  },
  company: {
    cif: 'B12345678',
    address: 'Calle Comercial 123, Madrid',
    postalCode: '28001',
    city: 'Madrid',
    country: 'España',
    website: 'www.vetsupplies.com'
  },
  billing: {
    paymentMethod: 'Transferencia bancaria',
    bankAccount: 'ES12 3456 7890 1234 5678 9012',
    vatNumber: 'ESB12345678',
    currency: 'EUR',
    paymentTerms: '30 días',
    minimumOrder: 500.00
  },
  products: [
    {
      id: '1',
      reference: 'VS-001',
      name: 'Amoxicilina 250mg',
      category: 'Antibióticos',
      description: 'Comprimidos de amoxicilina para perros y gatos',
      price: 25.50,
      discount: 10,
      minOrder: 10,
      unit: 'Caja',
      unitsPerBox: 100,
      status: 'active'
    },
    {
      id: '2',
      reference: 'VS-002',
      name: 'Meloxicam 1.5mg/ml',
      category: 'Antiinflamatorios',
      description: 'Suspensión oral de meloxicam',
      price: 18.75,
      discount: 5,
      minOrder: 5,
      unit: 'Frasco',
      unitsPerBox: 1,
      status: 'active'
    }
  ],
  orders: [
    {
      id: 'PO-2025-001',
      date: '2025-05-15',
      items: [
        {
          reference: 'VS-001',
          name: 'Amoxicilina 250mg',
          quantity: 20,
          price: 25.50,
          discount: 10,
          total: 459.00
        }
      ],
      subtotal: 459.00,
      tax: 96.39,
      shipping: 15.00,
      total: 570.39,
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'Transferencia bancaria',
      deliveryDate: '2025-05-17',
      notes: 'Entrega urgente solicitada'
    },
    {
      id: 'PO-2025-002',
      date: '2025-05-01',
      items: [
        {
          reference: 'VS-002',
          name: 'Meloxicam 1.5mg/ml',
          quantity: 10,
          price: 18.75,
          discount: 5,
          total: 178.13
        }
      ],
      subtotal: 178.13,
      tax: 37.41,
      shipping: 15.00,
      total: 230.54,
      status: 'processing',
      paymentStatus: 'pending',
      paymentMethod: 'Transferencia bancaria',
      deliveryDate: '2025-05-03'
    }
  ],
  deliveryTerms: {
    shippingMethod: 'Transporte propio',
    deliveryTime: '24-48 horas',
    shippingCost: 15.00,
    freeShippingThreshold: 500.00,
    returnPolicy: '14 días'
  },
  notes: 'Proveedor principal de medicamentos. Pedidos urgentes disponibles con recargo.'
};

const ProviderProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'info' | 'products' | 'orders'>('info');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
  });
  
  // In a real app, you would fetch the provider data based on the ID
  const provider = mockProvider;

  // Get area icon
  const getAreaIcon = (area: string) => {
    switch (area) {
      case 'Clínica':
        return <Building2 size={20} className="text-blue-600" />;
      case 'Tienda':
        return <ShoppingBag size={20} className="text-green-600" />;
      case 'Peluquería':
        return <Scissors size={20} className="text-purple-600" />;
      default:
        return <Building2 size={20} className="text-gray-600" />;
    }
  };

  const handlePrint = () => {
    const doc = generateProviderPDF(provider);
    const blobUrl = doc.output('bloburl');
    const printWindow = window.open(blobUrl);
    printWindow?.print();
  };

  const handleDownload = () => {
    const doc = generateProviderPDF(provider);
    doc.save(`proveedor-${provider.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  const handleExport = () => {
    const blob = generateProviderExcel(provider);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proveedor-${provider.name.toLowerCase().replace(/\s+/g, '-')}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrintOrder = (order: any) => {
    const doc = generateOrderPDF(order);
    const blobUrl = doc.output('bloburl');
    const printWindow = window.open(blobUrl);
    printWindow?.print();
  };

  const handleDownloadOrder = (order: any) => {
    const doc = generateOrderPDF(order);
    doc.save(`pedido-${order.id.toLowerCase()}.pdf`);
  };

  const handleEmailOrder = (order: any) => {
    // Prepare email data with order details
    setEmailData({
      to: 'proveedor@example.com', // Placeholder email
      subject: `Pedido ${order.id} - ClinicPro`,
      message: `Estimado proveedor,

Adjunto encontrará el pedido con número ${order.id} con fecha ${new Date(order.date).toLocaleDateString('es-ES')}.

Detalles del pedido:
${order.items.map(item => `- ${item.name}: ${item.quantity} unidades a ${item.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} cada uno`).join('\n')}

Total del pedido: ${order.total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
Fecha de entrega solicitada: ${new Date(order.deliveryDate).toLocaleDateString('es-ES')}

Por favor, confirme la recepción de este pedido y la fecha de entrega prevista.

Saludos cordiales,
ClinicPro`
    });

    // Show email form
    setShowEmailForm(true);
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Ficha del Proveedor</h1>
          <p className="mt-1 text-sm text-gray-500">
            Información completa del proveedor y sus productos
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={<Download size={18} />}
            onClick={handleExport}
          >
            Exportar
          </Button>
          <Button
            variant="outline"
            icon={<Printer size={18} />}
            onClick={handlePrint}
          >
            Imprimir
          </Button>
          <Button
            variant="primary"
            icon={<Edit size={18} />}
          >
            Editar
          </Button>
        </div>
      </div>

      {/* Area Badge */}
      <div className="flex items-center bg-gray-100 p-3 rounded-lg">
        {getAreaIcon(provider.area)}
        <span className="ml-2 font-medium">{provider.area}</span>
        <span className="mx-1">•</span>
        <span className="text-gray-700">{provider.type}</span>
        {provider.area === 'Tienda' && (
          <>
            <span className="mx-1">•</span>
            <span className="text-gray-700">{provider.family}</span>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          icon={<ShoppingCart size={18} />}
          fullWidth
        >
          Nuevo Pedido
        </Button>
        <Button
          variant="outline"
          icon={<Package size={18} />}
          fullWidth
        >
          Añadir Producto
        </Button>
        <Button
          variant="outline"
          icon={<FileText size={18} />}
          fullWidth
        >
          Nueva Factura
        </Button>
        <Button
          variant="outline"
          icon={<Mail size={18} />}
          fullWidth
        >
          Enviar Email
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('info')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'info'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Información General
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'products'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Pedidos
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'info' && (
          <>
            {/* Company Information */}
            <Card title="Información de la Empresa" icon={<Building2 size={20} />}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Nombre</label>
                    <p className="mt-1 text-sm text-gray-900">{provider.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">CIF</label>
                    <p className="mt-1 text-sm text-gray-900">{provider.company.cif}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Área</label>
                    <div className="mt-1 flex items-center">
                      {getAreaIcon(provider.area)}
                      <span className="ml-1 text-sm text-gray-900">{provider.area}</span>
                      <span className="mx-1">•</span>
                      <span className="text-sm text-gray-700">{provider.type}</span>
                      {provider.area === 'Tienda' && (
                        <>
                          <span className="mx-1">•</span>
                          <span className="text-sm text-gray-700">{provider.family}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Dirección</label>
                    <p className="mt-1 text-sm text-gray-900">{provider.company.address}</p>
                    <p className="text-sm text-gray-900">
                      {provider.company.postalCode} {provider.company.city}, {provider.company.country}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Sitio Web</label>
                    <p className="mt-1 text-sm text-gray-900">{provider.company.website}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card title="Información de Contacto" icon={<Phone size={20} />}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Nombre</label>
                    <p className="mt-1 text-sm text-gray-900">{provider.contact.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Cargo</label>
                    <p className="mt-1 text-sm text-gray-900">{provider.contact.position}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{provider.contact.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Teléfonos</label>
                    <p className="mt-1 text-sm text-gray-900">{provider.contact.phone}</p>
                    <p className="text-sm text-gray-900">{provider.contact.mobile}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Billing Information */}
            <Card title="Información de Facturación" icon={<DollarSign size={20} />}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Método de Pago</label>
                    <p className="mt-1 text-sm text-gray-900">{provider.billing.paymentMethod}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Cuenta Bancaria</label>
                    <p className="mt-1 text-sm text-gray-900">{provider.billing.bankAccount}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">NIF/CIF IVA</label>
                    <p className="mt-1 text-sm text-gray-900">{provider.billing.vatNumber}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Moneda</label>
                    <p className="mt-1 text-sm text-gray-900">{provider.billing.currency}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Condiciones de Pago</label>
                    <p className="mt-1 text-sm text-gray-900">{provider.billing.paymentTerms}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Pedido Mínimo</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {provider.billing.minimumOrder.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Delivery Terms */}
            <Card title="Condiciones de Envío" icon={<Truck size={20} />}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Método de Envío</label>
                    <p className="mt-1 text-sm text-gray-900">{provider.deliveryTerms.shippingMethod}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Tiempo de Entrega</label>
                    <p className="mt-1 text-sm text-gray-900">{provider.deliveryTerms.deliveryTime}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Gastos de Envío</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {provider.deliveryTerms.shippingCost.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Envío Gratuito a partir de</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {provider.deliveryTerms.freeShippingThreshold.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Política de Devoluciones</label>
                    <p className="mt-1 text-sm text-gray-900">{provider.deliveryTerms.returnPolicy}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Notes */}
            {provider.notes && (
              <Card title="Notas" icon={<FileText size={20} />}>
                <div className="p-6">
                  <p className="text-sm text-gray-900">{provider.notes}</p>
                </div>
              </Card>
            )}
          </>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {provider.products.map(product => (
              <Card key={product.id}>
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Edit size={16} />}
                      >
                        Editar
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Referencia</p>
                      <p className="text-sm font-medium text-gray-900">{product.reference}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Categoría</p>
                      <p className="text-sm font-medium text-gray-900">{product.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Precio</p>
                      <p className="text-sm font-medium text-gray-900">
                        {product.price.toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Descuento</p>
                      <p className="text-sm font-medium text-gray-900">{product.discount}%</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Pedido Mínimo</p>
                      <p className="text-sm font-medium text-gray-900">{product.minOrder} {product.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Unidad</p>
                      <p className="text-sm font-medium text-gray-900">{product.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Unidades por Caja</p>
                      <p className="text-sm font-medium text-gray-900">{product.unitsPerBox}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Estado</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Tag size={16} />}
                      >
                        Precios Especiales
                      </Button>
                      <p className="text-sm text-gray-500">
                        {product.status === 'active' ? 'Stock disponible' : 'No disponible'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
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
                      Importe Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IVA
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado Entrega
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado Pago
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Forma de Pago
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {provider.orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <FileText size={16} className="mr-2" />
                          <span className="text-sm font-medium">#{order.id}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(order.date).toLocaleDateString('es-ES')}
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
                        <div className="text-sm text-gray-900">
                          {order.tax.toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status === 'delivered' ? 'Entregado' : 'En Proceso'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.paymentStatus === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.paymentMethod}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handlePrintOrder(order)}
                            className="text-gray-400 hover:text-gray-500"
                            title="Imprimir"
                          >
                            <Printer size={18} />
                          </button>
                          <button
                            onClick={() => handleDownloadOrder(order)}
                            className="text-gray-400 hover:text-gray-500"
                            title="Descargar"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Pedido #{selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Order Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Fecha del Pedido</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {new Date(selectedOrder.date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedOrder.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedOrder.status === 'delivered' ? 'Entregado' : 'En Proceso'}
                    </span>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Productos</h4>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referencia</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Precio</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Dto.</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.reference}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {item.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{item.discount}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            {item.total.toLocaleString('es-ES', {
                              style: 'currency',
                              currency: 'EUR'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="mt-6 flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Subtotal:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOrder.subtotal.toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">IVA (21%):</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOrder.tax.toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Gastos de envío:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOrder.shipping.toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-sm font-medium text-gray-900">Total:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedOrder.total.toLocaleString('es-ES', {
                          style: 'currency',
                          currency: 'EUR'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 text-blue-500 mr-2" />
                      <h4 className="text-sm font-medium text-blue-900">Estado de Entrega</h4>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center">
                        {selectedOrder.status === 'delivered' ? (
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                        ) : selectedOrder.status === 'processing' ? (
                          <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
                        )}
                        <span className="text-sm text-gray-900">
                          {selectedOrder.status === 'delivered' 
                            ? 'Entregado el ' + new Date(selectedOrder.deliveryDate).toLocaleDateString('es-ES')
                            : selectedOrder.status === 'processing'
                            ? 'En proceso - Entrega estimada: ' + new Date(selectedOrder.deliveryDate).toLocaleDateString('es-ES')
                            : 'Pendiente - Entrega estimada: ' + new Date(selectedOrder.deliveryDate).toLocaleDateString('es-ES')
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
                        {selectedOrder.paymentStatus === 'paid' ? (
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <Clock className="h-5 w-5 text-orange-500 mr-2" />
                        )}
                        <span className="text-sm text-gray-900">
                          {selectedOrder.paymentStatus === 'paid' 
                            ? 'Pagado'
                            : 'Pendiente de pago'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                icon={<MailIcon size={18} />}
                onClick={() => handleEmailOrder(selectedOrder)}
              >
                Enviar por Email
              </Button>
              <Button
                variant="outline"
                icon={<Printer size={18} />}
                onClick={() => handlePrintOrder(selectedOrder)}
              >
                Imprimir
              </Button>
              <Button
                variant="outline"
                icon={<Download size={18} />}
                onClick={() => handleDownloadOrder(selectedOrder)}
              >
                Descargar PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedOrder(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Email Form Modal */}
      {showEmailForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Enviar Pedido por Email</h3>
              <button
                onClick={() => setShowEmailForm(false)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input
                label="Destinatario"
                type="email"
                value={emailData.to}
                onChange={(e) => setEmailData({...emailData, to: e.target.value})}
                placeholder="proveedor@ejemplo.com"
                icon={<MailIcon size={18} />}
                required
              />
              <Input
                label="Asunto"
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                placeholder="Asunto del email"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                  rows={10}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Escriba su mensaje aquí..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowEmailForm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  icon={<MailIcon size={18} />}
                  onClick={handleSendEmail}
                >
                  Enviar Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderProfile;