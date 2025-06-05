
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new invoice
export const createInvoice = mutation({
  args: {
    number: v.string(),
    date: v.string(),
    client: v.object({
      name: v.string(),
      nif: v.string()
    }),
    pet: v.object({
      name: v.string(),
      species: v.string(),
      breed: v.string(),
      age: v.number()
    }),
    area: v.string(),
    concept: v.string(),
    professional: v.string(),
    amount: v.number(),
    paymentMethod: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const invoiceId = await ctx.db.insert("invoices", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return invoiceId;
  },
});

// Get all invoices
export const getInvoices = query({
  handler: async (ctx) => {
    return await ctx.db.query("invoices").order("desc").collect();
  },
});

// Get invoice by ID
export const getInvoice = query({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Update invoice
export const updateInvoice = mutation({
  args: {
    id: v.id("invoices"),
    number: v.optional(v.string()),
    date: v.optional(v.string()),
    client: v.optional(v.object({
      name: v.string(),
      nif: v.string()
    })),
    pet: v.optional(v.object({
      name: v.string(),
      species: v.string(),
      breed: v.string(),
      age: v.number()
    })),
    area: v.optional(v.string()),
    concept: v.optional(v.string()),
    professional: v.optional(v.string()),
    amount: v.optional(v.number()),
    paymentMethod: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Delete invoice
export const deleteInvoice = mutation({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
