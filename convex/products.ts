
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createProduct = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    basePrice: v.number(),
    vat: v.number(),
    cost: v.number(),
    margin: v.number(),
    reference: v.optional(v.string()),
    barcode: v.optional(v.string()),
    currentStock: v.number(),
    minStock: v.number(),
    isActive: v.boolean(),
    providerId: v.optional(v.id("providers")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const productId = await ctx.db.insert("products", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    return productId;
  },
});

export const getProducts = query({
  handler: async (ctx) => {
    const products = await ctx.db.query("products").order("desc").collect();
    
    // Get provider information for each product
    const productsWithProviders = await Promise.all(
      products.map(async (product) => {
        let provider = null;
        if (product.providerId) {
          provider = await ctx.db.get(product.providerId);
        }
        return {
          ...product,
          provider: provider,
        };
      })
    );

    return productsWithProviders;
  },
});

export const getProduct = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) return null;

    let provider = null;
    if (product.providerId) {
      provider = await ctx.db.get(product.providerId);
    }

    return {
      ...product,
      provider: provider,
    };
  },
});

export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    basePrice: v.optional(v.number()),
    vat: v.optional(v.number()),
    cost: v.optional(v.number()),
    margin: v.optional(v.number()),
    reference: v.optional(v.string()),
    barcode: v.optional(v.string()),
    currentStock: v.optional(v.number()),
    minStock: v.optional(v.number()),
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

export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getProductsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const getActiveProducts = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});
