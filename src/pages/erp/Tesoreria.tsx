import React, { useState } from 'react';
import { Calculator, DollarSign, FileText, Download, BarChart2, Calendar, Plus, Filter, Search, RefreshCw, ArrowUp, ArrowDown, X as XIcon, Check, Clock, AlertTriangle, Building2, CreditCard, Wallet, Landmark, Banknote, Repeat, FileCheck, FileX, FilePlus, Eye, Send, Mail, MessageSquare, Phone, Printer, Edit, Trash, ChevronDown, ChevronUp, ChevronsUpDown, ArrowRight, FileSignature as Signature } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Tesoreria: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cuentas' | 'pagos-cobros' | 'remesas' | 'sepa' | 'cash-flow'>('cuentas');
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState<'bank' | 'card' | 'payment' | 'cash' | null>(null);
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(false);
  const [showCashFlowDetailPanel, setShowCashFlowDetailPanel] = useState(false);
  const [cashFlowTab, setCashFlowTab] = useState<'budget' | 'result'>('budget');
  const [showNewSEPAMandateForm, setShowNewSEPAMandateForm] = useState(false);
  const [showSEPAMandateDetailModal, setShowSEPAMandateDetailModal] = useState(false);
  const [showSEPAPreviewModal, setShowSEPAPreviewModal] = useState(false);
  const [selectedSEPAMandate, setSelectedSEPAMandate] = useState<any>(null);

  // SEPA Mandate form state
  const [sepaForm, setSepaForm] = useState({
    reference: '',
    creditorId: 'ES12345678A',
    creditorName: 'ClinicPro',
    creditorAddress: 'Calle de Beatriz de Bobadilla, 9',
    creditorPostalCode: '28040',
    creditorCity: 'Madrid',
    creditorCountry: 'España',
    debtorName: '',
    debtorAddress: '',
    debtorPostalCode: '',
    debtorCity: '',
    debtorCountry: 'España',
    swiftBic: '',
    iban: '',
    mandateType: 'recurrent',
    signDate: new Date().toISOString().split('T')[0],
    signLocation: 'Madrid',
    signatureAccepted: false,
    client: '',
    concept: '',
    dueDate: '',
    amount: '',
    sendByEmail: false,
    sendByWhatsApp: false,
    sendBySMS: false
  });

  // New payment form state
  const [paymentForm, setPaymentForm] = useState({
    date: new Date().toISOString().split('T')[0],
    contact: '',
    bank: '',
    description: '',
    amount: '',
    paymentType: 'without_invoice',
    invoice: '',
    paymentMethod: 'cash',
    sendByEmail: false,
    sendBySMS: false,
    sendByWhatsApp: false
  });

  // Mock data for SEPA mandates
  const sepaMandates = [
    {
      id: '1',
      reference: 'SEPA-2025-001',
      date: '2025-05-15',
      concept: 'Suscripción PetPass Premium',
      client: 'María García',
      type: 'CORE',
      items: 12,
      amount: 240.00,
      status: 'signed'
    },
    {
      id: '2',
      reference: 'SEPA-2025-002',
      date: '2025-05-18',
      concept: 'Tratamiento Dental Anual',
      client: 'Carlos Rodríguez',
      type: 'CORE',
      items: 4,
      amount: 320.00,
      status: 'pending'
    },
    {
      id: '3',
      reference: 'SEPA-2025-003',
      date: '2025-05-10',
      concept: 'Plan Vacunación Completo',
      client: 'Laura Martínez',
      type: 'B2B',
      items: 6,
      amount: 180.00,
      status: 'rejected'
    }
  ];

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

  const handleAddAccount = (type: 'bank' | 'card' | 'payment' | 'cash') => {
    setSelectedAccountType(type);
  };

  const handleSubmitAccount = () => {
    // Here you would typically submit the account form
    console.log('Submitting account form for type:', selectedAccountType);
    setShowAddAccountModal(false);
    setSelectedAccountType(null);
  };

  const handleSubmitPayment = () => {
    // Here you would typically submit the payment form
    console.log('Submitting payment form:', paymentForm);
    setShowNewPaymentModal(false);
  };

  const handleSubmitSEPAMandate = () => {
    // Here you would typically submit the SEPA mandate form
    console.log('Submitting SEPA mandate form:', sepaForm);
    setShowNewSEPAMandateForm(false);
  };

  const handleSEPAFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setSepaForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePaymentFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setPaymentForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleViewSEPAMandateDetail = (mandate: any) => {
    setSelectedSEPAMandate(mandate);
    setShowSEPAMandateDetailModal(true);
  };

  const handlePreviewSEPAMandate = () => {
    setShowSEPAPreviewModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tesorería</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión de cuentas bancarias, pagos y cobros
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
            onClick={() => {
              if (activeTab === 'cuentas') {
                setShowAddAccountModal(true);
              } else if (activeTab === 'pagos-cobros') {
                setShowNewPaymentModal(true);
              } else if (activeTab === 'sepa') {
                setShowNewSEPAMandateForm(true);
              }
            }}
          >
            {activeTab === 'cuentas' ? 'Añadir cuenta' : 
             activeTab === 'pagos-cobros' ? 'Nuevo pago' : 
             activeTab === 'sepa' ? 'Nuevo mandato SEPA' : 'Nuevo'}
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
            onClick={() => setActiveTab('cuentas')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'cuentas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Cuentas
          </button>
          <button
            onClick={() => setActiveTab('pagos-cobros')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'pagos-cobros'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Pagos y Cobros
          </button>
          <button
            onClick={() => setActiveTab('remesas')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'remesas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Remesas
          </button>
          <button
            onClick={() => setActiveTab('sepa')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'sepa'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            SEPA
          </button>
          <button
            onClick={() => setActiveTab('cash-flow')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'cash-flow'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Cash Flow
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'cuentas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Saldo Total</h3>
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
                  <h3 className="text-lg font-medium text-gray-900">Cuentas Bancarias</h3>
                  <Building2 className="h-5 w-5 text-blue-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-blue-600">3</p>
                <p className="mt-1 text-sm text-gray-500">cuentas activas</p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Tarjetas</h3>
                  <CreditCard className="h-5 w-5 text-purple-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-purple-600">2</p>
                <p className="mt-1 text-sm text-gray-500">tarjetas activas</p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Efectivo</h3>
                  <Wallet className="h-5 w-5 text-green-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-green-600">1</p>
                <p className="mt-1 text-sm text-gray-500">cajas activas</p>
              </div>
            </Card>
          </div>

          <Card title="Cuentas" icon={<Landmark size={20} />}>
            <div className="p-4 space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Número/IBAN
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Saldo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Última Actualización
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
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="h-5 w-5 text-blue-500 mr-2" />
                          <div className="text-sm font-medium text-gray-900">Cuenta Principal</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Banco</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">ES12 3456 7890 1234 5678 9012</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">85.250,00 €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Hoy, 10:15</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Activa
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="text">Ver movimientos</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Building2 className="h-5 w-5 text-blue-500 mr-2" />
                          <div className="text-sm font-medium text-gray-900">Cuenta Secundaria</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Banco</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">ES98 7654 3210 9876 5432 1098</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">32.500,00 €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Ayer, 18:30</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Activa
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="text">Ver movimientos</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-purple-500 mr-2" />
                          <div className="text-sm font-medium text-gray-900">Tarjeta Empresa</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Tarjeta</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">**** **** **** 5678</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">-2.500,00 €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Hace 2 días</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Activa
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="text">Ver movimientos</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Wallet className="h-5 w-5 text-green-500 mr-2" />
                          <div className="text-sm font-medium text-gray-900">Caja Principal</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Efectivo</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">-</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">1.250,00 €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Hoy, 09:00</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Activa
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="text">Ver movimientos</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'pagos-cobros' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Ingresos</h3>
                  <ArrowUp className="h-5 w-5 text-green-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-green-600">+15.750,00 €</p>
                <div className="mt-2 flex items-center">
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">12.5% vs. mes anterior</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Gastos</h3>
                  <ArrowDown className="h-5 w-5 text-red-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-red-600">-8.250,00 €</p>
                <div className="mt-2 flex items-center">
                  <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">5.2% vs. mes anterior</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Balance</h3>
                  <Calculator className="h-5 w-5 text-gray-400" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">+7.500,00 €</p>
                <div className="mt-2 flex items-center">
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">18.3% vs. mes anterior</span>
                </div>
              </div>
            </Card>
          </div>

          <Card title="Pagos y Cobros" icon={<DollarSign size={20} />}>
            <div className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Buscar por concepto, cliente..."
                  icon={<Search size={18} />}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  icon={<Filter size={18} />}
                >
                  Filtros
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Concepto
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contacto
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cuenta
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
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">15/05/2025</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Factura #INV-2025-001</div>
                        <div className="text-xs text-gray-500">Consulta veterinaria</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">María García</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Cuenta Principal</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">+75,00 €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completado
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="text">Ver detalles</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">14/05/2025</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Pago a proveedor</div>
                        <div className="text-xs text-gray-500">Medicamentos</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">VetSupplies S.L.</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Cuenta Principal</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-red-600">-1.250,00 €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completado
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="text">Ver detalles</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">13/05/2025</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Factura #INV-2025-002</div>
                        <div className="text-xs text-gray-500">Peluquería canina</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Carlos Rodríguez</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Caja Principal</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">+45,00 €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completado
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="text">Ver detalles</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">12/05/2025</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Pago de alquiler</div>
                        <div className="text-xs text-gray-500">Mayo 2025</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Inmobiliaria XYZ</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Cuenta Principal</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-red-600">-2.500,00 €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completado
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="text">Ver detalles</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'remesas' && (
        <div className="space-y-6">
          <Card title="Remesas" icon={<Repeat size={20} />}>
            <div className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Buscar remesas..."
                  icon={<Search size={18} />}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  icon={<Filter size={18} />}
                >
                  Filtros
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Concepto
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nº Items
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
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">15/05/2025</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Remesa mensual</div>
                        <div className="text-xs text-gray-500">Cuotas PetPass</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Cobro</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">45</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">+4.500,00 €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Procesada
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="text">Ver detalles</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">10/05/2025</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Remesa proveedores</div>
                        <div className="text-xs text-gray-500">Pagos mensuales</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Pago</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">12</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-red-600">-8.750,00 €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Procesada
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="text">Ver detalles</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">05/05/2025</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Remesa seguros</div>
                        <div className="text-xs text-gray-500">Cobros trimestrales</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Cobro</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">28</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">+3.360,00 €</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pendiente
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="text">Ver detalles</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'sepa' && (
        <div className="space-y-6">
          <Card title="Mandatos SEPA" icon={<FileCheck size={20} />}>
            <div className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Buscar mandatos SEPA..."
                  icon={<Search size={18} />}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  icon={<Filter size={18} />}
                >
                  Filtros
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referencia
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Concepto
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
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
                    {sepaMandates.map((mandate) => (
                      <tr key={mandate.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{mandate.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{mandate.reference}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{mandate.concept}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{mandate.client}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{mandate.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {mandate.amount.toLocaleString('es-ES', {
                              style: 'currency',
                              currency: 'EUR'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            mandate.status === 'signed' 
                              ? 'bg-green-100 text-green-800' 
                              : mandate.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {mandate.status === 'signed' 
                              ? 'Firmado' 
                              : mandate.status === 'pending'
                              ? 'Pendiente'
                              : 'Rechazado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2 justify-end">
                            <Button 
                              variant="text" 
                              size="sm"
                              onClick={() => handleViewSEPAMandateDetail(mandate)}
                            >
                              Ver Detalles
                            </Button>
                            {mandate.status === 'pending' && (
                              <Button 
                                variant="text" 
                                size="sm"
                                icon={<Send size={16} />}
                              >
                                Reenviar
                              </Button>
                            )}
                            <Button 
                              variant="text" 
                              size="sm"
                              icon={<Download size={16} />}
                            >
                              Descargar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center cursor-pointer" onClick={() => setShowNewSEPAMandateForm(!showNewSEPAMandateForm)}>
                    <h3 className="text-sm font-medium text-gray-900">Crear nuevo mandato SEPA</h3>
                    {showNewSEPAMandateForm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                  
                  {showNewSEPAMandateForm && (
                    <div className="p-4 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-4">Datos del Acreedor</h4>
                          <div className="space-y-4">
                            <Input
                              label="Referencia de la orden de domiciliación"
                              name="reference"
                              value={sepaForm.reference}
                              onChange={handleSEPAFormChange}
                              placeholder="SEPA-2025-XXX"
                              required
                            />
                            <Input
                              label="Identificador del acreedor"
                              name="creditorId"
                              value={sepaForm.creditorId}
                              onChange={handleSEPAFormChange}
                              placeholder="ES12345678A"
                              required
                            />
                            <Input
                              label="Nombre del acreedor"
                              name="creditorName"
                              value={sepaForm.creditorName}
                              onChange={handleSEPAFormChange}
                              placeholder="ClinicPro"
                              required
                            />
                            <Input
                              label="Dirección"
                              name="creditorAddress"
                              value={sepaForm.creditorAddress}
                              onChange={handleSEPAFormChange}
                              placeholder="Calle, número"
                              required
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <Input
                                label="Código Postal"
                                name="creditorPostalCode"
                                value={sepaForm.creditorPostalCode}
                                onChange={handleSEPAFormChange}
                                placeholder="28040"
                                required
                              />
                              <Input
                                label="Población"
                                name="creditorCity"
                                value={sepaForm.creditorCity}
                                onChange={handleSEPAFormChange}
                                placeholder="Madrid"
                                required
                              />
                            </div>
                            <Input
                              label="País"
                              name="creditorCountry"
                              value={sepaForm.creditorCountry}
                              onChange={handleSEPAFormChange}
                              placeholder="España"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-4">Datos del Deudor</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cliente
                              </label>
                              <select
                                name="client"
                                value={sepaForm.client}
                                onChange={handleSEPAFormChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                required
                              >
                                <option value="">Seleccionar cliente</option>
                                <option value="1">María García</option>
                                <option value="2">Carlos Rodríguez</option>
                                <option value="3">Laura Martínez</option>
                              </select>
                            </div>
                            <Input
                              label="Nombre del deudor"
                              name="debtorName"
                              value={sepaForm.debtorName}
                              onChange={handleSEPAFormChange}
                              placeholder="Nombre completo"
                              required
                            />
                            <Input
                              label="Dirección"
                              name="debtorAddress"
                              value={sepaForm.debtorAddress}
                              onChange={handleSEPAFormChange}
                              placeholder="Calle, número"
                              required
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <Input
                                label="Código Postal"
                                name="debtorPostalCode"
                                value={sepaForm.debtorPostalCode}
                                onChange={handleSEPAFormChange}
                                placeholder="28001"
                                required
                              />
                              <Input
                                label="Población"
                                name="debtorCity"
                                value={sepaForm.debtorCity}
                                onChange={handleSEPAFormChange}
                                placeholder="Madrid"
                                required
                              />
                            </div>
                            <Input
                              label="País"
                              name="debtorCountry"
                              value={sepaForm.debtorCountry}
                              onChange={handleSEPAFormChange}
                              placeholder="España"
                              required
                            />
                            <Input
                              label="Swift BIC"
                              name="swiftBic"
                              value={sepaForm.swiftBic}
                              onChange={handleSEPAFormChange}
                              placeholder="XXXXESMMXXX"
                              required
                            />
                            <Input
                              label="Número de cuenta IBAN"
                              name="iban"
                              value={sepaForm.iban}
                              onChange={handleSEPAFormChange}
                              placeholder="ES12 3456 7890 1234 5678 9012"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-4">Datos del Mandato</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de mandato
                              </label>
                              <div className="mt-2 space-x-4">
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    name="mandateType"
                                    value="recurrent"
                                    checked={sepaForm.mandateType === 'recurrent'}
                                    onChange={handleSEPAFormChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">Pago recurrente</span>
                                </label>
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    name="mandateType"
                                    value="one-time"
                                    checked={sepaForm.mandateType === 'one-time'}
                                    onChange={handleSEPAFormChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">Pago único</span>
                                </label>
                              </div>
                            </div>
                            <Input
                              label="Concepto"
                              name="concept"
                              value={sepaForm.concept}
                              onChange={handleSEPAFormChange}
                              placeholder="Ej: Suscripción PetPass"
                              required
                            />
                            <Input
                              label="Importe"
                              name="amount"
                              type="number"
                              value={sepaForm.amount}
                              onChange={handleSEPAFormChange}
                              placeholder="0.00"
                              required
                            />
                            <Input
                              label="Fecha de vencimiento"
                              name="dueDate"
                              type="date"
                              value={sepaForm.dueDate}
                              onChange={handleSEPAFormChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-4">Firma y Envío</h4>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <Input
                                label="Fecha de firma"
                                name="signDate"
                                type="date"
                                value={sepaForm.signDate}
                                onChange={handleSEPAFormChange}
                                required
                              />
                              <Input
                                label="Localidad de firma"
                                name="signLocation"
                                value={sepaForm.signLocation}
                                onChange={handleSEPAFormChange}
                                placeholder="Madrid"
                                required
                              />
                            </div>
                            
                            <div className="mt-4">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="signatureAccepted"
                                  checked={sepaForm.signatureAccepted}
                                  onChange={handleSEPAFormChange}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                  Acepto la orden de domiciliación
                                </span>
                              </label>
                              <p className="mt-1 text-xs text-gray-500">
                                Mediante la firma de esta orden de domiciliación, el deudor autoriza al acreedor a enviar instrucciones a la entidad del deudor para adeudar su cuenta y a la entidad para efectuar los adeudos en su cuenta siguiendo las instrucciones del acreedor.
                              </p>
                            </div>
                            
                            <div className="mt-4">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Enviar mandato al cliente</h5>
                              <div className="space-y-2">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    name="sendByEmail"
                                    checked={sepaForm.sendByEmail}
                                    onChange={handleSEPAFormChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">
                                    Enviar por Email
                                  </span>
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    name="sendByWhatsApp"
                                    checked={sepaForm.sendByWhatsApp}
                                    onChange={handleSEPAFormChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">
                                    Enviar por WhatsApp
                                  </span>
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    name="sendBySMS"
                                    checked={sepaForm.sendBySMS}
                                    onChange={handleSEPAFormChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">
                                    Enviar por SMS
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowNewSEPAMandateForm(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="outline"
                          icon={<Eye size={18} />}
                          onClick={handlePreviewSEPAMandate}
                        >
                          Previsualizar
                        </Button>
                        <div className="relative">
                          <Button
                            variant="primary"
                            icon={<Send size={18} />}
                            onClick={handleSubmitSEPAMandate}
                          >
                            Enviar Mandato
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'cash-flow' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Saldo Actual</h3>
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">116.500,00 €</p>
                <div className="mt-2 flex items-center">
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+7.500,00 € este mes</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Previsión a 30 días</h3>
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-blue-600">+12.500,00 €</p>
                <div className="mt-2 flex items-center">
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">Saldo estimado: 129.000,00 €</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Previsión a 90 días</h3>
                  <Calendar className="h-5 w-5 text-purple-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-purple-600">+35.000,00 €</p>
                <div className="mt-2 flex items-center">
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">Saldo estimado: 151.500,00 €</span>
                </div>
              </div>
            </Card>
          </div>

          <Card title="Flujo de Caja" icon={<BarChart2 size={20} />}>
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Evolución del Flujo de Caja</h3>
                <Button
                  variant="outline"
                  icon={<Eye size={18} />}
                  onClick={() => setShowCashFlowDetailPanel(true)}
                >
                  Ver detalle
                </Button>
              </div>
              
              <div className="h-80 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Gráfico de evolución del flujo de caja</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h4 className="text-sm font-medium text-green-800">Ingresos Previstos</h4>
                  <p className="mt-2 text-2xl font-bold text-green-600">+45.000,00 €</p>
                  <p className="mt-1 text-xs text-green-700">Próximos 90 días</p>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                  <h4 className="text-sm font-medium text-red-800">Gastos Previstos</h4>
                  <p className="mt-2 text-2xl font-bold text-red-600">-10.000,00 €</p>
                  <p className="mt-1 text-xs text-red-700">Próximos 90 días</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-800">Balance Previsto</h4>
                  <p className="mt-2 text-2xl font-bold text-blue-600">+35.000,00 €</p>
                  <p className="mt-1 text-xs text-blue-700">Próximos 90 días</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddAccountModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedAccountType 
                  ? `Añadir cuenta de ${
                      selectedAccountType === 'bank' 
                        ? 'banco' 
                        : selectedAccountType === 'card'
                        ? 'tarjeta'
                        : selectedAccountType === 'payment'
                        ? 'pasarela de pago'
                        : 'caja'
                    }`
                  : 'Indica qué tipo de cuenta quieres añadir'
                }
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => {
                  setShowAddAccountModal(false);
                  setSelectedAccountType(null);
                }}
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="px-6 py-4">
              {!selectedAccountType ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAddAccount('bank')}
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Banco</h4>
                        <p className="text-sm text-gray-500">Añadir cuenta bancaria</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAddAccount('card')}
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-purple-100">
                        <CreditCard className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Tarjeta</h4>
                        <p className="text-sm text-gray-500">Añadir tarjeta de crédito/débito</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAddAccount('payment')}
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-indigo-100">
                        <Banknote className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Pasarela de pago</h4>
                        <p className="text-sm text-gray-500">Conectar PayPal, Stripe, etc.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAddAccount('cash')}
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-green-100">
                        <Wallet className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">Caja</h4>
                        <p className="text-sm text-gray-500">Añadir caja de efectivo</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : selectedAccountType === 'bank' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de la entidad
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Ej: Santander, BBVA, CaixaBank..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IBAN
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="ES12 3456 7890 1234 5678 9012"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alias
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Ej: Cuenta Principal"
                    />
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Sincronizar con API bancaria
                      </span>
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      Permite la sincronización automática de movimientos a través de la API de tu banco.
                    </p>
                  </div>
                </div>
              ) : selectedAccountType === 'card' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emisor
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Ej: Visa, Mastercard, American Express..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de tarjeta
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="**** **** **** 1234"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de caducidad
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="MM/AA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alias
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Ej: Tarjeta Empresa"
                      />
                    </div>
                  </div>
                </div>
              ) : selectedAccountType === 'payment' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pasarela de pago
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Seleccionar pasarela</option>
                      <option value="paypal">PayPal</option>
                      <option value="stripe">Stripe</option>
                      <option value="redsys">Redsys</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID de Cliente / API Key
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Ej: pk_live_..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Clave Secreta
                    </label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="••••••••••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alias
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Ej: Stripe Principal"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de la caja
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Ej: Caja Principal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Saldo inicial
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Moneda
                    </label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="EUR">EUR - Euro</option>
                      <option value="USD">USD - Dólar Estadounidense</option>
                      <option value="GBP">GBP - Libra Esterlina</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  if (selectedAccountType) {
                    setSelectedAccountType(null);
                  } else {
                    setShowAddAccountModal(false);
                  }
                }}
                className="mr-3"
              >
                {selectedAccountType ? 'Atrás' : 'Cancelar'}
              </Button>
              {selectedAccountType && (
                <Button 
                  variant="primary" 
                  onClick={handleSubmitAccount}
                >
                  {selectedAccountType === 'payment' ? 'Conectar cuenta' : 'Crear cuenta'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Payment Modal */}
      {showNewPaymentModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Crear pago
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowNewPaymentModal(false)}
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="px-6 py-4">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Fecha"
                    type="date"
                    name="date"
                    value={paymentForm.date}
                    onChange={handlePaymentFormChange}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contacto
                    </label>
                    <select
                      name="contact"
                      value={paymentForm.contact}
                      onChange={handlePaymentFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    >
                      <option value="">Seleccionar contacto</option>
                      <option value="1">María García</option>
                      <option value="2">Carlos Rodríguez</option>
                      <option value="3">VetSupplies S.L.</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Banco
                    </label>
                    <select
                      name="bank"
                      value={paymentForm.bank}
                      onChange={handlePaymentFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    >
                      <option value="">Seleccionar cuenta</option>
                      <option value="1">Cuenta Principal</option>
                      <option value="2">Cuenta Secundaria</option>
                      <option value="3">Caja Principal</option>
                    </select>
                  </div>
                  <Input
                    label="Importe"
                    type="number"
                    name="amount"
                    value={paymentForm.amount}
                    onChange={handlePaymentFormChange}
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={paymentForm.description}
                    onChange={handlePaymentFormChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Añade una descripción..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de pago
                  </label>
                  <div className="mt-2 space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="paymentType"
                        value="without_invoice"
                        checked={paymentForm.paymentType === 'without_invoice'}
                        onChange={handlePaymentFormChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Sin factura</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="paymentType"
                        value="with_invoice"
                        checked={paymentForm.paymentType === 'with_invoice'}
                        onChange={handlePaymentFormChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Con factura</span>
                    </label>
                  </div>
                </div>
                
                {paymentForm.paymentType === 'with_invoice' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Factura
                    </label>
                    <select
                      name="invoice"
                      value={paymentForm.invoice}
                      onChange={handlePaymentFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    >
                      <option value="">Seleccionar factura</option>
                      <option value="1">INV-2025-001 - María García (75,00 €)</option>
                      <option value="2">INV-2025-002 - Carlos Rodríguez (45,00 €)</option>
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Método de pago
                  </label>
                  <select
                    name="paymentMethod"
                    value={paymentForm.paymentMethod}
                    onChange={handlePaymentFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="cash">Efectivo</option>
                    <option value="transfer">Transferencia</option>
                    <option value="card">Tarjeta</option>
                  </select>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Opciones de comunicación</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="sendByEmail"
                        checked={paymentForm.sendByEmail}
                        onChange={handlePaymentFormChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Enviar notificación por Email
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="sendBySMS"
                        checked={paymentForm.sendBySMS}
                        onChange={handlePaymentFormChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Enviar notificación por SMS
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="sendByWhatsApp"
                        checked={paymentForm.sendByWhatsApp}
                        onChange={handlePaymentFormChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Enviar notificación por WhatsApp
                      </span>
                    </label>
                  </div>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowNewPaymentModal(false)}
                className="mr-3"
              >
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSubmitPayment}
              >
                Crear Pago
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cash Flow Detail Panel */}
      {showCashFlowDetailPanel && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Detalle de Flujo de Caja
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowCashFlowDetailPanel(false)}
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setCashFlowTab('budget')}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      cashFlowTab === 'budget'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Presupuesto
                  </button>
                  <button
                    onClick={() => setCashFlowTab('result')}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      cashFlowTab === 'result'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Resultado
                  </button>
                </div>
                <div className="flex space-x-3">
                  <select
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="main">Escenario Principal</option>
                    <option value="alt1">Escenario Alternativo 1</option>
                    <option value="alt2">Escenario Alternativo 2</option>
                  </select>
                  <Button
                    variant="outline"
                    icon={<Download size={18} />}
                  >
                    Exportar
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Concepto
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enero
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Febrero
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Marzo
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Abril
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mayo
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Junio
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        Saldo Inicial
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        100.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        107.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        115.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        122.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        130.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        137.500,00 €
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-green-600">
                        Ingresos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-green-600">
                        15.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-green-600">
                        15.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-green-600">
                        15.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-green-600">
                        15.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-green-600">
                        15.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-green-600">
                        15.000,00 €
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap pl-8">
                        Consultas
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        8.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        8.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        8.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        8.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        8.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        8.000,00 €
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap pl-8">
                        Peluquería
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        3.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        3.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        3.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        3.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        3.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        3.000,00 €
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap pl-8">
                        Tienda
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        4.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        4.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        4.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        4.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        4.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        4.000,00 €
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-red-600">
                        Gastos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-red-600">
                        -7.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-red-600">
                        -7.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-red-600">
                        -7.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-red-600">
                        -7.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-red-600">
                        -7.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-red-600">
                        -7.500,00 €
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap pl-8">
                        Personal
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        -5.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        -5.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        -5.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        -5.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        -5.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        -5.000,00 €
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap pl-8">
                        Alquiler
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        -1.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        -1.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        -1.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        -1.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        -1.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        -1.500,00 €
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap pl-8">
                        Suministros
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        -1.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        -1.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        -1.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        -1.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        -1.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        -1.000,00 €
                      </td>
                    </tr>
                    <tr className="bg-gray-50 font-medium">
                      <td className="px-6 py-4 whitespace-nowrap">
                        Flujo de Caja Neto
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        +7.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        +7.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        +7.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        +7.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        +7.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        +7.500,00 €
                      </td>
                    </tr>
                    <tr className="bg-blue-50 font-medium">
                      <td className="px-6 py-4 whitespace-nowrap">
                        Saldo Final
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        107.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        115.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        122.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        130.000,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        137.500,00 €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        145.000,00 €
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowCashFlowDetailPanel(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SEPA Mandate Detail Modal */}
      {showSEPAMandateDetailModal && selectedSEPAMandate && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Detalles del Mandato SEPA
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => {
                  setShowSEPAMandateDetailModal(false);
                  setSelectedSEPAMandate(null);
                }}
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Referencia</h4>
                    <p className="mt-1 text-base font-medium text-gray-900">{selectedSEPAMandate.reference}</p>
                  </div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedSEPAMandate.status === 'signed' 
                      ? 'bg-green-100 text-green-800' 
                      : selectedSEPAMandate.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedSEPAMandate.status === 'signed' 
                      ? 'Firmado' 
                      : selectedSEPAMandate.status === 'pending'
                      ? 'Pendiente'
                      : 'Rechazado'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Fecha</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedSEPAMandate.date}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Tipo</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedSEPAMandate.type}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Concepto</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedSEPAMandate.concept}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Cliente</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedSEPAMandate.client}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Importe</h4>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {selectedSEPAMandate.amount.toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </p>
                </div>
                
                {selectedSEPAMandate.status === 'signed' && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <h4 className="text-sm font-medium text-green-800">Información de Firma</h4>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-green-700">Fecha de firma</p>
                        <p className="text-sm font-medium text-green-900">18/05/2025</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-700">Método de firma</p>
                        <p className="text-sm font-medium text-green-900">Email</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedSEPAMandate.status === 'rejected' && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <h4 className="text-sm font-medium text-red-800">Información de Rechazo</h4>
                    <div className="mt-2">
                      <p className="text-xs text-red-700">Motivo de rechazo</p>
                      <p className="text-sm font-medium text-red-900">El cliente ha rechazado la domiciliación</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button 
                variant="outline"
                icon={<Download size={18} />}
              >
                Descargar PDF
              </Button>
              {selectedSEPAMandate.status === 'pending' && (
                <Button 
                  variant="outline"
                  icon={<Send size={18} />}
                >
                  Reenviar
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowSEPAMandateDetailModal(false);
                  setSelectedSEPAMandate(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SEPA Mandate Preview Modal */}
      {showSEPAPreviewModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Vista Previa del Mandato SEPA
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowSEPAPreviewModal(false)}
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white p-8 border border-gray-300 rounded-lg max-w-3xl mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold">ORDEN DE DOMICILIACIÓN DE ADEUDO DIRECTO SEPA</h2>
                  <p className="text-sm text-gray-600">SEPA Direct Debit Mandate</p>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm font-medium">Referencia de la orden de domiciliación / Mandate reference:</p>
                  <p className="text-lg font-bold border-b border-gray-300 pb-1">{sepaForm.reference || 'SEPA-2025-XXX'}</p>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm font-medium">Identificador del acreedor / Creditor identifier:</p>
                  <p className="text-lg font-bold border-b border-gray-300 pb-1">{sepaForm.creditorId}</p>
                </div>
                
                <div className="mb-8">
                  <p className="text-sm font-medium">Nombre del acreedor / Creditor's name:</p>
                  <p className="text-lg font-bold border-b border-gray-300 pb-1">{sepaForm.creditorName}</p>
                  
                  <p className="text-sm font-medium mt-2">Dirección / Address:</p>
                  <p className="border-b border-gray-300 pb-1">{sepaForm.creditorAddress}</p>
                  
                  <p className="text-sm font-medium mt-2">Código Postal - Población - Provincia / Postal Code - City - Town:</p>
                  <p className="border-b border-gray-300 pb-1">{sepaForm.creditorPostalCode} {sepaForm.creditorCity}</p>
                  
                  <p className="text-sm font-medium mt-2">País / Country:</p>
                  <p className="border-b border-gray-300 pb-1">{sepaForm.creditorCountry}</p>
                </div>
                
                <div className="mb-8">
                  <p className="text-sm">Mediante la firma de esta orden de domiciliación, el deudor autoriza (A) al acreedor a enviar instrucciones a la entidad del deudor para adeudar su cuenta y (B) a la entidad para efectuar los adeudos en su cuenta siguiendo las instrucciones del acreedor. Como parte de sus derechos, el deudor está legitimado al reembolso por su entidad en los términos y condiciones del contrato suscrito con la misma. La solicitud de reembolso deberá efectuarse dentro de las ocho semanas que siguen a la fecha de adeudo en cuenta.</p>
                  <p className="text-sm text-gray-600 mt-2">By signing this mandate form, you authorize (A) the Creditor to send instructions to your bank to debit your account and (B) your bank to debit your account in accordance with the instructions from the Creditor. As part of your rights, you are entitled to a refund from your bank under the terms and conditions of your agreement with your bank. A refund must be claimed within eight weeks starting from the date on which your account was debited.</p>
                </div>
                
                <div className="mb-8">
                  <p className="text-sm font-medium">Nombre del deudor / Debtor's name:</p>
                  <p className="text-lg font-bold border-b border-gray-300 pb-1">{sepaForm.debtorName || '[Nombre del cliente]'}</p>
                  
                  <p className="text-sm font-medium mt-2">Dirección / Address:</p>
                  <p className="border-b border-gray-300 pb-1">{sepaForm.debtorAddress || '[Dirección del cliente]'}</p>
                  
                  <p className="text-sm font-medium mt-2">Código Postal - Población - Provincia / Postal Code - City - Town:</p>
                  <p className="border-b border-gray-300 pb-1">{sepaForm.debtorPostalCode || '[CP]'} {sepaForm.debtorCity || '[Ciudad]'}</p>
                  
                  <p className="text-sm font-medium mt-2">País / Country:</p>
                  <p className="border-b border-gray-300 pb-1">{sepaForm.debtorCountry}</p>
                </div>
                
                <div className="mb-8">
                  <p className="text-sm font-medium">Swift BIC:</p>
                  <p className="border-b border-gray-300 pb-1">{sepaForm.swiftBic || '[SWIFT BIC]'}</p>
                  
                  <p className="text-sm font-medium mt-2">Número de cuenta - IBAN / Account number - IBAN:</p>
                  <p className="text-lg font-bold border-b border-gray-300 pb-1">{sepaForm.iban || '[IBAN]'}</p>
                  <p className="text-xs text-gray-600 mt-1">En España el IBAN consta de 24 posiciones comenzando siempre por ES / Spanish IBAN of 24 positions always starting ES</p>
                </div>
                
                <div className="mb-8">
                  <p className="text-sm font-medium">Tipo de pago / Type of payment:</p>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center mr-6">
                      <div className={`h-4 w-4 border rounded-full flex items-center justify-center ${sepaForm.mandateType === 'recurrent' ? 'border-blue-600' : 'border-gray-300'}`}>
                        {sepaForm.mandateType === 'recurrent' && <div className="h-2 w-2 rounded-full bg-blue-600"></div>}
                      </div>
                      <span className="ml-2 text-sm">Pago recurrente / Recurrent payment</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`h-4 w-4 border rounded-full flex items-center justify-center ${sepaForm.mandateType === 'one-time' ? 'border-blue-600' : 'border-gray-300'}`}>
                        {sepaForm.mandateType === 'one-time' && <div className="h-2 w-2 rounded-full bg-blue-600"></div>}
                      </div>
                      <span className="ml-2 text-sm">Pago único / One-off payment</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Fecha / Date:</p>
                      <p className="border-b border-gray-300 pb-1">{sepaForm.signDate || new Date().toLocaleDateString('es-ES')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Localidad / Location:</p>
                      <p className="border-b border-gray-300 pb-1">{sepaForm.signLocation}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium">Firma del deudor / Signature of the debtor:</p>
                  <div className="h-20 border border-gray-300 rounded-lg mt-2 flex items-center justify-center">
                    {sepaForm.signatureAccepted ? (
                      <div className="flex items-center text-green-600">
                        <Check size={24} className="mr-2" />
                        <span className="font-medium">Firmado electrónicamente</span>
                      </div>
                    ) : (
                      <div className="text-gray-400 flex items-center">
                        <Signature size={24} className="mr-2" />
                        <span>Pendiente de firma</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-gray-600 mt-8">
                  <p>TODOS LOS CAMPOS HAN DE SER CUMPLIMENTADOS OBLIGATORIAMENTE.</p>
                  <p>UNA VEZ FIRMADA ESTA ORDEN DE DOMICILIACIÓN DEBE SER ENVIADA AL ACREEDOR PARA SU CUSTODIA.</p>
                  <p>ALL GAPS ARE MANDATORY. ONCE THIS MANDATE HAS BEEN SIGNED MUST BE SENT TO CREDITOR FOR STORAGE.</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <div className="relative">
                <Button
                  variant="outline"
                  icon={<Send size={18} />}
                >
                  Enviar
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden">
                  <div className="py-1">
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Mail size={16} className="inline mr-2" />
                      Enviar por Email
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <MessageSquare size={16} className="inline mr-2" />
                      Enviar por WhatsApp
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Phone size={16} className="inline mr-2" />
                      Enviar por SMS
                    </button>
                  </div>
                </div>
              </div>
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
                onClick={() => setShowSEPAPreviewModal(false)}
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

export default Tesoreria;