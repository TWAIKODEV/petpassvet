
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear un nuevo paciente
export const createPatient = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    birthDate: v.string(),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
    address: v.string(),
    preferredContact: v.union(v.literal("phone"), v.literal("email"), v.literal("whatsapp"), v.literal("sms")),
    bankAccount: v.optional(v.string()),
    creditCard: v.optional(v.string()),
    marketing: v.object({
      acceptsDataProtection: v.boolean(),
      acceptsEmailMarketing: v.boolean(),
      acceptsWhatsAppComm: v.boolean(),
    }),
    petPass: v.object({
      hasPetPass: v.boolean(),
      plan: v.optional(v.union(v.literal("track"), v.literal("protect"), v.literal("vetcare"))),
    }),
    services: v.object({
      wantsGrooming: v.boolean(),
      wantsFoodDelivery: v.boolean(),
      wantsHotelService: v.boolean(),
      wantsTraining: v.boolean(),
    }),
    pet: v.object({
      name: v.string(),
      species: v.string(),
      sex: v.union(v.literal("male"), v.literal("female")),
      birthDate: v.string(),
      breed: v.string(),
      isNeutered: v.boolean(),
      microchipNumber: v.optional(v.string()),
      vaccines: v.array(v.object({
        name: v.string(),
        date: v.string(),
        nextDue: v.optional(v.string()),
      })),
      healthPlans: v.array(v.object({
        name: v.string(),
        startDate: v.string(),
        endDate: v.string(),
      })),
      accidents: v.array(v.object({
        date: v.string(),
        description: v.string(),
        treatment: v.string(),
      })),
      surgeries: v.array(v.object({
        date: v.string(),
        type: v.string(),
        notes: v.string(),
      })),
      otherTests: v.array(v.object({
        date: v.string(),
        type: v.string(),
        result: v.string(),
      })),
    }),
    insuranceProvider: v.optional(v.string()),
    insuranceNumber: v.optional(v.string()),
    medicalHistory: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const patientId = await ctx.db.insert("patients", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return patientId;
  },
});

// Obtener todos los pacientes
export const getPatients = query({
  handler: async (ctx) => {
    return await ctx.db.query("patients").order("desc").collect();
  },
});

// Obtener un paciente por ID
export const getPatient = query({
  args: { id: v.id("patients") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Buscar pacientes por email
export const getPatientByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("patients")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Actualizar un paciente
export const updatePatient = mutation({
  args: {
    id: v.id("patients"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    birthDate: v.optional(v.string()),
    gender: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("other"))),
    address: v.optional(v.string()),
    preferredContact: v.optional(v.union(v.literal("phone"), v.literal("email"), v.literal("whatsapp"), v.literal("sms"))),
    bankAccount: v.optional(v.string()),
    creditCard: v.optional(v.string()),
    marketing: v.optional(v.object({
      acceptsDataProtection: v.boolean(),
      acceptsEmailMarketing: v.boolean(),
      acceptsWhatsAppComm: v.boolean(),
    })),
    petPass: v.optional(v.object({
      hasPetPass: v.boolean(),
      plan: v.optional(v.union(v.literal("track"), v.literal("protect"), v.literal("vetcare"))),
    })),
    services: v.optional(v.object({
      wantsGrooming: v.boolean(),
      wantsFoodDelivery: v.boolean(),
      wantsHotelService: v.boolean(),
      wantsTraining: v.boolean(),
    })),
    pet: v.optional(v.object({
      name: v.string(),
      species: v.string(),
      sex: v.union(v.literal("male"), v.literal("female")),
      birthDate: v.string(),
      breed: v.string(),
      isNeutered: v.boolean(),
      microchipNumber: v.optional(v.string()),
      vaccines: v.array(v.object({
        name: v.string(),
        date: v.string(),
        nextDue: v.optional(v.string()),
      })),
      healthPlans: v.array(v.object({
        name: v.string(),
        startDate: v.string(),
        endDate: v.string(),
      })),
      accidents: v.array(v.object({
        date: v.string(),
        description: v.string(),
        treatment: v.string(),
      })),
      surgeries: v.array(v.object({
        date: v.string(),
        type: v.string(),
        notes: v.string(),
      })),
      otherTests: v.array(v.object({
        date: v.string(),
        type: v.string(),
        result: v.string(),
      })),
    })),
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
    await ctx.db.delete(args.id);
  },
});
