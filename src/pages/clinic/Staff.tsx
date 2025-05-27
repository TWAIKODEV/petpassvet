import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  RefreshCw, 
  FileText,
  Download as DownloadIcon,
  Eye, 
  Printer, 
  X, 
  Plus, 
  Mail, 
  Phone, 
  Building2, 
  Calendar as CalendarIcon, 
  DollarSign,
  X as XIcon,
  Clock, 
  FileText as FileTextIcon, 
  Briefcase, 
  User,
  Check,
  Upload,
  FileCheck
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import NewEmployeeForm from '../../components/staff/NewEmployeeForm';
import { generatePayrollPDF } from '../../utils/payrollPdfGenerator';

// Mock data for employees
const mockStaff = [
  {
    id: '1',
    name: 'Dr. Alejandro Ramírez',
    role: 'Veterinario Senior',
    department: 'Veterinaria',
    email: 'alejandro.ramirez@clinica.com',
    phone: '+34 666 777 888',
    location: 'Sede Central Madrid',
    startDate: '2024-01-15',
    contractType: 'Indefinido',
    workingHours: 'Jornada Completa',
    salary: {
      gross: 45000,
      socialSecurity: 13500,
      net: 36450,
      totalCost: 58500
    },
    schedule: {
      hours: 40,
      shifts: ['Lunes a Viernes', '9:00 - 17:00']
    },
    status: 'active',
    hasContract: true,
    contract: {
      file: 'contrato_ramirez.pdf',
      startDate: '2024-01-15',
      endDate: null,
      type: 'Indefinido',
      position: 'Veterinario Senior',
      salary: 45000,
      salaryType: 'annual',
      payments: 14,
      workingHours: 'Jornada Completa',
      schedule: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      }
    }
  },
  {
    id: '2',
    name: 'Ana López',
    role: 'Auxiliar Veterinario',
    department: 'Veterinaria',
    email: 'ana.lopez@clinica.com',
    phone: '+34 666 888 999',
    location: 'Sede Central Madrid',
    startDate: '2024-02-01',
    contractType: 'Temporal',
    workingHours: 'Jornada Completa',
    salary: {
      gross: 24000,
      socialSecurity: 7200,
      net: 19440,
      totalCost: 31200
    },
    schedule: {
      hours: 40,
      shifts: ['Lunes a Viernes', '8:00 - 16:00']
    },
    status: 'active',
    hasContract: true,
    contract: {
      file: 'contrato_lopez.pdf',
      startDate: '2024-02-01',
      endDate: '2025-02-01',
      type: 'Temporal',
      position: 'Auxiliar Veterinario',
      salary: 24000,
      salaryType: 'annual',
      payments: 12,
      workingHours: 'Jornada Completa',
      schedule: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      }
    }
  },
  {
    id: '3',
    name: 'Carlos Rodríguez',
    role: 'Peluquero Canino',
    department: 'Peluquería',
    email: 'carlos.rodriguez@clinica.com',
    phone: '+34 666 999 000',
    location: 'Sucursal Norte',
    startDate: '2024-03-15',
    contractType: 'Indefinido',
    workingHours: 'Jornada Completa',
    salary: {
      gross: 22000,
      socialSecurity: 6600,
      net: 17820,
      totalCost: 28600
    },
    schedule: {
      hours: 40,
      shifts: ['Lunes a Viernes', '9:00 - 17:00']
    },
    status: 'active',
    hasContract: false
  },
  {
    id: '4',
    name: 'Laura Martínez',
    role: 'Recepcionista',
    department: 'Administración',
    email: 'laura.martinez@clinica.com',
    phone: '+34 666 000 111',
    location: 'Sede Central Madrid',
    startDate: '2024-01-20',
    contractType: 'Indefinido',
    workingHours: 'Media Jornada',
    salary: {
      gross: 20000,
      socialSecurity: 6000,
      net: 16200,
      totalCost: 26000
    },
    schedule: {
      hours: 20,
      shifts: ['Lunes a Viernes', '8:00 - 12:00']
    },
    status: 'inactive',
    hasContract: true,
    contract: {
      file: 'contrato_martinez.pdf',
      startDate: '2024-01-20',
      endDate: null,
      type: 'Indefinido',
      position: 'Recepcionista',
      salary: 20000,
      salaryType: 'annual',
      payments: 12,
      workingHours: 'Media Jornada',
      schedule: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      }
    }
  },
  {
    id: '5',
    name: 'Miguel Torres',
    role: 'Veterinario',
    department: 'Veterinaria',
    email: 'miguel.torres@clinica.com',
    phone: '+34 666 111 222',
    location: 'Sucursal Sur',
    startDate: '2024-02-15',
    contractType: 'Indefinido',
    workingHours: 'Jornada Completa',
    salary: {
      gross: 40000,
      socialSecurity: 12000,
      net: 32400,
      totalCost: 52000
    },
    schedule: {
      hours: 40,
      shifts: ['Lunes a Viernes', '10:00 - 18:00']
    },
    status: 'active',
    hasContract: false
  }
];

