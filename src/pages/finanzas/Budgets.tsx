
import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, RefreshCw, FileText, Eye, Printer, X, Mail, MessageSquare, Phone, Plus } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { generateBudgetPDF } from '../../utils/pdfGenerator';
import * as XLSX from 'xlsx';
import NewBudgetForm from '../../components/dashboard/NewBudgetForm';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

const Budgets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [previewBudget, setPreviewBudget] = useState<any>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const [whatsappData, setWhatsappData] = useState({
    number: '',
    message: ''
  });
  const [smsData, setSmsData] = useState({
    number: '',
    message: ''
  });
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showWhatsappForm, setShowWhatsappForm] = useState(false);
  const [showSmsForm, setShowSmsForm] = useState(false);
  const [showNewBudgetForm, setShowNewBudgetForm] = useState(false);

  // Get budgets from database
  const budgets = useQuery(api.budgets.getBudgets) || [];
  const updateBudgetShared = useMutation(api.budgets.updateBudgetShared);

  // Filter budgets based on search term and selected status
  const filteredBudgets = budgets.filter(budget => 
    (selectedStatus === 'all' || budget.status === selectedStatus) &&
    (budget.patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     budget.patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     budget.patient?.pets?.[0]?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     budget.number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNewBudget = (budgetData: any) => {
    console.log('New budget data:', budgetData);
    setShowNewBudgetForm(false);
  };

  const handleDownloadBudget = (budget: any) => {
    if (!budget.patient) return;

    const data = {
      budgetNumber: budget.number,
      date: budget.date,
      validUntil: budget.validUntil,
      clientName: `${budget.patient.firstName} ${budget.patient.lastName}`,
      clientAddress: budget.billingAddress || budget.patient.address || "Dirección no especificada",
      clientNif: budget.nif || "NIF no especificado",
      clientEmail: budget.patient.email,
      clientPhone: budget.patient.phone,
      items: budget.products.map((item: any) => ({
        description: item.name,
        area: item.itemType,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount || 0,
        vat: item.vat,
        amount: item.price * item.quantity
      })),
      notes: budget.notes || ""
    };

    const doc = generateBudgetPDF(data);
    doc.save(`presupuesto-${budget.number}.pdf`);
  };

  const handlePrintBudget = (budget: any) => {
    if (!budget.patient) return;

    const data = {
      budgetNumber: budget.number,
      date: budget.date,
      validUntil: budget.validUntil,
      clientName: `${budget.patient.firstName} ${budget.patient.lastName}`,
      clientAddress: budget.billingAddress || budget.patient.address || "Dirección no especificada",
      clientNif: budget.nif || "NIF no especificado",
      clientEmail: budget.patient.email,
      clientPhone: budget.patient.phone,
      items: budget.products.map((item: any) => ({
        description: item.name,
        area: item.itemType,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount || 0,
        vat: item.vat,
        amount: item.price * item.quantity
      })),
      notes: budget.notes || ""
    };

    const doc = generateBudgetPDF(data);
    const blobUrl = doc.output('bloburl');
    window.open(blobUrl, '_blank');
  };

  const handlePreviewBudget = (budget: any) => {
    setPreviewBudget(budget);
    
    // Pre-populate sharing forms with client data
    setEmailData({
      to: budget.patient?.email || '',
      subject: `Presupuesto ${budget.number} - ClinicPro`,
      message: `Estimado/a ${budget.patient?.firstName} ${budget.patient?.lastName},\n\nAdjunto encontrará el presupuesto solicitado con número ${budget.number}.\n\nEl presupuesto es válido hasta el ${new Date(budget.validUntil).toLocaleDateString('es-ES')}.\n\nSi tiene alguna pregunta, no dude en contactarnos.\n\nSaludos cordiales,\nEquipo ClinicPro`
    });
    
    setWhatsappData({
      number: budget.patient?.phone || '',
      message: `Hola ${budget.patient?.firstName}, le enviamos el presupuesto solicitado con número ${budget.number}. El presupuesto es válido hasta el ${new Date(budget.validUntil).toLocaleDateString('es-ES')}. Saludos, ClinicPro.`
    });
    
    setSmsData({
      number: budget.patient?.phone || '',
      message: `ClinicPro: Su presupuesto ${budget.number} está disponible hasta ${new Date(budget.validUntil).toLocaleDateString('es-ES')}.`
    });
  };

  const handleShareBudget = (method: 'email' | 'whatsapp' | 'sms') => {
    if (method === 'email') {
      setShowEmailForm(true);
    } else if (method === 'whatsapp') {
      setShowWhatsappForm(true);
    } else if (method === 'sms') {
      setShowSmsForm(true);
    }
    setShowShareOptions(false);
  };

  const handleSendEmail = async () => {
    console.log('Sending email:', emailData);
    
    if (previewBudget) {
      await updateBudgetShared({
        id: previewBudget._id,
        shareMethod: 'email'
      });
    }
    
    setShowEmailForm(false);
  };

  const handleSendWhatsapp = async () => {
    console.log('Sending WhatsApp:', whatsappData);
    
    const encodedMessage = encodeURIComponent(whatsappData.message);
    const whatsappUrl = `https://wa.me/${whatsappData.number.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    if (previewBudget) {
      await updateBudgetShared({
        id: previewBudget._id,
        shareMethod: 'whatsapp'
      });
    }
    
    setShowWhatsappForm(false);
  };

  const handleSendSms = async () => {
    console.log('Sending SMS:', smsData);
    
    const encodedMessage = encodeURIComponent(smsData.message);
    const smsUrl = `sms:${smsData.number}?body=${encodedMessage}`;
    window.location.href = smsUrl;
    
    if (previewBudget) {
      await updateBudgetShared({
        id: previewBudget._id,
        shareMethod: 'sms'
      });
    }
    
    setShowSmsForm(false);
  };

  const handleExportExcel = () => {
    const excelData = budgets.map(budget => ({
      'Nº Presupuesto': budget.number,
      'Fecha': new Date(budget.date).toLocaleDateString('es-ES'),
      'Válido hasta': new Date(budget.validUntil).toLocaleDateString('es-ES'),
      'Cliente': `${budget.patient?.firstName} ${budget.patient?.lastName}`,
      'NIF/CIF': budget.nif || 'No especificado',
      'Mascota': budget.patient?.pets?.[0] ? `${budget.patient.pets[0].name} (${budget.patient.pets[0].species} ${budget.patient.pets[0].breed})` : 'No especificada',
      'Importe': budget.products.reduce((total: number, item: any) => {
        const subtotal = item.price * item.quantity * (1 - item.discount / 100);
        return total + subtotal * (1 + item.vat / 100);
      }, 0),
      'Estado': budget.status === 'pending' ? 'Pendiente' : 
                budget.status === 'accepted' ? 'Aceptado' : 'Rechazado',
      'Compartido': budget.shared.length > 0 ? 'Sí' : 'No',
      'Métodos': budget.shared.join(', ')
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Presupuestos');
    XLSX.writeFile(wb, 'presupuestos.xlsx');
  };

  const calculateBudgetTotal = (products: any[]) => {
    return products.reduce((total, item) => {
      const subtotal = item.price * item.quantity * (1 - item.discount / 100);
      return total + subtotal * (1 + item.vat / 100);
    }, 0);
  };

  // Status styles and labels
  const statusStyles = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'accepted': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    'pending': 'Pendiente',
    'accepted': 'Aceptado',
    'rejected': 'Rechazado'
  };

  // Share method icons
  const shareMethodIcons = {
    'email': <Mail size={16} className="text-blue-600" />,
    'whatsapp': <MessageSquare size={16} className="text-green-600" />,
    'sms': <Phone size={16} className="text-purple-600" />
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Presupuestos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de presupuestos para clientes
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
          <Button
            variant="primary"
            icon={<Plus size={18} />}
            className="flex-1 sm:flex-none"
            onClick={() => setShowNewBudgetForm(true)}
          >
            Nuevo Presupuesto
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <Input
            placeholder="Buscar presupuestos..."
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
            <option value="accepted">Aceptados</option>
            <option value="rejected">Rechazados</option>
          </select>
          <Button
            variant="outline"
            icon={<RefreshCw size={18} />}
          >
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Budgets Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nº Presupuesto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Válido hasta
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mascota
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importe
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compartido
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBudgets.map((budget) => (
                <tr key={budget._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{budget.number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(budget.date).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(budget.validUntil).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {budget.patient ? `${budget.patient.firstName} ${budget.patient.lastName}` : 'Cliente no encontrado'}
                    </div>
                    <div className="text-sm text-gray-500">{budget.nif || 'NIF no especificado'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {budget.patient?.pets?.[0]?.name || 'No especificada'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {budget.patient?.pets?.[0] ? 
                        `${budget.patient.pets[0].species} ${budget.patient.pets[0].breed}` : 
                        ''
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {calculateBudgetTotal(budget.products).toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      statusStyles[budget.status]
                    }`}>
                      {statusLabels[budget.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {budget.shared.length > 0 ? (
                      <div className="flex items-center space-x-1">
                        {budget.shared.map((method: string) => (
                          <div key={method} className="flex items-center">
                            {shareMethodIcons[method as keyof typeof shareMethodIcons]}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownloadBudget(budget)}
                        className="text-gray-400 hover:text-gray-500"
                        title="Descargar PDF"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handlePrintBudget(budget)}
                        className="text-gray-400 hover:text-gray-500"
                        title="Imprimir"
                      >
                        <Printer size={18} />
                      </button>
                      <button
                        onClick={() => handlePreviewBudget(budget)}
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
      {previewBudget && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Vista Previa de Presupuesto - {previewBudget.number}
              </h3>
              <button
                onClick={() => setPreviewBudget(null)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Cliente</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {previewBudget.patient ? `${previewBudget.patient.firstName} ${previewBudget.patient.lastName}` : 'Cliente no encontrado'}
                    </p>
                    <p className="text-sm text-gray-500">{previewBudget.nif || 'NIF no especificado'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Mascota</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {previewBudget.patient?.pets?.[0]?.name || 'No especificada'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {previewBudget.patient?.pets?.[0] ? 
                        `${previewBudget.patient.pets[0].species} ${previewBudget.patient.pets[0].breed}` : 
                        ''
                      }
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Fecha de Emisión</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(previewBudget.date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Válido Hasta</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(previewBudget.validUntil).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Artículos</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Artículo</th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Precio</th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">IVA</th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {previewBudget.products.map((item: any, index: number) => {
                          const price = item.price;
                          const quantity = item.quantity;
                          const discount = item.discount || 0;
                          const vat = item.vat;
                          
                          const subtotal = price * quantity;
                          const discountAmount = subtotal * (discount / 100);
                          const afterDiscount = subtotal - discountAmount;
                          const taxAmount = afterDiscount * (vat / 100);
                          const total = afterDiscount + taxAmount;
                          
                          return (
                            <tr key={index}>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                <span className="font-semibold">{item.name}</span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 text-center">
                                {quantity}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 text-center">
                                {price.toLocaleString('es-ES', {
                                  style: 'currency',
                                  currency: 'EUR'
                                })}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 text-center">
                                {vat}%
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                                {total.toLocaleString('es-ES', {
                                  style: 'currency',
                                  currency: 'EUR'
                                })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    
                    {/* Summary section */}
                    <div className="bg-gray-50 px-6 py-4 border-t">
                      <div className="flex justify-end">
                        <div className="w-64 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">
                              {(() => {
                                const subtotal = previewBudget.products.reduce((sum: number, item: any) => {
                                  const price = item.price * item.quantity;
                                  const discount = (item.discount || 0) / 100;
                                  return sum + (price * (1 - discount));
                                }, 0);
                                return subtotal.toLocaleString('es-ES', {
                                  style: 'currency',
                                  currency: 'EUR'
                                });
                              })()}
                            </span>
                          </div>
                          
                          {/* VAT breakdown */}
                          {(() => {
                            const vatBreakdown: { [key: number]: number } = {};
                            previewBudget.products.forEach((item: any) => {
                              const price = item.price * item.quantity;
                              const discount = (item.discount || 0) / 100;
                              const afterDiscount = price * (1 - discount);
                              const vatAmount = afterDiscount * (item.vat / 100);
                              
                              if (!vatBreakdown[item.vat]) {
                                vatBreakdown[item.vat] = 0;
                              }
                              vatBreakdown[item.vat] += vatAmount;
                            });
                            
                            return Object.entries(vatBreakdown).map(([rate, amount]) => (
                              <div key={rate} className="flex justify-between text-sm">
                                <span className="text-gray-600">IVA ({rate}%):</span>
                                <span className="font-medium">
                                  {amount.toLocaleString('es-ES', {
                                    style: 'currency',
                                    currency: 'EUR'
                                  })}
                                </span>
                              </div>
                            ));
                          })()}
                          
                          <div className="border-t pt-2">
                            <div className="flex justify-between text-base font-bold">
                              <span>Total:</span>
                              <span>
                                {calculateBudgetTotal(previewBudget.products).toLocaleString('es-ES', {
                                  style: 'currency',
                                  currency: 'EUR'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Estado</h4>
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusStyles[previewBudget.status]
                    }`}>
                      {statusLabels[previewBudget.status]}
                    </span>
                  </p>
                </div>

                {previewBudget.shared.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Compartido vía</h4>
                    <div className="mt-1 flex items-center space-x-2">
                      {previewBudget.shared.map((method: string) => (
                        <div key={method} className="flex items-center">
                          {shareMethodIcons[method as keyof typeof shareMethodIcons]}
                          <span className="ml-1 text-sm text-gray-900 capitalize">{method}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {previewBudget.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Notas</h4>
                    <p className="mt-1 text-sm text-gray-900">{previewBudget.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <div>
                <Button
                  variant="outline"
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  icon={<FileText size={18} />}
                >
                  Compartir
                </Button>
                {showShareOptions && (
                  <div className="absolute mt-2 bg-white rounded-md shadow-lg z-10">
                    <div className="p-2 space-y-1">
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => handleShareBudget('email')}
                      >
                        <Mail size={16} className="mr-2 text-blue-600" />
                        Email
                      </button>
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => handleShareBudget('whatsapp')}
                      >
                        <MessageSquare size={16} className="mr-2 text-green-600" />
                        WhatsApp
                      </button>
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => handleShareBudget('sms')}
                      >
                        <Phone size={16} className="mr-2 text-purple-600" />
                        SMS
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  icon={<Printer size={18} />}
                  onClick={() => handlePrintBudget(previewBudget)}
                >
                  Imprimir
                </Button>
                <Button
                  variant="outline"
                  icon={<Download size={18} />}
                  onClick={() => handleDownloadBudget(previewBudget)}
                >
                  Descargar PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPreviewBudget(null)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Form Modal */}
      {showEmailForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Enviar por Email</h3>
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
                placeholder="email@ejemplo.com"
                icon={<Mail size={18} />}
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
                  rows={6}
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
                  icon={<Mail size={18} />}
                  onClick={handleSendEmail}
                >
                  Enviar Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Form Modal */}
      {showWhatsappForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Enviar por WhatsApp</h3>
              <button
                onClick={() => setShowWhatsappForm(false)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input
                label="Número de teléfono"
                type="tel"
                value={whatsappData.number}
                onChange={(e) => setWhatsappData({...whatsappData, number: e.target.value})}
                placeholder="+34 666 777 888"
                icon={<Phone size={18} />}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  value={whatsappData.message}
                  onChange={(e) => setWhatsappData({...whatsappData, message: e.target.value})}
                  rows={6}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Escriba su mensaje aquí..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowWhatsappForm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  icon={<MessageSquare size={18} />}
                  onClick={handleSendWhatsapp}
                >
                  Enviar por WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SMS Form Modal */}
      {showSmsForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Enviar por SMS</h3>
              <button
                onClick={() => setShowSmsForm(false)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <Input
                label="Número de teléfono"
                type="tel"
                value={smsData.number}
                onChange={(e) => setSmsData({...smsData, number: e.target.value})}
                placeholder="+34 666 777 888"
                icon={<Phone size={18} />}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  value={smsData.message}
                  onChange={(e) => setSmsData({...smsData, message: e.target.value})}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Escriba su mensaje aquí..."
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Máximo 160 caracteres para SMS estándar. Caracteres: {smsData.message.length}/160
                </p>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowSmsForm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  icon={<Phone size={18} />}
                  onClick={handleSendSms}
                >
                  Enviar SMS
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Budget Form Modal */}
      {showNewBudgetForm && (
        <NewBudgetForm
          onClose={() => setShowNewBudgetForm(false)}
          onSubmit={handleNewBudget}
        />
      )}
    </div>
  );
};

export default Budgets;
