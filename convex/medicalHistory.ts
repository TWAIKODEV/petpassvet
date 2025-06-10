
import { query } from "./_generated/server";
import { v } from "convex/values";

// Obtener todos los pets con sus pacientes para el historial médico
export const getMedicalHistoryData = query({
  handler: async (ctx) => {
    // Obtener todas las mascotas
    const pets = await ctx.db.query("pets").order("desc").collect();
    
    // Para cada mascota, obtener el paciente y contar las citas
    const medicalHistory = await Promise.all(
      pets.map(async (pet) => {
        const patient = await ctx.db.get(pet.patientId);
        if (!patient) return null;

        // Contar las citas de esta mascota
        const appointments = await ctx.db
          .query("appointments")
          .withIndex("by_pet", (q) => q.eq("petId", pet._id))
          .collect();

        return {
          id: pet._id,
          date: new Date(pet.createdAt).toISOString().split('T')[0],
          owner: {
            name: `${patient.firstName} ${patient.lastName}`,
            email: patient.email,
            phone: patient.phone
          },
          pet: {
            name: pet.name,
            species: pet.species,
            breed: pet.breed || '',
            age: pet.birthDate ? Math.floor((Date.now() - new Date(pet.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 0,
            sex: pet.sex || 'male',
            microchip: pet.microchipNumber || ''
          },
          recordCount: appointments.length,
          petPass: patient.petPass.hasPetPass,
          healthPlan: patient.petPass.plan || null,
          insurance: pet.hasInsurance ? {
            provider: pet.insuranceProvider || '',
            number: pet.insuranceNumber || ''
          } : null
        };
      })
    );

    // Filtrar valores null y retornar
    return medicalHistory.filter(Boolean);
  },
});

// Obtener el historial detallado de una mascota
export const getPetDetailedHistory = query({
  args: { petId: v.id("pets") },
  handler: async (ctx, args) => {
    const pet = await ctx.db.get(args.petId);
    if (!pet) return null;

    const patient = await ctx.db.get(pet.patientId);
    if (!patient) return null;

    // Obtener todas las citas de esta mascota
    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_pet", (q) => q.eq("petId", args.petId))
      .order("desc")
      .collect();

    // Obtener información de los doctores para cada cita
    const appointmentsWithDoctors = await Promise.all(
      appointments.map(async (appointment) => {
        const doctor = await ctx.db.get(appointment.doctorId);
        return {
          id: appointment._id,
          date: appointment.date,
          time: appointment.time,
          doctor: doctor?.name || 'Doctor no encontrado',
          area: appointment.serviceType,
          service: appointment.consultationKind,
          amount: 75.00, // Valor por defecto, podrías añadir este campo a appointments
          status: appointment.status,
          notes: appointment.notes
        };
      })
    );

    return {
      id: pet._id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed || '',
      sex: pet.sex || 'male',
      birthDate: pet.birthDate || '',
      owner: {
        name: `${patient.firstName} ${patient.lastName}`,
        phone: patient.phone,
        email: patient.email
      },
      visits: appointmentsWithDoctors
    };
  },
});
