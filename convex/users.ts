
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear un nuevo usuario
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    roleId: v.string(),
    department: v.string(),
    position: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    lastLogin: v.optional(v.string()),
    avatar: v.optional(v.string()),
    customPermissionIds: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return userId;
  },
});

// Obtener todos los usuarios
export const getUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").order("desc").collect();
  },
});

// Obtener usuario por email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Obtener usuarios por rol
export const getUsersByRole = query({
  args: { roleId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("roleId", args.roleId))
      .collect();
  },
});

// Obtener usuarios por estado
export const getUsersByStatus = query({
  args: { status: v.union(v.literal("active"), v.literal("inactive")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Obtener un usuario por ID
export const getUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Actualizar un usuario
export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    roleId: v.optional(v.string()),
    department: v.optional(v.string()),
    position: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    lastLogin: v.optional(v.string()),
    avatar: v.optional(v.string()),
    customPermissionIds: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Actualizar último login
export const updateLastLogin = mutation({
  args: {
    id: v.id("users"),
    lastLogin: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      lastLogin: args.lastLogin,
      updatedAt: Date.now(),
    });
  },
});

// Eliminar un usuario
export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
