
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear una nueva receta
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

// Obtener todas las recetas
export const getPrescriptions = query({
  handler: async (ctx) => {
    return await ctx.db.query("prescriptions").order("desc").collect();
  },
});

// Obtener recetas por paciente
export const getPrescriptionsByPatient = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("prescriptions")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .collect();
  },
});
