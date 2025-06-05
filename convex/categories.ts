
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear una nueva categoría
export const createCategory = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    parentCategoryId: v.optional(v.id("categories")),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const categoryId = await ctx.db.insert("categories", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return categoryId;
  },
});

// Obtener todas las categorías
export const getCategories = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").order("desc").collect();
  },
});

// Obtener categorías padre (sin parent)
export const getParentCategories = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("parentCategoryId"), undefined))
      .collect();
  },
});

// Obtener subcategorías por categoría padre
export const getSubcategoriesByParent = query({
  args: { parentCategoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_parent", (q) => q.eq("parentCategoryId", args.parentCategoryId))
      .collect();
  },
});

// Obtener una categoría por ID
export const getCategory = query({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Actualizar una categoría
export const updateCategory = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    parentCategoryId: v.optional(v.id("categories")),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Eliminar una categoría
export const deleteCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
