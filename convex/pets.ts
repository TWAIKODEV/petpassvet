
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear una nueva mascota
export const createPet = mutation({
  args: {
    patientId: v.id("patients"),
    name: v.string(),
    species: v.string(),
    breed: v.string(),
    sex: v.union(v.literal("male"), v.literal("female")),
    birthDate: v.string(),
    isNeutered: v.boolean(),
    microchipNumber: v.optional(v.string()),
    color: v.optional(v.string()),
    weight: v.optional(v.number()),
    observations: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const petId = await ctx.db.insert("pets", {
      ...args,
      vaccines: [],
      healthPlans: [],
      accidents: [],
      surgeries: [],
      otherTests: [],
      createdAt: now,
      updatedAt: now,
    });
    return petId;
  },
});

// Obtener mascotas por paciente
export const getPetsByPatient = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pets")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .collect();
  },
});

// Obtener una mascota por ID
export const getPet = query({
  args: { id: v.id("pets") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Actualizar una mascota
export const updatePet = mutation({
  args: {
    id: v.id("pets"),
    name: v.optional(v.string()),
    species: v.optional(v.string()),
    breed: v.optional(v.string()),
    sex: v.optional(v.union(v.literal("male"), v.literal("female"))),
    birthDate: v.optional(v.string()),
    isNeutered: v.optional(v.boolean()),
    microchipNumber: v.optional(v.string()),
    color: v.optional(v.string()),
    weight: v.optional(v.number()),
    observations: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Eliminar una mascota
export const deletePet = mutation({
  args: { id: v.id("pets") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
