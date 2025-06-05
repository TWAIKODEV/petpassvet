
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new user role
export const createUserRole = mutation({
  args: {
    id: v.string(),
    name: v.union(v.literal("admin"), v.literal("manager"), v.literal("veterinarian"), v.literal("vet_assistant"), v.literal("receptionist"), v.literal("groomer")),
    displayName: v.string(),
    permissionIds: v.array(v.string()),
    isEditable: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const roleId = await ctx.db.insert("userRoles", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return roleId;
  },
});

// Get all user roles
export const getUserRoles = query({
  handler: async (ctx) => {
    return await ctx.db.query("userRoles").order("desc").collect();
  },
});

// Get user role by ID
export const getUserRole = query({
  args: { id: v.id("userRoles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get user role by name
export const getUserRoleByName = query({
  args: { name: v.union(v.literal("admin"), v.literal("manager"), v.literal("veterinarian"), v.literal("vet_assistant"), v.literal("receptionist"), v.literal("groomer")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userRoles")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
  },
});

// Update user role
export const updateUserRole = mutation({
  args: {
    id: v.id("userRoles"),
    displayName: v.optional(v.string()),
    permissionIds: v.optional(v.array(v.string())),
    isEditable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Delete user role
export const deleteUserRole = mutation({
  args: { id: v.id("userRoles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
