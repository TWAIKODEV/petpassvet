import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear un nuevo paciente
// Obtener todos los pacientes
export const getPatients = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("patients").collect();
  },
});

export const createPatient = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    birthDate: v.string(),
    address: v.string(),
    preferredContact: v.optional(
      v.union(
        v.literal("phone"),
        v.literal("email"),
        v.literal("whatsapp"),
        v.literal("sms"),
      ),
    ),
    bankAccount: v.optional(v.string()),
    creditCard: v.optional(v.string()),
    marketing: v.object({
      acceptsEmail: v.boolean(),
      acceptsSms: v.boolean(),
      acceptsWhatsApp: v.boolean(),
    }),
    petPass: v.object({
      hasPetPass: v.boolean(),
      plan: v.optional(
        v.union(v.literal("track"), v.literal("protect"), v.literal("vetcare")),
      ),
    }),
    services: v.object({
      wantsGrooming: v.boolean(),
      wantsFoodDelivery: v.boolean(),
      wantsHotelService: v.boolean(),
      wantsTraining: v.boolean(),
    }),
    insuranceProvider: v.optional(v.string()),
    insuranceNumber: v.optional(v.string()),
    medicalHistory: v.optional(v.array(v.string())),
    // Pet information (optional - will create pet if provided)
    pet: v.optional(
      v.object({
        name: v.string(),
        species: v.string(),
        breed: v.string(),
        sex: v.union(v.literal("male"), v.literal("female")),
        birthDate: v.string(),
        isNeutered: v.boolean(),
        microchipNumber: v.optional(v.string()),
        color: v.optional(v.string()),
        observations: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const { pet, ...patientData } = args;

    // Create patient
    const patientId = await ctx.db.insert("patients", {
      ...patientData,
      createdAt: now,
      updatedAt: now,
    });

    // Create pet if provided
    if (pet) {
      await ctx.db.insert("pets", {
        patientId,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        sex: pet.sex,
        birthDate: pet.birthDate,
        isNeutered: pet.isNeutered,
        microchipNumber: pet.microchipNumber,
        color: pet.color,
        weight: undefined,
        observations: pet.observations,
        vaccines: [],
        healthPlans: [],
        accidents: [],
        surgeries: [],
        otherTests: [],
        createdAt: now,
        updatedAt: now,
      });
    }

    return patientId;
  },
});

// Obtener todos los pacientes con sus mascotas
export const getPatients = query({
  handler: async (ctx) => {
    const patients = await ctx.db.query("patients").order("desc").collect();

    // Get pets for each patient
    const patientsWithPets = await Promise.all(
      patients.map(async (patient) => {
        const pets = await ctx.db
          .query("pets")
          .withIndex("by_patient", (q) => q.eq("patientId", patient._id))
          .collect();

        return {
          ...patient,
          pets: pets,
          // For backward compatibility, include first pet as 'pet'
          pet: pets[0] || null,
        };
      }),
    );

    return patientsWithPets;
  },
});

// Obtener un paciente por ID con sus mascotas
export const getPatient = query({
  args: { id: v.id("patients") },
  handler: async (ctx, args) => {
    const patient = await ctx.db.get(args.id);
    if (!patient) return null;

    const pets = await ctx.db
      .query("pets")
      .withIndex("by_patient", (q) => q.eq("patientId", args.id))
      .collect();

    return {
      ...patient,
      pets: pets,
      pet: pets[0] || null,
    };
  },
});

// Buscar pacientes por email
export const getPatientByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const patient = await ctx.db
      .query("patients")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!patient) return null;

    const pets = await ctx.db
      .query("pets")
      .withIndex("by_patient", (q) => q.eq("patientId", patient._id))
      .collect();

    return {
      ...patient,
      pets: pets,
      pet: pets[0] || null,
    };
  },
});

// Actualizar un paciente
export const updatePatient = mutation({
  args: {
    id: v.id("patients"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    birthDate: v.optional(v.string()),
    address: v.optional(v.string()),
    preferredContact: v.optional(
      v.union(
        v.literal("phone"),
        v.literal("email"),
        v.literal("whatsapp"),
        v.literal("sms"),
      ),
    ),
    bankAccount: v.optional(v.string()),
    creditCard: v.optional(v.string()),
    marketing: v.optional(
      v.object({
        acceptsEmail: v.boolean(),
        acceptsSms: v.boolean(),
        acceptsWhatsApp: v.boolean(),
      }),
    ),
    petPass: v.optional(
      v.object({
        hasPetPass: v.boolean(),
        plan: v.optional(
          v.union(
            v.literal("track"),
            v.literal("protect"),
            v.literal("vetcare"),
          ),
        ),
      }),
    ),
    services: v.optional(
      v.object({
        wantsGrooming: v.boolean(),
        wantsFoodDelivery: v.boolean(),
        wantsHotelService: v.boolean(),
        wantsTraining: v.boolean(),
      }),
    ),
    insuranceProvider: v.optional(v.string()),
    insuranceNumber: v.optional(v.string()),
    medicalHistory: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Eliminar un paciente
export const deletePatient = mutation({
  args: { id: v.id("patients") },
  handler: async (ctx, args) => {
    // Delete associated pets first
    const pets = await ctx.db
      .query("pets")
      .withIndex("by_patient", (q) => q.eq("patientId", args.id))
      .collect();

    for (const pet of pets) {
      await ctx.db.delete(pet._id);
    }

    // Delete patient
    await ctx.db.delete(args.id);
  },
});
