import React from 'react';
import { X, DollarSign, Database, AlertTriangle } from 'lucide-react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Button from '../common/Button';
import Input from '../common/Input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormValidator, type NewMedicineFormInput, type NewMedicineFormOutput } from '../../validators/formValidator';
import { Id } from "../../../convex/_generated/dataModel";

interface NewMedicineFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (medicineData: NewMedicineFormOutput) => void;
  initialData?: NewMedicineFormOutput & { _id?: Id<"medicines"> };
  isEditing?: boolean;
}

const NewMedicineForm: React.FC<NewMedicineFormProps> = ({ 
  isOpen,
  onClose, 
  onSubmit, 
  initialData, 
  isEditing = false
}) => {
  const createMedicine = useMutation(api.medicines.createMedicine);
  const updateMedicine = useMutation(api.medicines.updateMedicine);
  const providersQuery = useQuery(api.providers.getProviders);

  const form = useForm<NewMedicineFormInput, unknown, NewMedicineFormOutput>({
    resolver: zodResolver(FormValidator.newMedicine()),
    defaultValues: initialData || {
      name: '',
      activeIngredient: '',
      manufacturer: '',
      type: '',
      dosageForm: '',
      species: [],
      recommendedDosage: '',
      duration: '',
      registrationNumber: '',
      reference: '',
      stock: 0,
      minStock: 0,
      basePrice: 0,
      vat: 0,
      cost: 0,
      conditions: [],
      contraindications: [],
      sideEffects: [],
      interactions: [],
      status: 'active',
      atcVetCode: '',
      prescriptionRequired: false,
      psychotropic: false,
      antibiotic: false,
      administrationRoutes: [],
      excipients: [],
      withdrawalPeriod: '',
      providerId: '',
      aiScore: undefined,
    }
  });

  const { control, handleSubmit, formState: { errors }, reset, watch } = form;

  const onSubmitForm = async (values: NewMedicineFormOutput) => {
    try {
      if (isEditing && initialData?._id) {
        // Update existing medicine
        await updateMedicine({
          id: initialData._id,
          ...values,
          registrationNumber: values.registrationNumber || undefined,
          reference: values.reference || undefined,
          atcVetCode: values.atcVetCode || undefined,
          withdrawalPeriod: values.withdrawalPeriod || undefined,
          providerId: values.providerId || undefined,
          aiScore: values.aiScore || undefined,
        });
      } else {
        // Create new medicine
        await createMedicine({
          ...values,
          registrationNumber: values.registrationNumber || undefined,
          reference: values.reference || undefined,
          atcVetCode: values.atcVetCode || undefined,
          withdrawalPeriod: values.withdrawalPeriod || undefined,
          providerId: values.providerId || undefined,
          aiScore: values.aiScore || undefined,
        });
      }
      
      onSubmit(values);
      reset();
      onClose();
    } catch (error) {
      console.error('Error saving medicine:', error);
    }
  };

  // Options for form fields
  const types = [
    { id: 'Antibiótico', name: 'Antibiótico' },
    { id: 'Antiinflamatorio', name: 'Antiinflamatorio' },
    { id: 'Antialérgico', name: 'Antialérgico' },
    { id: 'Antiparasitario', name: 'Antiparasitario' },
    { id: 'Analgésico', name: 'Analgésico' },
    { id: 'Hormonal', name: 'Hormonal' },
    { id: 'Cardiovascular', name: 'Cardiovascular' },
    { id: 'Dermatológico', name: 'Dermatológico' },
    { id: 'Oftalmológico', name: 'Oftalmológico' },
    { id: 'Otro', name: 'Otro' }
  ];

  const dosageForms = [
    { id: 'Comprimidos', name: 'Comprimidos' },
    { id: 'Cápsulas', name: 'Cápsulas' },
    { id: 'Suspensión oral', name: 'Suspensión oral' },
    { id: 'Solución oral', name: 'Solución oral' },
    { id: 'Solución inyectable', name: 'Solución inyectable' },
    { id: 'Pomada', name: 'Pomada' },
    { id: 'Crema', name: 'Crema' },
    { id: 'Gel', name: 'Gel' },
    { id: 'Gotas', name: 'Gotas' },
    { id: 'Spray', name: 'Spray' },
    { id: 'Otro', name: 'Otro' }
  ];

  const speciesOptions = [
    { id: 'Perro', name: 'Perro' },
    { id: 'Gato', name: 'Gato' },
    { id: 'Conejo', name: 'Conejo' },
    { id: 'Hurón', name: 'Hurón' },
    { id: 'Ave', name: 'Ave' },
    { id: 'Reptil', name: 'Reptil' },
    { id: 'Roedor', name: 'Roedor' },
    { id: 'Équido', name: 'Équido' }
  ];

  const administrationRoutes = [
    { id: 'Oral', name: 'Oral' },
    { id: 'Intravenosa', name: 'Intravenosa' },
    { id: 'Intramuscular', name: 'Intramuscular' },
    { id: 'Subcutánea', name: 'Subcutánea' },
    { id: 'Tópica', name: 'Tópica' },
    { id: 'Oftálmica', name: 'Oftálmica' },
    { id: 'Ótica', name: 'Ótica' },
    { id: 'Nasal', name: 'Nasal' }
  ];

  const handleSpeciesChange = (species: string, checked: boolean) => {
    const currentSpecies = watch("species");
    if (checked) {
      form.setValue("species", [...currentSpecies, species]);
    } else {
      form.setValue("species", currentSpecies.filter(s => s !== species));
    }
  };

  const handleAdministrationRouteChange = (route: string, checked: boolean) => {
    const currentRoutes = watch("administrationRoutes");
    if (checked) {
      form.setValue("administrationRoutes", [...currentRoutes, route]);
    } else {
      form.setValue("administrationRoutes", currentRoutes.filter(r => r !== route));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Editar Medicamento' : 'Nuevo Medicamento'}
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
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Nombre del Medicamento *"
                        placeholder="Ej: Amoxicilina 250mg"
                        {...field}
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Controller
                    name="activeIngredient"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Principio Activo *"
                        placeholder="Ej: Amoxicilina"
                        {...field}
                      />
                    )}
                  />
                  {errors.activeIngredient && (
                    <p className="mt-1 text-xs text-red-600">{errors.activeIngredient.message}</p>
                  )}
                </div>

                <div>
                  <Controller
                    name="manufacturer"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Fabricante *"
                        placeholder="Ej: Laboratorios MSD"
                        {...field}
                      />
                    )}
                  />
                  {errors.manufacturer && (
                    <p className="mt-1 text-xs text-red-600">{errors.manufacturer.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo *
                  </label>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Seleccionar tipo</option>
                        {types.map(type => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.type && (
                    <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Forma Farmacéutica *
                  </label>
                  <Controller
                    name="dosageForm"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Seleccionar forma</option>
                        {dosageForms.map(form => (
                          <option key={form.id} value={form.id}>{form.name}</option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.dosageForm && (
                    <p className="mt-1 text-xs text-red-600">{errors.dosageForm.message}</p>
                  )}
                </div>

                <div>
                  <Controller
                    name="recommendedDosage"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Posología Recomendada *"
                        placeholder="Ej: 10-20 mg/kg cada 12h"
                        {...field}
                      />
                    )}
                  />
                  {errors.recommendedDosage && (
                    <p className="mt-1 text-xs text-red-600">{errors.recommendedDosage.message}</p>
                  )}
                </div>

                <div>
                  <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Duración Recomendada *"
                        placeholder="Ej: 7-10 días"
                        {...field}
                      />
                    )}
                  />
                  {errors.duration && (
                    <p className="mt-1 text-xs text-red-600">{errors.duration.message}</p>
                  )}
                </div>

                <div>
                  <Controller
                    name="registrationNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Número de Registro"
                        placeholder="Ej: 2568 ESP"
                        {...field}
                      />
                    )}
                  />
                </div>

                <div>
                  <Controller
                    name="reference"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Referencia"
                        placeholder="Ej: AMX250-100"
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Stock and Pricing */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Stock y Precios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Controller
                    name="stock"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Stock Actual *"
                        type="number"
                        placeholder="Ej: 100"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        min="0"
                        icon={<Database size={18} />}
                      />
                    )}
                  />
                  {errors.stock && (
                    <p className="mt-1 text-xs text-red-600">{errors.stock.message}</p>
                  )}
                </div>

                <div>
                  <Controller
                    name="minStock"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Stock Mínimo *"
                        type="number"
                        placeholder="Ej: 10"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        min="0"
                        icon={<AlertTriangle size={18} />}
                      />
                    )}
                  />
                  {errors.minStock && (
                    <p className="mt-1 text-xs text-red-600">{errors.minStock.message}</p>
                  )}
                </div>

                <div>
                  <Controller
                    name="basePrice"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Precio Base (€) *"
                        type="number"
                        placeholder="Ej: 25.50"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        icon={<DollarSign size={18} />}
                      />
                    )}
                  />
                  {errors.basePrice && (
                    <p className="mt-1 text-xs text-red-600">{errors.basePrice.message}</p>
                  )}
                </div>

                <div>
                  <Controller
                    name="vat"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="IVA (%) *"
                        type="number"
                        placeholder="Ej: 21"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    )}
                  />
                  {errors.vat && (
                    <p className="mt-1 text-xs text-red-600">{errors.vat.message}</p>
                  )}
                </div>

                <div>
                  <Controller
                    name="cost"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Coste (€) *"
                        type="number"
                        placeholder="Ej: 18.50"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        icon={<DollarSign size={18} />}
                      />
                    )}
                  />
                  {errors.cost && (
                    <p className="mt-1 text-xs text-red-600">{errors.cost.message}</p>
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
            </div>

            {/* Species and Applicability */}
            <div className="border-b border-gray-200 pb-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vías de Administración
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {administrationRoutes.map(route => (
                      <label key={route.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={watch("administrationRoutes").includes(route.id)}
                          onChange={(e) => handleAdministrationRouteChange(route.id, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{route.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Médica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Indicaciones *
                  </label>
                  <Controller
                    name="conditions"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Una indicación por línea..."
                        onChange={(e) => field.onChange(
                          e.target.value.split('\n').filter(line => line.trim() !== '')
                        )}
                      />
                    )}
                  />
                  {errors.conditions && (
                    <p className="mt-1 text-xs text-red-600">{errors.conditions.message}</p>
                  )}
                </div>

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
                        placeholder="Una contraindicación por línea..."
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
                        placeholder="Un efecto secundario por línea..."
                        onChange={(e) => field.onChange(
                          e.target.value.split('\n').filter(line => line.trim() !== '')
                        )}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interacciones
                  </label>
                  <Controller
                    name="interactions"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Una interacción por línea..."
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
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Adicional</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Controller
                    name="atcVetCode"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Código ATC Vet"
                        placeholder="Ej: J01CA04"
                        {...field}
                      />
                    )}
                  />
                </div>

                <div>
                  <Controller
                    name="withdrawalPeriod"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Período de Retirada"
                        placeholder="Ej: 7 días"
                        {...field}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proveedor
                  </label>
                  <Controller
                    name="providerId"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Sin proveedor</option>
                        {providersQuery?.map((provider) => (
                          <option key={provider._id} value={provider._id}>
                            {provider.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>

                <div>
                  <Controller
                    name="aiScore"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Puntuación IA"
                        type="number"
                        placeholder="Ej: 85"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                        min="0"
                        max="100"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="flex items-center">
                  <Controller
                    name="prescriptionRequired"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        id="prescriptionRequired"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    )}
                  />
                  <label htmlFor="prescriptionRequired" className="ml-2 text-sm text-gray-700">
                    Requiere Receta
                  </label>
                </div>

                <div className="flex items-center">
                  <Controller
                    name="psychotropic"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        id="psychotropic"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    )}
                  />
                  <label htmlFor="psychotropic" className="ml-2 text-sm text-gray-700">
                    Psicotrópico
                  </label>
                </div>

                <div className="flex items-center">
                  <Controller
                    name="antibiotic"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        id="antibiotic"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    )}
                  />
                  <label htmlFor="antibiotic" className="ml-2 text-sm text-gray-700">
                    Antibiótico
                  </label>
                </div>
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
            {isEditing ? 'Guardar Cambios' : 'Guardar Medicamento'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewMedicineForm;
