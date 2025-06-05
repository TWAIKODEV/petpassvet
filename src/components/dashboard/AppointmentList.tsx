import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, PhoneCall, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Appointment, Patient, Doctor } from '../../types';
import PetHistoryModal from './PetHistoryModal';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

interface AppointmentListProps {
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
  title?: string;
  limit?: number;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ 
  appointments,
  patients, 
  doctors, 
  title = "Próximas Citas", 
  limit = 5 
}) => {
  const [selectedPet, setSelectedPet] = useState<any>(null);

  // Get patient and doctor info for each appointment
  const getPatientById = (id: string) => patients.find(patient => patient.id === id);
  const getDoctorById = (id: string) => doctors.find(doctor => doctor.id === id);

  // Status indicator styles with background opacity for better readability
  const statusStyles = {
    'pending': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
    'confirmed': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    'waiting': 'bg-pink-100 text-pink-800 hover:bg-pink-200',
    'in_progress': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    'completed': 'bg-green-100 text-green-800 hover:bg-green-200',
    'no_show': 'bg-red-100 text-red-800 hover:bg-red-200'
  };

  // Status labels in Spanish
  const statusLabels = {
    'pending': 'Pte Confirmación',
    'confirmed': 'Confirmada',
    'waiting': 'Sala de Espera',
    'in_progress': 'En Curso',
    'completed': 'Terminada',
    'no_show': 'No Asistencia'
  };

  // Consultation kind labels and icons
  const consultationKindLabels = {
    'annualReview': 'Revisión Anual',
    'followUp': 'Seguimiento',
    'checkUp': 'Chequeo',
    'emergency': 'Emergencia',
    'vaccination': 'Vacunación',
    'surgery': 'Cirugía',
    'dental': 'Dental',
    'grooming': 'Peluquería'
  };

  // Service type labels
  const serviceTypeLabels = {
    'veterinary': 'Veterinaria',
    'grooming': 'Peluquería',
    'rehabilitation': 'Rehabilitación',
    'hospitalization': 'Hospitalización'
  };

  // Communication methods configuration
  const communicationMethods = {
    'phone': {
      icon: <PhoneCall size={16} />,
      label: 'Llamar',
      action: (contact: string) => `tel:${contact}`,
      className: 'text-green-600 hover:text-green-700'
    },
    'email': {
      icon: <Mail size={16} />,
      label: 'Enviar email',
      action: (contact: string) => `mailto:${contact}`,
      className: 'text-blue-600 hover:text-blue-700'
    },
    'whatsapp': {
      icon: <MessageSquare size={16} />,
      label: 'WhatsApp',
      action: (contact: string) => `https://wa.me/${contact.replace(/[^0-9]/g, '')}`,
      className: 'text-emerald-600 hover:text-emerald-700'
    },
    'sms': {
      icon: <MessageSquare size={16} />,
      label: 'SMS',
      action: (contact: string) => `sms:${contact}`,
      className: 'text-purple-600 hover:text-purple-700'
    }
  };

  const handleCommunication = (method: string, contact: string) => {
    const config = communicationMethods[method];
    if (config) {
      window.open(config.action(contact), '_blank');
    }
  };

  const handleConsultation = (appointmentId: string) => {
    // Navigate to consultation page
    window.location.href = `/consulta/${appointmentId}`;
  };

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    // Here you would typically make an API call to update the appointment status
    console.log('Updating appointment', appointmentId, 'to status:', newStatus);
  };

  const handleViewHistory = (petId: string) => {
    // Mock pet data - in a real app, you would fetch this from your API
    const mockPet = {
      id: petId,
      name: "Luna",
      species: "Perro",
      breed: "Labrador",
      sex: "female",
      birthDate: "2020-06-15",
      owner: {
        name: "María García",
        phone: "+34 666 777 888",
        email: "maria.garcia@example.com"
      },
      visits: [
        {
          date: "2025-05-20",
          doctor: "Dr. Alejandro Ramírez",
          area: "Veterinaria",
          service: "Revisión Anual",
          amount: 75.00
        },
        {
          date: "2025-04-15",
          doctor: "Ana López",
          area: "Peluquería",
          service: "Corte y Baño",
          amount: 45.00
        },
        {
          date: "2025-03-10",
          doctor: "Dra. Laura Gómez",
          area: "Veterinaria",
          service: "Vacunación",
          amount: 60.00
        },
        {
          date: "2025-02-01",
          doctor: "Dr. Miguel Torres",
          area: "Cirugía",
          service: "Limpieza Dental",
          amount: 120.00
        }
      ]
    };

    setSelectedPet(mockPet);
  };

  const appointments = useQuery(api.appointments.getAppointments) || [];
  const todayAppointments = appointments.filter(appointment => {
    const today = new Date().toISOString().split('T')[0];
    return appointment.date === today;
  });

  return (
    <Card title={title} icon={<Calendar size={20} />}>
      <div className="divide-y divide-gray-200">
        {appointments.slice(0, limit).map((appointment) => {
          const patient = getPatientById(appointment.patientId);
          const doctor = getDoctorById(appointment.doctorId);

          if (!patient || !doctor) return null;

          return (
            <div key={appointment.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium text-gray-900">
                      {appointment.petName}
                    </h4>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {appointment.breed}, {appointment.age} años, {appointment.sex === 'male' ? 'Macho' : 'Hembra'}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center">
                    <span className="text-sm text-gray-600">Propietario: {patient.name}</span>
                    <div className="ml-3 flex items-center space-x-2">
                      {patient.preferredContact && (
                        <button
                          onClick={() => handleCommunication(patient.preferredContact, patient[patient.preferredContact === 'email' ? 'email' : 'phone'])}
                          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${communicationMethods[patient.preferredContact].className} bg-opacity-10 hover:bg-opacity-20`}
                          title={`Contactar por ${communicationMethods[patient.preferredContact].label}`}
                        >
                          {communicationMethods[patient.preferredContact].icon}
                          <span>{communicationMethods[patient.preferredContact].label}</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                      {consultationKindLabels[appointment.consultationKind]}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {serviceTypeLabels[appointment.serviceType]}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <select
                    value={appointment.status}
                    onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                    className={`appearance-none text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${statusStyles[appointment.status]}`}
                    style={{
                      paddingRight: '2rem' // Space for the custom arrow
                    }}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option 
                        key={value} 
                        value={value}
                        className="text-gray-900 bg-white" // Reset colors for dropdown options
                      >
                        {label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <svg className="h-4 w-4 text-current opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center text-xs text-gray-500">
                <User size={14} className="mr-1" />
                <span>Dr. {doctor.name.split(' ')[doctor.name.split(' ').length - 1]}</span>
                <span className="mx-2">•</span>
                <Calendar size={14} className="mr-1" />
                <span>
                  {new Date(appointment.date).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    day: 'numeric',
                    month: 'long'
                  })}
                </span>
                <span className="mx-2">•</span>
                <Clock size={14} className="mr-1" />
                <span>{appointment.time} ({appointment.duration} min)</span>
              </div>

              {appointment.notes && (
                <p className="mt-2 text-xs text-gray-600 italic">"{appointment.notes}"</p>
              )}

              <div className="mt-2 flex justify-between items-center">
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleViewHistory(appointment.id);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Ver historial completo →
                </a>
                {appointment.status !== 'completed' && appointment.status !== 'no_show' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConsultation(appointment.id)}
                    icon={<ArrowRight size={16} />}
                    iconPosition="right"
                  >
                    Ir a Consulta
                  </Button>
                )}
              </div>
            </div>
          );
        })}

        {appointments.length === 0 && (
          <p className="py-4 text-sm text-gray-500 text-center">No hay citas programadas.</p>
        )}
      </div>

      {appointments.length > limit && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Ver todas las citas
          </button>
        </div>
      )}

      {selectedPet && (
        <PetHistoryModal
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
        />
      )}
    </Card>
  );
};

export default AppointmentList;