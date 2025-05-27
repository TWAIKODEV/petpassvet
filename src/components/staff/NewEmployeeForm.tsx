import React, { useState } from 'react';
import { X, Plus, Trash } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

interface NewEmployeeFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const NewEmployeeForm: React.FC<NewEmployeeFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
    email: '',
    dni: '',
    socialSecurityNumber: '',
    phone: '',
    
    // Education and Qualifications
    education: [] as string[],
    certifications: [] as string[],
    
    // Contract Information
    contractType: '',
    workingHours: '',
    schedule: '',
    weekendWork: false,
    nightShift: false,
    
    // Position Information
    position: '',
    department: '',
    baseSalary: '',
    paymentPeriods: '12',
    vacationDays: '23',
    collectiveAgreement: '',
    trialPeriod: '90',
    
    // Work Location
    workLocation: '',
    workMode: 'presencial', // presencial, hibrida, teletrabajo
    
    // Additional Information
    startDate: '',
    notes: ''
  });

  const [currentCertification, setCurrentCertification] = useState('');
  const [currentEducation, setCurrentEducation] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAddCertification = () => {
    if (currentCertification.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, currentCertification.trim()]
      }));
      setCurrentCertification('');
    }
  };

  const handleAddEducation = () => {
    if (currentEducation.trim()) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, currentEducation.trim()]
      }));
      setCurrentEducation('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-start justify-center z-50 overflow-y-auto p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
        <div className="sticky top-0 z-10 bg-white rounded-t-lg border-b border-gray-200">
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Nuevo Empleado</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                label="Apellidos"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <Input
                label="Fecha de Nacimiento"
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Seleccionar Género</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </select>
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                label="DNI/NIE"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                required
              />
              <Input
                label="Número Seguridad Social"
                name="socialSecurityNumber"
                value={formData.socialSecurityNumber}
                onChange={handleChange}
                required
              />
              <Input
                label="Teléfono"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Education and Qualifications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Formación y Títulos</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Formación Académica</label>
                <div className="mt-1 flex gap-2">
                  <Input
                    value={currentEducation}
                    onChange={(e) => setCurrentEducation(e.target.value)}
                    placeholder="Añadir formación académica"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddEducation}
                  >
                    Añadir
                  </Button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{edu}</span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          education: prev.education.filter((_, i) => i !== index)
                        }))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Títulos y Certificaciones</label>
                <div className="mt-1 flex gap-2">
                  <Input
                    value={currentCertification}
                    onChange={(e) => setCurrentCertification(e.target.value)}
                    placeholder="Añadir título o certificación"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCertification}
                  >
                    Añadir
                  </Button>
                </div>
                <div className="mt-2 space-y-2">
                  {formData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{cert}</span>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          certifications: prev.certifications.filter((_, i) => i !== index)
                        }))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contract Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Contrato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="contractType"
                value={formData.contractType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Tipo de Contrato</option>
                <option value="practicas">Prácticas</option>
                <option value="temporal">Temporal</option>
                <option value="indefinido">Indefinido</option>
                <option value="obra">Obra y Servicio</option>
              </select>

              <select
                name="workingHours"
                value={formData.workingHours}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Jornada Laboral</option>
                <option value="completa">Jornada Completa</option>
                <option value="parcial">Media Jornada</option>
                <option value="reducida">Jornada Reducida</option>
              </select>

              <select
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Horario</option>
                <option value="morning">Mañana (8:00 - 15:00)</option>
                <option value="evening">Tarde (15:00 - 22:00)</option>
                <option value="split">Partido (9:00 - 14:00 y 16:00 - 19:00)</option>
              </select>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="weekendWork"
                    checked={formData.weekendWork}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Trabajo en fines de semana</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="nightShift"
                    checked={formData.nightShift}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Turno de noche</span>
                </label>
              </div>
            </div>
          </div>

          {/* Position Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Puesto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Puesto</option>
                <option value="secretaria">Secretaria</option>
                <option value="auxiliar_veterinario">Auxiliar Veterinario</option>
                <option value="auxiliar_enfermeria">Auxiliar Enfermería Veterinaria</option>
                <option value="veterinario_practicas">Veterinario en Prácticas</option>
                <option value="veterinario_jr">Veterinario Jr</option>
                <option value="veterinario_senior">Veterinario Senior</option>
                <option value="veterinario_especialista">Veterinario Especialista</option>
              </select>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Departamento</option>
                <option value="veterinaria">Veterinaria</option>
                <option value="peluqueria">Peluquería</option>
                <option value="recepcion">Recepción</option>
                <option value="administracion">Administración</option>
              </select>

              <Input
                label="Salario Base"
                type="number"
                name="baseSalary"
                value={formData.baseSalary}
                onChange={handleChange}
                required
              />

              <select
                name="paymentPeriods"
                value={formData.paymentPeriods}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="12">12 pagas</option>
                <option value="14">14 pagas</option>
              </select>

              <Input
                label="Días de Vacaciones"
                type="number"
                name="vacationDays"
                value={formData.vacationDays}
                onChange={handleChange}
                required
              />

              <Input
                label="Convenio Colectivo"
                name="collectiveAgreement"
                value={formData.collectiveAgreement}
                onChange={handleChange}
                required
              />

              <Input
                label="Período de Prueba (días)"
                type="number"
                name="trialPeriod"
                value={formData.trialPeriod}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Work Location */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ubicación de Trabajo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Centro de Trabajo"
                name="workLocation"
                value={formData.workLocation}
                onChange={handleChange}
                required
              />

              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="presencial">Presencial</option>
                <option value="hibrida">Híbrida</option>
                <option value="teletrabajo">Teletrabajo</option>
              </select>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información Adicional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Fecha de Inicio"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Añade cualquier nota o comentario relevante..."
                />
              </div>
            </div>
          </div>
        </form>

        {/* Form Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-lg">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              onClick={handleSubmit}
            >
              Guardar Empleado
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewEmployeeForm;