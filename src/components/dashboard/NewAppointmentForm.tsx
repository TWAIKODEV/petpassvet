import React, { useState, useEffect } from 'react';
import { X, Search, Calendar, Clock, User } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id, Doc } from '../../../convex/_generated/dataModel';
import { FunctionReturnType } from 'convex/server';
import { useToastContext } from '../../context/ToastContext';
import { getTodayFormatted } from '../../utils/dateUtils';
import { useSocialMediaAuth } from '../../hooks/useSocialMediaAuth';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormValidator, type NewAppointmentFormInput, type NewAppointmentFormOutput } from '../../validators/formValidator';

interface NewAppointmentFormProps {
  onClose: () => void;
  onSubmit: (data: Omit<Doc<"appointments">, "_id" | "createdAt" | "updatedAt" | "_creationTime">) => void;
}

const NewAppointmentForm: React.FC<NewAppointmentFormProps> = ({ onClose, onSubmit }) => {
  const { showSuccess, showError } = useToastContext();
  const { updateConnectedAccounts } = useSocialMediaAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientPet, setSelectedPatientPet] = useState<NonNullable<FunctionReturnType<typeof api.appointments.searchPatientsAndPets>[number]> | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const form = useForm<NewAppointmentFormInput, unknown, NewAppointmentFormOutput>({
    resolver: zodResolver(FormValidator.newAppointment()),
    defaultValues: {
      petId: '',
      consultationType: 'normal',
      serviceType: '',
      employeeId: '',
      date: getTodayFormatted(),
      time: '09:00',
      duration: 30,
      status: 'pending',
      notes: ''
    }
  });
  const { control, handleSubmit, setValue, formState: { errors }, reset } = form;
  const [addToCalendar, setAddToCalendar] = useState(false);
  const [accountsUpdated, setAccountsUpdated] = useState(false);

  // Convex queries and mutations
  const searchResults = useQuery(api.appointments.searchPatientsAndPets, 
    searchTerm.length >= 2 ? { searchTerm } : "skip"
  ) || [];
  const createAppointment = useMutation(api.appointments.createAppointment);
  const connectedAccounts = useQuery(api.microsoft.getConnectedAccounts, { userId: "current-user" });
  const createCalendarEvent = useAction(api.microsoft.createMicrosoftCalendarEvent);

  useEffect(() => {
    setShowSearchResults(searchTerm.length >= 2);
  }, [searchTerm]);

  // Update connected accounts when form opens (only once when accounts are available)
  useEffect(() => {
    if (connectedAccounts && connectedAccounts.length > 0 && !accountsUpdated) {
      console.log('Updating connected accounts');
      updateConnectedAccounts(connectedAccounts);
      setAccountsUpdated(true);
    }
  }, [connectedAccounts, accountsUpdated, updateConnectedAccounts]);

  // Check if there's a valid Microsoft account connected
  const validMicrosoftAccount = connectedAccounts?.find(
    (account: Doc<"socialAccounts">) => account.platform === 'microsoft' && 
               account.connected && 
               account.expiresAt && 
               Date.now() < account.expiresAt
  );

    const handlePatientPetSelect = (patientPet: NonNullable<FunctionReturnType<typeof api.appointments.searchPatientsAndPets>[number]>) => {
    setSelectedPatientPet(patientPet);
    setSearchTerm('');
    setShowSearchResults(false);
    setValue('petId', (patientPet.petId as unknown as string) ?? '');
  };

  const onSubmitForm: (values: NewAppointmentFormOutput) => Promise<void> = async (values) => {
    if (!selectedPatientPet) {
      showError('Por favor selecciona un paciente y mascota');
      return;
    }

    try {
      let calendarEventId: string | undefined;

      if (addToCalendar && validMicrosoftAccount) {
        try {
          const serviceTypeLabel = serviceTypes.find(type => type.value === values.serviceType)?.label || values.serviceType;
          const consultationTypeLabel = consultationTypes.find(type => type.value === values.consultationType)?.label || values.consultationType;

          const appointmentDate = new Date(`${values.date}T${values.time}:00`);
          const endTime = new Date(appointmentDate.getTime() + (values.duration * 60000));

          const startDateTime = appointmentDate.toISOString();
          const endDateTime = endTime.toISOString();

          const calendarResult = await createCalendarEvent({
            accessToken: validMicrosoftAccount.accessToken!,
            subject: `Cita Petpassvet con ${selectedPatientPet.petName}`,
            description: `Cita de ${serviceTypeLabel} (${consultationTypeLabel})`,
            startDateTime,
            endDateTime,
            timeZone: 'Europe/Madrid',
            reminderMinutes: 1440
          });

          if (calendarResult && calendarResult.event && calendarResult.event.id) {
            calendarEventId = calendarResult.event.id;
          }
        } catch (calendarError) {
          console.error('Error creando evento de calendario:', calendarError);
          showError('Error al crear el evento en el calendario de Microsoft. La cita no se ha creado.');
          return;
        }
      }

      const appointmentData: Omit<Doc<'appointments'>, '_id' | 'createdAt' | 'updatedAt' | '_creationTime'> = {
        petId: values.petId as unknown as Id<'pets'>,
        consultationType: values.consultationType,
        serviceType: values.serviceType,
        employeeId: values.employeeId as unknown as Id<'employees'>,
        date: values.date,
        time: values.time,
        duration: values.duration,
        status: values.status,
        notes: values.notes ? values.notes : undefined,
        microsoftCalendarEventId: calendarEventId,
      };

      await createAppointment(appointmentData);

      if (addToCalendar && validMicrosoftAccount && calendarEventId) {
        showSuccess('Cita creada exitosamente y añadida al calendario de Microsoft.');
      } else {
        showSuccess('Cita creada exitosamente.');
      }

      onSubmit(appointmentData);
      reset();
      onClose();
    } catch (error) {
      console.error('Error creating appointment:', error);
      showError('Error al crear la cita. Por favor intenta de nuevo.');
    }
  };

  const serviceTypes = [
    { value: 'checkUp', label: 'Chequeo' },
    { value: 'vaccination', label: 'Vacunación' },
    { value: 'surgery', label: 'Cirugía' },
    { value: 'dental', label: 'Dental' },
    { value: 'grooming', label: 'Peluquería' },
    { value: 'emergency', label: 'Emergencia' },
    { value: 'followUp', label: 'Seguimiento' },
    { value: 'annualReview', label: 'Revisión Anual' },
    { value: 'firstVisit', label: 'Primera Visita' },
    { value: 'procedure', label: 'Procedimiento' }
  ];

  const consultationTypes = [
    { value: 'normal', label: 'Normal' },
    { value: 'insurance', label: 'Seguro' },
    { value: 'emergency', label: 'Emergencia' }
  ];

    const employees = useQuery(api.employees.getEmployees) || [];


  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Nueva Cita
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="p-6">
          <div className="space-y-6">
            {/* Patient/Pet Search */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Cliente y Mascota *
              </label>
              <div className="relative">
                <Input
                  placeholder="Buscar por nombre del cliente, mascota, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search size={18} />}
                />

                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-auto">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handlePatientPetSelect(result)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User size={16} className="text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">
                              {result.petName} ({result.petSpecies})
                            </div>
                            <div className="text-sm text-gray-500">
                              Propietario: {result.patientName}
                            </div>
                            <div className="text-xs text-gray-400">
                              {result.email} • {result.phone}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showSearchResults && searchResults.length === 0 && searchTerm.length >= 2 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300">
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No se encontraron resultados para "{searchTerm}"
                    </div>
                  </div>
                )}
              </div>

              {selectedPatientPet && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-blue-900">
                        {selectedPatientPet.petName} ({selectedPatientPet.petSpecies})
                      </div>
                      <div className="text-sm text-blue-700">
                        Propietario: {selectedPatientPet.patientName}
                      </div>
                    </div>
                     <button
                      type="button"
                      onClick={() => {
                        setSelectedPatientPet(null);
                        setSearchTerm('');
                         setValue('petId', '');
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
              {!selectedPatientPet && errors.petId && (
                <p className="mt-2 text-xs text-red-600">{errors.petId.message}</p>
              )}
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Cita *
              </label>
              <Controller
                control={control}
                name="serviceType"
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar tipo de cita</option>
                    {serviceTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                )}
              />
              {errors.serviceType && (
                <p className="mt-1 text-xs text-red-600">{errors.serviceType.message}</p>
              )}
            </div>

            {/* Consultation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modalidad *
              </label>
              <Controller
                control={control}
                name="consultationType"
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {consultationTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                )}
              />
              {errors.consultationType && (
                <p className="mt-1 text-xs text-red-600">{errors.consultationType.message}</p>
              )}
            </div>

            {/* Employee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Especialista
              </label>
              <Controller
                control={control}
                name="employeeId"
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar especialista *</option>
                    {employees.map(employee => (
                      <option key={employee._id} value={employee._id}>
                        {employee.firstName} {employee.lastName} - {employee.position} ({employee.department})
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.employeeId && (
                <p className="mt-1 text-xs text-red-600">{errors.employeeId.message}</p>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha *
                </label>
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <Input
                      type="date"
                      {...field}
                      icon={<Calendar size={18} />}
                    />
                  )}
                />
                {errors.date && (
                  <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora *
                </label>
                <Controller
                  control={control}
                  name="time"
                  render={({ field }) => (
                    <Input
                      type="time"
                      {...field}
                      icon={<Clock size={18} />}
                    />
                  )}
                />
                {errors.time && (
                  <p className="mt-1 text-xs text-red-600">{errors.time.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración (min) *
                </label>
                <Controller
                  control={control}
                  name="duration"
                  render={({ field }) => (
                    <select
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value={15}>15 minutos</option>
                      <option value={30}>30 minutos</option>
                      <option value={45}>45 minutos</option>
                      <option value={60}>60 minutos</option>
                      <option value={90}>90 minutos</option>
                      <option value={120}>120 minutos</option>
                    </select>
                  )}
                />
                {errors.duration && (
                  <p className="mt-1 text-xs text-red-600">{errors.duration.message}</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <Controller
                control={control}
                name="notes"
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Notas adicionales sobre la cita..."
                  />
                )}
              />
              {errors.notes && (
                <p className="mt-1 text-xs text-red-600">{errors.notes.message}</p>
              )}
            </div>

            {/* Add to Calendar Checkbox */}
            {validMicrosoftAccount && (
              <div className="flex items-center">
                <input
                  id="add-to-calendar"
                  type="checkbox"
                  checked={addToCalendar}
                  onChange={(e) => setAddToCalendar(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="add-to-calendar" className="ml-2 block text-sm text-gray-900">
                  Añadir al Calendario de Microsoft
                </label>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
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
              disabled={!selectedPatientPet}
            >
              Crear Cita
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentForm;