import React from 'react';
import { X, Clock, DollarSign, Calendar } from 'lucide-react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Button from '../common/Button';
import Input from '../common/Input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormValidator, type NewTreatmentFormInput, type NewTreatmentFormOutput } from '../../validators/formValidator';
import { Id } from "../../../convex/_generated/dataModel";

interface NewTreatmentFormProps {
  onClose: () => void;
  onSubmit: (treatmentData: NewTreatmentFormOutput) => void;
  initialData?: NewTreatmentFormOutput & { _id?: Id<"treatments"> };
  isEditing?: boolean;
}

const NewTreatmentForm: React.FC<NewTreatmentFormProps> = ({ 
  onClose, 
  onSubmit, 
  initialData, 
  isEditing = false 
}) => {
  const createTreatment = useMutation(api.treatments.createTreatment);
  const updateTreatment = useMutation(api.treatments.updateTreatment);
  const medicines = useQuery(api.medicines.getMedicines);

  const form = useForm<NewTreatmentFormInput, unknown, NewTreatmentFormOutput>({
    resolver: zodResolver(FormValidator.newTreatment()),
    defaultValues: initialData || {
      name: '',
      category: '',
      description: '',
      duration: 30,
      followUpPeriod: undefined,
      price: 0,
      status: 'active',
      species: [],
      sex: 'both',
      clinicArea: '',
      conditions: [],
      associatedMedicines: [],
      procedures: [],
      contraindications: [],
      sideEffects: [],
      notes: '',
      minAge: undefined,
      maxAge: undefined,
    }
  });

  const { control, handleSubmit, formState: { errors }, reset, watch } = form;

  const onSubmitForm = async (values: NewTreatmentFormOutput) => {
    try {
      if (isEditing && initialData?._id) {
        // Update existing treatment
        await updateTreatment({
          id: initialData._id,
          ...values,
          followUpPeriod: values.followUpPeriod || undefined,
          clinicArea: values.clinicArea || undefined,
          notes: values.notes || undefined,
          minAge: values.minAge || undefined,
          maxAge: values.maxAge || undefined,
          associatedMedicines: values.associatedMedicines as Id<"medicines">[],
        });
      } else {
        // Create new treatment
        await createTreatment({
          ...values,
          followUpPeriod: values.followUpPeriod || undefined,
          clinicArea: values.clinicArea || undefined,
          notes: values.notes || undefined,
          minAge: values.minAge || undefined,
          maxAge: values.maxAge || undefined,
          associatedMedicines: values.associatedMedicines as Id<"medicines">[],
        });
      }
      
      onSubmit(values);
      reset();
      onClose();
    } catch (error) {
      console.error('Error saving treatment:', error);
    }
  };

  // Options for form fields
  const categories = [
    { id: 'Dental', name: 'Dental' },
    { id: 'Dermatología', name: 'Dermatología' },
    { id: 'Vacunación', name: 'Vacunación' },
    { id: 'Cirugía', name: 'Cirugía' },
    { id: 'Rehabilitación', name: 'Rehabilitación' }
  ];

  const speciesOptions = [
    { id: 'Perro', name: 'Perro' },
    { id: 'Gato', name: 'Gato' },
    { id: 'Conejo', name: 'Conejo' },
    { id: 'Hurón', name: 'Hurón' },
    { id: 'Ave', name: 'Ave' },
    { id: 'Reptil', name: 'Reptil' },
    { id: 'Roedor', name: 'Roedor' }
  ];

  const conditionOptions = [
    { id: 'Dermatitis', name: 'Dermatitis' },
    { id: 'Otitis', name: 'Otitis' },
    { id: 'Displasia de cadera', name: 'Displasia de cadera' },
    { id: 'Artrosis', name: 'Artrosis' },
    { id: 'Alergias cutáneas', name: 'Alergias cutáneas' },
    { id: 'Sarro dental', name: 'Sarro dental' },
    { id: 'Gingivitis', name: 'Gingivitis' },
    { id: 'Maloclusión dental', name: 'Maloclusión dental' },
    { id: 'Control reproductivo', name: 'Control reproductivo' },
    { id: 'Prevención de rabia', name: 'Prevención de rabia' }
  ];

  const procedureOptions = [
    { id: 'Ultrasonido dental', name: 'Ultrasonido dental' },
    { id: 'Pulido dental', name: 'Pulido dental' },
    { id: 'Aplicación de flúor', name: 'Aplicación de flúor' },
    { id: 'Radiografía', name: 'Radiografía' },
    { id: 'Ecografía', name: 'Ecografía' },
    { id: 'Análisis de sangre', name: 'Análisis de sangre' },
    { id: 'Biopsia', name: 'Biopsia' },
    { id: 'Cirugía menor', name: 'Cirugía menor' },
    { id: 'Anestesia general', name: 'Anestesia general' },
    { id: 'Masaje terapéutico', name: 'Masaje terapéutico' }
  ];

  const clinicAreaOptions = [
    { id: 'Medicina General', name: 'Medicina General' },
    { id: 'Cirugía', name: 'Cirugía' },
    { id: 'Dermatología', name: 'Dermatología' },
    { id: 'Odontología', name: 'Odontología' },
    { id: 'Rehabilitación', name: 'Rehabilitación' },
    { id: 'Medicina Preventiva', name: 'Medicina Preventiva' },
    { id: 'Cardiología', name: 'Cardiología' },
    { id: 'Neurología', name: 'Neurología' },
    { id: 'Oftalmología', name: 'Oftalmología' }
  ];

  const handleSpeciesChange = (species: string, checked: boolean) => {
    const currentSpecies = watch("species");
    if (checked) {
      form.setValue("species", [...currentSpecies, species]);
    } else {
      form.setValue("species", currentSpecies.filter(s => s !== species));
    }
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    const currentConditions = watch("conditions");
    if (checked) {
      form.setValue("conditions", [...currentConditions, condition]);
    } else {
      form.setValue("conditions", currentConditions.filter(c => c !== condition));
    }
  };

  const handleProcedureChange = (procedure: string, checked: boolean) => {
    const currentProcedures = watch("procedures");
    if (checked) {
      form.setValue("procedures", [...currentProcedures, procedure]);
    } else {
      form.setValue("procedures", currentProcedures.filter(p => p !== procedure));
    }
  };

  const handleMedicineChange = (medicineId: string, checked: boolean) => {
    const currentMedicines = watch("associatedMedicines");
    if (checked) {
      form.setValue("associatedMedicines", [...currentMedicines, medicineId]);
    } else {
      form.setValue("associatedMedicines", currentMedicines.filter(m => m !== medicineId));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Editar Tratamiento' : 'Nuevo Tratamiento'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Nombre del Tratamiento *"
                      placeholder="Ej: Limpieza Dental Completa"
                      {...field}
                    />
                  )}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  )}
                />
                {errors.category && (
                  <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Descripción detallada del tratamiento..."
                    />
                  )}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <Controller
                  name="duration"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Duración (minutos) *"
                      type="number"
                      placeholder="Ej: 30"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      min="1"
                      icon={<Clock size={18} />}
                    />
                  )}
                />
                {errors.duration && (
                  <p className="mt-1 text-xs text-red-600">{errors.duration.message}</p>
                )}
              </div>

              <div>
                <Controller
                  name="followUpPeriod"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Período de Seguimiento (días)"
                      type="number"
                      placeholder="Ej: 14"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      min="0"
                      icon={<Calendar size={18} />}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Precio (€) *"
                      type="number"
                      placeholder="Ej: 85.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      icon={<DollarSign size={18} />}
                    />
                  )}
                />
                {errors.price && (
                  <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                    </select>
                  )}
                />
                {errors.status && (
                  <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>
                )}
              </div>
            </div>

            {/* Applicability */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Aplicabilidad</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especies *
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {speciesOptions.map(species => (
                      <label key={species.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={watch("species").includes(species.id)}
                          onChange={(e) => handleSpeciesChange(species.id, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{species.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.species && (
                    <p className="mt-1 text-xs text-red-600">{errors.species.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sexo *
                  </label>
                  <Controller
                    name="sex"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="both">Ambos</option>
                        <option value="male">Solo machos</option>
                        <option value="female">Solo hembras</option>
                      </select>
                    )}
                  />
                  {errors.sex && (
                    <p className="mt-1 text-xs text-red-600">{errors.sex.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Área Clínica
                  </label>
                  <Controller
                    name="clinicArea"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Seleccionar área</option>
                        {clinicAreaOptions.map(area => (
                          <option key={area.id} value={area.id}>{area.name}</option>
                        ))}
                      </select>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dolencias Tratadas *
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {conditionOptions.map(condition => (
                      <label key={condition.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={watch("conditions").includes(condition.id)}
                          onChange={(e) => handleConditionChange(condition.id, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{condition.name}</span>
                      </label>
                    ))}
                  </div>
                  {errors.conditions && (
                    <p className="mt-1 text-xs text-red-600">{errors.conditions.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Associated Medicines */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Medicamentos Asociados</h3>
              <div className="space-y-3">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buscar y seleccionar medicamentos
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar medicamentos..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      onChange={(e) => {
                        const searchTerm = e.target.value.toLowerCase();
                        const filteredMedicines = medicines?.filter(medicine =>
                          medicine.name.toLowerCase().includes(searchTerm) ||
                          medicine.activeIngredient.toLowerCase().includes(searchTerm)
                        ) || [];

                        const dropdown = e.target.nextElementSibling as HTMLElement;
                        if (searchTerm && filteredMedicines.length > 0) {
                          dropdown.style.display = 'block';
                          dropdown.innerHTML = filteredMedicines.map(medicine => `
                            <div class="medicine-option px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100" 
                                 data-medicine-id="${medicine._id}"
                                 data-medicine-name="${medicine.name}"
                                 data-medicine-ingredient="${medicine.activeIngredient}">
                              <div class="font-medium text-sm">${medicine.name}</div>
                              <div class="text-xs text-gray-500">${medicine.activeIngredient}</div>
                            </div>
                          `).join('');

                          dropdown.querySelectorAll('.medicine-option').forEach(option => {
                            option.addEventListener('click', () => {
                              const medicineId = option.getAttribute('data-medicine-id') as string;
                              if (!watch("associatedMedicines").includes(medicineId)) {
                                handleMedicineChange(medicineId, true);
                              }
                              (e.target as HTMLInputElement).value = '';
                              dropdown.style.display = 'none';
                            });
                          });
                        } else {
                          dropdown.style.display = 'none';
                        }
                      }}
                      onBlur={(e) => {
                        setTimeout(() => {
                          const dropdown = e.target.nextElementSibling as HTMLElement;
                          dropdown.style.display = 'none';
                        }, 200);
                      }}
                    />
                    <div 
                      className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto"
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                {/* Selected medicines */}
                {watch("associatedMedicines").length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medicamentos seleccionados
                    </label>
                    <div className="space-y-2">
                      {watch("associatedMedicines").map(medicineId => {
                        const medicine = medicines?.find(m => m._id === medicineId);
                        return medicine ? (
                          <div key={medicineId} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{medicine.name}</div>
                              <div className="text-xs text-gray-500">{medicine.activeIngredient}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleMedicineChange(medicineId, false)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Procedures */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Procedimientos</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                {procedureOptions.map(procedure => (
                  <label key={procedure.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={watch("procedures").includes(procedure.id)}
                      onChange={(e) => handleProcedureChange(procedure.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{procedure.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contraindications and Side Effects */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contraindicaciones y Efectos Secundarios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraindicaciones
                  </label>
                  <Controller
                    name="contraindications"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Una por línea..."
                        onChange={(e) => field.onChange(
                          e.target.value.split('\n').filter(line => line.trim() !== '')
                        )}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Efectos Secundarios
                  </label>
                  <Controller
                    name="sideEffects"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Uno por línea..."
                        onChange={(e) => field.onChange(
                          e.target.value.split('\n').filter(line => line.trim() !== '')
                        )}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas Adicionales
              </label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Información adicional relevante..."
                  />
                )}
              />
            </div>

            {/* Age Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Controller
                  name="minAge"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Edad Mínima (meses)"
                      type="number"
                      placeholder="Ej: 6"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      min="0"
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  name="maxAge"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Edad Máxima (meses)"
                      type="number"
                      placeholder="Ej: 120"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      min="0"
                    />
                  )}
                />
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmitForm)}
          >
            {isEditing ? 'Guardar Cambios' : 'Guardar Tratamiento'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewTreatmentForm;

