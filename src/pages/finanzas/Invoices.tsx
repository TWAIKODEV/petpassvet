import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, RefreshCw, FileText, Eye, Printer, X } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { generateInvoicePDF } from '../../utils/pdfGenerator';
import * as XLSX from 'xlsx';

// Mock data for invoices
const mockInvoices = [
  {
    id: '1',
    number: 'INV-202505001',
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
    area: 'Veterinaria',
    concept: 'Consulta General + Vacunación',
    professional: 'Dr. Alejandro Ramírez',
    amount: 150.00,
    paymentMethod: 'card',
    status: 'paid'
  },
  {
    id: '2',
    number: 'INV-202505002',
    date: '2025-05-21',
    client: {
      name: 'Carlos Rodríguez',
      nif: 'Y8765432M'
    },
    pet: {
      name: 'Rocky',
      species: 'Perro',
      breed: 'Pastor Alemán',
      age: 5
    },
    area: 'Peluquería',
    concept: 'Corte y Baño',
    professional: 'Ana López',
    amount: 85.50,
    paymentMethod: 'cash',
    status: 'paid'
  }
];

const Invoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [previewInvoice, setPreviewInvoice] = useState<any>(null);

  const handleDownloadInvoice = (invoice: any) => {
    const data = {
      invoiceNumber: invoice.number,
      date: invoice.date,
      clientName: invoice.client.name,
      clientAddress: "Dirección del cliente",
      clientNif: invoice.client.nif,
      clientEmail: "email@cliente.com",
      clientPhone: "666777888",
      items: [{
        description: invoice.concept,
        area: invoice.area,
        amount: invoice.amount
      }],
      paymentMethod: invoice.paymentMethod,
      notes: ""
    };

    const doc = generateInvoicePDF(data);
    doc.save(`factura-${invoice.number}.pdf`);
  };

  const handlePrintInvoice = (invoice: any) => {
    const data = {
      invoiceNumber: invoice.number,
      date: invoice.date,
      clientName: invoice.client.name,
      clientAddress: "Dirección del cliente",
      clientNif: invoice.client.nif,
      clientEmail: "email@cliente.com",
      clientPhone: "666777888",
      items: [{
        description: invoice.concept,
        area: invoice.area,
        amount: invoice.amount
      }],
      paymentMethod: invoice.paymentMethod,
      notes: ""
    };

    const doc = generateInvoicePDF(data);
    const blobUrl = doc.output('bloburl');
    window.open(blobUrl, '_blank');
  };

  const handlePreviewInvoice = (invoice: any) => {
    setPreviewInvoice(invoice);
  };

  const handleExportExcel = () => {
    const excelData = mockInvoices.map(invoice => ({
      'Nº Factura': invoice.number,
      'Fecha': new Date(invoice.date).toLocaleDateString('es-ES'),
      'Cliente': invoice.client.name,
      'NIF/CIF': invoice.client.nif,
      'Mascota': `${invoice.pet.name} (${invoice.pet.species} ${invoice.pet.breed}, ${invoice.pet.age} años)`,
      'Área': invoice.area,
      'Concepto': invoice.concept,
      'Profesional': invoice.professional,
      'Importe': invoice.amount,
      'Estado': invoice.status === 'paid' ? 'Pagada' : 
                invoice.status === 'pending' ? 'Pendiente' : 'Cancelada',
      'Forma de Pago': invoice.paymentMethod === 'card' ? 'Tarjeta' :
                      invoice.paymentMethod === 'cash' ? 'Efectivo' : 'Transferencia'
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Facturas');
    XLSX.writeFile(wb, 'facturas.xlsx');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Facturas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de facturas y documentos de venta
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

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <Input
            placeholder="Buscar facturas..."
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
            <option value="paid">Pagadas</option>
            <option value="pending">Pendientes</option>
            <option value="cancelled">Canceladas</option>
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
          <Button
            variant="outline"
            icon={<RefreshCw size={18} />}
          >
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Invoices Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-32 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nº Factura
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
              {mockInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{invoice.number}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(invoice.date).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{invoice.client.name}</div>
                    <div className="text-sm text-gray-500">{invoice.client.nif}</div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{invoice.pet.name}</div>
                    <div className="text-sm text-gray-500">
                      {invoice.pet.species} {invoice.pet.breed}, {invoice.pet.age} años
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="font-semibold">{invoice.area}</span>
                      <br />
                      {invoice.concept}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{invoice.professional}</div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.amount.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      invoice.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : invoice.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status === 'paid' ? 'Pagada' : 
                       invoice.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                    </span>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {invoice.paymentMethod === 'card' ? 'Tarjeta' :
                       invoice.paymentMethod === 'cash' ? 'Efectivo' : 'Transferencia'}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownloadInvoice(invoice)}
                        className="text-gray-400 hover:text-gray-500"
                        title="Descargar PDF"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handlePrintInvoice(invoice)}
                        className="text-gray-400 hover:text-gray-500"
                        title="Imprimir"
                      >
                        <Printer size={18} />
                      </button>
                      <button
                        onClick={() => handlePreviewInvoice(invoice)}
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
      {previewInvoice && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Vista Previa de Factura - {previewInvoice.number}
              </h3>
              <button
                onClick={() => setPreviewInvoice(null)}
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
                    <p className="mt-1 text-sm text-gray-900">{previewInvoice.client.name}</p>
                    <p className="text-sm text-gray-500">{previewInvoice.client.nif}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Mascota</h4>
                    <p className="mt-1 text-sm text-gray-900">{previewInvoice.pet.name}</p>
                    <p className="text-sm text-gray-500">
                      {previewInvoice.pet.species} {previewInvoice.pet.breed}, {previewInvoice.pet.age} años
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Detalles de la Factura</h4>
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
                            <span className="font-semibold">{previewInvoice.area}</span>
                            <br />
                            {previewInvoice.concept}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-right">
                            {previewInvoice.amount.toLocaleString('es-ES', {
                              style: 'currency',
                              currency: 'EUR'
                            })}
                          </td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">Total</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                            {previewInvoice.amount.toLocaleString('es-ES', {
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
                    <p className="mt-1 text-sm text-gray-900">{previewInvoice.professional}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Forma de Pago</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {previewInvoice.paymentMethod === 'card' ? 'Tarjeta' :
                       previewInvoice.paymentMethod === 'cash' ? 'Efectivo' : 'Transferencia'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                icon={<Printer size={18} />}
                onClick={() => handlePrintInvoice(previewInvoice)}
              >
                Imprimir
              </Button>
              <Button
                variant="outline"
                icon={<Download size={18} />}
                onClick={() => handleDownloadInvoice(previewInvoice)}
              >
                Descargar PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => setPreviewInvoice(null)}
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

export default Invoices;