import { z } from "zod";

export class FormValidator {
  static newAppointment() {
    return z.object({
      petId: z.string().min(1, "Selecciona un paciente y mascota"),
      consultationType: z.enum(["normal", "insurance", "emergency"], {
        required_error: "Selecciona la modalidad",
      }),
      serviceType: z.string().min(1, "Selecciona el tipo de cita"),
      employeeId: z.string().min(1, "Selecciona el especialista"),
      date: z
        .string()
        .min(1, "Selecciona la fecha")
        .regex(/^\d{4}-\d{2}-\d{2}$/i, "Formato de fecha inválido (YYYY-MM-DD)"),
      time: z
        .string()
        .min(1, "Selecciona la hora")
        .regex(/^\d{2}:\d{2}$/i, "Formato de hora inválido (HH:MM)"),
      duration: z
        .number({ invalid_type_error: "La duración debe ser un número" })
        .int("La duración debe ser un número entero")
        .positive("La duración debe ser mayor que 0"),
      // Persisted by backend logic/UI, but keep in schema for completeness with default
      status: z
        .enum([
          "pending",
          "confirmed",
          "waiting",
          "in_progress",
          "completed",
          "no_show",
          "scheduled",
        ])
        .default("pending"),
      notes: z.string().max(2000, "Máximo 2000 caracteres").optional().or(z.literal("")),
      microsoftCalendarEventId: z.string().optional(),
    });
  }

  static newPatient() {
    return z.object({
      // Owner information
      firstName: z.string().min(1, "El nombre es obligatorio"),
      lastName: z.string().min(1, "Los apellidos son obligatorios"),
      email: z.string().min(1, "El email es obligatorio").email("Email inválido"),
      phone: z.string().min(1, "El teléfono es obligatorio"),
      birthDate: z.string().min(1, "La fecha de nacimiento es obligatoria"),
      idNumber: z.string().min(1, "El DNI/NIE es obligatorio"),
      language: z.string().optional().or(z.literal("")),
      preferredContact: z.enum(["phone", "email", "whatsapp", "sms"]).optional(),
      couponCode: z.string().optional().or(z.literal("")),
      affiliateClub: z.string().optional().or(z.literal("")),
      address: z.string().min(1, "La dirección es obligatoria"),

      // Marketing and communications
      marketing: z.object({
        acceptsEmail: z.boolean(),
        acceptsSms: z.boolean(),
        acceptsWhatsApp: z.boolean(),
        signedAt: z.string().optional(),
      }),

      // PetPass information
      petPass: z.object({
        hasPetPass: z.boolean(),
        product: z.enum(["track", "protect", "vetcare"]).optional(),
      }),

      // Additional services
      services: z.object({
        wantsGrooming: z.boolean(),
        wantsFoodDelivery: z.boolean(),
        wantsHotelService: z.boolean(),
        wantsTraining: z.boolean(),
      }),

      // Pet information (optional)
      pet: z.object({
        name: z.string().min(1, "El nombre de la mascota es obligatorio"),
        species: z.string().min(1, "La especie es obligatoria"),
        breed: z.string().min(1, "La raza es obligatoria"),
        sex: z.enum(["male", "female"], { required_error: "El sexo es obligatorio" }),
        birthDate: z.string().min(1, "La fecha de nacimiento de la mascota es obligatoria"),
        isNeutered: z.boolean(),
        microchipNumber: z.string().optional().or(z.literal("")),
        color: z.string().optional().or(z.literal("")),
        observations: z.string().optional().or(z.literal("")),
        hasInsurance: z.boolean(),
        insuranceProvider: z.string().optional().or(z.literal("")),
        insuranceNumber: z.string().optional().or(z.literal("")),
      }).optional(),
    });
  }

  static newPet() {
    return z.object({
      // Required fields
      patientId: z.string().min(1, "Debe seleccionar un propietario"),
      name: z.string().min(1, "El nombre de la mascota es obligatorio"),
      species: z.string().min(1, "La especie es obligatoria"),
      
      // Optional fields
      breed: z.string().optional().or(z.literal("")),
      sex: z.enum(["male", "female"]).optional(),
      birthDate: z.string().optional().or(z.literal("")),
      isNeutered: z.boolean().optional(),
      microchipNumber: z.string().optional().or(z.literal("")),
      color: z.string().optional().or(z.literal("")),
      weight: z.number().optional(),
      height: z.number().optional(),
      furType: z.string().optional().or(z.literal("")),
      observations: z.string().optional().or(z.literal("")),
      currentTreatments: z.string().optional().or(z.literal("")),
      allergies: z.string().optional().or(z.literal("")),
      
      // Medical tests
      bloodTest: z.object({
        done: z.boolean(),
        date: z.string().optional().or(z.literal("")),
      }).optional(),
      xrayTest: z.object({
        done: z.boolean(),
        date: z.string().optional().or(z.literal("")),
      }).optional(),
      ultrasoundTest: z.object({
        done: z.boolean(),
        date: z.string().optional().or(z.literal("")),
      }).optional(),
      urineTest: z.object({
        done: z.boolean(),
        date: z.string().optional().or(z.literal("")),
      }).optional(),
      otherTests: z.string().optional().or(z.literal("")),
      
      // Additional services
      hasPetPass: z.boolean().optional(),
      hasInsurance: z.boolean().optional(),
      insuranceProvider: z.string().optional().or(z.literal("")),
      insuranceNumber: z.string().optional().or(z.literal("")),
    });
  }

  static newTreatment() {
    return z.object({
      // Required fields
      name: z.string().min(1, "El nombre del tratamiento es obligatorio"),
      category: z.string().min(1, "Debe seleccionar una categoría"),
      description: z.string().min(1, "La descripción es obligatoria"),
      duration: z.number().int().positive("La duración debe ser un número positivo"),
      price: z.number().positive("El precio debe ser un número positivo"),
      status: z.enum(["active", "inactive"]),
      species: z.array(z.string()).min(1, "Debe seleccionar al menos una especie"),
      sex: z.enum(["male", "female", "both"]),
      conditions: z.array(z.string()).min(1, "Debe seleccionar al menos una dolencia"),
      associatedMedicines: z.array(z.string()), // This will be Id<"medicines">[] when used
      procedures: z.array(z.string()),
      contraindications: z.array(z.string()),
      sideEffects: z.array(z.string()),
      
      // Optional fields
      followUpPeriod: z.number().int().positive().optional(),
      clinicArea: z.string().optional().or(z.literal("")),
      notes: z.string().optional().or(z.literal("")),
      minAge: z.number().int().positive().optional(),
      maxAge: z.number().int().positive().optional(),
    });
  }
}

// Input type (what the form accepts before defaults are applied)
export type NewAppointmentFormInput = z.input<ReturnType<typeof FormValidator.newAppointment>>;
// Output type (after parsing/defaults)
export type NewAppointmentFormOutput = z.output<ReturnType<typeof FormValidator.newAppointment>>;

// Patient form types
export type NewPatientFormInput = z.input<ReturnType<typeof FormValidator.newPatient>>;
export type NewPatientFormOutput = z.output<ReturnType<typeof FormValidator.newPatient>>;

// Pet form types
export type NewPetFormInput = z.input<ReturnType<typeof FormValidator.newPet>>;
export type NewPetFormOutput = z.output<ReturnType<typeof FormValidator.newPet>>;

export type NewTreatmentFormInput = z.input<ReturnType<typeof FormValidator.newTreatment>>;
export type NewTreatmentFormOutput = z.output<ReturnType<typeof FormValidator.newTreatment>>;


