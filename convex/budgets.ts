
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createBudget = mutation({
  args: {
    patientId: v.id("patients"),
    date: v.string(),
    validUntil: v.string(),
    number: v.string(),
    products: v.array(
      v.object({
        itemId: v.string(),
        itemType: v.union(v.literal("product"), v.literal("service"), v.literal("medicine")),
        name: v.string(),
        quantity: v.number(),
        price: v.number(),
        discount: v.number(),
        vat: v.number(),
      })
    ),
    nif: v.optional(v.string()),
    billingAddress: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.optional(v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected"))),
    shared: v.optional(v.array(v.union(v.literal("email"), v.literal("whatsapp"), v.literal("sms")))),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const budgetId = await ctx.db.insert("budgets", {
      ...args,
      status: args.status || "pending",
      shared: args.shared || [],
      createdAt: now,
      updatedAt: now,
    });

    return budgetId;
  },
});

export const getBudgets = query({
  handler: async (ctx) => {
    const budgets = await ctx.db.query("budgets").order("desc").collect();
    
    // Get patient details for each budget
    const budgetsWithPatients = await Promise.all(
      budgets.map(async (budget) => {
        const patient = await ctx.db.get(budget.patientId);
        const pets = await ctx.db
          .query("pets")
          .withIndex("by_patient", (q) => q.eq("patientId", budget.patientId))
          .collect();

        return {
          ...budget,
          patient: patient ? {
            ...patient,
            pets: pets,
            pet: pets[0] || null,
          } : null,
        };
      })
    );

    return budgetsWithPatients;
  },
});

export const getBudget = query({
  args: { id: v.id("budgets") },
  handler: async (ctx, args) => {
    const budget = await ctx.db.get(args.id);
    if (!budget) return null;

    const patient = await ctx.db.get(budget.patientId);
    const pets = await ctx.db
      .query("pets")
      .withIndex("by_patient", (q) => q.eq("patientId", budget.patientId))
      .collect();

    return {
      ...budget,
      patient: patient ? {
        ...patient,
        pets: pets,
        pet: pets[0] || null,
      } : null,
    };
  },
});

export const updateBudget = mutation({
  args: {
    id: v.id("budgets"),
    patientId: v.optional(v.id("patients")),
    date: v.optional(v.string()),
    validUntil: v.optional(v.string()),
    number: v.optional(v.string()),
    products: v.optional(v.array(
      v.object({
        itemId: v.string(),
        itemType: v.union(v.literal("product"), v.literal("service"), v.literal("medicine")),
        name: v.string(),
        quantity: v.number(),
        price: v.number(),
        discount: v.number(),
        vat: v.number(),
      })
    )),
    nif: v.optional(v.string()),
    billingAddress: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.optional(v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected"))),
    shared: v.optional(v.array(v.union(v.literal("email"), v.literal("whatsapp"), v.literal("sms")))),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

export const deleteBudget = mutation({
  args: { id: v.id("budgets") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateBudgetShared = mutation({
  args: {
    id: v.id("budgets"),
    shareMethod: v.union(v.literal("email"), v.literal("whatsapp"), v.literal("sms")),
  },
  handler: async (ctx, args) => {
    const budget = await ctx.db.get(args.id);
    if (!budget) throw new Error("Budget not found");

    const shared = [...budget.shared];
    if (!shared.includes(args.shareMethod)) {
      shared.push(args.shareMethod);
    }

    await ctx.db.patch(args.id, {
      shared,
      updatedAt: Date.now(),
    });
  },
});

// Get all products, services, and medicines for budget creation
export const getBudgetItems = query({
  handler: async (ctx) => {
    const products = await ctx.db.query("products").filter((q) => q.eq(q.field("isActive"), true)).collect();
    const services = await ctx.db.query("services").filter((q) => q.eq(q.field("isActive"), true)).collect();
    const medicines = await ctx.db.query("medicines").filter((q) => q.eq(q.field("status"), "active")).collect();

    return {
      products: products.map(p => ({ ...p, type: 'product' as const })),
      services: services.map(s => ({ ...s, type: 'service' as const })),
      medicines: medicines.map(m => ({ ...m, type: 'medicine' as const })),
    };
  },
});
