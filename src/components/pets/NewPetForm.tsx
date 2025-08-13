import React from 'react';
import { X } from 'lucide-react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Button from '../common/Button';
import Input from '../common/Input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormValidator, type NewPetFormInput, type NewPetFormOutput } from '../../validators/formValidator';
import { Id } from "../../../convex/_generated/dataModel";

interface NewPetFormProps {
  onClose: () => void;
  onSubmit: (petData: NewPetFormOutput) => void;
}

const NewPetForm: React.FC<NewPetFormProps> = ({ onClose, onSubmit }) => {
  const createPet = useMutation(api.pets.createPet);
  const patients = useQuery(api.patients.getPatients) || [];

  const form = useForm<NewPetFormInput, unknown, NewPetFormOutput>({
    resolver: zodResolver(FormValidator.newPet()),
    defaultValues: {
      patientId: '',
      name: '',
      species: '',
      breed: '',
      sex: undefined,
      birthDate: '',
      isNeutered: false,
      microchipNumber: '',
      color: '',
      weight: undefined,
      height: undefined,
      furType: '',
      observations: '',
      currentTreatments: '',
      allergies: '',
      bloodTest: { done: false, date: '' },
      xrayTest: { done: false, date: '' },
      ultrasoundTest: { done: false, date: '' },
      urineTest: { done: false, date: '' },
      otherTests: '',
      hasPetPass: false,
      hasInsurance: false,
      insuranceProvider: '',
      insuranceNumber: '',
    }
  });

  const { control, handleSubmit, formState: { errors }, reset, watch } = form;
  const hasInsurance = watch("hasInsurance");

  const onSubmitForm = async (values: NewPetFormOutput) => {
    try {
      await createPet({
        patientId: values.patientId as unknown as Id<"patients">,
        name: values.name,
        species: values.species,
        breed: values.breed || undefined,
        sex: values.sex,
        birthDate: values.birthDate || undefined,
        isNeutered: values.isNeutered || false,
        microchipNumber: values.microchipNumber || undefined,
        color: values.color || undefined,
        weight: values.weight,
        height: values.height,
        furType: values.furType || undefined,
        observations: values.observations || undefined,
        currentTreatments: values.currentTreatments || undefined,
        allergies: values.allergies || undefined,
        bloodTest: values.bloodTest?.done ? {
          done: true,
          date: values.bloodTest.date || undefined,
        } : undefined,
        xrayTest: values.xrayTest?.done ? {
          done: true,
          date: values.xrayTest.date || undefined,
        } : undefined,
        ultrasoundTest: values.ultrasoundTest?.done ? {
          done: true,
          date: values.ultrasoundTest.date || undefined,
        } : undefined,
        urineTest: values.urineTest?.done ? {
          done: true,
          date: values.urineTest.date || undefined,
        } : undefined,
        otherTests: values.otherTests || undefined,
        hasPetPass: values.hasPetPass || false,
        hasInsurance: values.hasInsurance || false,
        insuranceProvider: values.hasInsurance && values.insuranceProvider
          ? values.insuranceProvider
          : undefined,
        insuranceNumber: values.hasInsurance && values.insuranceNumber
          ? values.insuranceNumber
          : undefined,
      });
      onSubmit(values);
      reset();
      onClose();
    } catch (error) {
      console.error('Error creating pet:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Nueva Mascota</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 flex-1">
          <form 
            className="space-y-6"
            onSubmit={handleSubmit(onSubmitForm)}
          >
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Nombre de la Mascota *"
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
                    Especie *
                  </label>
                  <Controller
                    name="species"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Seleccionar especie</option>
                        <option value="Perro">Perro</option>
                        <option value="Gato">Gato</option>
                        <option value="Conejo">Conejo</option>
                        <option value="Ave">Ave</option>
                        <option value="Reptil">Reptil</option>
                        <option value="Otro">Otro</option>
                      </select>
                    )}
                  />
                  {errors.species && (
                    <p className="mt-1 text-xs text-red-600">{errors.species.message}</p>
                  )}
                </div>
                <Controller
                  name="breed"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Raza"
                      {...field}
                    />
                  )}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sexo
                  </label>
                  <Controller
                    name="sex"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Seleccionar sexo</option>
                        <option value="male">Macho</option>
                        <option value="female">Hembra</option>
                      </select>
                    )}
                  />
                </div>
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Fecha de Nacimiento"
                      type="date"
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="microchipNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Nº Microchip"
                      {...field}
                      placeholder="Ej: 941000024680135"
                    />
                  )}
                />
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <Controller
                      name="isNeutered"
                      control={control}
                      render={({ field }) => (
                        <input 
                          type="checkbox" 
                          {...field}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      )}
                    />
                    <span className="text-sm text-gray-700">Esterilizado/a</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Physical Characteristics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Características Físicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="furType"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Pelo
                      </label>
                      <select
                        {...field}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="corto">Corto</option>
                        <option value="medio">Medio</option>
                        <option value="largo">Largo</option>
                        <option value="rizado">Rizado</option>
                        <option value="duro">Duro</option>
                        <option value="sin_pelo">Sin pelo</option>
                      </select>
                    </div>
                  )}
                />
                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Color de Pelo"
                      {...field}
                      placeholder="Ej: Negro, Marrón, Atigrado..."
                    />
                  )}
                />
                <Controller
                  name="weight"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Peso (kg)"
                      type="number"
                      {...field}
                      step="0.1"
                      min="0"
                    />
                  )}
                />
                <Controller
                  name="height"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Altura (cm)"
                      type="number"
                      {...field}
                      min="0"
                    />
                  )}
                />
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Médica</h3>
              <div className="space-y-4">
                <Controller
                  name="currentTreatments"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tratamientos en Curso
                      </label>
                      <textarea
                        {...field}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Describa los tratamientos actuales..."
                      ></textarea>
                    </div>
                  )}
                />
                
                <Controller
                  name="allergies"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alergias Conocidas
                      </label>
                      <textarea
                        {...field}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Alergias a medicamentos, alimentos, etc..."
                      ></textarea>
                    </div>
                  )}
                />

                <Controller
                  name="observations"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observaciones
                      </label>
                      <textarea
                        {...field}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Notas adicionales sobre la mascota..."
                      ></textarea>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Medical Tests */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pruebas Médicas Relevantes</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="bloodTest.done"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Análisis de Sangre
                        </label>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            {...field}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Realizado</span>
                          <Controller
                            name="bloodTest.date"
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="date"
                                {...field}
                                className="ml-2"
                              />
                            )}
                          />
                        </div>
                      </div>
                    )}
                  />
                  
                  <Controller
                    name="xrayTest.done"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Radiografía
                        </label>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            {...field}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Realizado</span>
                          <Controller
                            name="xrayTest.date"
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="date"
                                {...field}
                                className="ml-2"
                              />
                            )}
                          />
                        </div>
                      </div>
                    )}
                  />
                  
                  <Controller
                    name="ultrasoundTest.done"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ecografía
                        </label>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            {...field}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Realizado</span>
                          <Controller
                            name="ultrasoundTest.date"
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="date"
                                {...field}
                                className="ml-2"
                              />
                            )}
                          />
                        </div>
                      </div>
                    )}
                  />
                  
                  <Controller
                    name="urineTest.done"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Análisis de Orina
                        </label>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            {...field}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Realizado</span>
                          <Controller
                            name="urineTest.date"
                            control={control}
                            render={({ field }) => (
                              <Input
                                type="date"
                                {...field}
                                className="ml-2"
                              />
                            )}
                          />
                        </div>
                      </div>
                    )}
                  />
                </div>
                
                <Controller
                  name="otherTests"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Otras Pruebas o Resultados Relevantes
                      </label>
                      <textarea
                        {...field}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Describa otras pruebas realizadas y sus resultados..."
                      ></textarea>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Adicional</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Propietario *
                  </label>
                  <Controller
                    name="patientId"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Seleccionar propietario</option>
                        {patients.map(patient => (
                          <option key={patient._id} value={patient._id}>
                            {patient.firstName} {patient.lastName}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.patientId && (
                    <p className="mt-1 text-xs text-red-600">{errors.patientId.message}</p>
                  )}
                </div>
                
                <Controller
                  name="hasPetPass"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          {...field}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Tiene PetPass</span>
                      </label>
                    </div>
                  )}
                />
                
                <Controller
                  name="hasInsurance"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          {...field}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Tiene seguro</span>
                      </label>
                    </div>
                  )}
                />

                {hasInsurance && (
                  <>
                    <Controller
                      name="insuranceProvider"
                      control={control}
                      render={({ field }) => (
                        <Input
                          label="Compañía de seguros"
                          {...field}
                          placeholder="Nombre de la aseguradora"
                        />
                      )}
                    />

                    <Controller
                      name="insuranceNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          label="Número de póliza"
                          {...field}
                          placeholder="Número de la póliza"
                        />
                      )}
                    />
                  </>
                )}
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
            Guardar Mascota
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewPetForm;
