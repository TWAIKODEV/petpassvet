import React, { useState } from 'react';
import { X, Calendar, DollarSign, Pill, User, PawPrint, Shield, Clock, FileText, Phone, Mail, MapPin, CheckCircle, AlertCircle, Heart, Activity, Clipboard, Stethoscope, Eye } from 'lucide-react';
import Button from '../common/Button';
import PetHistoryModal from '../dashboard/PetHistoryModal';

interface ClientInfo {
  id: string;
  pet: {
    name: string;
    species: string;
    breed: string;
    age: number;
    sex: 'male' | 'female';
  };
  lastVisit: string;
  nextVisit?: string;
  visits: number;
  petPass: boolean;
  healthPlan?: string;
  insurance?: {
    provider: string;
    number: string;
  };
  billing: {
    totalSpent: number;
    lastPayment: {
      amount: number;
      date: string;
      method: string;
    };
  };
  prescriptions: Array<{
    date: string;
    medication: string;
    duration: string;
  }>;
}

interface ClientProfileModalProps {
  clientInfo: ClientInfo;
  onClose: () => void;
  onNavigate: () => void;
}

const ClientProfileModal: React.FC<ClientProfileModalProps> = ({ 
  clientInfo, 
  onClose,
  onNavigate
}) => {
  const [showPetHistoryModal, setShowPetHistoryModal] = useState(false);

  // Mock owner data based on client info
  const ownerData = {
    name: "María García",
    email: "maria.garcia@example.com",
    phone: "+34 666 777 888",
    address: "Calle Principal 123, Madrid",
    birthDate: "1985-06-15",
    preferredContact: "whatsapp"
  };

  // Mock medical history data
  const medicalHistory = [
    {
      date: "2025-05-01",
      type: "Revisión Anual",
      diagnosis: "Estado general saludable",
      treatment: "Vacunación antirrábica"
    },
    {
      date: "2025-04-15",
      type: "Consulta",
      diagnosis: "Dermatitis leve",
      treatment: "Champú medicado y antihistamínicos"
    },
    {
      date: "2025-03-10",
      type: "Vacunación",
      diagnosis: "Estado saludable",
      treatment: "Vacuna polivalente"
    }
  ];

  // Mock upcoming appointments
  const upcomingAppointments = clientInfo.nextVisit ? [
    {
      date: clientInfo.nextVisit,
      time: "10:30",
      type: "Revisión",
      doctor: "Dr. Alejandro Ramírez"
    }
  ] : [];

  // Prepare pet data for history modal
  const petData = {
    id: clientInfo.id,
    name: clientInfo.pet.name,
    species: clientInfo.pet.species,
    breed: clientInfo.pet.breed,
    sex: clientInfo.pet.sex,
    birthDate: new Date(Date.now() - clientInfo.pet.age * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    owner: {
      name: ownerData.name,
      phone: ownerData.phone,
      email: ownerData.email
    },
    visits: Array(clientInfo.visits).fill(null).map((_, i) => ({
      date: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      doctor: i % 2 === 0 ? 'Dr. Alejandro Ramírez' : 'Dra. Laura Gómez',
      area: i % 3 === 0 ? 'Veterinaria' : i % 3 === 1 ? 'Peluquería' : 'Cirugía',
      service: i % 3 === 0 ? 'Consulta General' : i % 3 === 1 ? 'Corte y Baño' : 'Limpieza Dental',
      amount: i % 3 === 0 ? 75.00 : i % 3 === 1 ? 45.00 : 120.00
    }))
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="sticky top-0 z-10 bg-white rounded-t-lg border-b border-gray-200">
          <div className="flex justify-between items-center px-6 py-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Ficha del Cliente</h2>
              <p className="mt-1 text-sm text-gray-500">
                Información completa del cliente y su mascota
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Owner Information */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <User className="text-blue-600 mr-3" size={24} />
                <h3 className="text-lg font-medium text-gray-900">Información del Propietario</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre</p>
                  <p className="text-base text-gray-900">{ownerData.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <div className="flex items-center">
                      <Mail size={14} className="text-gray-400 mr-1" />
                      <p className="text-sm text-gray-900">{ownerData.email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Teléfono</p>
                    <div className="flex items-center">
                      <Phone size={14} className="text-gray-400 mr-1" />
                      <p className="text-sm text-gray-900">{ownerData.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Dirección</p>
                  <div className="flex items-center">
                    <MapPin size={14} className="text-gray-400 mr-1" />
                    <p className="text-sm text-gray-900">{ownerData.address}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fecha de Nacimiento</p>
                    <p className="text-sm text-gray-900">
                      {new Date(ownerData.birthDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contacto Preferido</p>
                    <p className="text-sm text-gray-900 capitalize">{ownerData.preferredContact}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pet Information */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <PawPrint className="text-purple-600 mr-3" size={24} />
                <h3 className="text-lg font-medium text-gray-900">Información de la Mascota</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre</p>
                  <p className="text-base text-gray-900">{clientInfo.pet.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Especie</p>
                    <p className="text-sm text-gray-900">{clientInfo.pet.species}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Raza</p>
                    <p className="text-sm text-gray-900">{clientInfo.pet.breed}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Edad</p>
                    <p className="text-sm text-gray-900">{clientInfo.pet.age} años</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sexo</p>
                    <p className="text-sm text-gray-900">
                      {clientInfo.pet.sex === 'male' ? 'Macho' : 'Hembra'}
                    </p>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">PetPass</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        clientInfo.petPass ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {clientInfo.petPass ? 'Activo' : 'No tiene'}
                      </span>
                    </div>
                    
                    {clientInfo.insurance && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Seguro</p>
                        <p className="text-sm text-gray-900">{clientInfo.insurance.provider}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Stethoscope className="text-green-600 mr-3" size={24} />
                  <h3 className="text-lg font-medium text-gray-900">Historial Médico</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Eye size={16} />}
                  onClick={() => setShowPetHistoryModal(true)}
                >
                  Ver Historial Completo
                </Button>
              </div>
              
              <div className="space-y-4">
                {medicalHistory.map((record, index) => (
                  <div key={index} className={index > 0 ? "pt-3 border-t border-gray-200" : ""}>
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">{record.type}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(record.date).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-medium">Diagnóstico:</span> {record.diagnosis}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Tratamiento:</span> {record.treatment}
                    </p>
                  </div>
                ))}
                
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Total de visitas registradas: <span className="font-medium">{clientInfo.visits}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Última visita: <span className="font-medium">{new Date(clientInfo.lastVisit).toLocaleDateString('es-ES')}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <DollarSign className="text-yellow-600 mr-3" size={24} />
                <h3 className="text-lg font-medium text-gray-900">Información de Facturación</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Gastado</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {clientInfo.billing.totalSpent.toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Último Pago</p>
                    <p className="text-sm text-gray-900">
                      {clientInfo.billing.lastPayment.amount.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fecha</p>
                    <p className="text-sm text-gray-900">
                      {new Date(clientInfo.billing.lastPayment.date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Método de Pago</p>
                  <p className="text-sm text-gray-900 capitalize">
                    {clientInfo.billing.lastPayment.method === 'card' ? 'Tarjeta' : 
                     clientInfo.billing.lastPayment.method === 'cash' ? 'Efectivo' : 
                     clientInfo.billing.lastPayment.method}
                  </p>
                </div>
                
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Media mensual: <span className="font-medium">
                      {(clientInfo.billing.totalSpent / 12).toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Prescriptions */}
          {clientInfo.prescriptions.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Pill className="text-red-600 mr-3" size={24} />
                <h3 className="text-lg font-medium text-gray-900">Recetas Activas</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientInfo.prescriptions.map((prescription, index) => (
                  <div key={index} className="bg-red-50 rounded-lg p-3 border border-red-100">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-900">{prescription.medication}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(prescription.date).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Duración: {prescription.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Appointments */}
          {upcomingAppointments.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Calendar className="text-blue-600 mr-3" size={24} />
                <h3 className="text-lg font-medium text-gray-900">Próximas Citas</h3>
              </div>
              
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">{appointment.type}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(appointment.date).toLocaleDateString('es-ES')} - {appointment.time}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Con: {appointment.doctor}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={onNavigate}
          >
            Ir a Ficha Completa
          </Button>
        </div>
      </div>

      {/* Pet History Modal */}
      {showPetHistoryModal && (
        <PetHistoryModal
          pet={petData}
          onClose={() => setShowPetHistoryModal(false)}
        />
      )}
    </div>
  );
};

export default ClientProfileModal;