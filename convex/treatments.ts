
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createTreatment = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    description: v.string(),
    duration: v.number(),
    followUpPeriod: v.optional(v.number()),
    price: v.number(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    species: v.array(v.string()),
    sex: v.union(v.literal("male"), v.literal("female"), v.literal("both")),
    clinicArea: v.optional(v.string()),
    conditions: v.array(v.string()),
    associatedMedicines: v.array(v.id("medicines")),
    procedures: v.array(v.string()),
    contraindications: v.array(v.string()),
    sideEffects: v.array(v.string()),
    notes: v.optional(v.string()),
    minAge: v.optional(v.number()),
    maxAge: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("treatments", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getTreatments = query({
  handler: async (ctx) => {
    return await ctx.db.query("treatments").order("desc").collect();
  },
});

export const getTreatment = query({
  args: { id: v.id("treatments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateTreatment = mutation({
  args: {
    id: v.id("treatments"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    duration: v.optional(v.number()),
    followUpPeriod: v.optional(v.number()),
    price: v.optional(v.number()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    species: v.optional(v.array(v.string())),
    sex: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("both"))),
    clinicArea: v.optional(v.string()),
    conditions: v.optional(v.array(v.string())),
    associatedMedicines: v.optional(v.array(v.id("medicines"))),
    procedures: v.optional(v.array(v.string())),
    contraindications: v.optional(v.array(v.string())),
    sideEffects: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    minAge: v.optional(v.number()),
    maxAge: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

export const deleteTreatment = mutation({
  args: { id: v.id("treatments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getTreatmentsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("treatments")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const getActiveTreatments = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("treatments")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
  },
});

export const getTreatmentsByClinicArea = query({
  args: { clinicArea: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("treatments")
      .withIndex("by_clinic_area", (q) => q.eq("clinicArea", args.clinicArea))
      .collect();
  },
});
