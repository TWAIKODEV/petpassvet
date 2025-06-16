
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createService = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    basePrice: v.number(),
    vat: v.number(),
    cost: v.number(),
    margin: v.number(),
    duration: v.number(),
    isActive: v.boolean(),
    providerId: v.optional(v.id("providers")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const serviceId = await ctx.db.insert("services", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    return serviceId;
  },
});

export const getServices = query({
  handler: async (ctx) => {
    const services = await ctx.db.query("services").order("desc").collect();
    
    // Get provider information for each service
    const servicesWithProviders = await Promise.all(
      services.map(async (service) => {
        let provider = null;
        if (service.providerId) {
          provider = await ctx.db.get(service.providerId);
        }
        return {
          ...service,
          provider: provider,
        };
      })
    );

    return servicesWithProviders;
  },
});

export const getService = query({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    const service = await ctx.db.get(args.id);
    if (!service) return null;

    let provider = null;
    if (service.providerId) {
      provider = await ctx.db.get(service.providerId);
    }

    return {
      ...service,
      provider: provider,
    };
  },
});

export const updateService = mutation({
  args: {
    id: v.id("services"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    basePrice: v.optional(v.number()),
    vat: v.optional(v.number()),
    cost: v.optional(v.number()),
    margin: v.optional(v.number()),
    duration: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    providerId: v.optional(v.id("providers")),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

export const deleteService = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getServicesByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("services")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const getActiveServices = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("services")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});
