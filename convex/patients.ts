
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear un nuevo paciente
export const createPatient = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    birthDate: v.optional(v.string()),
    gender: v.optional(v.string()),
    emergencyContact: v.optional(v.object({
      name: v.string(),
      phone: v.string(),
      relationship: v.string(),
    })),
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

// Actualizar un paciente
export const updatePatient = mutation({
  args: {
    id: v.id("patients"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    birthDate: v.optional(v.string()),
    gender: v.optional(v.string()),
    emergencyContact: v.optional(v.object({
      name: v.string(),
      phone: v.string(),
      relationship: v.string(),
    })),
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
