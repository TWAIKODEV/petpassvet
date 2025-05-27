import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, RefreshCw, FileText, Eye, Printer, X, Mail, MessageSquare, Phone, Plus } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { generateBudgetPDF } from '../../utils/pdfGenerator';
import * as XLSX from 'xlsx';
import NewBudgetForm from '../../components/dashboard/NewBudgetForm';

// Mock data for budgets
const mockBudgets = [
  {
    id: '1',
    number: 'PRES-202505001',
    date: '2025-05-21',
    validUntil: '2025-06-21',
    client: {
      name: 'María García',
      nif: 'B12345678',
      email: 'maria.garcia@example.com',
      phone: '+34 666 777 888'
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
    status: 'pending',
    shared: false
  },
  {
    id: '2',
    number: 'PRES-202505002',
    date: '2025-05-20',
    validUntil: '2025-06-20',
    client: {
      name: 'Carlos Rodríguez',
      nif: 'Y8765432M',
      email: 'carlos.rodriguez@example.com',
      phone: '+34 666 888 999'
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
    status: 'accepted',
    shared: true,
    shareMethod: 'email'
  },
  {
    id: '3',
    number: 'PRES-202505003',
    date: '2025-05-19',
    validUntil: '2025-06-19',
    client: {
      name: 'Laura Martínez',
      nif: 'Z9876543X',
      email: 'laura.martinez@example.com',
      phone: '+34 666 999 000'
    },
    pet: {
      name: 'Milo',
      species: 'Gato',
      breed: 'Siamés',
      age: 2
    },
    area: 'Veterinaria',
    concept: 'Revisión Dental + Limpieza',
    professional: 'Dr. Miguel Torres',
    amount: 120.00,
    status: 'rejected',
    shared: true,
    shareMethod: 'whatsapp'
  }
];

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

  // Filter budgets based on search term and selected status
  const filteredBudgets = mockBudgets.filter(budget => 
    (selectedStatus === 'all' || budget.status === selectedStatus) &&
    (budget.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     budget.pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     budget.number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNewBudget = (budgetData: any) => {
    // Here you would typically make an API call to save the new budget
    console.log('New budget data:', budgetData);
    setShowNewBudgetForm(false);
  };

  const handleDownloadBudget = (budget: any) => {
    const data = {
      budgetNumber: budget.number,
      date: budget.date,
      validUntil: budget.validUntil,
      clientName: budget.client.name,
      clientAddress: "Dirección del cliente",
      clientNif: budget.client.nif,
      clientEmail: budget.client.email,
      clientPhone: budget.client.phone,
      items: [{
        description: budget.concept,
        area: budget.area,
        amount: budget.amount
      }],
      notes: ""
    };

    const doc = generateBudgetPDF(data);
    doc.save(`presupuesto-${budget.number}.pdf`);
  };

  const handlePrintBudget = (budget: any) => {
    const data = {
      budgetNumber: budget.number,
      date: budget.date,
      validUntil: budget.validUntil,
      clientName: budget.client.name,
      clientAddress: "Dirección del cliente",
      clientNif: budget.client.nif,
      clientEmail: budget.client.email,
      clientPhone: budget.client.phone,
      items: [{
        description: budget.concept,
        area: budget.area,
        amount: budget.amount
      }],
      notes: ""
    };

    const doc = generateBudgetPDF(data);
    const blobUrl = doc.output('bloburl');
    window.open(blobUrl, '_blank');
  };

  const handlePreviewBudget = (budget: any) => {
    setPreviewBudget(budget);
    
    // Pre-populate sharing forms with client data
    setEmailData({
      to: budget.client.email || '',
      subject: `Presupuesto ${budget.number} - ClinicPro`,
      message: `Estimado/a ${budget.client.name},\n\nAdjunto encontrará el presupuesto solicitado con número ${budget.number}.\n\nEl presupuesto es válido hasta el ${new Date(budget.validUntil).toLocaleDateString('es-ES')}.\n\nSi tiene alguna pregunta, no dude en contactarnos.\n\nSaludos cordiales,\nEquipo ClinicPro`
    });
    
    setWhatsappData({
      number: budget.client.phone || '',
      message: `Hola ${budget.client.name}, le enviamos el presupuesto solicitado con número ${budget.number}. El presupuesto es válido hasta el ${new Date(budget.validUntil).toLocaleDateString('es-ES')}. Saludos, ClinicPro.`
    });
    
    setSmsData({
      number: budget.client.phone || '',
      message: `ClinicPro: Su presupuesto ${budget.number} por ${budget.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} está disponible hasta ${new Date(budget.validUntil).toLocaleDateString('es-ES')}.`
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

  const handleSendEmail = () => {
    // In a real app, this would send an email with the budget attached
    console.log('Sending email:', emailData);
    
    // Close the form
    setShowEmailForm(false);
    
    // Update the budget status to indicate it was shared
    if (previewBudget) {
      const updatedBudget = { ...previewBudget, shared: true, shareMethod: 'email' };
      // Here you would typically update the budget in your database
      console.log('Updated budget:', updatedBudget);
    }
  };

  const handleSendWhatsapp = () => {
    // In a real app, this would send a WhatsApp message with the budget
    console.log('Sending WhatsApp:', whatsappData);
    
    // For demo purposes, we'll open a WhatsApp web link
    const encodedMessage = encodeURIComponent(whatsappData.message);
    const whatsappUrl = `https://wa.me/${whatsappData.number.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Close the form
    setShowWhatsappForm(false);
    
    // Update the budget status to indicate it was shared
    if (previewBudget) {
      const updatedBudget = { ...previewBudget, shared: true, shareMethod: 'whatsapp' };
      // Here you would typically update the budget in your database
      console.log('Updated budget:', updatedBudget);
    }
  };

  const handleSendSms = () => {
    // In a real app, this would send an SMS with the budget
    console.log('Sending SMS:', smsData);
    
    // For demo purposes, we'll try to open the native SMS app
    const encodedMessage = encodeURIComponent(smsData.message);
    const smsUrl = `sms:${smsData.number}?body=${encodedMessage}`;
    window.location.href = smsUrl;
    
    // Close the form
    setShowSmsForm(false);
    
    // Update the budget status to indicate it was shared
    if (previewBudget) {
      const updatedBudget = { ...previewBudget, shared: true, shareMethod: 'sms' };
      // Here you would typically update the budget in your database
      console.log('Updated budget:', updatedBudget);
    }
  };

  const handleExportExcel = () => {
    const excelData = mockBudgets.map(budget => ({
      'Nº Presupuesto': budget.number,
      'Fecha': new Date(budget.date).toLocaleDateString('es-ES'),
      'Válido hasta': new Date(budget.validUntil).toLocaleDateString('es-ES'),
      'Cliente': budget.client.name,
      'NIF/CIF': budget.client.nif,
      'Mascota': `${budget.pet.name} (${budget.pet.species} ${budget.pet.breed}, ${budget.pet.age} años)`,
      'Área': budget.area,
      'Concepto': budget.concept,
      'Profesional': budget.professional,
      'Importe': budget.amount,
      'Estado': budget.status === 'pending' ? 'Pendiente' : 
                budget.status === 'accepted' ? 'Aceptado' : 'Rechazado',
      'Compartido': budget.shared ? 'Sí' : 'No',
      'Método': budget.shareMethod || '-'
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Presupuestos');
    XLSX.writeFile(wb, 'presupuestos.xlsx');
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
                  Concepto
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
                <tr key={budget.id} className="hover:bg-gray-50">
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
                    <div className="text-sm font-medium text-gray-900">{budget.client.name}</div>
                    <div className="text-sm text-gray-500">{budget.client.nif}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{budget.pet.name}</div>
                    <div className="text-sm text-gray-500">
                      {budget.pet.species} {budget.pet.breed}, {budget.pet.age} años
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="font-semibold">{budget.area}</span>
                      <br />
                      {budget.concept}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {budget.amount.toLocaleString('es-ES', {
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
                    {budget.shared ? (
                      <div className="flex items-center">
                        {shareMethodIcons[budget.shareMethod]}
                        <span className="ml-1 text-sm text-gray-900">
                          {budget.shareMethod === 'email' ? 'Email' : 
                           budget.shareMethod === 'whatsapp' ? 'WhatsApp' : 'SMS'}
                        </span>
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
                    <p className="mt-1 text-sm text-gray-900">{previewBudget.client.name}</p>
                    <p className="text-sm text-gray-500">{previewBudget.client.nif}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Mascota</h4>
                    <p className="mt-1 text-sm text-gray-900">{previewBudget.pet.name}</p>
                    <p className="text-sm text-gray-500">
                      {previewBudget.pet.species} {previewBudget.pet.breed}, {previewBudget.pet.age} años
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
                  <h4 className="text-sm font-medium text-gray-500">Detalles del Presupuesto</h4>
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
                            <span className="font-semibold">{previewBudget.area}</span>
                            <br />
                            {previewBudget.concept}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-right">
                            {previewBudget.amount.toLocaleString('es-ES', {
                              style: 'currency',
                              currency: 'EUR'
                            })}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            IVA (21%)
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 text-right">
                            {(previewBudget.amount * 0.21).toLocaleString('es-ES', {
                              style: 'currency',
                              currency: 'EUR'
                            })}
                          </td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">Total</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                            {(previewBudget.amount * 1.21).toLocaleString('es-ES', {
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
                    <p className="mt-1 text-sm text-gray-900">{previewBudget.professional}</p>
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
                </div>

                {previewBudget.shared && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Compartido vía</h4>
                    <p className="mt-1 flex items-center">
                      {shareMethodIcons[previewBudget.shareMethod]}
                      <span className="ml-1 text-sm text-gray-900">
                        {previewBudget.shareMethod === 'email' ? 'Email' : 
                         previewBudget.shareMethod === 'whatsapp' ? 'WhatsApp' : 'SMS'}
                      </span>
                    </p>
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