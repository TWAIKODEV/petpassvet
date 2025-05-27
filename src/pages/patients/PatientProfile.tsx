import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign,
  FileText,
  Shield,
  Activity,
  Pill,
  Syringe,
  Scissors,
  Heart,
  AlertTriangle,
  Download,
  Printer,
  Edit,
  Plus,
  BarChart2
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

// Mock patient data - In a real app, this would come from your API
const mockPatientData = {
  id: '1',
  owner: {
    name: 'María García',
    email: 'maria.garcia@email.com',
    phone: '+34 666 777 888',
    address: 'Calle Principal 123, Madrid',
    birthDate: '1985-06-15',
    preferredContact: 'whatsapp',
    registrationDate: '2024-01-15'
  },
  pet: {
    name: 'Luna',
    species: 'Perro',
    breed: 'Labrador',
    sex: 'female',
    birthDate: '2022-03-10',
    color: 'Dorado',
    weight: 25.5,
    microchip: '941000024680135',
    isNeutered: true,
    allergies: ['Pollo'],
    conditions: ['Dermatitis atópica'],
    notes: 'Muy activa y sociable'
  },
  plans: {
    petPass: {
      active: true,
      plan: 'Premium',
      startDate: '2024-02-01',
      endDate: '2025-01-31',
      benefits: [
        'Consultas ilimitadas',
        'Vacunación anual',
        'Desparasitación',
        'Limpieza dental anual'
      ]
    },
    insurance: {
      provider: 'PetSure',
      policyNumber: 'PS-123456',
      coverage: '80%',
      startDate: '2024-01-15',
      endDate: '2025-01-14'
    }
  },
  visits: [
    {
      id: '1',
      date: '2025-05-15',
      type: 'Revisión Anual',
      doctor: 'Dr. Alejandro Ramírez',
      diagnosis: 'Estado general saludable',
      treatment: 'Vacunación antirrábica',
      notes: 'Próxima revisión en 6 meses',
      vitals: {
        weight: 25.5,
        temperature: 38.5,
        heartRate: 80,
        respiratory: 20
      }
    },
    {
      id: '2',
      date: '2025-04-01',
      type: 'Consulta',
      doctor: 'Dra. Laura Gómez',
      diagnosis: 'Dermatitis leve',
      treatment: 'Champú medicado y antihistamínicos',
      notes: 'Seguimiento en 2 semanas',
      vitals: {
        weight: 25.2,
        temperature: 38.7,
        heartRate: 82,
        respiratory: 22
      }
    }
  ],
  vaccinations: [
    {
      name: 'Rabia',
      date: '2025-05-15',
      nextDue: '2026-05-15',
      vet: 'Dr. Alejandro Ramírez'
    },
    {
      name: 'Polivalente',
      date: '2025-01-10',
      nextDue: '2026-01-10',
      vet: 'Dra. Laura Gómez'
    }
  ],
  prescriptions: [
    {
      id: '1',
      date: '2025-05-15',
      medication: 'Simparica 80mg',
      dosage: '1 comprimido',
      frequency: 'Mensual',
      duration: '6 meses',
      doctor: 'Dr. Alejandro Ramírez'
    },
    {
      id: '2',
      date: '2025-04-01',
      medication: 'Apoquel 16mg',
      dosage: '1 comprimido',
      frequency: 'Cada 12 horas',
      duration: '14 días',
      doctor: 'Dra. Laura Gómez'
    }
  ],
  grooming: [
    {
      id: '1',
      date: '2025-05-01',
      service: 'Corte completo',
      notes: 'Corte de verano',
      groomer: 'Ana López'
    }
  ],
  billing: {
    totalSpent: 1250.00,
    lastPayment: {
      amount: 75.00,
      date: '2025-05-15',
      method: 'card'
    },
    recentTransactions: [
      {
        id: '1',
        date: '2025-05-15',
        concept: 'Consulta + Vacunación',
        amount: 75.00,
        method: 'card'
      },
      {
        id: '2',
        date: '2025-05-01',
        concept: 'Peluquería',
        amount: 45.00,
        method: 'cash'
      },
      {
        id: '3',
        date: '2025-04-01',
        concept: 'Consulta Dermatología',
        amount: 60.00,
        method: 'card'
      }
    ]
  }
};

const PatientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'billing'>('info');
  
  // In a real app, you would fetch the patient data based on the ID
  const patient = mockPatientData;

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ficha del Paciente</h1>
          <p className="mt-1 text-sm text-gray-500">
            Información completa del paciente y su historial
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={<Download size={18} />}
          >
            Exportar
          </Button>
          <Button
            variant="outline"
            icon={<Printer size={18} />}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          icon={<Calendar size={18} />}
          fullWidth
        >
          Nueva Cita
        </Button>
        <Button
          variant="outline"
          icon={<Pill size={18} />}
          fullWidth
        >
          Nueva Prescripción
        </Button>
        <Button
          variant="outline"
          icon={<Scissors size={18} />}
          fullWidth
        >
          Servicio Peluquería
        </Button>
        <Button
          variant="outline"
          icon={<DollarSign size={18} />}
          fullWidth
        >
          Nueva Venta
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
            onClick={() => setActiveTab('history')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Historial Clínico
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'billing'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Facturación
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'info' && (
          <>
            {/* Owner Information */}
            <Card title="Información del Propietario" icon={<User size={20} />}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Nombre</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.owner.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.owner.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Teléfono</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.owner.phone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Dirección</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.owner.address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Fecha de Nacimiento</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(patient.owner.birthDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Cliente desde</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(patient.owner.registrationDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pet Information */}
            <Card title="Información de la Mascota" icon={<Heart size={20} />}>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Nombre</label>
                      <p className="mt-1 text-sm text-gray-900">{patient.pet.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Especie</label>
                      <p className="mt-1 text-sm text-gray-900">{patient.pet.species}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Raza</label>
                      <p className="mt-1 text-sm text-gray-900">{patient.pet.breed}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Edad</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {calculateAge(patient.pet.birthDate)} años
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Sexo</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {patient.pet.sex === 'male' ? 'Macho' : 'Hembra'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Peso</label>
                      <p className="mt-1 text-sm text-gray-900">{patient.pet.weight} kg</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Microchip</label>
                      <p className="mt-1 text-sm text-gray-900">{patient.pet.microchip}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Estado</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {patient.pet.isNeutered ? 'Esterilizado/a' : 'No esterilizado/a'}
                      </p>
                    </div>
                  </div>
                </div>

                {(patient.pet.allergies.length > 0 || patient.pet.conditions.length > 0) && (
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <h4 className="ml-2 text-sm font-medium text-yellow-800">
                        Información Importante
                      </h4>
                    </div>
                    <div className="mt-2 space-y-2">
                      {patient.pet.allergies.length > 0 && (
                        <p className="text-sm text-yellow-700">
                          <span className="font-medium">Alergias:</span> {patient.pet.allergies.join(', ')}
                        </p>
                      )}
                      {patient.pet.conditions.length > 0 && (
                        <p className="text-sm text-yellow-700">
                          <span className="font-medium">Condiciones:</span> {patient.pet.conditions.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {patient.pet.notes && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-500">Notas</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.pet.notes}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Plans and Insurance */}
            <Card title="Planes y Seguros" icon={<Shield size={20} />}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PetPass */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-blue-900">PetPass</h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {patient.plans.petPass.plan}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Vigencia:</span>{' '}
                      {new Date(patient.plans.petPass.startDate).toLocaleDateString('es-ES')} -{' '}
                      {new Date(patient.plans.petPass.endDate).toLocaleDateString('es-ES')}
                    </p>
                    <div>
                      <p className="text-sm font-medium text-blue-700">Beneficios:</p>
                      <ul className="mt-1 text-sm text-blue-700 list-disc list-inside">
                        {patient.plans.petPass.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Insurance */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-green-900">Seguro Veterinario</h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Cobertura {patient.plans.insurance.coverage}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-green-700">
                      <span className="font-medium">Aseguradora:</span> {patient.plans.insurance.provider}
                    </p>
                    <p className="text-sm text-green-700">
                      <span className="font-medium">Nº Póliza:</span> {patient.plans.insurance.policyNumber}
                    </p>
                    <p className="text-sm text-green-700">
                      <span className="font-medium">Vigencia:</span>{' '}
                      {new Date(patient.plans.insurance.startDate).toLocaleDateString('es-ES')} -{' '}
                      {new Date(patient.plans.insurance.endDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}

        {activeTab === 'history' && (
          <>
            {/* Medical History */}
            <Card title="Historial de Visitas" icon={<Activity size={20} />}>
              <div className="p-6">
                <div className="space-y-6">
                  {patient.visits.map((visit) => (
                    <div key={visit.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{visit.type}</h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {new Date(visit.date).toLocaleDateString('es-ES')} • {visit.doctor}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<FileText size={16} />}
                        >
                          Ver Detalles
                        </Button>
                      </div>
                      <div className="mt-4 grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Peso</p>
                          <p className="text-sm font-medium text-gray-900">{visit.vitals.weight} kg</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Temperatura</p>
                          <p className="text-sm font-medium text-gray-900">{visit.vitals.temperature}°C</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Frec. Cardíaca</p>
                          <p className="text-sm font-medium text-gray-900">{visit.vitals.heartRate} lpm</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Frec. Respiratoria</p>
                          <p className="text-sm font-medium text-gray-900">{visit.vitals.respiratory} rpm</p>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div>
                          <p className="text-xs text-gray-500">Diagnóstico</p>
                          <p className="text-sm text-gray-900">{visit.diagnosis}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Tratamiento</p>
                          <p className="text-sm text-gray-900">{visit.treatment}</p>
                        </div>
                        {visit.notes && (
                          <div>
                            <p className="text-xs text-gray-500">Notas</p>
                            <p className="text-sm text-gray-900">{visit.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Vaccinations */}
            <Card title="Vacunaciones" icon={<Syringe size={20} />}>
              <div className="p-6">
                <div className="space-y-4">
                  {patient.vaccinations.map((vaccination, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{vaccination.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(vaccination.date).toLocaleDateString('es-ES')} • {vaccination.vet}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Próxima dosis</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(vaccination.nextDue).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Prescriptions */}
            <Card title="Prescripciones" icon={<Pill size={20} />}>
              <div className="p-6">
                <div className="space-y-6">
                  {patient.prescriptions.map((prescription) => (
                    <div key={prescription.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{prescription.medication}</h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {new Date(prescription.date).toLocaleDateString('es-ES')} • {prescription.doctor}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<Printer size={16} />}
                        >
                          Imprimir
                        </Button>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Dosis</p>
                          <p className="text-sm text-gray-900">{prescription.dosage}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Frecuencia</p>
                          <p className="text-sm text-gray-900">{prescription.frequency}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Duración</p>
                          <p className="text-sm text-gray-900">{prescription.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Grooming */}
            <Card title="Servicios de Peluquería" icon={<Scissors size={20} />}>
              <div className="p-6">
                <div className="space-y-4">
                  {patient.grooming.map((service) => (
                    <div key={service.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{service.service}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(service.date).toLocaleDateString('es-ES')} • {service.groomer}
                        </p>
                      </div>
                      {service.notes && (
                        <p className="text-sm text-gray-500">{service.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </>
        )}

        {activeTab === 'billing' && (
          <>
            {/* Billing Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="p-6">
                  <h3 className="text-sm font-medium text-gray-500">Total Gastado</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {patient.billing.totalSpent.toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </p>
                </div>
              </Card>
              <Card>
                <div className="p-6">
                  <h3 className="text-sm font-medium text-gray-500">Último Pago</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {patient.billing.lastPayment.amount.toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(patient.billing.lastPayment.date).toLocaleDateString('es-ES')} • {
                      patient.billing.lastPayment.method === 'card' ? 'Tarjeta' :
                      patient.billing.lastPayment.method === 'cash' ? 'Efectivo' : 'Transferencia'
                    }
                  </p>
                </div>
              </Card>
              <Card>
                <div className="p-6">
                  <h3 className="text-sm font-medium text-gray-500">Media Mensual</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {(patient.billing.totalSpent / 12).toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </p>
                </div>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card title="Transacciones Recientes" icon={<BarChart2 size={20} />}>
              <div className="p-6">
                <div className="space-y-4">
                  {patient.billing.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transaction.concept}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString('es-ES')} • {
                            transaction.method === 'card' ? 'Tarjeta' :
                            transaction.method === 'cash' ? 'Efectivo' : 'Transferencia'
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.amount.toLocaleString('es-ES', {
                            style: 'currency',
                            currency: 'EUR'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;