// Mock payroll data
const mockPayrolls = [
  {
    id: '1',
    employeeId: '1',
    period: 'Mayo 2025',
    date: '2025-05-30',
    amount: 3037.50,
    status: 'paid'
  },
  {
    id: '2',
    employeeId: '1',
    period: 'Abril 2025',
    date: '2025-04-30',
    amount: 3037.50,
    status: 'paid'
  },
  {
    id: '3',
    employeeId: '1',
    period: 'Marzo 2025',
    date: '2025-03-30',
    amount: 3037.50,
    status: 'paid'
  },
  {
    id: '4',
    employeeId: '2',
    period: 'Mayo 2025',
    date: '2025-05-30',
    amount: 1620.00,
    status: 'paid'
  },
  {
    id: '5',
    employeeId: '2',
    period: 'Abril 2025',
    date: '2025-04-30',
    amount: 1620.00,
    status: 'paid'
  }
];

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showNewEmployeeForm, setShowNewEmployeeForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'payrolls'>('info');
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showViewContractModal, setShowViewContractModal] = useState(false);
  const [payrollData, setPayrollData] = useState({
    employeeId: '',
    period: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [payrollDateRange, setPayrollDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [contractData, setContractData] = useState({
    employeeId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    type: '',
    position: '',
    salary: '',
    salaryType: 'annual',
    payments: '12',
    workingHours: '',
    schedule: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    },
    isActive: true,
    file: null
  });

  const filteredStaff = mockStaff.filter(staff => 
    (selectedDepartment === 'all' || staff.department === selectedDepartment) &&
    (staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     staff.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNewEmployee = (employeeData: any) => {
    // Here you would typically make an API call to save the new employee
    console.log('New employee data:', employeeData);
    setShowNewEmployeeForm(false);
  };

  const handlePrintPayroll = (employee: any) => {
    const doc = generatePayrollPDF(employee);
    const blobUrl = doc.output('bloburl');
    const printWindow = window.open(blobUrl);
    printWindow?.print();
  };

  const handleSubmitPayroll = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting payroll:', payrollData);
    // Here you would typically make an API call to create a new payroll
    setShowPayrollModal(false);
    // Reset form
    setPayrollData({
      employeeId: '',
      period: '',
      amount: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleSubmitContract = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting contract:', contractData);
    // Here you would typically make an API call to create a new contract
    setShowContractModal(false);
    // Reset form
    setContractData({
      employeeId: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      type: '',
      position: '',
      salary: '',
      salaryType: 'annual',
      payments: '12',
      workingHours: '',
      schedule: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      },
      isActive: true,
      file: null
    });
  };

  // Get employee payrolls
  const getEmployeePayrolls = (employeeId: string) => {
    return mockPayrolls.filter(payroll => payroll.employeeId === employeeId);
  };

  // Filter payrolls by date range
  const filterPayrollsByDate = (payrolls: any[]) => {
    return payrolls.filter(payroll => {
      const payrollDate = new Date(payroll.date);
      const fromDate = new Date(payrollDateRange.from);
      const toDate = new Date(payrollDateRange.to);
      return payrollDate >= fromDate && payrollDate <= toDate;
    });
  };

  const handleViewContract = (employee: any) => {
    setSelectedEmployee(employee);
    setShowViewContractModal(true);
  };

  const handleAddContract = (employee: any) => {
    setSelectedEmployee(employee);
    setContractData({
      ...contractData,
      employeeId: employee.id,
      position: employee.role,
      workingHours: employee.workingHours
    });
    setShowContractModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personal</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestión del personal de la clínica
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
            onClick={() => setShowNewEmployeeForm(true)}
            className="flex-1 sm:flex-none"
          >
            Nuevo Empleado
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <Input
            placeholder="Buscar empleados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
            className="flex-1"
          />
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="all">Todos los departamentos</option>
            <option value="Veterinaria">Veterinaria</option>
            <option value="Peluquería">Peluquería</option>
            <option value="Recepción">Recepción</option>
            <option value="Administración">Administración</option>
          </select>
          <Button
            variant="outline"
            icon={<RefreshCw size={18} />}
          >
            Actualizar
          </Button>
        </div>
      </Card>

      {/* Staff List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Centro de Trabajo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horario Laboral
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Alta
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {staff.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                        <div className="text-sm text-gray-500">{staff.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{staff.email}</div>
                    <div className="text-sm text-gray-500">{staff.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{staff.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{staff.schedule.shifts[0]}</div>
                    <div className="text-sm text-gray-500">{staff.schedule.shifts[1]}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(staff.startDate).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      staff.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {staff.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2 justify-end">
                      <button
                        onClick={() => setSelectedEmployee(staff)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => staff.hasContract ? handleViewContract(staff) : handleAddContract(staff)}
                        className="text-blue-600 hover:text-blue-800"
                        title={staff.hasContract ? "Ver contrato" : "Añadir contrato"}
                      >
                        <FileCheck size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Detalles del Empleado
              </h3>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-xl">
                    {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900">{selectedEmployee.name}</h2>
                  <p className="text-sm text-gray-500">{selectedEmployee.role} • {selectedEmployee.department}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
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
                    Información
                  </button>
                  <button
                    onClick={() => setActiveTab('payrolls')}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === 'payrolls'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    Nóminas
                  </button>
                </nav>
              </div>

              {activeTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Employee Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Información del Empleado</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedEmployee.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Teléfono</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedEmployee.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tipo de Contrato</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedEmployee.contractType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Jornada</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedEmployee.workingHours}</p>
                        <p className="text-sm text-gray-500">{selectedEmployee.schedule.hours} horas semanales</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Fecha de Incorporación</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(selectedEmployee.startDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Información Adicional</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Centro de Trabajo</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedEmployee.location}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Horario</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedEmployee.schedule.shifts[0]}</p>
                        <p className="text-sm text-gray-500">{selectedEmployee.schedule.shifts[1]}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Estado</p>
                        <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedEmployee.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedEmployee.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Contrato</p>
                        <div className="mt-1 flex items-center">
                          {selectedEmployee.hasContract ? (
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<FileCheck size={16} />}
                              onClick={() => handleViewContract(selectedEmployee)}
                            >
                              Ver contrato
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<FileText size={16} />}
                              onClick={() => handleAddContract(selectedEmployee)}
                            >
                              Añadir contrato
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'payrolls' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Input
                        type="date"
                        label="Desde"
                        value={payrollDateRange.from}
                        onChange={(e) => setPayrollDateRange(prev => ({ ...prev, from: e.target.value }))}
                      />
                      <Input
                        type="date"
                        label="Hasta"
                        value={payrollDateRange.to}
                        onChange={(e) => setPayrollDateRange(prev => ({ ...prev, to: e.target.value }))}
                      />
                    </div>
                    <Button
                      variant="primary"
                      icon={<Plus size={18} />}
                      onClick={() => {
                        setPayrollData({
                          ...payrollData,
                          employeeId: selectedEmployee.id
                        });
                        setShowPayrollModal(true);
                      }}
                    >
                      Emitir Nómina
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Período
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha
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
                        {filterPayrollsByDate(getEmployeePayrolls(selectedEmployee.id)).map((payroll) => (
                          <tr key={payroll.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{payroll.period}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(payroll.date).toLocaleDateString('es-ES')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {payroll.amount.toLocaleString('es-ES', {
                                  style: 'currency',
                                  currency: 'EUR'
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Pagada
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center space-x-2 justify-end">
                                <button
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Ver"
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  className="text-gray-400 hover:text-gray-600"
                                  title="Descargar"
                                >
                                  <DownloadIcon size={18} />
                                </button>
                                <button
                                  className="text-gray-400 hover:text-gray-600"
                                  title="Imprimir"
                                  onClick={() => handlePrintPayroll(selectedEmployee)}
                                >
                                  <Printer size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filterPayrollsByDate(getEmployeePayrolls(selectedEmployee.id)).length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                              No hay nóminas en el período seleccionado
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                icon={<Printer size={18} />}
                onClick={() => handlePrintPayroll(selectedEmployee)}
              >
                Imprimir Nómina
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedEmployee(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Employee Form Modal */}
      {showNewEmployeeForm && (
        <NewEmployeeForm
          onClose={() => setShowNewEmployeeForm(false)}
          onSubmit={handleNewEmployee}
        />
      )}

      {/* New Payroll Modal */}
      {showPayrollModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Emitir Nómina
              </h3>
              <button
                onClick={() => setShowPayrollModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitPayroll} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empleado
                </label>
                <select
                  value={payrollData.employeeId}
                  onChange={(e) => setPayrollData({...payrollData, employeeId: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Seleccionar empleado</option>
                  {mockStaff.map(staff => (
                    <option key={staff.id} value={staff.id} selected={staff.id === selectedEmployee?.id}>
                      {staff.name} - {staff.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Período
                </label>
                <select
                  value={payrollData.period}
                  onChange={(e) => setPayrollData({...payrollData, period: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Seleccionar período</option>
                  <option value="Enero 2025">Enero 2025</option>
                  <option value="Febrero 2025">Febrero 2025</option>
                  <option value="Marzo 2025">Marzo 2025</option>
                  <option value="Abril 2025">Abril 2025</option>
                  <option value="Mayo 2025">Mayo 2025</option>
                  <option value="Junio 2025">Junio 2025</option>
                  <option value="Julio 2025">Julio 2025</option>
                  <option value="Agosto 2025">Agosto 2025</option>
                  <option value="Septiembre 2025">Septiembre 2025</option>
                  <option value="Octubre 2025">Octubre 2025</option>
                  <option value="Noviembre 2025">Noviembre 2025</option>
                  <option value="Diciembre 2025">Diciembre 2025</option>
                  <option value="Extra Verano 2025">Extra Verano 2025</option>
                  <option value="Extra Navidad 2025">Extra Navidad 2025</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Importe Neto
                </label>
                <Input
                  type="number"
                  value={payrollData.amount}
                  onChange={(e) => setPayrollData({...payrollData, amount: e.target.value})}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  icon={<DollarSign size={18} />}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Emisión
                </label>
                <Input
                  type="date"
                  value={payrollData.date}
                  onChange={(e) => setPayrollData({...payrollData, date: e.target.value})}
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowPayrollModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon={<FileText size={18} />}
                >
                  Emitir Nómina
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Contract Modal */}
      {showViewContractModal && selectedEmployee && selectedEmployee.hasContract && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Contrato de Trabajo
              </h3>
              <button
                onClick={() => setShowViewContractModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Información del Contrato</h4>
                    <p className="text-sm text-blue-700 mt-1">Contrato activo desde {new Date(selectedEmployee.contract.startDate).toLocaleDateString('es-ES')}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check size={12} className="mr-1" />
                    Activo
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Empleado</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedEmployee.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Puesto</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedEmployee.contract.position}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo de Contrato</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedEmployee.contract.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha de Inicio</p>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedEmployee.contract.startDate).toLocaleDateString('es-ES')}</p>
                </div>
                {selectedEmployee.contract.endDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fecha de Fin</p>
                    <p className="mt-1 text-sm text-gray-900">{new Date(selectedEmployee.contract.endDate).toLocaleDateString('es-ES')}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">Salario</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedEmployee.contract.salary.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })} 
                    {selectedEmployee.contract.salaryType === 'annual' ? ' anuales' : ' mensuales'} 
                    {` en ${selectedEmployee.contract.payments} pagas`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Jornada</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedEmployee.contract.workingHours}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-500">Horario</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(selectedEmployee.contract.schedule).map(([day, enabled]) => (
                      enabled && (
                        <span key={day} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Documento de Contrato</p>
                    <p className="text-sm text-gray-500 mt-1">{selectedEmployee.contract.file}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<DownloadIcon size={16} />}
                  >
                    Descargar
                  </Button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <Button
                variant="outline"
                icon={<FileText size={18} />}
                onClick={() => {
                  setShowViewContractModal(false);
                  handleAddContract(selectedEmployee);
                }}
              >
                Modificar Contrato
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowViewContractModal(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Contract Modal */}
      {showContractModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedEmployee?.hasContract ? 'Modificar Contrato' : 'Añadir Contrato'}
              </h3>
              <button
                onClick={() => setShowContractModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitContract} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empleado
                </label>
                <select
                  value={contractData.employeeId}
                  onChange={(e) => setContractData({...contractData, employeeId: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                  disabled={!!selectedEmployee}
                >
                  <option value="">Seleccionar empleado</option>
                  {mockStaff.map(staff => (
                    <option key={staff.id} value={staff.id} selected={staff.id === selectedEmployee?.id}>
                      {staff.name} - {staff.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Inicio
                  </label>
                  <Input
                    type="date"
                    value={contractData.startDate}
                    onChange={(e) => setContractData({...contractData, startDate: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Fin (opcional)
                  </label>
                  <Input
                    type="date"
                    value={contractData.endDate}
                    onChange={(e) => setContractData({...contractData, endDate: e.target.value})}
                    min={contractData.startDate}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Contrato
                  </label>
                  <select
                    value={contractData.type}
                    onChange={(e) => setContractData({...contractData, type: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="Indefinido">Indefinido</option>
                    <option value="Temporal">Temporal</option>
                    <option value="Prácticas">Prácticas</option>
                    <option value="Formación">Formación</option>
                    <option value="Obra y Servicio">Obra y Servicio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Puesto
                  </label>
                  <Input
                    type="text"
                    value={contractData.position}
                    onChange={(e) => setContractData({...contractData, position: e.target.value})}
                    placeholder="Ej: Veterinario Senior"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salario Bruto
                  </label>
                  <Input
                    type="number"
                    value={contractData.salary}
                    onChange={(e) => setContractData({...contractData, salary: e.target.value})}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    icon={<DollarSign size={18} />}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={contractData.salaryType}
                    onChange={(e) => setContractData({...contractData, salaryType: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="annual">Anual</option>
                    <option value="monthly">Mensual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pagas
                  </label>
                  <select
                    value={contractData.payments}
                    onChange={(e) => setContractData({...contractData, payments: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="12">12 pagas</option>
                    <option value="14">14 pagas</option>
                    <option value="15">15 pagas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horario Laboral
                </label>
                <select
                  value={contractData.workingHours}
                  onChange={(e) => setContractData({...contractData, workingHours: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Seleccionar jornada</option>
                  <option value="Jornada Completa">Jornada Completa</option>
                  <option value="Media Jornada">Media Jornada</option>
                  <option value="Jornada Parcial">Jornada Parcial</option>
                  <option value="Por Horas">Por Horas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días Laborables
                </label>
                <div className="grid grid-cols-7 gap-2">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                    <div key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`day-${day}`}
                        checked={contractData.schedule[day]}
                        onChange={(e) => setContractData({
                          ...contractData,
                          schedule: {
                            ...contractData.schedule,
                            [day]: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`day-${day}`} className="ml-2 block text-sm text-gray-900">
                        {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={contractData.isActive}
                  onChange={(e) => setContractData({...contractData, isActive: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Contrato activo
                </label>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Archivos
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Subir archivo</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">o arrastrar y soltar</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX hasta 10MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowContractModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon={<FileCheck size={18} />}
                >
                  {selectedEmployee?.hasContract ? 'Actualizar Contrato' : 'Guardar Contrato'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;