
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new category
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

// Get all categories
export const getCategories = query({
  handler: async (ctx) => {
    return await ctx.db.query("categories").order("desc").collect();
  },
});

// Get category by ID
export const getCategory = query({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get subcategories by parent
export const getSubcategories = query({
  args: { parentCategoryId: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_parent", (q) => q.eq("parentCategoryId", args.parentCategoryId))
      .collect();
  },
});

// Get root categories (no parent)
export const getRootCategories = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("parentCategoryId"), undefined))
      .collect();
  },
});

// Update category
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

// Delete category
export const deleteCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
