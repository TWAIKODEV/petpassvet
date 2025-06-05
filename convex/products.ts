
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear un nuevo producto
export const createProduct = mutation({
  args: {
    name: v.string(),
    categoryId: v.id("categories"),
    subcategoryId: v.optional(v.id("categories")),
    description: v.optional(v.string()),
    price: v.number(),
    cost: v.optional(v.number()),
    discountPrice: v.optional(v.number()),
    stock: v.optional(v.number()),
    minStock: v.optional(v.number()),
    sku: v.optional(v.string()),
    barcode: v.optional(v.string()),
    brand: v.optional(v.string()),
    supplier: v.optional(v.string()),
    location: v.optional(v.string()),
    lastUpdated: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    rating: v.optional(v.number()),
    reviews: v.optional(v.number()),
    images: v.optional(v.array(v.string())),
    status: v.string(),
    area: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
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

// Obtener todos los productos
export const getProducts = query({
  handler: async (ctx) => {
    return await ctx.db.query("products").order("desc").collect();
  },
});

// Obtener productos por categoría
export const getProductsByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .collect();
  },
});

// Obtener producto por SKU
export const getProductBySku = query({
  args: { sku: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_sku", (q) => q.eq("sku", args.sku))
      .first();
  },
});

// Obtener un producto por ID
export const getProduct = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Obtener productos destacados
export const getFeaturedProducts = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("featured"), true))
      .collect();
  },
});

// Actualizar un producto
export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    subcategoryId: v.optional(v.id("categories")),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    cost: v.optional(v.number()),
    discountPrice: v.optional(v.number()),
    stock: v.optional(v.number()),
    minStock: v.optional(v.number()),
    sku: v.optional(v.string()),
    barcode: v.optional(v.string()),
    brand: v.optional(v.string()),
    supplier: v.optional(v.string()),
    location: v.optional(v.string()),
    lastUpdated: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    rating: v.optional(v.number()),
    reviews: v.optional(v.number()),
    images: v.optional(v.array(v.string())),
    status: v.optional(v.string()),
    area: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Actualizar stock del producto
export const updateProductStock = mutation({
  args: {
    id: v.id("products"),
    stock: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      stock: args.stock,
      updatedAt: Date.now(),
    });
  },
});

// Eliminar un producto
export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
