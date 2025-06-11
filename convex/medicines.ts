
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createMedicine = mutation({
  args: {
    name: v.string(),
    activeIngredient: v.string(),
    manufacturer: v.string(),
    type: v.string(),
    conditions: v.array(v.string()),
    species: v.array(v.string()),
    breeds: v.array(v.string()),
    sex: v.union(v.literal("male"), v.literal("female"), v.literal("both")),
    dosageForm: v.string(),
    recommendedDosage: v.string(),
    duration: v.string(),
    contraindications: v.array(v.string()),
    sideEffects: v.array(v.string()),
    interactions: v.array(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    stock: v.number(),
    minStock: v.number(),
    price: v.number(),
    reference: v.optional(v.string()),
    atcVetCode: v.optional(v.string()),
    registrationNumber: v.optional(v.string()),
    prescriptionRequired: v.boolean(),
    psychotropic: v.boolean(),
    antibiotic: v.boolean(),
    administrationRoutes: v.array(v.string()),
    excipients: v.optional(v.array(v.string())),
    withdrawalPeriod: v.optional(v.string()),
    aiScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const medicineId = await ctx.db.insert("medicines", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    return medicineId;
  },
});

export const getMedicines = query({
  handler: async (ctx) => {
    const medicines = await ctx.db.query("medicines").order("desc").collect();
    return medicines;
  },
});

export const getMedicine = query({
  args: { id: v.id("medicines") },
  handler: async (ctx, args) => {
    const medicine = await ctx.db.get(args.id);
    return medicine;
  },
});

export const updateMedicine = mutation({
  args: {
    id: v.id("medicines"),
    name: v.optional(v.string()),
    activeIngredient: v.optional(v.string()),
    manufacturer: v.optional(v.string()),
    type: v.optional(v.string()),
    conditions: v.optional(v.array(v.string())),
    species: v.optional(v.array(v.string())),
    breeds: v.optional(v.array(v.string())),
    sex: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("both"))),
    dosageForm: v.optional(v.string()),
    recommendedDosage: v.optional(v.string()),
    duration: v.optional(v.string()),
    contraindications: v.optional(v.array(v.string())),
    sideEffects: v.optional(v.array(v.string())),
    interactions: v.optional(v.array(v.string())),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    stock: v.optional(v.number()),
    minStock: v.optional(v.number()),
    price: v.optional(v.number()),
    reference: v.optional(v.string()),
    atcVetCode: v.optional(v.string()),
    registrationNumber: v.optional(v.string()),
    prescriptionRequired: v.optional(v.boolean()),
    psychotropic: v.optional(v.boolean()),
    antibiotic: v.optional(v.boolean()),
    administrationRoutes: v.optional(v.array(v.string())),
    excipients: v.optional(v.array(v.string())),
    withdrawalPeriod: v.optional(v.string()),
    aiScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

export const deleteMedicine = mutation({
  args: { id: v.id("medicines") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const searchMedicines = query({
  args: { 
    searchTerm: v.optional(v.string()),
    type: v.optional(v.string()),
    species: v.optional(v.string()),
    showInactive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let medicines = await ctx.db.query("medicines").collect();

    if (args.searchTerm) {
      const searchLower = args.searchTerm.toLowerCase();
      medicines = medicines.filter(medicine => 
        medicine.name.toLowerCase().includes(searchLower) ||
        medicine.activeIngredient.toLowerCase().includes(searchLower) ||
        medicine.manufacturer.toLowerCase().includes(searchLower) ||
        medicine.type.toLowerCase().includes(searchLower) ||
        medicine.conditions.some(condition => condition.toLowerCase().includes(searchLower))
      );
    }

    if (args.type && args.type !== 'all') {
      medicines = medicines.filter(medicine => medicine.type === args.type);
    }

    if (args.species && args.species !== 'all') {
      medicines = medicines.filter(medicine => medicine.species.includes(args.species));
    }

    if (!args.showInactive) {
      medicines = medicines.filter(medicine => medicine.status === 'active');
    }

    return medicines;
  },
});
