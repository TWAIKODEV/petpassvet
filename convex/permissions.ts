
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new permission
export const createPermission = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    description: v.string(),
    module: v.string(),
    action: v.union(v.literal("view"), v.literal("create"), v.literal("edit"), v.literal("delete"), v.literal("manage")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const permissionId = await ctx.db.insert("permissions", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return permissionId;
  },
});

// Get all permissions
export const getPermissions = query({
  handler: async (ctx) => {
    return await ctx.db.query("permissions").order("desc").collect();
  },
});

// Get permission by ID
export const getPermission = query({
  args: { id: v.id("permissions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get permissions by module
export const getPermissionsByModule = query({
  args: { module: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("permissions")
      .withIndex("by_module", (q) => q.eq("module", args.module))
      .collect();
  },
});

// Get permissions by action
export const getPermissionsByAction = query({
  args: { action: v.union(v.literal("view"), v.literal("create"), v.literal("edit"), v.literal("delete"), v.literal("manage")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("permissions")
      .withIndex("by_action", (q) => q.eq("action", args.action))
      .collect();
  },
});

// Update permission
export const updatePermission = mutation({
  args: {
    id: v.id("permissions"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    module: v.optional(v.string()),
    action: v.optional(v.union(v.literal("view"), v.literal("create"), v.literal("edit"), v.literal("delete"), v.literal("manage"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Delete permission
export const deletePermission = mutation({
  args: { id: v.id("permissions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
