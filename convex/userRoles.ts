
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear un nuevo rol de usuario
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
    const userRoleId = await ctx.db.insert("userRoles", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return userRoleId;
  },
});

// Obtener todos los roles de usuario
export const getUserRoles = query({
  handler: async (ctx) => {
    return await ctx.db.query("userRoles").order("desc").collect();
  },
});

// Obtener rol por nombre
export const getUserRoleByName = query({
  args: { name: v.union(v.literal("admin"), v.literal("manager"), v.literal("veterinarian"), v.literal("vet_assistant"), v.literal("receptionist"), v.literal("groomer")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userRoles")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
  },
});

// Obtener un rol por ID
export const getUserRole = query({
  args: { id: v.id("userRoles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Actualizar un rol de usuario
export const updateUserRole = mutation({
  args: {
    id: v.id("userRoles"),
    roleId: v.optional(v.string()),
    name: v.optional(v.union(v.literal("admin"), v.literal("manager"), v.literal("veterinarian"), v.literal("vet_assistant"), v.literal("receptionist"), v.literal("groomer"))),
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

// Eliminar un rol de usuario
export const deleteUserRole = mutation({
  args: { id: v.id("userRoles") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
