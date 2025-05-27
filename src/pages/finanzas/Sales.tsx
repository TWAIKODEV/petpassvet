import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, RefreshCw, FileText, Eye, Printer, X, CreditCard, Wallet, Check as BankCheck } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { generateInvoicePDF, generateTicketPDF } from '../../utils/pdfGenerator';
import * as XLSX from 'xlsx';

// Service areas
const serviceAreas = [
  { id: 'all', name: 'Todas las áreas' },
  { id: 'veterinary', name: 'Veterinaria' },
  { id: 'grooming', name: 'Peluquería' },
  { id: 'pharmacy', name: 'Farmacia' },
  { id: 'store', name: 'Tienda' }
];

// Mock data for sales
const mockSales = [
  {
    id: '1',
    number: 'INV-202505001',
    type: 'invoice',
    date: '2025-05-21',
    client: {
      name: 'María García',
      nif: 'B12345678'
    },
    pet: {
      name: 'Luna',
      species: 'Perro',
      breed: 'Labrador',
      age: 3
    },
    concept: 'Consulta General + Vacunación',
    area: 'veterinary',
    areaName: 'Veterinaria',
    professional: 'Dr. Alejandro Ramírez',
    amount: 150.00,
    paymentMethod: 'card',
    status: 'completed'
  },
  {
    id: '2',
    type: 'ticket',
    date: '2025-05-21',
    client: {
      name: 'Carlos Rodríguez'
    },
    pet: {
      name: 'Rocky',
      species: 'Perro',
      breed: 'Pastor Alemán',
      age: 5
    },
    concept: 'Venta Pienso Premium 12kg',
    area: 'store',
    areaName: 'Tienda',
    professional: 'Ana López',
    amount: 65.50,
    paymentMethod: 'cash',
    status: 'completed'
  },
  {
    id: '3',
    number: 'INV-202505002',
    type: 'invoice',
    date: '2025-05-21',
    client: {
      name: 'Laura Martínez',
      nif: 'Y1234567Z'
    },
    pet: {
      name: 'Milo',
      species: 'Gato',
      breed: 'Persa',
      age: 2
    },
    concept: 'Peluquería + Corte de Uñas',
    area: 'grooming',
    areaName: 'Peluquería',
    professional: 'Carmen Ruiz',
    amount: 45.00,
    paymentMethod: 'card',
    status: 'completed'
  }
];

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [previewSale, setPreviewSale] = useState<any>(null);

  // Filter sales based on search, status, payment method and area
  const filteredSales = mockSales.filter(sale => 
    (selectedStatus === 'all' || sale.status === selectedStatus) &&
    (selectedPaymentMethod === 'all' || sale.paymentMethod === selectedPaymentMethod) &&
    (selectedArea === 'all' || sale.area === selectedArea) &&
    (sale.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     sale.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
     sale.professional.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate totals by payment method
  const totals = filteredSales.reduce((acc, sale) => {
    if (sale.status === 'completed') {
      acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.amount;
      acc.total = (acc.total || 0) + sale.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  // Calculate totals by area
  const areaStats = filteredSales.reduce((acc, sale) => {
    if (sale.status === 'completed') {
      acc[sale.area] = {
        count: (acc[sale.area]?.count || 0) + 1,
        amount: (acc[sale.area]?.amount || 0) + sale.amount
      };
    }
    return acc;
  }, {} as Record<string, { count: number; amount: number }>);

  const handleDownloadInvoice = (sale: any) => {
    if (sale.type !== 'invoice') return;

    const data = {
      invoiceNumber: sale.number,
      date: sale.date,
      clientName: sale.client.name,
      clientAddress: "Dirección del cliente",
      clientNif: sale.client.nif,
      clientEmail: "email@cliente.com",
      clientPhone: "666777888",
      items: [{
        description: sale.concept,
        area: sale.areaName,
        amount: sale.amount
      }],
      paymentMethod: sale.paymentMethod,
      notes: ""
    };

    const doc = generateInvoicePDF(data);
    doc.save(`factura-${sale.number}.pdf`);
  };

  const handlePrintInvoice = (sale: any) => {
    if (sale.type !== 'invoice') return;

    const data = {
      invoiceNumber: sale.number,
      date: sale.date,
      clientName: sale.client.name,
      clientAddress: "Dirección del cliente",
      clientNif: sale.client.nif,
      clientEmail: "email@cliente.com",
      clientPhone: "666777888",
      items: [{
        description: sale.concept,
        area: sale.areaName,
        amount: sale.amount
      }],
      paymentMethod: sale.paymentMethod,
      notes: ""
    };

    const doc = generateInvoicePDF(data);
    const blobUrl = doc.output('bloburl');
    window.open(blobUrl, '_blank');
  };

  const handlePrintTicket = (sale: any) => {
    const data = {
      date: new Date(sale.date).toLocaleDateString('es-ES'),
      clientName: sale.client.name,
      items: [{
        description: sale.concept,
        amount: sale.amount
      }],
      paymentMethod: sale.paymentMethod === 'card' ? 'Tarjeta' :
                    sale.paymentMethod === 'cash' ? 'Efectivo' : 'Transferencia',
      professional: sale.professional
    };

    const doc = generateTicketPDF(data);
    const blobUrl = doc.output('bloburl');
    window.open(blobUrl, '_blank');
  };

  const handleExportExcel = () => {
    const excelData = mockSales.map(sale => ({
      'Nº Documento': sale.type === 'invoice' ? sale.number : 'Ticket Caja',
      'Tipo': sale.type === 'invoice' ? 'Factura' : 'Ticket',
      'Fecha': new Date(sale.date).toLocaleDateString('es-ES'),
      'Cliente': sale.client.name,
      'NIF/CIF': sale.client.nif || '-',
      'Mascota': sale.pet ? `${sale.pet.name} (${sale.pet.species} ${sale.pet.breed}, ${sale.pet.age} años)` : '-',
      'Concepto': sale.concept,
      'Área': sale.areaName,
      'Profesional': sale.professional,
      'Importe': sale.amount,
      'Estado': sale.status === 'completed' ? 'Completada' : 'Pendiente',
      'Forma de Pago': sale.paymentMethod === 'card' ? 'Tarjeta' :
                      sale.paymentMethod === 'cash' ? 'Efectivo' : 'Transferencia'
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
    XLSX.writeFile(wb, 'ventas.xlsx');
  };

  return (
    <div className="space-y-6">
      {/* Header with Summary Cards */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ventas</h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestión de ventas y transacciones
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              icon={<Download size={18} />}
              className="flex-1 sm:flex-none"
              onClick={handleExportExcel}
            >
              Exportar
            </Button>
          </div>
        </div>

        {/* Area Stats - Updated layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {Object.entries(areaStats).map(([area, stats]) => {
            const areaInfo = serviceAreas.find(a => a.id === area);
            if (!areaInfo) return null;
            
            // Define border colors based on area
            const borderColors = {
              veterinary: 'border-blue-500',
              grooming: 'border-purple-500',
              pharmacy: 'border-green-500',
              store: 'border-orange-500'
            };
            
            return (
              <Card key={area} className={`border-2 ${borderColors[area] || 'border-gray-200'}`}>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-700">{areaInfo.name}</h3>
                    <span className="text-sm text-gray-500">{stats.count} ventas</span>
                  </div>
                  <p className="mt-4 text-2xl font-bold text-gray-900">
                    {stats.amount.toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Payment Method Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Total Ventas</h3>
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {(totals.total || 0).toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR'
                })}
              </p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Tarjeta</h3>
                <CreditCard className="h-5 w-5 text-blue-400" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-blue-600">
                {(totals.card || 0).toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR'
                })}
              </p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Efectivo</h3>
                <Wallet className="h-5 w-5 text-green-400" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-green-600">
                {(totals.cash || 0).toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR'
                })}
              </p>
            </div>
          </Card>
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Transferencia</h3>
                <BankCheck className="h-5 w-5 text-purple-400" />
              </div>
              <p className="mt-2 text-2xl font-semibold text-purple-600">
                {(totals.transfer || 0).toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR'
                })}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <Input
            placeholder="Buscar ventas..."
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
            <option value="completed">Completadas</option>
            <option value="pending">Pendientes</option>
          </select>
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          >
            <option value="all">Todas las formas de pago</option>
            <option value="cash">Efectivo</option>
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
          </select>
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            {serviceAreas.map(area => (
              <option key={area.id} value={area.id}>{area.name}</option>
            ))}
          </select>
          <Button
            variant="outline"
            icon={<RefreshCw size={18} />}
          >
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Sales Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nº Documento
                </th>
                <th scope="col" className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="w-40 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="w-48 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mascota
                </th>
                <th scope="col" className="w-48 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Concepto
                </th>
                <th scope="col" className="w-40 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profesional
                </th>
                <th scope="col" className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importe
                </th>
                <th scope="col" className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Forma de Pago
                </th>
                <th scope="col" className="w-24 px-3 py-3 relative">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {sale.type === 'invoice' ? sale.number : 'Ticket Caja'}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(sale.date).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{sale.client.name}</div>
                    {sale.client.nif && (
                      <div className="text-sm text-gray-500">{sale.client.nif}</div>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{sale.pet.name}</div>
                    <div className="text-sm text-gray-500">
                      {sale.pet.species} {sale.pet.breed}, {sale.pet.age} años
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="font-semibold">{sale.areaName}</div>
                      {sale.concept}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sale.professional}</div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {sale.amount.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      sale.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sale.status === 'completed' ? 'Completada' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {sale.paymentMethod === 'card' ? 'Tarjeta' :
                       sale.paymentMethod === 'cash' ? 'Efectivo' : 'Transferencia'}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {sale.type === 'invoice' ? (
                        <>
                          <button
                            onClick={() => handleDownloadInvoice(sale)}
                            className="text-gray-400 hover:text-gray-500"
                            title="Descargar PDF"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={() => handlePrintInvoice(sale)}
                            className="text-gray-400 hover:text-gray-500"
                            title="Imprimir"
                          >
                            <Printer size={18} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handlePrintTicket(sale)}
                          className="text-gray-400 hover:text-gray-500"
                          title="Imprimir Ticket"
                        >
                          <Printer size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => setPreviewSale(sale)}
                        className="text-gray-400 hover:text-gray-500"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewSale && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Vista Previa de {previewSale.type === 'invoice' ? 'Factura' : 'Ticket'} - {
                  previewSale.type === 'invoice' ? previewSale.number : 'Ticket Caja'
                }
              </h3>
              <button
                onClick={() => setPreviewSale(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Cliente</h4>
                    <p className="mt-1 text-sm text-gray-900">{previewSale.client.name}</p>
                    {previewSale.client.nif && (
                      <p className="text-sm text-gray-500">{previewSale.client.nif}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Mascota</h4>
                    <p className="mt-1 text-sm text-gray-900">{previewSale.pet.name}</p>
                    <p className="text-sm text-gray-500">
                      {previewSale.pet.species} {previewSale.pet.breed}, {previewSale.pet.age} años
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Detalles de la Venta</h4>
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Importe</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="font-semibold">{previewSale.areaName}</div>
                            {previewSale.concept}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-right">
                            {previewSale.amount.toLocaleString('es-ES', {
                              style: 'currency',
                              currency: 'EUR'
                            })}
                          </td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">Total</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                            {previewSale.amount.toLocaleString('es-ES', {
                              style: 'currency',
                              currency: 'EUR'
                            })}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Profesional</h4>
                    <p className="mt-1 text-sm text-gray-900">{previewSale.professional}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Forma de Pago</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {previewSale.paymentMethod === 'card' ? 'Tarjeta' :
                       previewSale.paymentMethod === 'cash' ? 'Efectivo' : 'Transferencia'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              {previewSale.type === 'invoice' ? (
                <>
                  <Button
                    variant="outline"
                    icon={<Printer size={18} />}
                    onClick={() => handlePrintInvoice(previewSale)}
                  >
                    Imprimir
                  </Button>
                  <Button
                    variant="outline"
                    icon={<Download size={18} />}
                    onClick={() => handleDownloadInvoice(previewSale)}
                  >
                    Descargar PDF
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  icon={<Printer size={18} />}
                  onClick={() => handlePrintTicket(previewSale)}
                >
                  Imprimir Ticket
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setPreviewSale(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;