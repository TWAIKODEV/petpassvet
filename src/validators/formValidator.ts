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
}

// Input type (what the form accepts before defaults are applied)
export type NewAppointmentFormInput = z.input<ReturnType<typeof FormValidator.newAppointment>>;
// Output type (after parsing/defaults)
export type NewAppointmentFormOutput = z.output<ReturnType<typeof FormValidator.newAppointment>>;


