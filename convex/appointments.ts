import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear una nueva cita
export const createAppointment = mutation({
  args: {
    petId: v.id("pets"),
    consultationType: v.union(v.literal("normal"), v.literal("insurance"), v.literal("emergency")),
    serviceType: v.string(),
    employeeId: v.id("employees"),
    date: v.string(),
    time: v.string(),
    duration: v.number(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("waiting"), v.literal("in_progress"), v.literal("completed"), v.literal("no_show"), v.literal("scheduled")),
    notes: v.optional(v.string()),
    microsoftCalendarEventId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const appointmentId = await ctx.db.insert("appointments", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return appointmentId;
  },
});

// Obtener todas las citas con información completa
export const getAppointments = query({
  handler: async (ctx) => {
    const appointments = await ctx.db.query("appointments").order("desc").collect();

    const appointmentsWithDetails = await Promise.all(
      appointments.map(async (appointment) => {
        // Obtener información de la mascota
        const pet = await ctx.db.get(appointment.petId);
        if (!pet) return null;

        // Obtener información del paciente (propietario)
        const patient = await ctx.db.get(pet.patientId);
        if (!patient) return null;

        // Obtener información del empleado
        const employee = await ctx.db.get(appointment.employeeId);
        if (!employee) return null;

        // Calcular edad de la mascota
        const age = pet.birthDate 
          ? new Date().getFullYear() - new Date(pet.birthDate).getFullYear()
          : 0;

        // Determinar el tipo de consulta basado en el departamento del empleado
        const consultationKind = employee.department === 'veterinary' 
          ? 'checkUp' 
          : employee.department === 'grooming' 
          ? 'grooming' 
          : 'procedure';

        return {
          ...appointment,
          consultationKind, // Agregamos esto para compatibilidad
          pet: {
            id: pet._id,
            name: pet.name,
            species: pet.species,
            breed: pet.breed || '',
            sex: pet.sex || 'male',
            age: age,
          },
          patient: {
            id: patient._id,
            name: `${patient.firstName} ${patient.lastName}`,
            email: patient.email,
            phone: patient.phone,
          },
          employee: {
            id: employee._id,
            name: `${employee.firstName} ${employee.lastName}`,
            department: employee.department,
            position: employee.position,
          }
        };
      })
    );

    return appointmentsWithDetails.filter(appointment => appointment !== null);
  },
});

// Obtener citas por mascota
export const getAppointmentsByPet = query({
  args: { petId: v.id("pets") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_pet", (q) => q.eq("petId", args.petId))
      .collect();
  },
});

// Obtener citas por fecha
export const getAppointmentsByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const appointments = await ctx.db
      .query("appointments")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();

    const appointmentsWithDetails = await Promise.all(
      appointments.map(async (appointment) => {
        const pet = await ctx.db.get(appointment.petId);
        if (!pet) return null;

        const patient = await ctx.db.get(pet.patientId);
        if (!patient) return null;

        const employee = await ctx.db.get(appointment.employeeId);
        if (!employee) return null;

        const age = pet.birthDate 
          ? new Date().getFullYear() - new Date(pet.birthDate).getFullYear()
          : 0;

        const consultationKind = employee.department === 'veterinary' 
          ? 'checkUp' 
          : employee.department === 'grooming' 
          ? 'grooming' 
          : 'procedure';

        return {
          ...appointment,
          consultationKind,
          pet: {
            id: pet._id,
            name: pet.name,
            species: pet.species,
            breed: pet.breed || '',
            sex: pet.sex || 'male',
            age: age,
          },
          patient: {
            id: patient._id,
            name: `${patient.firstName} ${patient.lastName}`,
            email: patient.email,
            phone: patient.phone,
          },
          employee: {
            id: employee._id,
            name: `${employee.firstName} ${employee.lastName}`,
            department: employee.department,
            position: employee.position,
          }
        };
      })
    );

    return appointmentsWithDetails.filter(appointment => appointment !== null);
  },
});

// Obtener citas por empleado
export const getAppointmentsByEmployee = query({
  args: { employeeId: v.id("employees") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_employee", (q) => q.eq("employeeId", args.employeeId))
      .collect();
  },
});

// Obtener una cita por ID
export const getAppointment = query({
  args: { id: v.id("appointments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Actualizar estado de cita
export const updateAppointmentStatus = mutation({
  args: {
    id: v.id("appointments"),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("waiting"), v.literal("in_progress"), v.literal("completed"), v.literal("no_show"), v.literal("scheduled")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

// Eliminar una cita
export const deleteAppointment = mutation({
  args: { id: v.id("appointments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Buscar pacientes y mascotas para el buscador de citas
export const searchPatientsAndPets = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const patients = await ctx.db.query("patients").collect();
    const pets = await ctx.db.query("pets").collect();

    const results = [];

    // Buscar en pacientes
    for (const patient of patients) {
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      if (
        fullName.includes(args.searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
        patient.phone.includes(args.searchTerm)
      ) {
        // Obtener mascotas del paciente
        const patientPets = pets.filter(pet => pet.patientId === patient._id);

        for (const pet of patientPets) {
          results.push({
            id: `${patient._id}-${pet._id}`,
            patientId: patient._id,
            petId: pet._id,
            patientName: fullName,
            petName: pet.name,
            petSpecies: pet.species,
            petBreed: pet.breed || '',
            email: patient.email,
            phone: patient.phone,
            displayText: `${pet.name} (${pet.species}) - ${fullName}`
          });
        }
      }
    }

    // Buscar en mascotas
    for (const pet of pets) {
      if (pet.name.toLowerCase().includes(args.searchTerm.toLowerCase())) {
        const patient = await ctx.db.get(pet.patientId);
        if (patient) {
          const fullName = `${patient.firstName} ${patient.lastName}`;
          const existingResult = results.find(r => r.petId === pet._id);

          if (!existingResult) {
            results.push({
              id: `${patient._id}-${pet._id}`,
              patientId: patient._id,
              petId: pet._id,
              patientName: fullName,
              petName: pet.name,
              petSpecies: pet.species,
              petBreed: pet.breed || '',
              email: patient.email,
              phone: patient.phone,
              displayText: `${pet.name} (${pet.species}) - ${fullName}`
            });
          }
        }
      }
    }

    return results.slice(0, 10); // Limitar a 10 resultados
  },
});

// Actualizar una cita existente
export const updateAppointment = mutation({
  args: {
    appointmentId: v.id("appointments"),
    petId: v.optional(v.id("pets")),
    consultationType: v.optional(v.union(v.literal("normal"), v.literal("insurance"), v.literal("emergency"))),
    serviceType: v.optional(v.string()),
    employeeId: v.optional(v.id("employees")),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    duration: v.optional(v.number()),
    status: v.optional(v.union(v.literal("pending"), v.literal("confirmed"), v.literal("waiting"), v.literal("in_progress"), v.literal("completed"), v.literal("no_show"), v.literal("scheduled"))),
    notes: v.optional(v.string()),
    microsoftCalendarEventId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { appointmentId, ...updateData } = args;
    const now = Date.now();
    
    const updatedAppointment = await ctx.db.patch(appointmentId, {
      ...updateData,
      updatedAt: now,
    });
    
    return updatedAppointment;
  },
});