import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { X, Plus, Trash, ChevronDown, ChevronRight, Check } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";

interface NewPatientFormProps {
  onClose: () => void;
  onSubmit: (patientData: any) => void;
}

const NewPatientForm: React.FC<NewPatientFormProps> = ({
  onClose,
  onSubmit,
}) => {
  const createPatient = useMutation(api.patients.createPatient);
  const [formData, setFormData] = useState({
    // Owner information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    idNumber: "", // DNI/NIE
    language: "",
    preferredContact: "",
    couponCode: "",
    affiliateClub: "",
    address: "Calle de Beatriz de Bobadilla, 9. Madrid",

    // Marketing and communications
    marketing: {
      acceptsEmail: false,
      acceptsSms: false,
      acceptsWhatsApp: false,
    },

    // PetPass information
    petPass: {
      hasPetPass: false,
      product: "", // Changed from 'plan' to 'product' for clarity
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
      sex: "",
      birthDate: "",
      microchipNumber: "",
      isNeutered: false,
      color: "",
      observations: "",
      hasInsurance: false,
      insurerName: "",
      policyNumber: "",
    },
  });

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

  const toggleSection = (section: string) => {
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
      setFormData((prev) => ({
        ...prev,
        marketing: {
          ...prev.marketing,
          signedAt: new Date().toISOString(),
        },
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    // Handle nested object updates
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const patientData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate,
        address: formData.address,
        preferredContact: formData.preferredContact
          ? (formData.preferredContact as
              | "phone"
              | "email"
              | "whatsapp"
              | "sms")
          : undefined,
        bankAccount: undefined,
        creditCard: undefined,
        marketing: {
          acceptsEmail: formData.marketing.acceptsEmail || false,
          acceptsSms: formData.marketing.acceptsSms || false,
          acceptsWhatsApp: formData.marketing.acceptsWhatsApp || false,
        },
        petPass: {
          hasPetPass: formData.petPass.hasPetPass || false,
          plan:
            formData.petPass.hasPetPass && formData.petPass.product
              ? (formData.petPass.product as "track" | "protect" | "vetcare")
              : undefined,
        },
        services: {
          wantsGrooming: formData.services.wantsGrooming || false,
          wantsFoodDelivery: formData.services.wantsFoodDelivery || false,
          wantsHotelService: formData.services.wantsHotelService || false,
          wantsTraining: formData.services.wantsTraining || false,
        },
        insuranceProvider: formData.pet.hasInsurance
          ? formData.pet.insurerName
          : undefined,
        insuranceNumber: formData.pet.hasInsurance
          ? formData.pet.policyNumber
          : undefined,
        medicalHistory: undefined,
      };

      // Add pet data if provided
      if (formData.pet.name && formData.pet.species) {
        patientData.pet = {
          name: formData.pet.name,
          species: formData.pet.species,
          breed: formData.pet.breed || "",
          sex: formData.pet.sex as "male" | "female",
          birthDate: formData.pet.birthDate || "",
          isNeutered: formData.pet.isNeutered || false,
          microchipNumber: formData.pet.microchipNumber,
          color: formData.pet.color,
          observations: formData.pet.observations,
        };
      }

      const patientId = await createPatient(patientData);

      console.log("Paciente creado con ID:", patientId);
      onSubmit(formData);
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
    section: string;
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Owner Information Section */}
          <div className="border rounded-lg shadow-sm">
            <SectionHeader
              title="Información del Propietario"
              section="owner"
            />
            {expandedSections.owner && (
              <div className="p-4 space-y-4">
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
                </div>
                <Input
                  label="DNI/NIE"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Dirección"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <Input
                    label="Teléfono"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Fecha de Nacimiento"
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Seleccionar Idioma</option>
                    <option value="es">Español</option>
                    <option value="en">Inglés</option>
                    <option value="ca">Catalán</option>
                  </select>
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
                        <input
                          type="radio"
                          name="preferredContact"
                          value={method}
                          checked={formData.preferredContact === method}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {method}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Código de descuento"
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleChange}
                    placeholder="Si tiene un código, ingréselo aquí"
                  />
                  <Input
                    label="Club de afiliados"
                    name="affiliateClub"
                    value={formData.affiliateClub}
                    onChange={handleChange}
                    placeholder="Nombre del club si es miembro"
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
                <Input
                  label="Nombre de la Mascota"
                  name="pet.name"
                  value={formData.pet.name}
                  onChange={handleChange}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Especie"
                    name="pet.species"
                    value={formData.pet.species}
                    onChange={handleChange}
                  />
                  <Input
                    label="Raza"
                    name="pet.breed"
                    value={formData.pet.breed}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    name="pet.sex"
                    value={formData.pet.sex}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Seleccionar Sexo</option>
                    <option value="male">Macho</option>
                    <option value="female">Hembra</option>
                  </select>
                  <Input
                    label="Fecha de Nacimiento"
                    type="date"
                    name="pet.birthDate"
                    value={formData.pet.birthDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Color del pelaje"
                    name="pet.coatColor"
                    value={formData.pet.color}
                    onChange={handleChange}
                  />
                  <Input
                    label="Número de Microchip"
                    name="pet.microchipNumber"
                    value={formData.pet.microchipNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Observaciones
                  </label>
                  <textarea
                    name="pet.observations"
                    value={formData.pet.observations}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="pet.isNeutered"
                      checked={formData.pet.isNeutered}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Esterilizado/a
                    </span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="pet.hasInsurance"
                      checked={formData.pet.hasInsurance}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Tiene seguro</span>
                  </label>
                </div>
                {formData.pet.hasInsurance && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nombre de la aseguradora"
                      name="pet.insurerName"
                      value={formData.pet.insurerName}
                      onChange={handleChange}
                    />
                    <Input
                      label="Número de póliza"
                      name="pet.policyNumber"
                      value={formData.pet.policyNumber}
                      onChange={handleChange}
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
                    <input
                      type="checkbox"
                      name="marketing.emailConsent"
                      checked={formData.marketing.acceptsEmail}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Acepto recibir comunicaciones por email
                    </span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="marketing.smsConsent"
                      checked={formData.marketing.acceptsSms}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Acepto recibir comunicaciones por SMS
                    </span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="marketing.whatsappConsent"
                      checked={formData.marketing.acceptsWhatsApp}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                      {formData.marketing.signedAt ? (
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
                      {!formData.marketing.signedAt && (
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
                    <input
                      type="checkbox"
                      name="petPass.hasPetPass"
                      checked={formData.petPass.hasPetPass}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-900">
                        Tiene PetPass
                      </label>
                      <p className="mt-1 text-sm text-gray-500">
                        Seleccione esta opción si el paciente cuenta con un plan
                        PetPass
                      </p>

                      {formData.petPass.hasPetPass && (
                        <div className="mt-4 relative">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Producto PetPass
                          </label>
                          <div className="relative">
                            <select
                              name="petPass.product"
                              value={formData.petPass.product}
                              onChange={handleChange}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white"
                            >
                              <option value="undefined">
                                Seleccionar producto
                              </option>
                              <option value="track">PetPass Track</option>
                              <option value="protect">PetPass Protect</option>
                              <option value="vetcare">PetPass Vetcare</option>
                            </select>
                          </div>

                          {formData.petPass.product && (
                            <div className="mt-2 p-2 bg-white rounded border border-gray-200 text-sm">
                              {formData.petPass.product === "track" && (
                                <div className="flex flex-col gap-1">
                                  <span className="font-medium text-blue-600">
                                    PetPass Track
                                  </span>
                                  <p className="text-gray-600">
                                    Seguimiento básico de la salud de tu mascota
                                  </p>
                                </div>
                              )}
                              {formData.petPass.product === "protect" && (
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
                              {formData.petPass.product === "vetcare" && (
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
                  <input
                    type="checkbox"
                    name="services.wantsGrooming"
                    checked={formData.services.wantsGrooming}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Servicio de Peluquería
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="services.wantsFoodDelivery"
                    checked={formData.services.wantsFoodDelivery}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Servicio de Comida a Domicilio
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="services.wantsHotelService"
                    checked={formData.services.wantsHotelService}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Servicio de Hotel para Viajes
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="services.wantsTraining"
                    checked={formData.services.wantsTraining}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
            <Button type="submit" variant="primary" onClick={handleSubmit}>
              Guardar Paciente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPatientForm;
