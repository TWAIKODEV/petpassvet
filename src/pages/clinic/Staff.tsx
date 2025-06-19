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
  FileCheck,
  Edit,
  Trash2,
  Users
} from 'lucide-react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { generatePayrollPDF } from '../../utils/payrollPdfGenerator';

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'informacion' | 'nominas'>('informacion');
  const [showNewEmployeeForm, setShowNewEmployeeForm] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [payrollDateRange, setPayrollDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  // Convex queries and mutations
  const employees = useQuery(api.employees.getEmployees) || [];
  const schedules = useQuery(api.schedules.getSchedules) || [];
  const createEmployee = useMutation(api.employees.createEmployee);
  const updateEmployee = useMutation(api.employees.updateEmployee);
  const deleteEmployee = useMutation(api.employees.deleteEmployee);
  const createSchedule = useMutation(api.schedules.createSchedule);
  const createPayroll = useMutation(api.payrolls.createPayroll);
  const employeePayrolls = useQuery(
    api.payrolls.getPayrollsByEmployee,
    selectedEmployee ? { employeeId: selectedEmployee._id } : "skip"
  ) || [];

  // Form states
  const [employeeForm, setEmployeeForm] = useState({
    nombre: '',
    apellidos: '',
    fechaNacimiento: '',
    genero: 'masculino' as 'masculino' | 'femenino' | 'otro',
    email: '',
    dni: '',
    numeroSeguridadSocial: '',
    telefono: '',
    formacionAcademica: [''],
    titulos: [''],
    tipoContrato: '',
    jornadaLaboral: '',
    scheduleIds: [] as string[],
    trabajoFinesSemana: false,
    turnoNoche: false,
    puesto: '',
    departamento: 'veterinaria' as 'veterinaria' | 'peluqueria' | 'administracion',
    salarioBase: 0,
    pagas: 12,
    diasVacaciones: 22,
    convenioColectivo: '',
    periodoPrueba: '',
    centroTrabajo: '',
    modalidad: 'presencial' as 'presencial' | 'teletrabajo' | 'hibrida',
    fechaInicio: '',
    notas: ''
  });

  const [scheduleForm, setScheduleForm] = useState({
    startTime: '',
    endTime: '',
    selectedDays: {
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    }
  });

  const [payrollForm, setPayrollForm] = useState({
    periodo: 1,
    importeNeto: 0,
    fechaEmision: new Date().toISOString().split('T')[0]
  });

  // Helper functions
  const calculateWeekdayMask = (selectedDays: any) => {
    let mask = 0;
    if (selectedDays.monday) mask |= 1;
    if (selectedDays.tuesday) mask |= 2;
    if (selectedDays.wednesday) mask |= 4;
    if (selectedDays.thursday) mask |= 8;
    if (selectedDays.friday) mask |= 16;
    if (selectedDays.saturday) mask |= 32;
    if (selectedDays.sunday) mask |= 64;
    return mask;
  };

  const getWeekdayNames = (mask: number) => {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const activeDays: string[] = [];

    for (let i = 0; i < 7; i++) {
      if (mask & (1 << i)) {
        activeDays.push(days[i]);
      }
    }

    return activeDays;
  };

  const getPeriodName = (periodo: number) => {
    if (periodo >= 1 && periodo <= 12) {
      const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      return months[periodo - 1];
    } else if (periodo === 13) {
      return 'Paga Extra Verano';
    } else if (periodo === 14) {
      return 'Paga Extra Navidad';
    }
    return 'Periodo desconocido';
  };

  // Event handlers
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEmployee({
        ...employeeForm,
        formacionAcademica: employeeForm.formacionAcademica.filter(f => f.trim() !== ''),
        titulos: employeeForm.titulos.filter(t => t.trim() !== ''),
        scheduleIds: employeeForm.scheduleIds as any
      });
      setShowNewEmployeeForm(false);
      resetEmployeeForm();
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  const handleCreateSchedule = async () => {
    try {
      const selectedDaysArray = Object.entries(scheduleForm.selectedDays)
        .filter(([_, selected]) => selected)
        .map(([day, _]) => day);

      // Group consecutive days into single schedules
      const groupedDays: string[][] = [];
      let currentGroup: string[] = [];

      for (let i = 0; i < selectedDaysArray.length; i++) {
        const day = selectedDaysArray[i];
        currentGroup.push(day);

        if (i === selectedDaysArray.length - 1 ||
            selectedDaysArray[i + 1] !== getNextDay(day)) {
          groupedDays.push(currentGroup);
          currentGroup = [];
        }
      }

      const scheduleIds: string[] = [];
      for (const group of groupedDays) {
        let weekdayMask = 0;
        for (const day of group) {
          weekdayMask |= {
            monday: 1,
            tuesday: 2,
            wednesday: 4,
            thursday: 8,
            friday: 16,
            saturday: 32,
            sunday: 64
          }[day] || 0; // Provide a default value in case of an unexpected day
        }

        const scheduleId = await createSchedule({
          startTime: scheduleForm.startTime,
          endTime: scheduleForm.endTime,
          weekdayMask: weekdayMask
        });
        scheduleIds.push(scheduleId);
      }

      setEmployeeForm(prev => ({
        ...prev,
        scheduleIds: [...prev.scheduleIds, ...scheduleIds]
      }));

      setShowScheduleModal(false);
      setScheduleForm({
        startTime: '',
        endTime: '',
        selectedDays: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false
        }
      });
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const handleCreatePayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    try {
      await createPayroll({
        employeeId: selectedEmployee._id,
        ...payrollForm
      });
      setShowPayrollModal(false);
      setPayrollForm({
        periodo: 1,
        importeNeto: 0,
        fechaEmision: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error creating payroll:', error);
    }
  };

  const resetEmployeeForm = () => {
    setEmployeeForm({
      nombre: '',
      apellidos: '',
      fechaNacimiento: '',
      genero: 'masculino',
      email: '',
      dni: '',
      numeroSeguridadSocial: '',
      telefono: '',
      formacionAcademica: [''],
      titulos: [''],
      tipoContrato: '',
      jornadaLaboral: '',
      scheduleIds: [],
      trabajoFinesSemana: false,
      turnoNoche: false,
      puesto: '',
      departamento: 'veterinaria',
      salarioBase: 0,
      pagas: 12,
      diasVacaciones: 22,
      convenioColectivo: '',
      periodoPrueba: '',
      centroTrabajo: '',
      modalidad: 'presencial',
      fechaInicio: '',
      notas: ''
    });
  };

  const filteredEmployees = employees.filter(employee =>
    `${employee.nombre} ${employee.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.puesto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrintPayroll = (employee: any, payroll: any) => {
    generatePayrollPDF(employee, payroll);
  };

  const getNextDay = (day: string): string | undefined => {
    switch (day) {
      case 'monday': return 'tuesday';
      case 'tuesday': return 'wednesday';
      case 'wednesday': return 'thursday';
      case 'thursday': return 'friday';
      case 'friday': return 'saturday';
      case 'saturday': return 'sunday';
      default: return undefined;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personal</h1>
          <p className="text-gray-600">Gestión de empleados y nóminas</p>
        </div>
        <Button
          variant="primary"
          icon={<Plus size={18} />}
          onClick={() => setShowNewEmployeeForm(true)}
        >
          Nuevo Empleado
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar empleado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee._id}>
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {employee.nombre} {employee.apellidos}
                  </h3>
                  <p className="text-sm text-gray-500">{employee.puesto}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 size={16} className="mr-2" />
                  {employee.departamento}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail size={16} className="mr-2" />
                  {employee.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={16} className="mr-2" />
                  {employee.telefono}
                </div>
              </div>

              <Button
                variant="outline"
                fullWidth
                onClick={() => setSelectedEmployee(employee)}
              >
                Ver detalles
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedEmployee.nombre} {selectedEmployee.apellidos}
              </h3>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'informacion', name: 'Información', icon: User },
                  { id: 'nominas', name: 'Nóminas', icon: DollarSign },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon size={16} />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {activeTab === 'informacion' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Datos Personales</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">DNI:</span> {selectedEmployee.dni}</div>
                      <div><span className="font-medium">Fecha Nacimiento:</span> {selectedEmployee.fechaNacimiento}</div>
                      <div><span className="font-medium">Género:</span> {selectedEmployee.genero}</div>
                      <div><span className="font-medium">Teléfono:</span> {selectedEmployee.telefono}</div>
                      <div><span className="font-medium">Email:</span> {selectedEmployee.email}</div>
                      <div><span className="font-medium">SS:</span> {selectedEmployee.numeroSeguridadSocial}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Información Laboral</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Puesto:</span> {selectedEmployee.puesto}</div>
                      <div><span className="font-medium">Departamento:</span> {selectedEmployee.departamento}</div>
                      <div><span className="font-medium">Tipo Contrato:</span> {selectedEmployee.tipoContrato}</div>
                      <div><span className="font-medium">Jornada:</span> {selectedEmployee.jornadaLaboral}</div>
                      <div><span className="font-medium">Modalidad:</span> {selectedEmployee.modalidad}</div>
                      <div><span className="font-medium">Fecha Inicio:</span> {selectedEmployee.fechaInicio}</div>
                      <div><span className="font-medium">Salario Base:</span> {selectedEmployee.salarioBase.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Horarios</h4>
                    <div className="space-y-2">
                      {selectedEmployee.schedules?.map((schedule: any, index: number) => (
                        <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                          <div><span className="font-medium">Horario:</span> {schedule.startTime} - {schedule.endTime}</div>
                          <div><span className="font-medium">Días:</span> {getWeekdayNames(schedule.weekdayMask).join(', ')}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Otros Datos</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Pagas:</span> {selectedEmployee.pagas}</div>
                      <div><span className="font-medium">Días Vacaciones:</span> {selectedEmployee.diasVacaciones}</div>
                      <div><span className="font-medium">Convenio:</span> {selectedEmployee.convenioColectivo}</div>
                      <div><span className="font-medium">Período Prueba:</span> {selectedEmployee.periodoPrueba}</div>
                      <div><span className="font-medium">Centro Trabajo:</span> {selectedEmployee.centroTrabajo}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'nominas' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900">Nóminas</h4>
                    <Button
                      variant="primary"
                      icon={<Plus size={18} />}
                      onClick={() => setShowPayrollModal(true)}
                    >
                      Emitir Nómina
                    </Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Período
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha Emisión
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Importe Neto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {employeePayrolls.map((payroll) => (
                          <tr key={payroll._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {getPeriodName(payroll.periodo)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(payroll.fechaEmision).toLocaleDateString('es-ES')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {payroll.importeNeto.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handlePrintPayroll(selectedEmployee, payroll)}
                                className="text-blue-600 hover:text-blue-800 mr-3"
                              >
                                <Printer size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Employee Form Modal */}
      {showNewEmployeeForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Nuevo Empleado</h3>
              <button
                onClick={() => setShowNewEmployeeForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Datos Personales */}
                <div className="col-span-2">
                  <h4 className="font-medium text-gray-900 mb-4">Datos Personales</h4>
                </div>

                <Input
                  label="Nombre"
                  value={employeeForm.nombre}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, nombre: e.target.value }))}
                  required
                />

                <Input
                  label="Apellidos"
                  value={employeeForm.apellidos}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, apellidos: e.target.value }))}
                  required
                />

                <Input
                  label="Fecha de Nacimiento"
                  type="date"
                  value={employeeForm.fechaNacimiento}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, fechaNacimiento: e.target.value }))}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                  <select
                    value={employeeForm.genero}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, genero: e.target.value as any }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <Input
                  label="Email"
                  type="email"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
                  required
                />

                <Input
                  label="DNI/NIE"
                  value={employeeForm.dni}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, dni: e.target.value }))}
                  required
                />

                <Input
                  label="Número Seguridad Social"
                  value={employeeForm.numeroSeguridadSocial}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, numeroSeguridadSocial: e.target.value }))}
                  required
                />

                <Input
                  label="Teléfono"
                  value={employeeForm.telefono}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, telefono: e.target.value }))}
                  required
                />

                {/* Información Laboral */}
                <div className="col-span-2 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Información Laboral</h4>
                </div>

                <Input
                  label="Puesto"
                  value={employeeForm.puesto}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, puesto: e.target.value }))}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                  <select
                    value={employeeForm.departamento}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, departamento: e.target.value as any }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="veterinaria">Veterinaria</option>
                    <option value="peluqueria">Peluquería</option>
                    <option value="administracion">Administración</option>
                  </select>
                </div>

                <Input
                  label="Tipo de Contrato"
                  value={employeeForm.tipoContrato}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, tipoContrato: e.target.value }))}
                  required
                />

                <Input
                  label="Jornada Laboral"
                  value={employeeForm.jornadaLaboral}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, jornadaLaboral: e.target.value }))}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
                  <select
                    value={employeeForm.modalidad}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, modalidad: e.target.value as any }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="presencial">Presencial</option>
                    <option value="teletrabajo">Teletrabajo</option>
                    <option value="hibrida">Híbrida</option>
                  </select>
                </div>

                <Input
                  label="Fecha de Inicio"
                  type="date"
                  value={employeeForm.fechaInicio}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, fechaInicio: e.target.value }))}
                  required
                />

                <Input
                  label="Salario Base"
                  type="number"
                  value={employeeForm.salarioBase}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, salarioBase: Number(e.target.value) }))}
                  required
                />

                <Input
                  label="Número de Pagas"
                  type="number"
                  value={employeeForm.pagas}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, pagas: Number(e.target.value) }))}
                  required
                />

                {/* Horario */}
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">Horario</label>
                    <Button
                      type="button"
                      variant="outline"
                      icon={<Plus size={16} />}
                      onClick={() => setShowScheduleModal(true)}
                    >
                      Añadir Horario
                    </Button>
                  </div>
                  {employeeForm.scheduleIds.length > 0 && (
                    <div className="space-y-2">
                      {employeeForm.scheduleIds.map((scheduleId, index) => {
                        const schedule = schedules.find(s => s._id === scheduleId);
                        return schedule ? (
                          <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                            {schedule.startTime} - {schedule.endTime} | {getWeekdayNames(schedule.weekdayMask).join(', ')}
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                {/* Additional fields */}
                <Input
                  label="Convenio Colectivo"
                  value={employeeForm.convenioColectivo}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, convenioColectivo: e.target.value }))}
                />

                <Input
                  label="Período de Prueba"
                  value={employeeForm.periodoPrueba}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, periodoPrueba: e.target.value }))}
                />

                <Input
                  label="Centro de Trabajo"
                  value={employeeForm.centroTrabajo}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, centroTrabajo: e.target.value }))}
                />

                <Input
                  label="Días de Vacaciones"
                  type="number"
                  value={employeeForm.diasVacaciones}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, diasVacaciones: Number(e.target.value) }))}
                />

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                  <textarea
                    value={employeeForm.notas}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, notas: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewEmployeeForm(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  Crear Empleado
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Añadir Horario</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <Input
                label="Hora de Inicio"
                type="time"
                value={scheduleForm.startTime}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />

              <Input
                label="Hora de Fin"
                type="time"
                value={scheduleForm.endTime}
                onChange={(e) => setScheduleForm(prev => ({ ...prev, endTime: e.target.value }))}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Días de la semana</label>
                <div className="space-y-2">
                  {Object.entries(scheduleForm.selectedDays).map(([day, selected]) => (
                    <label key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => setScheduleForm(prev => ({
                          ...prev,
                          selectedDays: {
                            ...prev.selectedDays,
                            [day]: e.target.checked
                          }
                        }))}
                        className="mr-2"
                      />
                      <span className="capitalize">
                        {day === 'monday' ? 'Lunes' :
                         day === 'tuesday' ? 'Martes' :
                         day === 'wednesday' ? 'Miércoles' :
                         day === 'thursday' ? 'Jueves' :
                         day === 'friday' ? 'Viernes' :
                         day === 'saturday' ? 'Sábado' :
                         'Domingo'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreateSchedule}
                >
                  Añadir Horario
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payroll Modal */}
      {showPayrollModal && selectedEmployee && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Emitir Nómina</h3>
              <button
                onClick={() => setShowPayrollModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreatePayroll} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                <select
                  value={payrollForm.periodo}
                  onChange={(e) => setPayrollForm(prev => ({ ...prev, periodo: Number(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {getPeriodName(i + 1)}
                    </option>
                  ))}
                  <option value={13}>Paga Extra Verano</option>
                  <option value={14}>Paga Extra Navidad</option>
                </select>
              </div>

              <Input
                label="Importe Neto"
                type="number"
                step="0.01"
                value={payrollForm.importeNeto}
                onChange={(e) => setPayrollForm(prev => ({ ...prev, importeNeto: Number(e.target.value) }))}
                required
              />

              <Input
                label="Fecha de Emisión"
                type="date"
                value={payrollForm.fechaEmision}
                onChange={(e) => setPayrollForm(prev => ({ ...prev, fechaEmision: e.target.value }))}
                required
              />

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPayrollModal(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  Emitir Nómina
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