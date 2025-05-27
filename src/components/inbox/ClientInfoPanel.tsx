import React, { useState } from 'react';
import { X, Calendar, DollarSign, Pill, User, PawPrint, Shield, Clock, FileText, Phone, Mail, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import ClientProfileModal from './ClientProfileModal';

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

interface ClientInfoPanelProps {
  clientInfo: ClientInfo;
  onClose: () => void;
  onViewFullProfile: (clientId: string) => void;
}

const ClientInfoPanel: React.FC<ClientInfoPanelProps> = ({ 
  clientInfo, 
  onClose,
  onViewFullProfile
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <div className="w-full md:w-80 border-l border-gray-200 bg-white overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Información del Cliente</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Pet Information */}
        <div>
          <div className="flex items-center mb-2">
            <PawPrint size={16} className="text-gray-500 mr-2" />
            <h4 className="text-sm font-medium text-gray-900">Mascota</h4>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900">{clientInfo.pet.name}</p>
            <p className="text-xs text-gray-500">
              {clientInfo.pet.species} {clientInfo.pet.breed}, {clientInfo.pet.age} años, {
                clientInfo.pet.sex === 'male' ? 'Macho' : 'Hembra'
              }
            </p>
          </div>
        </div>
        
        {/* Visit Information */}
        <div>
          <div className="flex items-center mb-2">
            <Calendar size={16} className="text-gray-500 mr-2" />
            <h4 className="text-sm font-medium text-gray-900">Visitas</h4>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div>
              <p className="text-xs text-gray-500">Última Visita</p>
              <p className="text-sm text-gray-900">
                {new Date(clientInfo.lastVisit).toLocaleDateString('es-ES')}
              </p>
            </div>
            {clientInfo.nextVisit && (
              <div>
                <p className="text-xs text-gray-500">Próxima Visita</p>
                <p className="text-sm text-gray-900">
                  {new Date(clientInfo.nextVisit).toLocaleDateString('es-ES')}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500">Total Visitas</p>
              <p className="text-sm text-gray-900">{clientInfo.visits}</p>
            </div>
          </div>
        </div>
        
        {/* Plans and Insurance */}
        <div>
          <div className="flex items-center mb-2">
            <Shield size={16} className="text-gray-500 mr-2" />
            <h4 className="text-sm font-medium text-gray-900">Planes y Seguros</h4>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div>
              <p className="text-xs text-gray-500">PetPass</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                clientInfo.petPass ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {clientInfo.petPass ? 'Activo' : 'No tiene'}
              </span>
            </div>
            {clientInfo.healthPlan && (
              <div>
                <p className="text-xs text-gray-500">Plan de Salud</p>
                <p className="text-sm text-gray-900">{clientInfo.healthPlan}</p>
              </div>
            )}
            {clientInfo.insurance && (
              <div>
                <p className="text-xs text-gray-500">Seguro</p>
                <p className="text-sm text-gray-900">
                  {clientInfo.insurance.provider} - {clientInfo.insurance.number}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Billing Information */}
        <div>
          <div className="flex items-center mb-2">
            <DollarSign size={16} className="text-gray-500 mr-2" />
            <h4 className="text-sm font-medium text-gray-900">Facturación</h4>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div>
              <p className="text-xs text-gray-500">Total Gastado</p>
              <p className="text-sm font-medium text-gray-900">
                {clientInfo.billing.totalSpent.toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR'
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Último Pago</p>
              <p className="text-sm text-gray-900">
                {clientInfo.billing.lastPayment.amount.toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR'
                })} - {new Date(clientInfo.billing.lastPayment.date).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Prescriptions */}
        {clientInfo.prescriptions.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <Pill size={16} className="text-gray-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">Recetas Recientes</h4>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              {clientInfo.prescriptions.map((prescription, index) => (
                <div key={index}>
                  <p className="text-xs text-gray-500">
                    {new Date(prescription.date).toLocaleDateString('es-ES')}
                  </p>
                  <p className="text-sm text-gray-900">
                    {prescription.medication} - {prescription.duration}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="pt-4 border-t border-gray-200">
          <Button
            variant="primary"
            fullWidth
            onClick={() => setShowProfileModal(true)}
          >
            Ver Perfil Completo
          </Button>
        </div>
      </div>

      {/* Client Profile Modal */}
      {showProfileModal && (
        <ClientProfileModal
          clientInfo={clientInfo}
          onClose={() => setShowProfileModal(false)}
          onNavigate={() => onViewFullProfile(clientInfo.id)}
        />
      )}
    </div>
  );
};

export default ClientInfoPanel;