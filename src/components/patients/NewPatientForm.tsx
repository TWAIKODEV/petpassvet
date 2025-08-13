import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { X, ChevronDown, ChevronRight, Check } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormValidator, type NewPatientFormInput, type NewPatientFormOutput } from '../../validators/formValidator';

interface NewPatientFormProps {
  onClose: () => void;
  onSubmit: (patientData: NewPatientFormOutput) => void;
}

const NewPatientForm: React.FC<NewPatientFormProps> = ({
  onClose,
  onSubmit,
}) => {
  const createPatient = useMutation(api.patients.createPatient);
  
  const form = useForm<NewPatientFormInput, unknown, NewPatientFormOutput>({
    resolver: zodResolver(FormValidator.newPatient()),
    defaultValues: {
      // Owner information
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      birthDate: "",
      idNumber: "",
      language: "",
      preferredContact: undefined,
      couponCode: "",
      affiliateClub: "",
      address: "",

      // Marketing and communications
      marketing: {
        acceptsEmail: false,
        acceptsSms: false,
        acceptsWhatsApp: false,
        signedAt: undefined,
      },

      // PetPass information
      petPass: {
        hasPetPass: false,
        product: undefined,
      },

      // Additional services
      services: {
        wantsGrooming: false,
        wantsFoodDelivery: false,
        wantsHotelService: false,
        wantsTraining: false,
      },

      // Pet information
      pet: {
        name: "",
        species: "",
        breed: "",
        sex: undefined,
        birthDate: "",
        isNeutered: false,
        microchipNumber: "",
        color: "",
        observations: "",
        hasInsurance: false,
        insuranceProvider: "",
        insuranceNumber: "",
      },
    }
  });

  const { control, handleSubmit, setValue, formState: { errors }, reset, watch } = form;
  const petPassHasPetPass = watch("petPass.hasPetPass");
  const petHasInsurance = watch("pet.hasInsurance");

  const [expandedSections, setExpandedSections] = useState({
    owner: true,
    marketing: true,
    petPass: true,
    services: true,
    pet: true,
  });

  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSendOTP = () => {
    setOtpSent(true);
  };

  const handleVerifyOTP = () => {
    if (otpCode.length === 6) {
      setShowSignatureModal(false);
      setValue("marketing.signedAt", new Date().toISOString());
    }
  };

  const onSubmitForm = async (values: NewPatientFormOutput) => {
    try {
      const patientData: {
        firstName: string;
        lastName: string;
        email?: string;
        phone: string;
        birthDate: string;
        address?: string;
        preferredContact?: "phone" | "email" | "whatsapp" | "sms";
        bankAccount: undefined;
        creditCard: undefined;
        marketing: {
          acceptsEmail: boolean;
          acceptsSms: boolean;
          acceptsWhatsApp: boolean;
        };
        petPass: {
          hasPetPass: boolean;
          plan?: "track" | "protect" | "vetcare";
        };
        services: {
          wantsGrooming: boolean;
          wantsFoodDelivery: boolean;
          wantsHotelService: boolean;
          wantsTraining: boolean;
        };
        medicalHistory: undefined;
        pet?: {
          name: string;
          species: string;
          breed?: string;
          sex?: "male" | "female";
          birthDate?: string;
          isNeutered: boolean;
          microchipNumber?: string;
          color?: string;
          observations?: string;
          hasInsurance: boolean;
          insuranceProvider?: string;
          insuranceNumber?: string;
        };
      } = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email || undefined,
        phone: values.phone,
        birthDate: values.birthDate,
        address: values.address || undefined,
        preferredContact: values.preferredContact,
        bankAccount: undefined,
        creditCard: undefined,
        marketing: {
          acceptsEmail: values.marketing.acceptsEmail,
          acceptsSms: values.marketing.acceptsSms,
          acceptsWhatsApp: values.marketing.acceptsWhatsApp,
        },
        petPass: {
          hasPetPass: values.petPass.hasPetPass,
          plan: values.petPass.product,
        },
        services: {
          wantsGrooming: values.services.wantsGrooming,
          wantsFoodDelivery: values.services.wantsFoodDelivery,
          wantsHotelService: values.services.wantsHotelService,
          wantsTraining: values.services.wantsTraining,
        },
        medicalHistory: undefined,
      };

      // Add pet data if provided
      if (values.pet && values.pet.name && values.pet.species) {
        const petData = {
          name: values.pet.name,
          species: values.pet.species,
          breed: values.pet.breed,
          sex: values.pet.sex,
          birthDate: values.pet.birthDate,
          isNeutered: values.pet.isNeutered,
          microchipNumber: values.pet.microchipNumber || undefined,
          color: values.pet.color || undefined,
          observations: values.pet.observations || undefined,
          hasInsurance: values.pet.hasInsurance || false,
          insuranceProvider: values.pet.hasInsurance && values.pet.insuranceProvider
            ? values.pet.insuranceProvider
            : undefined,
          insuranceNumber: values.pet.hasInsurance && values.pet.insuranceNumber
            ? values.pet.insuranceNumber
            : undefined,
        };

        patientData.pet = petData;
      }

      const patientId = await createPatient(patientData);

      console.log("Paciente creado con ID:", patientId);
      onSubmit(values);
      reset();
      onClose();
    } catch (error) {
      console.error("Error creando paciente:", error);
    }
  };

  const SectionHeader = ({
    title,
    section,
  }: {
    title: string;
    section: keyof typeof expandedSections;
  }) => (
    <div
      className="flex items-center justify-between bg-gray-50 p-4 rounded-t-lg cursor-pointer"
      onClick={() => toggleSection(section)}
    >
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {expandedSections[section] ? (
        <ChevronDown size={20} />
      ) : (
        <ChevronRight size={20} />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-start justify-center z-50 overflow-y-auto p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
        <div className="sticky top-0 z-10 bg-white rounded-t-lg border-b border-gray-200">
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Nuevo Paciente
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form id="patient-form" onSubmit={handleSubmit(onSubmitForm)} className="p-6 space-y-6">
          {/* Owner Information Section */}
          <div className="border rounded-lg shadow-sm">
            <SectionHeader
              title="Información del Propietario"
              section="owner"
            />
            {expandedSections.owner && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Controller
                      control={control}
                      name="firstName"
                      render={({ field }) => (
                        <Input
                          label="Nombre *"
                          {...field}
                        />
                      )}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Controller
                      control={control}
                      name="lastName"
                      render={({ field }) => (
                        <Input
                          label="Apellidos *"
                          {...field}
                        />
                      )}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Controller
                    control={control}
                    name="idNumber"
                    render={({ field }) => (
                      <Input
                        label="DNI/NIE *"
                        {...field}
                      />
                    )}
                  />
                  {errors.idNumber && (
                    <p className="mt-1 text-xs text-red-600">{errors.idNumber.message}</p>
                  )}
                </div>
                <div>
                  <Controller
                    control={control}
                    name="address"
                    render={({ field }) => (
                      <Input
                        label="Dirección *"
                        {...field}
                      />
                    )}
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Controller
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <Input
                          label="Email"
                          type="email"
                          {...field}
                        />
                      )}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <Controller
                      control={control}
                      name="phone"
                      render={({ field }) => (
                        <Input
                          label="Teléfono *"
                          type="tel"
                          {...field}
                        />
                      )}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Controller
                      control={control}
                      name="birthDate"
                      render={({ field }) => (
                        <Input
                          label="Fecha de Nacimiento *"
                          type="date"
                          {...field}
                        />
                      )}
                    />
                    {errors.birthDate && (
                      <p className="mt-1 text-xs text-red-600">{errors.birthDate.message}</p>
                    )}
                  </div>
                  <div>
                    <Controller
                      control={control}
                      name="language"
                      render={({ field }) => (
                        <select
                          {...field}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="">Seleccionar Idioma</option>
                          <option value="es">Español</option>
                          <option value="en">Inglés</option>
                          <option value="ca">Catalán</option>
                        </select>
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Método de contacto preferido
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["phone", "email", "sms", "whatsapp"].map((method) => (
                      <label
                        key={method}
                        className="flex items-center space-x-2"
                      >
                        <Controller
                          control={control}
                          name="preferredContact"
                          render={({ field }) => (
                            <input
                              type="radio"
                              value={method}
                              checked={field.value === method}
                              onChange={(e) => field.onChange(e.target.value)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                          )}
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {method}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    control={control}
                    name="couponCode"
                    render={({ field }) => (
                      <Input
                        label="Código de descuento"
                        {...field}
                        placeholder="Si tiene un código, ingréselo aquí"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="affiliateClub"
                    render={({ field }) => (
                      <Input
                        label="Club de afiliados"
                        {...field}
                        placeholder="Nombre del club si es miembro"
                      />
                    )}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pet Information Section */}
          <div className="border rounded-lg shadow-sm">
            <SectionHeader title="Información de la Mascota" section="pet" />
            {expandedSections.pet && (
              <div className="p-4 space-y-4">
                <div>
                  <Controller
                    control={control}
                    name="pet.name"
                    render={({ field }) => (
                      <Input
                        label="Nombre de la Mascota *"
                        {...field}
                      />
                    )}
                  />
                  {errors.pet?.name && (
                    <p className="mt-1 text-xs text-red-600">{errors.pet.name.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Controller
                      control={control}
                      name="pet.species"
                      render={({ field }) => (
                        <Input
                          label="Especie *"
                          {...field}
                        />
                      )}
                    />
                    {errors.pet?.species && (
                      <p className="mt-1 text-xs text-red-600">{errors.pet.species.message}</p>
                    )}
                  </div>
                  <Controller
                    control={control}
                    name="pet.breed"
                    render={({ field }) => (
                      <Input
                        label="Raza *"
                        {...field}
                      />
                    )}
                  />
                  {errors.pet?.breed && (
                    <p className="mt-1 text-xs text-red-600">{errors.pet.breed.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    control={control}
                    name="pet.sex"
                    render={({ field }) => (
                      <select
                        {...field}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Seleccionar Sexo *</option>
                        <option value="male">Macho</option>
                        <option value="female">Hembra</option>
                      </select>
                    )}
                  />
                  {errors.pet?.sex && (
                    <p className="mt-1 text-xs text-red-600">{errors.pet.sex.message}</p>
                  )}
                  <Controller
                    control={control}
                    name="pet.birthDate"
                    render={({ field }) => (
                      <Input
                        label="Fecha de Nacimiento *"
                        type="date"
                        {...field}
                      />
                    )}
                  />
                  {errors.pet?.birthDate && (
                    <p className="mt-1 text-xs text-red-600">{errors.pet.birthDate.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    control={control}
                    name="pet.color"
                    render={({ field }) => (
                      <Input
                        label="Color del pelaje"
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="pet.microchipNumber"
                    render={({ field }) => (
                      <Input
                        label="Número de Microchip"
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Observaciones
                  </label>
                  <Controller
                    control={control}
                    name="pet.observations"
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <Controller
                      control={control}
                      name="pet.isNeutered"
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      )}
                    />
                    <span className="text-sm text-gray-700">
                      Esterilizado/a
                    </span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Controller
                      control={control}
                      name="pet.hasInsurance"
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      )}
                    />
                    <span className="text-sm text-gray-700">Tiene seguro</span>
                  </label>
                </div>
                {petHasInsurance && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      control={control}
                      name="pet.insuranceProvider"
                      render={({ field }) => (
                        <Input
                          label="Nombre de la aseguradora"
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="pet.insuranceNumber"
                      render={({ field }) => (
                        <Input
                          label="Número de póliza"
                          {...field}
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Marketing Section */}
          <div className="border rounded-lg shadow-sm">
            <SectionHeader
              title="Marketing y Comunicaciones"
              section="marketing"
            />
            {expandedSections.marketing && (
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <Controller
                      control={control}
                      name="marketing.acceptsEmail"
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      )}
                    />
                    <span className="text-sm text-gray-700">
                      Acepto recibir comunicaciones por email
                    </span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Controller
                      control={control}
                      name="marketing.acceptsSms"
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      )}
                    />
                    <span className="text-sm text-gray-700">
                      Acepto recibir comunicaciones por SMS
                    </span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Controller
                      control={control}
                      name="marketing.acceptsWhatsApp"
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      )}
                    />
                    <span className="text-sm text-gray-700">
                      Acepto recibir comunicaciones por WhatsApp
                    </span>
                  </label>
                </div>

                {/* Authorization Link */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {watch("marketing.signedAt") ? (
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 text-sm">!</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-blue-900">
                        Autorización de Protección de Datos y Marketing
                      </h4>
                      <p className="mt-1 text-sm text-blue-700">
                        Es necesario firmar la autorización para el tratamiento
                        de datos personales y comunicaciones comerciales
                      </p>
                      {!watch("marketing.signedAt") && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setShowSignatureModal(true)}
                        >
                          Firmar Autorización
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PetPass Section */}
          <div className="border rounded-lg shadow-sm">
            <SectionHeader title="PetPass" section="petPass" />
            {expandedSections.petPass && (
              <div className="p-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <Controller
                      control={control}
                      name="petPass.hasPetPass"
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      )}
                    />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-900">
                        Tiene PetPass
                      </label>
                      <p className="mt-1 text-sm text-gray-500">
                        Seleccione esta opción si el paciente cuenta con un plan
                        PetPass
                      </p>

                      {petPassHasPetPass && (
                        <div className="mt-4 relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Producto PetPass
                          </label>
                          <div className="relative">
                            <Controller
                              control={control}
                              name="petPass.product"
                              render={({ field }) => (
                                <select
                                  {...field}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white"
                                >
                                  <option value="">Seleccionar producto</option>
                                  <option value="track">PetPass Track</option>
                                  <option value="protect">PetPass Protect</option>
                                  <option value="vetcare">PetPass Vetcare</option>
                                </select>
                              )}
                            />
                          </div>

                          {watch("petPass.product") && (
                            <div className="mt-2 p-2 bg-white rounded border border-gray-200 text-sm">
                              {watch("petPass.product") === "track" && (
                                <div className="flex flex-col gap-1">
                                  <span className="font-medium text-blue-600">
                                    PetPass Track
                                  </span>
                                  <p className="text-gray-600">
                                    Seguimiento básico de la salud de tu mascota
                                  </p>
                                </div>
                              )}
                              {watch("petPass.product") === "protect" && (
                                <div className="flex flex-col gap-1">
                                  <span className="font-medium text-blue-600">
                                    PetPass Protect
                                  </span>
                                  <p className="text-gray-600">
                                    Protección completa con servicios
                                    adicionales
                                  </p>
                                </div>
                              )}
                              {watch("petPass.product") === "vetcare" && (
                                <div className="flex flex-col gap-1">
                                  <span className="font-medium text-blue-600">
                                    PetPass Vetcare
                                  </span>
                                  <p className="text-gray-600">
                                    Cuidado veterinario integral y preventivo
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Services Section */}
          <div className="border rounded-lg shadow-sm">
            <SectionHeader title="Servicios Adicionales" section="services" />
            {expandedSections.services && (
              <div className="p-4 space-y-3">
                <label className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="services.wantsGrooming"
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    )}
                  />
                  <span className="text-sm text-gray-700">
                    Servicio de Peluquería
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="services.wantsFoodDelivery"
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    )}
                  />
                  <span className="text-sm text-gray-700">
                    Servicio de Comida a Domicilio
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="services.wantsHotelService"
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    )}
                  />
                  <span className="text-sm text-gray-700">
                    Servicio de Hotel para Viajes
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    name="services.wantsTraining"
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    )}
                  />
                  <span className="text-sm text-gray-700">
                    Servicio de Entrenamiento
                  </span>
                </label>
              </div>
            )}
          </div>
        </form>

        {/* Electronic Signature Modal */}
        {showSignatureModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Firma Electrónica
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Para confirmar su autorización, recibirá un código OTP en su
                teléfono móvil.
              </p>

              {!otpSent ? (
                <Button
                  type="button"
                  variant="primary"
                  fullWidth
                  onClick={handleSendOTP}
                >
                  Enviar Código OTP
                </Button>
              ) : (
                <div className="space-y-4">
                  <Input
                    label="Código OTP"
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Ingrese el código de 6 dígitos"
                    maxLength={6}
                  />
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      fullWidth
                      onClick={() => setShowSignatureModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      fullWidth
                      onClick={handleVerifyOTP}
                    >
                      Verificar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-lg">
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" form="patient-form">
              Guardar Paciente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPatientForm;
