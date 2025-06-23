import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock,
  Activity,
  BarChart2,
  FileText,
  Pill,
  ArrowRight,
  Calendar,
  User,
  Euro,
  RefreshCw
} from 'lucide-react';
import AppointmentList from '../components/dashboard/AppointmentList';
import NewAppointmentForm from '../components/dashboard/NewAppointmentForm';
import NewPatientForm from '../components/patients/NewPatientForm';
import NewSaleForm from '../components/dashboard/NewSaleForm';
import NewBudgetForm from '../components/dashboard/NewBudgetForm';

import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { mockDashboardSummary } from '../data/mockData';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  
  // Load real data from Convex
  const appointments = useQuery(api.appointments.getAppointments) || [];
  const patients = useQuery(api.patients.getPatients) || [];
  const employees = useQuery(api.employees.getEmployees) || [];
  const [showNewAppointmentForm, setShowNewAppointmentForm] = useState(false);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [showNewSaleForm, setShowNewSaleForm] = useState(false);
  const [showNewBudgetForm, setShowNewBudgetForm] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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

  const handleNewAppointment = (appointmentData: any) => {
    // Here you would typically make an API call to save the new appointment
    console.log('New appointment data:', appointmentData);
    setShowNewAppointmentForm(false);
  };

  const handleNewPatient = (patientData: any) => {
    // Here you would typically make an API call to save the new patient
    console.log('New patient data:', patientData);
    setShowNewPatientForm(false);
  };

  const handleNewSale = (saleData: any) => {
    // Here you would typically make an API call to save the new sale
    console.log('New sale data:', saleData);
    setShowNewSaleForm(false);
  };

  const handleNewBudget = (budgetData: any) => {
    // Here you would typically make an API call to save the new budget
    console.log('New budget data:', budgetData);
    setShowNewBudgetForm(false);
  };

  

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'Nueva Cita',
      icon: <Calendar size={20} />,
      color: 'text-blue-600 bg-blue-100',
      onClick: () => setShowNewAppointmentForm(true)
    },
    {
      title: 'Nuevo Cliente',
      icon: <User size={20} />,
      color: 'text-purple-600 bg-purple-100',
      onClick: () => setShowNewPatientForm(true)
    },
    {
      title: 'Nueva Venta',
      icon: <Euro size={20} />,
      color: 'text-green-600 bg-green-100',
      onClick: () => setShowNewSaleForm(true)
    },
    {
      title: 'Nuevo Presupuesto',
      icon: <FileText size={20} />,
      color: 'text-orange-600 bg-orange-100',
      onClick: () => setShowNewBudgetForm(true)
    },
    {
      title: 'Nueva Receta',
      icon: <Pill size={20} />,
      color: 'text-teal-600 bg-teal-100',
      onClick: () => navigate('/dashboard/new-prescription')
    }
  ];

  // Status colors and labels for appointment states
  const appointmentStatusConfig = [
    { status: 'pending', label: 'Pendientes', color: 'text-orange-600' },
    { status: 'confirmed', label: 'Confirmadas', color: 'text-yellow-600' },
    { status: 'waiting', label: 'En Espera', color: 'text-pink-600' },
    { status: 'in_progress', label: 'En Curso', color: 'text-blue-600' },
    { status: 'completed', label: 'Terminadas', color: 'text-green-600' },
    { status: 'no_show', label: 'No Asistencia', color: 'text-red-600' }
  ];

  return (
    <div className="space-y-6">
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

      <Card title="Gestión" icon={<BarChart2 size={20} />}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-2">
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              onClick={action.onClick ? (e) => {
                e.preventDefault();
                action.onClick();
              } : undefined}
              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
            >
              <div className={`p-2 rounded-lg ${action.color} transition-colors`}>
                {action.icon}
              </div>
              <span className="ml-3 text-sm font-medium text-gray-900 group-hover:text-gray-700">
                {action.title}
              </span>
              <ArrowRight size={16} className="ml-auto text-gray-400 group-hover:text-gray-600" />
            </a>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AppointmentList 
            appointments={appointments}
            patients={patients}
            employees={employees}
            title="Próximas Citas"
          />
        </div>
        
        <div className="space-y-6">
          <Card title="Citas de Hoy" icon={<Clock size={20} />}>
            <div className="text-center py-8">
              {(() => {
                const today = new Date().toISOString().split('T')[0];
                const todayAppointments = appointments.filter(app => app.date === today);
                return (
                  <>
                    <div className="text-5xl font-bold text-blue-600 flex items-center justify-center">
                      <Calendar size={36} className="mr-2 text-blue-500" />
                      {todayAppointments.length}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">citas programadas para hoy</p>
                  </>
                );
              })()}
              
              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                {appointmentStatusConfig.map((config) => {
                  const today = new Date().toISOString().split('T')[0];
                  const todayAppointments = appointments.filter(app => app.date === today);
                  return (
                    <div key={config.status} className="border rounded-lg p-3">
                      <p className="text-gray-500 text-xs">{config.label}</p>
                      <p className={`text-xl font-semibold ${config.color}`}>
                        {todayAppointments.filter(a => a.status === config.status).length}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              <button className="mt-6 text-sm font-medium text-blue-600 hover:text-blue-500">
                Ver agenda completa →
              </button>
            </div>
          </Card>

          <Card title="Ingresos de Hoy" icon={<Euro size={20} />}>
            <div className="text-center py-8">
              <div className="text-5xl font-bold text-green-600 flex items-center justify-center">
                <Euro size={36} className="mr-2 text-green-500" />
                {mockDashboardSummary.revenueToday.toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR'
                }).replace('EUR', '€')}
              </div>
              <p className="mt-2 text-sm text-gray-600">ingresos del día</p>
              
              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="border rounded-lg p-3">
                  <p className="text-gray-500 text-xs">Efectivo</p>
                  <p className="text-xl font-semibold text-green-600">
                    {(mockDashboardSummary.revenueToday * 0.6).toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR'
                    }).replace('EUR', '€')}
                  </p>
                </div>
                <div className="border rounded-lg p-3">
                  <p className="text-gray-500 text-xs">Tarjeta</p>
                  <p className="text-xl font-semibold text-blue-600">
                    {(mockDashboardSummary.revenueToday * 0.4).toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR'
                    }).replace('EUR', '€')}
                  </p>
                </div>
              </div>
              
              <button className="mt-6 text-sm font-medium text-blue-600 hover:text-blue-500">
                Ver detalles →
              </button>
            </div>
          </Card>
          
          <Card title="Actividad Reciente" icon={<Activity size={20} />}>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User size={16} />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-900">Nuevo paciente registrado</p>
                  <p className="text-xs text-gray-500">Hace 23 minutos</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <Calendar size={16} />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-900">Cita confirmada</p>
                  <p className="text-xs text-gray-500">Hace 1 hora</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <Euro size={16} />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-900">Pago recibido</p>
                  <p className="text-xs text-gray-500">Hace 2 horas</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Ver todo →
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* New Appointment Form Modal */}
      {showNewAppointmentForm && (
        <NewAppointmentForm
          onClose={() => setShowNewAppointmentForm(false)}
          onSubmit={handleNewAppointment}
        />
      )}

      {/* New Patient Form Modal */}
      {showNewPatientForm && (
        <NewPatientForm
          onClose={() => setShowNewPatientForm(false)}
          onSubmit={handleNewPatient}
        />
      )}

      {/* New Sale Form Modal */}
      {showNewSaleForm && (
        <NewSaleForm
          onClose={() => setShowNewSaleForm(false)}
          onSubmit={handleNewSale}
        />
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

export default Dashboard;