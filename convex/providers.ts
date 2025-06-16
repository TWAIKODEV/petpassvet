
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createProvider = mutation({
  args: {
    name: v.string(),
    area: v.union(v.literal("productos"), v.literal("servicios"), v.literal("medicamentos")),
    cif: v.string(),
    contactName: v.string(),
    position: v.optional(v.string()),
    email: v.string(),
    phone: v.string(),
    mobile: v.optional(v.string()),
    address: v.string(),
    postalCode: v.string(),
    city: v.string(),
    province: v.string(),
    country: v.string(),
    website: v.optional(v.string()),
    paymentMethod: v.string(),
    bankAccount: v.optional(v.string()),
    vatNumber: v.optional(v.string()),
    currency: v.string(),
    paymentTerms: v.string(),
    minimumOrder: v.optional(v.number()),
    shippingMethod: v.string(),
    deliveryTime: v.string(),
    shippingCost: v.number(),
    freeShippingThreshold: v.optional(v.number()),
    returnPolicy: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const providerId = await ctx.db.insert("providers", {
      ...args,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });

    return providerId;
  },
});

export const getProviders = query({
  handler: async (ctx) => {
    const providers = await ctx.db.query("providers").order("desc").collect();
    return providers;
  },
});

export const getProvider = query({
  args: { id: v.id("providers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateProvider = mutation({
  args: {
    id: v.id("providers"),
    name: v.optional(v.string()),
    area: v.optional(v.union(v.literal("productos"), v.literal("servicios"), v.literal("medicamentos"))),
    cif: v.optional(v.string()),
    contactName: v.optional(v.string()),
    position: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    mobile: v.optional(v.string()),
    address: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    city: v.optional(v.string()),
    province: v.optional(v.string()),
    country: v.optional(v.string()),
    website: v.optional(v.string()),
    paymentMethod: v.optional(v.string()),
    bankAccount: v.optional(v.string()),
    vatNumber: v.optional(v.string()),
    currency: v.optional(v.string()),
    paymentTerms: v.optional(v.string()),
    minimumOrder: v.optional(v.number()),
    shippingMethod: v.optional(v.string()),
    deliveryTime: v.optional(v.string()),
    shippingCost: v.optional(v.number()),
    freeShippingThreshold: v.optional(v.number()),
    returnPolicy: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

export const deleteProvider = mutation({
  args: { id: v.id("providers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getProvidersByArea = query({
  args: { area: v.union(v.literal("productos"), v.literal("servicios"), v.literal("medicamentos")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("providers")
      .withIndex("by_area", (q) => q.eq("area", args.area))
      .collect();
  },
});

export const searchProviders = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const providers = await ctx.db.query("providers").collect();
    
    return providers.filter(provider => 
      provider.name.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
      provider.contactName.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
      provider.phone.includes(args.searchTerm)
    );
  },
});
