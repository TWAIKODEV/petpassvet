
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear una nueva prescripción
export const createPrescription = mutation({
  args: {
    patientId: v.id("patients"),
    petId: v.optional(v.id("pets")),
    veterinarian: v.string(),
    medications: v.array(v.object({
      name: v.string(),
      dosage: v.string(),
      frequency: v.string(),
      duration: v.string(),
      instructions: v.optional(v.string()),
    })),
    diagnosis: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const prescriptionId = await ctx.db.insert("prescriptions", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return prescriptionId;
  },
});

// Obtener todas las prescripciones
export const getPrescriptions = query({
  handler: async (ctx) => {
    return await ctx.db.query("prescriptions").order("desc").collect();
  },
});

// Obtener prescripciones por paciente
export const getPrescriptionsByPatient = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("prescriptions")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .collect();
  },
});

// Obtener una prescripción por ID
export const getPrescription = query({
  args: { id: v.id("prescriptions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Actualizar una prescripción
export const updatePrescription = mutation({
  args: {
    id: v.id("prescriptions"),
    patientId: v.optional(v.id("patients")),
    petId: v.optional(v.id("pets")),
    veterinarian: v.optional(v.string()),
    medications: v.optional(v.array(v.object({
      name: v.string(),
      dosage: v.string(),
      frequency: v.string(),
      duration: v.string(),
      instructions: v.optional(v.string()),
    }))),
    diagnosis: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Eliminar una prescripción
export const deletePrescription = mutation({
  args: { id: v.id("prescriptions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
