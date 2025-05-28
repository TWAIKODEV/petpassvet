
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const prescriptions = await ctx.db.query("prescriptions").collect();
    
    // Get patient data for each prescription
    const prescriptionsWithPatients = await Promise.all(
      prescriptions.map(async (prescription) => {
        const patient = await ctx.db.get(prescription.patientId);
        return {
          ...prescription,
          patient,
        };
      })
    );
    
    return prescriptionsWithPatients;
  },
});

export const get = query({
  args: { id: v.id("prescriptions") },
  handler: async (ctx, args) => {
    const prescription = await ctx.db.get(args.id);
    if (!prescription) return null;
    
    const patient = await ctx.db.get(prescription.patientId);
    return {
      ...prescription,
      patient,
    };
  },
});

export const create = mutation({
  args: {
    number: v.string(),
    patientId: v.id("patients"),
    veterinarian: v.string(),
    medications: v.array(v.object({
      id: v.string(),
      name: v.string(),
      dosage: v.string(),
      frequency: v.string(),
      duration: v.string(),
      instructions: v.string(),
    })),
    notes: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const date = new Date().toISOString();
    return await ctx.db.insert("prescriptions", {
      ...args,
      date,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("prescriptions"),
    status: v.optional(v.string()),
    notes: v.optional(v.string()),
    medications: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      dosage: v.string(),
      frequency: v.string(),
      duration: v.string(),
      instructions: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});
