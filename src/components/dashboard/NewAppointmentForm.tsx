import React, { useState } from 'react';
import { X, Search, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import { mockPatients, mockDoctors, mockAppointments } from '../../data/mockData';

interface NewAppointmentFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const NewAppointmentForm: React.FC<NewAppointmentFormProps> = ({ onClose, onSubmit }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: '30',
    serviceType: '',
    consultationType: 'normal',
    consultationKind: '',
    doctorId: '',
    notes: ''
  });

  // Filter patients based on search term
  const filteredPatients = mockPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const appointmentData = {
      ...formData,
      patientId: selectedPatient.id,
      petName: selectedPatient.pet.name,
      breed: selectedPatient.pet.breed,
      age: new Date().getFullYear() - new Date(selectedPatient.pet.birthDate).getFullYear(),
      sex: selectedPatient.pet.sex,
      status: 'pending'
    };

    // Add the new appointment to the mock data
    const newAppointment = {
      id: `temp-${Date.now()}`, // In a real app, this would be generated by the backend
      ...appointmentData
    };

    // Update the mock appointments (in a real app, this would be an API call)
    mockAppointments.push(newAppointment);

    // Call the onSubmit prop
    onSubmit(appointmentData);

    // Close the form
    onClose();

    // Navigate to the appointments view
    navigate('/agenda/citas', { 
      state: { 
        newAppointment: true,
        date: formData.date 
      } 
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nueva Cita</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Patient Search Section */}
          {!selectedPatient ? (
            <div className="space-y-4">
              <Input
                label="Buscar paciente"
                placeholder="Buscar por nombre del propietario, mascota, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} />}
              />

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Resultados de la búsqueda</h3>
                <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                  {filteredPatients.map(patient => (
                    <button
                      key={patient.id}
                      type="button"
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-500">{patient.email} • {patient.phone}</p>
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {patient.pet.name} • {patient.pet.breed} • {patient.pet.sex === 'male' ? 'Macho' : 'Hembra'}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                  {filteredPatients.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No se encontraron resultados
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selected Patient Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">Paciente Seleccionado</h3>
                    <p className="mt-1 text-sm text-blue-700">{selectedPatient.name}</p>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {selectedPatient.pet.name} • {selectedPatient.pet.breed} • {selectedPatient.pet.sex === 'male' ? 'Macho' : 'Hembra'}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPatient(null)}
                    className="text-blue-700 hover:text-blue-800 text-sm font-medium"
                  >
                    Cambiar paciente
                  </button>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área de Servicio
                  </label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Seleccionar área</option>
                    <option value="veterinary">Veterinaria</option>
                    <option value="grooming">Peluquería</option>
                    <option value="rehabilitation">Rehabilitación</option>
                    <option value="hospitalization">Hospitalización</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Consulta
                  </label>
                  <select
                    name="consultationKind"
                    value={formData.consultationKind}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="annualReview">Revisión Anual</option>
                    <option value="followUp">Seguimiento</option>
                    <option value="checkUp">Chequeo</option>
                    <option value="emergency">Emergencia</option>
                    <option value="vaccination">Vacunación</option>
                    <option value="surgery">Cirugía</option>
                    <option value="dental">Dental</option>
                    <option value="grooming">Peluquería</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profesional
                  </label>
                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Seleccionar profesional</option>
                    {mockDoctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  >
                    <option value="15">15 minutos</option>
                    <option value="30">30 minutos</option>
                    <option value="45">45 minutos</option>
                    <option value="60">1 hora</option>
                    <option value="90">1 hora 30 minutos</option>
                    <option value="120">2 horas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha
                  </label>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    icon={<Calendar size={18} />}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora
                  </label>
                  <Input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    icon={<Clock size={18} />}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Añade notas o comentarios relevantes..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            {selectedPatient && (
              <Button
                type="submit"
                variant="primary"
              >
                Crear Cita
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentForm;