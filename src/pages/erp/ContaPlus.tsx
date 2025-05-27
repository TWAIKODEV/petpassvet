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
  X as XIcon,
  Plus,
  Check,
  Clock,
  AlertTriangle,
  DollarSign, 
  BarChart2, 
  TrendingUp,
  ArrowUp,
  ArrowDown,
  PieChart,
  Calculator,
  BookOpen,
  Settings,
  Edit,
  Trash,
  List,
  Link,
  Tag,
  Upload,
  ChevronDown,
  Database,
  Briefcase,
  ArrowRight,
  Percent
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Contabilidad: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cuentas' | 'diario' | 'activos' | 'perdidas' | 'balance'>('cuentas');
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [showEditAccountModal, setShowEditAccountModal] = useState(false);
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [showNewAssetModal, setShowNewAssetModal] = useState(false);
  const [assetFormStep, setAssetFormStep] = useState<'definition' | 'amortization'>('definition');
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [accountForm, setAccountForm] = useState({
    type: '',
    name: '',
    number: '',
    color: '#3B82F6' // Default blue color
  });
  const [entryForm, setEntryForm] = useState({
    type: 'standard',
    template: '',
    date: new Date().toISOString().split('T')[0],
    lines: [
      {
        account: '',
        description: '',
        document: '',
        debit: '',
        credit: '',
        tags: []
      }
    ],
    notes: '',
    file: null
  });
  const [assetForm, setAssetForm] = useState({
    // Definition step
    name: '',
    contact: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    serialNumber: '',
    tags: '',
    description: '',
    account: '',
    initialValue: '',
    units: '1',
    // Amortization step
    amortizationStartDate: new Date().toISOString().split('T')[0],
    amortizationConcept: 'linear',
    amortizationPeriod: 'annual',
    amortizationCoefficient: '10',
    amortizationYears: '10',
    accumulatedAmortizationAccount: '2818',
    amortizationExpenseAccount: '681',
    accumulatedAmortization: '0',
    adjust: false
  });

  // Mock data for accounts
  const accountGroups = [
    { id: '1', name: 'Activo' },
    { id: '2', name: 'Pasivo' },
    { id: '3', name: 'Patrimonio Neto' },
    { id: '4', name: 'Gastos' },
    { id: '5', name: 'Ingresos' },
    { id: '6', name: 'Compras y Gastos' },
    { id: '7', name: 'Ventas e Ingresos' }
  ];

  const accounts = [
    { id: '1', number: '100', name: 'Capital social', group: '3', debit: 0, credit: 300000, balance: -300000, color: '#3B82F6' },
    { id: '2', number: '112', name: 'Reserva legal', group: '3', debit: 0, credit: 30000, balance: -30000, color: '#3B82F6' },
    { id: '3', number: '129', name: 'Resultado del ejercicio', group: '3', debit: 0, credit: 215500, balance: -215500, color: '#3B82F6' },
    { id: '4', number: '170', name: 'Deudas a largo plazo con entidades de crédito', group: '2', debit: 0, credit: 120000, balance: -120000, color: '#EF4444' },
    { id: '5', number: '210', name: 'Terrenos y bienes naturales', group: '1', debit: 150000, credit: 0, balance: 150000, color: '#10B981' },
    { id: '6', number: '211', name: 'Construcciones', group: '1', debit: 250000, credit: 0, balance: 250000, color: '#10B981' },
    { id: '7', number: '216', name: 'Mobiliario', group: '1', debit: 45000, credit: 0, balance: 45000, color: '#10B981' },
    { id: '8', number: '217', name: 'Equipos para procesos de información', group: '1', debit: 25000, credit: 0, balance: 25000, color: '#10B981' },
    { id: '9', number: '300', name: 'Mercaderías', group: '1', debit: 35000, credit: 0, balance: 35000, color: '#10B981' },
    { id: '10', number: '400', name: 'Proveedores', group: '2', debit: 0, credit: 35000, balance: -35000, color: '#EF4444' },
    { id: '11', number: '410', name: 'Acreedores por prestaciones de servicios', group: '2', debit: 0, credit: 12000, balance: -12000, color: '#EF4444' },
    { id: '12', number: '430', name: 'Clientes', group: '1', debit: 45000, credit: 0, balance: 45000, color: '#10B981' },
    { id: '13', number: '465', name: 'Remuneraciones pendientes de pago', group: '2', debit: 0, credit: 12500, balance: -12500, color: '#EF4444' },
    { id: '14', number: '475', name: 'Hacienda Pública, acreedora por conceptos fiscales', group: '2', debit: 0, credit: 15000, balance: -15000, color: '#EF4444' },
    { id: '15', number: '572', name: 'Bancos', group: '1', debit: 195000, credit: 0, balance: 195000, color: '#10B981' },
    { id: '16', number: '600', name: 'Compras de mercaderías', group: '6', debit: 45600, credit: 0, balance: 45600, color: '#F59E0B' },
    { id: '17', number: '621', name: 'Arrendamientos', group: '6', debit: 12000, credit: 0, balance: 12000, color: '#F59E0B' },
    { id: '18', number: '622', name: 'Reparaciones y conservación', group: '6', debit: 3500, credit: 0, balance: 3500, color: '#F59E0B' },
    { id: '19', number: '623', name: 'Servicios profesionales', group: '6', debit: 8500, credit: 0, balance: 8500, color: '#F59E0B' },
    { id: '20', number: '628', name: 'Suministros', group: '6', debit: 4500, credit: 0, balance: 4500, color: '#F59E0B' },
    { id: '21', number: '640', name: 'Sueldos y salarios', group: '6', debit: 75000, credit: 0, balance: 75000, color: '#F59E0B' },
    { id: '22', number: '642', name: 'Seguridad social', group: '6', debit: 22500, credit: 0, balance: 22500, color: '#F59E0B' },
    { id: '23', number: '700', name: 'Ventas de mercaderías', group: '7', debit: 0, credit: 125750, balance: -125750, color: '#8B5CF6' },
    { id: '24', number: '705', name: 'Prestaciones de servicios', group: '7', debit: 0, credit: 45600, balance: -45600, color: '#8B5CF6' },
    { id: '25', number: '2818', name: 'Amortización acumulada del inmovilizado material', group: '2', debit: 0, credit: 75000, balance: -75000, color: '#EF4444' },
    { id: '26', number: '681', name: 'Amortización del inmovilizado material', group: '6', debit: 25000, credit: 0, balance: 25000, color: '#F59E0B' }
  ];

  // Mock data for journal entries
  const journalEntries = [
    {
      id: '1',
      date: '2025-05-21',
      concept: 'Factura Proveedor VetSupplies',
      debit: [
        { account: '600', name: 'Compras', amount: 2450.75 }
      ],
      credit: [
        { account: '400', name: 'Proveedores', amount: 2450.75 }
      ],
      reference: 'FP-2025-123',
      status: 'posted',
      type: 'purchase',
      document: 'FP-2025-123.pdf',
      tags: ['Compras', 'Medicamentos'],
      checked: true
    },
    {
      id: '2',
      date: '2025-05-20',
      concept: 'Factura Cliente María García',
      debit: [
        { account: '430', name: 'Clientes', amount: 875.50 }
      ],
      credit: [
        { account: '700', name: 'Ventas', amount: 723.55 },
        { account: '477', name: 'IVA Repercutido', amount: 151.95 }
      ],
      reference: 'FC-2025-234',
      status: 'posted',
      type: 'sale',
      document: 'FC-2025-234.pdf',
      tags: ['Ventas', 'Consulta'],
      checked: false
    },
    {
      id: '3',
      date: '2025-05-19',
      concept: 'Nóminas Mayo 2025',
      debit: [
        { account: '640', name: 'Sueldos y Salarios', amount: 12500.00 }
      ],
      credit: [
        { account: '465', name: 'Remuneraciones pendientes de pago', amount: 12500.00 }
      ],
      reference: 'NOM-2025-05',
      status: 'posted',
      type: 'payroll',
      document: 'NOM-2025-05.pdf',
      tags: ['Nóminas', 'Personal'],
      checked: true
    },
    {
      id: '4',
      date: '2025-05-18',
      concept: 'Pago Alquiler Mayo',
      debit: [
        { account: '621', name: 'Arrendamientos', amount: 3500.00 }
      ],
      credit: [
        { account: '410', name: 'Acreedores', amount: 3500.00 }
      ],
      reference: 'ALQ-2025-05',
      status: 'posted',
      type: 'expense',
      document: 'ALQ-2025-05.pdf',
      tags: ['Alquiler', 'Gastos Fijos'],
      checked: true
    },
    {
      id: '5',
      date: '2025-05-17',
      concept: 'Cobro Factura Cliente',
      debit: [
        { account: '572', name: 'Bancos', amount: 1250.00 }
      ],
      credit: [
        { account: '430', name: 'Clientes', amount: 1250.00 }
      ],
      reference: 'COB-2025-124',
      status: 'posted',
      type: 'payment',
      document: 'COB-2025-124.pdf',
      tags: ['Cobros', 'Clientes'],
      checked: false
    }
  ];

  // Mock data for assets
  const assets = [
    {
      id: '1',
      purchaseDate: '2023-01-15',
      amortizationStartDate: '2023-02-01',
      account: '217',
      accountName: 'Equipos para procesos de información',
      tags: ['Informática', 'Administración'],
      serialNumber: 'SN-2023-001',
      contact: 'TechSupplies S.L.',
      concept: 'Servidor principal',
      document: 'FAC-2023-045.pdf',
      initialValue: 12000.00,
      amortized: 3000.00,
      currentValue: 9000.00,
      status: 'active'
    },
    {
      id: '2',
      purchaseDate: '2023-03-10',
      amortizationStartDate: '2023-04-01',
      account: '216',
      accountName: 'Mobiliario',
      tags: ['Mobiliario', 'Consulta'],
      serialNumber: 'MOB-2023-023',
      contact: 'MueblesPro S.A.',
      concept: 'Mobiliario consulta principal',
      document: 'FAC-2023-078.pdf',
      initialValue: 8500.00,
      amortized: 1700.00,
      currentValue: 6800.00,
      status: 'active'
    },
    {
      id: '3',
      purchaseDate: '2022-11-05',
      amortizationStartDate: '2022-12-01',
      account: '213',
      accountName: 'Maquinaria',
      tags: ['Equipamiento', 'Veterinaria'],
      serialNumber: 'EQ-2022-156',
      contact: 'MedicalVet Supplies',
      concept: 'Equipo de rayos X',
      document: 'FAC-2022-234.pdf',
      initialValue: 35000.00,
      amortized: 8750.00,
      currentValue: 26250.00,
      status: 'active'
    },
    {
      id: '4',
      purchaseDate: '2021-06-20',
      amortizationStartDate: '2021-07-01',
      account: '218',
      accountName: 'Elementos de transporte',
      tags: ['Vehículos', 'Logística'],
      serialNumber: 'VH-2021-002',
      contact: 'AutoVet S.L.',
      concept: 'Furgoneta de servicio',
      document: 'FAC-2021-156.pdf',
      initialValue: 28000.00,
      amortized: 14000.00,
      currentValue: 14000.00,
      status: 'active'
    },
    {
      id: '5',
      purchaseDate: '2020-03-15',
      amortizationStartDate: '2020-04-01',
      account: '215',
      accountName: 'Otras instalaciones',
      tags: ['Instalaciones', 'Clínica'],
      serialNumber: 'INST-2020-045',
      contact: 'InstalPro S.A.',
      concept: 'Sistema de climatización',
      document: 'FAC-2020-089.pdf',
      initialValue: 15000.00,
      amortized: 9000.00,
      currentValue: 6000.00,
      status: 'active'
    }
  ];

  // Mock data for profit and loss
  const profitAndLoss = {
    income: [
      { account: '700', name: 'Ventas de mercaderías', amount: 125750.00 },
      { account: '705', name: 'Prestaciones de servicios', amount: 45600.00 }
    ],
    expenses: [
      { account: '600', name: 'Compras de mercaderías', amount: 45600.00 },
      { account: '621', name: 'Arrendamientos', amount: 12000.00 },
      { account: '622', name: 'Reparaciones y conservación', amount: 3500.00 },
      { account: '623', name: 'Servicios profesionales', amount: 8500.00 },
      { account: '628', name: 'Suministros', amount: 4500.00 },
      { account: '640', name: 'Sueldos y salarios', amount: 75000.00 },
      { account: '642', name: 'Seguridad social', amount: 22500.00 }
    ],
    totalIncome: 171350.00,
    totalExpenses: 171600.00,
    result: -250.00
  };

  // Mock data for balance sheet
  const balanceSheet = {
    assets: [
      { account: '210', name: 'Terrenos y bienes naturales', amount: 150000.00 },
      { account: '211', name: 'Construcciones', amount: 250000.00 },
      { account: '216', name: 'Mobiliario', amount: 45000.00 },
      { account: '217', name: 'Equipos para procesos de información', amount: 25000.00 },
      { account: '300', name: 'Mercaderías', amount: 35000.00 },
      { account: '430', name: 'Clientes', amount: 45000.00 },
      { account: '572', name: 'Bancos', amount: 195000.00 }
    ],
    liabilities: [
      { account: '170', name: 'Deudas a largo plazo con entidades de crédito', amount: 120000.00 },
      { account: '400', name: 'Proveedores', amount: 35000.00 },
      { account: '410', name: 'Acreedores por prestaciones de servicios', amount: 12000.00 },
      { account: '465', name: 'Remuneraciones pendientes de pago', amount: 12500.00 },
      { account: '475', name: 'Hacienda Pública, acreedora por conceptos fiscales', amount: 15000.00 }
    ],
    equity: [
      { account: '100', name: 'Capital social', amount: 300000.00 },
      { account: '112', name: 'Reserva legal', amount: 30000.00 },
      { account: '129', name: 'Resultado del ejercicio', amount: 215500.00 }
    ],
    totalAssets: 745000.00,
    totalLiabilitiesEquity: 745000.00
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Add the missing handleDateChange function
  const handleDateChange = (field: 'from' | 'to', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add the missing handleRefresh function
  const handleRefresh = () => {
    // Here you would typically fetch new data with the selected date range
    console.log('Refreshing data for date range:', dateRange);
  };

  const handleNewAccount = () => {
    setAccountForm({
      type: '',
      name: '',
      number: '',
      color: '#3B82F6'
    });
    setShowNewAccountModal(true);
  };

  const handleEditAccount = (account: any) => {
    setSelectedAccount(account);
    setAccountForm({
      type: account.group,
      name: account.name,
      number: account.number,
      color: account.color
    });
    setShowEditAccountModal(true);
  };

  const handleAccountFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAccountForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitAccount = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Account form submitted:', accountForm);
    
    // Here you would typically save the account to your database
    // For now, we'll just close the modal
    setShowNewAccountModal(false);
    setShowEditAccountModal(false);
  };

  const getGroupName = (groupId: string) => {
    const group = accountGroups.find(g => g.id === groupId);
    return group ? group.name : '';
  };

  // Filter accounts based on search term
  const filteredAccounts = accounts.filter(account => 
    account.number.includes(searchTerm) ||
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getGroupName(account.group).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle new journal entry
  const handleNewEntry = () => {
    setEntryForm({
      type: 'standard',
      template: '',
      date: new Date().toISOString().split('T')[0],
      lines: [
        {
          account: '',
          description: '',
          document: '',
          debit: '',
          credit: '',
          tags: []
        }
      ],
      notes: '',
      file: null
    });
    setShowNewEntryModal(true);
  };

  // Add a new line to the entry form
  const handleAddEntryLine = () => {
    setEntryForm(prev => ({
      ...prev,
      lines: [
        ...prev.lines,
        {
          account: '',
          description: '',
          document: '',
          debit: '',
          credit: '',
          tags: []
        }
      ]
    }));
  };

  // Remove a line from the entry form
  const handleRemoveEntryLine = (index: number) => {
    if (entryForm.lines.length > 1) {
      setEntryForm(prev => ({
        ...prev,
        lines: prev.lines.filter((_, i) => i !== index)
      }));
    }
  };

  // Handle entry form changes
  const handleEntryFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEntryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle entry line changes
  const handleEntryLineChange = (index: number, field: string, value: string) => {
    setEntryForm(prev => ({
      ...prev,
      lines: prev.lines.map((line, i) => 
        i === index ? { ...line, [field]: value } : line
      )
    }));
  };

  // Submit the entry form
  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Entry form submitted:', entryForm);
    
    // Here you would typically save the entry to your database
    // For now, we'll just close the modal
    setShowNewEntryModal(false);
  };

  // Handle new asset
  const handleNewAsset = () => {
    setAssetForm({
      name: '',
      contact: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      serialNumber: '',
      tags: '',
      description: '',
      account: '',
      initialValue: '',
      units: '1',
      amortizationStartDate: new Date().toISOString().split('T')[0],
      amortizationConcept: 'linear',
      amortizationPeriod: 'annual',
      amortizationCoefficient: '10',
      amortizationYears: '10',
      accumulatedAmortizationAccount: '2818',
      amortizationExpenseAccount: '681',
      accumulatedAmortization: '0',
      adjust: false
    });
    setAssetFormStep('definition');
    setShowNewAssetModal(true);
  };

  // Handle asset form changes
  const handleAssetFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setAssetForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle asset form submission
  const handleSubmitAsset = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (assetFormStep === 'definition') {
      setAssetFormStep('amortization');
      return;
    }
    
    console.log('Asset form submitted:', assetForm);
    
    // Here you would typically save the asset to your database
    // For now, we'll just close the modal
    setShowNewAssetModal(false);
  };

  // Filter assets based on search term
  const filteredAssets = assets.filter(asset => 
    asset.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contabilidad</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión contable y financiera
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
            onClick={
              activeTab === 'cuentas' ? handleNewAccount : 
              activeTab === 'diario' ? handleNewEntry : 
              activeTab === 'activos' ? handleNewAsset : undefined
            }
          >
            {activeTab === 'cuentas' ? 'Nueva Cuenta' : 
             activeTab === 'diario' ? 'Nuevo Asiento' : 
             activeTab === 'activos' ? 'Nuevo Activo' : 'Nuevo Asiento'}
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
            Cuadro de Cuentas
          </button>
          <button
            onClick={() => setActiveTab('diario')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'diario'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Libro Diario
          </button>
          <button
            onClick={() => setActiveTab('activos')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'activos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Activos
          </button>
          <button
            onClick={() => setActiveTab('perdidas')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'perdidas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Pérdidas y Ganancias
          </button>
          <button
            onClick={() => setActiveTab('balance')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'balance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Balance de Situación
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'cuentas' && (
        <div className="space-y-6">
          {/* Accounts Search and Filters */}
          <Card>
            <div className="p-4 flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Buscar por código, nombre o grupo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
                className="flex-1"
              />
              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todos los grupos</option>
                {accountGroups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activas</option>
                <option value="inactive">Inactivas</option>
              </select>
              <Button
                variant="outline"
                icon={<RefreshCw size={18} />}
              >
                Actualizar
              </Button>
            </div>
          </Card>

          {/* Accounts Table */}
          <Card title="Cuadro de Cuentas" icon={<List size={20} />}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grupo
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Debe
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Haber
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAccounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: account.color }}></div>
                          <span className="ml-2 text-sm font-medium text-gray-900">{account.number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{account.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getGroupName(account.group)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(account.debit)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(account.credit)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className={`text-sm font-medium ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(account.balance)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditAccount(account)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <Settings size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Account Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Total Activo</h3>
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-green-600">
                  {formatCurrency(accounts.filter(a => a.group === '1').reduce((sum, a) => sum + a.balance, 0))}
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Total Pasivo</h3>
                  <DollarSign className="h-5 w-5 text-red-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-red-600">
                  {formatCurrency(accounts.filter(a => a.group === '2').reduce((sum, a) => sum + a.balance, 0))}
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Patrimonio Neto</h3>
                  <DollarSign className="h-5 w-5 text-blue-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-blue-600">
                  {formatCurrency(accounts.filter(a => a.group === '3').reduce((sum, a) => sum + a.balance, 0))}
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'diario' && (
        <div className="space-y-6">
          {/* Journal Entries Search and Filters */}
          <Card>
            <div className="p-4 flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Buscar asientos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
                className="flex-1"
              />
              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todos los tipos</option>
                <option value="purchase">Compras</option>
                <option value="sale">Ventas</option>
                <option value="expense">Gastos</option>
                <option value="income">Ingresos</option>
                <option value="payroll">Nóminas</option>
                <option value="payment">Pagos</option>
                <option value="other">Otros</option>
              </select>
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) => handleDateChange('from', e.target.value)}
                icon={<Calendar size={18} />}
              />
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) => handleDateChange('to', e.target.value)}
                icon={<Calendar size={18} />}
              />
              <Button
                variant="outline"
                icon={<Download size={18} />}
              >
                Exportar
              </Button>
            </div>
          </Card>

          {/* Journal Entries Table */}
          <Card title="Libro Diario" icon={<BookOpen size={20} />}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asiento
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Línea
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cuenta
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre de cuenta
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Debe
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Haber
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Punteado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {journalEntries.map((entry, entryIndex) => (
                    <React.Fragment key={entry.id}>
                      {/* Debit entries */}
                      {entry.debit.map((debitItem, debitIndex) => (
                        <tr key={`${entry.id}-debit-${debitIndex}`} className="hover:bg-gray-50">
                          {debitIndex === 0 && (
                            <>
                              <td className="px-4 py-3 whitespace-nowrap\" rowSpan={entry.debit.length + entry.credit.length}>
                                <div className="text-sm font-medium text-gray-900">{entry.id}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{debitIndex + 1}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap" rowSpan={entry.debit.length + entry.credit.length}>
                                <div className="text-sm text-gray-900">
                                  {new Date(entry.date).toLocaleDateString('es-ES')}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap" rowSpan={entry.debit.length + entry.credit.length}>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {entry.type === 'purchase' ? 'Compra' : 
                                   entry.type === 'sale' ? 'Venta' : 
                                   entry.type === 'expense' ? 'Gasto' : 
                                   entry.type === 'income' ? 'Ingreso' : 
                                   entry.type === 'payroll' ? 'Nómina' : 
                                   entry.type === 'payment' ? 'Pago' : 'Otro'}
                                </span>
                              </td>
                              <td className="px-4 py-3" rowSpan={entry.debit.length + entry.credit.length}>
                                <div className="text-sm text-gray-900">{entry.concept}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap" rowSpan={entry.debit.length + entry.credit.length}>
                                <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center">
                                  <Link size={16} className="mr-1" />
                                  <span className="text-sm">{entry.reference}</span>
                                </a>
                              </td>
                            </>
                          )}
                          {debitIndex !== 0 && (
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{debitIndex + 1}</div>
                            </td>
                          )}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{debitItem.account}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{debitItem.name}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {debitItem.amount.toLocaleString('es-ES', { 
                                style: 'currency', 
                                currency: 'EUR' 
                              })}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <div className="text-sm text-gray-900">-</div>
                          </td>
                          {debitIndex === 0 && (
                            <>
                              <td className="px-4 py-3" rowSpan={entry.debit.length + entry.credit.length}>
                                <div className="flex flex-wrap gap-1">
                                  {entry.tags.map((tag, tagIndex) => (
                                    <span key={tagIndex} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center" rowSpan={entry.debit.length + entry.credit.length}>
                                <input 
                                  type="checkbox" 
                                  checked={entry.checked} 
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  onChange={() => {}}
                                />
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                      
                      {/* Credit entries */}
                      {entry.credit.map((creditItem, creditIndex) => (
                        <tr key={`${entry.id}-credit-${creditIndex}`} className="hover:bg-gray-50">
                          {entry.debit.length === 0 && creditIndex === 0 && (
                            <>
                              <td className="px-4 py-3 whitespace-nowrap\" rowSpan={entry.credit.length}>
                                <div className="text-sm font-medium text-gray-900">{entry.id}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{creditIndex + 1}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap" rowSpan={entry.credit.length}>
                                <div className="text-sm text-gray-900">
                                  {new Date(entry.date).toLocaleDateString('es-ES')}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap" rowSpan={entry.credit.length}>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {entry.type === 'purchase' ? 'Compra' : 
                                   entry.type === 'sale' ? 'Venta' : 
                                   entry.type === 'expense' ? 'Gasto' : 
                                   entry.type === 'income' ? 'Ingreso' : 
                                   entry.type === 'payroll' ? 'Nómina' : 
                                   entry.type === 'payment' ? 'Pago' : 'Otro'}
                                </span>
                              </td>
                              <td className="px-4 py-3" rowSpan={entry.credit.length}>
                                <div className="text-sm text-gray-900">{entry.concept}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap" rowSpan={entry.credit.length}>
                                <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center">
                                  <Link size={16} className="mr-1" />
                                  <span className="text-sm">{entry.reference}</span>
                                </a>
                              </td>
                            </>
                          )}
                          {(entry.debit.length > 0 || creditIndex !== 0) && (
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{entry.debit.length + creditIndex + 1}</div>
                            </td>
                          )}
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{creditItem.account}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{creditItem.name}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <div className="text-sm text-gray-900">-</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {creditItem.amount.toLocaleString('es-ES', { 
                                style: 'currency', 
                                currency: 'EUR' 
                              })}
                            </div>
                          </td>
                          {entry.debit.length === 0 && creditIndex === 0 && (
                            <>
                              <td className="px-4 py-3" rowSpan={entry.credit.length}>
                                <div className="flex flex-wrap gap-1">
                                  {entry.tags.map((tag, tagIndex) => (
                                    <span key={tagIndex} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center" rowSpan={entry.credit.length}>
                                <input 
                                  type="checkbox" 
                                  checked={entry.checked} 
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  onChange={() => {}}
                                />
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Floating Action Button for New Entry */}
          <div className="fixed bottom-8 right-8">
            <Button
              variant="primary"
              size="lg"
              icon={<Plus size={20} />}
              onClick={handleNewEntry}
              className="rounded-full shadow-lg"
            >
              Nuevo Asiento
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'activos' && (
        <div className="space-y-6">
          {/* Assets Search and Filters */}
          <Card>
            <div className="p-4 flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Buscar activos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
                className="flex-1"
              />
              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todas las cuentas</option>
                {accounts
                  .filter(account => account.number.startsWith('2') || account.number.startsWith('21'))
                  .map(account => (
                    <option key={account.id} value={account.number}>
                      {account.number} - {account.name}
                    </option>
                  ))}
              </select>
              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
                <option value="fully_amortized">Totalmente amortizados</option>
              </select>
              <Button
                variant="outline"
                icon={<Download size={18} />}
              >
                Exportar
              </Button>
            </div>
          </Card>

          {/* Assets Table */}
          <Card title="Activos" icon={<Briefcase size={20} />}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de compra
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha inicio amortización
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cuenta contable
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nº de serie
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Concepto
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor inicial
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amortizado
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor actual
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="relative px-4 py-3">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(asset.purchaseDate).toLocaleDateString('es-ES')}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(asset.amortizationStartDate).toLocaleDateString('es-ES')}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{asset.account}</div>
                        <div className="text-xs text-gray-500">{asset.accountName}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {asset.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{asset.serialNumber}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{asset.contact}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{asset.concept}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <a href="#" className="text-blue-600 hover:text-blue-800 flex items-center">
                          <Link size={16} className="mr-1" />
                          <span className="text-sm">{asset.document}</span>
                        </a>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(asset.initialValue)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(asset.amortized)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(asset.currentValue)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {asset.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <Settings size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Asset Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Valor Total Activos</h3>
                  <Briefcase className="h-5 w-5 text-blue-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-blue-600">
                  {formatCurrency(assets.reduce((sum, asset) => sum + asset.initialValue, 0))}
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Amortización Acumulada</h3>
                  <Calculator className="h-5 w-5 text-red-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-red-600">
                  {formatCurrency(assets.reduce((sum, asset) => sum + asset.amortized, 0))}
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Valor Neto Contable</h3>
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-green-600">
                  {formatCurrency(assets.reduce((sum, asset) => sum + asset.currentValue, 0))}
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'perdidas' && (
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

      {activeTab === 'balance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Activo</h3>
                  <DollarSign className="h-5 w-5 text-blue-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-blue-600">
                  {formatCurrency(balanceSheet.totalAssets)}
                </p>
                <p className="mt-1 text-sm text-gray-500">total del período</p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Pasivo</h3>
                  <DollarSign className="h-5 w-5 text-red-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-red-600">
                  {formatCurrency(balanceSheet.liabilities.reduce((sum, item) => sum + item.amount, 0))}
                </p>
                <p className="mt-1 text-sm text-gray-500">total del período</p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Patrimonio Neto</h3>
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-green-600">
                  {formatCurrency(balanceSheet.equity.reduce((sum, item) => sum + item.amount, 0))}
                </p>
                <p className="mt-1 text-sm text-gray-500">total del período</p>
              </div>
            </Card>
          </div>

          <Card title="Balance de Situación" icon={<PieChart size={20} />}>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Assets */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Activo</h4>
                  <div className="space-y-4">
                    {balanceSheet.assets.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between text-sm">
                          <span>({item.account}) {item.name}</span>
                          <span className="font-medium">{formatCurrency(item.amount)}</span>
                        </div>
                        <div className="mt-1 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-blue-600 rounded-full" 
                            style={{ width: `${(item.amount / balanceSheet.totalAssets) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span>Total Activo</span>
                        <span className="text-blue-600">{formatCurrency(balanceSheet.totalAssets)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Liabilities and Equity */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Pasivo y Patrimonio Neto</h4>
                  <div className="space-y-4">
                    <h5 className="text-sm font-medium text-gray-700">Pasivo</h5>
                    {balanceSheet.liabilities.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between text-sm">
                          <span>({item.account}) {item.name}</span>
                          <span className="font-medium">{formatCurrency(item.amount)}</span>
                        </div>
                        <div className="mt-1 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-red-600 rounded-full" 
                            style={{ width: `${(item.amount / balanceSheet.totalLiabilitiesEquity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span>Total Pasivo</span>
                        <span className="text-red-600">
                          {formatCurrency(balanceSheet.liabilities.reduce((sum, item) => sum + item.amount, 0))}
                        </span>
                      </div>
                    </div>
                    
                    <h5 className="text-sm font-medium text-gray-700 mt-6">Patrimonio Neto</h5>
                    {balanceSheet.equity.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between text-sm">
                          <span>({item.account}) {item.name}</span>
                          <span className="font-medium">{formatCurrency(item.amount)}</span>
                        </div>
                        <div className="mt-1 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-green-600 rounded-full" 
                            style={{ width: `${(item.amount / balanceSheet.totalLiabilitiesEquity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span>Total Patrimonio Neto</span>
                        <span className="text-green-600">
                          {formatCurrency(balanceSheet.equity.reduce((sum, item) => sum + item.amount, 0))}
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t-2 border-gray-200">
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span>Total Pasivo y Patrimonio Neto</span>
                        <span className="text-gray-900">{formatCurrency(balanceSheet.totalLiabilitiesEquity)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* New Account Modal */}
      {showNewAccountModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Nueva Cuenta
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowNewAccountModal(false)}
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitAccount}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grupo Contable
                  </label>
                  <select
                    name="type"
                    value={accountForm.type}
                    onChange={handleAccountFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Seleccionar grupo</option>
                    {accountGroups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Cuenta
                  </label>
                  <Input
                    type="text"
                    name="number"
                    value={accountForm.number}
                    onChange={handleAccountFormChange}
                    placeholder="Ej: 572"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Cuenta
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={accountForm.name}
                    onChange={handleAccountFormChange}
                    placeholder="Ej: Bancos"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      name="color"
                      value={accountForm.color}
                      onChange={handleAccountFormChange}
                      className="h-8 w-8 rounded border-gray-300 cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-500">{accountForm.color}</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                >
                  Crear Cuenta
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {showEditAccountModal && selectedAccount && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Editar Cuenta
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowEditAccountModal(false)}
              >
                
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitAccount}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grupo Contable
                  </label>
                  <select
                    name="type"
                    value={accountForm.type}
                    onChange={handleAccountFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Seleccionar grupo</option>
                    {accountGroups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Cuenta
                  </label>
                  <Input
                    type="text"
                    name="number"
                    value={accountForm.number}
                    onChange={handleAccountFormChange}
                    placeholder="Ej: 572"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Cuenta
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={accountForm.name}
                    onChange={handleAccountFormChange}
                    placeholder="Ej: Bancos"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      name="color"
                      value={accountForm.color}
                      onChange={handleAccountFormChange}
                      className="h-8 w-8 rounded border-gray-300 cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-500">{accountForm.color}</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  icon={<Trash size={18} />}
                  className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                  onClick={() => {
                    console.log('Delete account:', selectedAccount.id);
                    setShowEditAccountModal(false);
                  }}
                >
                  Eliminar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon={<Edit size={18} />}
                >
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Journal Entry Modal */}
      {showNewEntryModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Nuevo Asiento
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowNewEntryModal(false)}
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitEntry} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Asiento
                    </label>
                    <select
                      name="type"
                      value={entryForm.type}
                      onChange={handleEntryFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    >
                      <option value="standard">Estándar</option>
                      <option value="purchase">Compra</option>
                      <option value="sale">Venta</option>
                      <option value="expense">Gasto</option>
                      <option value="income">Ingreso</option>
                      <option value="payroll">Nómina</option>
                      <option value="payment">Pago</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asiento Predefinido
                    </label>
                    <select
                      name="template"
                      value={entryForm.template}
                      onChange={handleEntryFormChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Seleccionar plantilla</option>
                      <option value="purchase">Compra a proveedor</option>
                      <option value="sale">Venta a cliente</option>
                      <option value="expense">Gasto general</option>
                      <option value="payroll">Nómina</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha
                    </label>
                    <Input
                      type="date"
                      name="date"
                      value={entryForm.date}
                      onChange={handleEntryFormChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cuenta
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Descripción
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Documento
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Debe
                        </th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Haber
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tags
                        </th>
                        <th scope="col" className="relative px-4 py-3 w-10">
                          <span className="sr-only">Acciones</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {entryForm.lines.map((line, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <select
                              value={line.account}
                              onChange={(e) => handleEntryLineChange(index, 'account', e.target.value)}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              required
                            >
                              <option value="">Seleccionar cuenta</option>
                              {accounts.map(account => (
                                <option key={account.id} value={account.number}>
                                  {account.number} - {account.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="text"
                              value={line.description}
                              onChange={(e) => handleEntryLineChange(index, 'description', e.target.value)}
                              placeholder="Descripción"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="text"
                              value={line.document}
                              onChange={(e) => handleEntryLineChange(index, 'document', e.target.value)}
                              placeholder="Ref. documento"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              value={line.debit}
                              onChange={(e) => handleEntryLineChange(index, 'debit', e.target.value)}
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                              className="text-right"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="number"
                              value={line.credit}
                              onChange={(e) => handleEntryLineChange(index, 'credit', e.target.value)}
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                              className="text-right"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <Input
                              type="text"
                              value={line.tags.join(', ')}
                              onChange={(e) => handleEntryLineChange(index, 'tags', e.target.value)}
                              placeholder="Tags separados por comas"
                              icon={<Tag size={16} />}
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveEntryLine(index)}
                              className="text-red-500 hover:text-red-700"
                              disabled={entryForm.lines.length <= 1}
                            >
                              <Trash size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    icon={<Plus size={16} />}
                    onClick={handleAddEntryLine}
                  >
                    Añadir Línea
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas
                    </label>
                    <textarea
                      name="notes"
                      value={entryForm.notes}
                      onChange={handleEntryFormChange}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Añade notas o comentarios relevantes..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subir Archivo
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <span>Subir un archivo</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">o arrastrar y soltar</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, JPG, PNG hasta 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewEntryModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Asset Modal */}
      {showNewAssetModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {assetFormStep === 'definition' ? 'Nuevo Activo - Definición' : 'Nuevo Activo - Amortización'}
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowNewAssetModal(false)}
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitAsset} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6">
                {assetFormStep === 'definition' ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={assetForm.name}
                          onChange={handleAssetFormChange}
                          placeholder="Nombre del activo"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contacto
                        </label>
                        <Input
                          type="text"
                          name="contact"
                          value={assetForm.contact}
                          onChange={handleAssetFormChange}
                          placeholder="Proveedor o contacto"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha de compra
                        </label>
                        <Input
                          type="date"
                          name="purchaseDate"
                          value={assetForm.purchaseDate}
                          onChange={handleAssetFormChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nº de serie
                        </label>
                        <Input
                          type="text"
                          name="serialNumber"
                          value={assetForm.serialNumber}
                          onChange={handleAssetFormChange}
                          placeholder="Número de serie o referencia"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags
                      </label>
                      <Input
                        type="text"
                        name="tags"
                        value={assetForm.tags}
                        onChange={handleAssetFormChange}
                        placeholder="Tags separados por comas"
                        icon={<Tag size={16} />}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        name="description"
                        value={assetForm.description}
                        onChange={handleAssetFormChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Descripción del activo"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cuenta contable
                        </label>
                        <select
                          name="account"
                          value={assetForm.account}
                          onChange={handleAssetFormChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        >
                          <option value="">Seleccionar cuenta</option>
                          {accounts
                            .filter(account => account.number.startsWith('21'))
                            .map(account => (
                              <option key={account.id} value={account.number}>
                                {account.number} - {account.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valor inicial
                        </label>
                        <Input
                          type="number"
                          name="initialValue"
                          value={assetForm.initialValue}
                          onChange={handleAssetFormChange}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Unidades
                        </label>
                        <Input
                          type="number"
                          name="units"
                          value={assetForm.units}
                          onChange={handleAssetFormChange}
                          placeholder="1"
                          min="1"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha inicio amortización
                        </label>
                        <Input
                          type="date"
                          name="amortizationStartDate"
                          value={assetForm.amortizationStartDate}
                          onChange={handleAssetFormChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Concepto
                        </label>
                        <select
                          name="amortizationConcept"
                          value={assetForm.amortizationConcept}
                          onChange={handleAssetFormChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        >
                          <option value="linear">Lineal</option>
                          <option value="degressive">Degresivo</option>
                          <option value="progressive">Progresivo</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Período
                        </label>
                        <select
                          name="amortizationPeriod"
                          value={assetForm.amortizationPeriod}
                          onChange={handleAssetFormChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        >
                          <option value="annual">Anual</option>
                          <option value="monthly">Mensual</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Coeficiente (%)
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <Input
                            type="number"
                            name="amortizationCoefficient"
                            value={assetForm.amortizationCoefficient}
                            onChange={handleAssetFormChange}
                            placeholder="10"
                            min="0"
                            max="100"
                            step="0.01"
                            required
                            icon={<Percent size={16} />}
                            iconPosition="right"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Años
                        </label>
                        <Input
                          type="number"
                          name="amortizationYears"
                          value={assetForm.amortizationYears}
                          onChange={handleAssetFormChange}
                          placeholder="10"
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cuenta amortización acumulada
                        </label>
                        <select
                          name="accumulatedAmortizationAccount"
                          value={assetForm.accumulatedAmortizationAccount}
                          onChange={handleAssetFormChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        >
                          <option value="">Seleccionar cuenta</option>
                          {accounts
                            .filter(account => account.number.startsWith('28'))
                            .map(account => (
                              <option key={account.id} value={account.number}>
                                {account.number} - {account.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cuenta gasto amortización
                        </label>
                        <select
                          name="amortizationExpenseAccount"
                          value={assetForm.amortizationExpenseAccount}
                          onChange={handleAssetFormChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          required
                        >
                          <option value="">Seleccionar cuenta</option>
                          {accounts
                            .filter(account => account.number.startsWith('68'))
                            .map(account => (
                              <option key={account.id} value={account.number}>
                                {account.number} - {account.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="text-sm font-medium text-gray-900 mb-4">Vista previa de amortización</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-white">
                            <tr>
                              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Año
                              </th>
                              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Valor inicial
                              </th>
                              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amortización
                              </th>
                              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amortización acumulada
                              </th>
                              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Valor final
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {/* Preview rows - in a real app, these would be calculated based on the form values */}
                            {Array.from({ length: Math.min(5, parseInt(assetForm.amortizationYears) || 10) }).map((_, index) => {
                              const initialValue = parseFloat(assetForm.initialValue) || 0;
                              const years = parseInt(assetForm.amortizationYears) || 10;
                              const coefficient = parseFloat(assetForm.amortizationCoefficient) / 100 || 0.1;
                              
                              // Simple linear amortization calculation
                              const yearlyAmortization = initialValue * coefficient;
                              const accumulatedAmortization = Math.min(yearlyAmortization * (index + 1), initialValue);
                              const finalValue = Math.max(initialValue - accumulatedAmortization, 0);
                              
                              return (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {new Date().getFullYear() + index}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                                    {formatCurrency(initialValue)}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                                    {formatCurrency(yearlyAmortization)}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                                    {formatCurrency(accumulatedAmortization)}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                                    {formatCurrency(finalValue)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amortización acumulada
                        </label>
                        <Input
                          type="number"
                          name="accumulatedAmortization"
                          value={assetForm.accumulatedAmortization}
                          onChange={handleAssetFormChange}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="adjust"
                            checked={assetForm.adjust}
                            onChange={handleAssetFormChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Ajustar amortización</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (assetFormStep === 'amortization') {
                      setAssetFormStep('definition');
                    } else {
                      setShowNewAssetModal(false);
                    }
                  }}
                >
                  {assetFormStep === 'amortization' ? 'Atrás' : 'Cancelar'}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  {assetFormStep === 'definition' ? 'Continuar' : 'Guardar Activo'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contabilidad;