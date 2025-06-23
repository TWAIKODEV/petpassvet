
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear un nuevo usuario
export const createUser = mutation({
  args: {
    employeeId: v.id("employees"),
    roleId: v.id("roles"),
    status: v.union(v.literal("active"), v.literal("inactive")),
    password: v.string(),
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

// Obtener todos los usuarios con información de empleado y rol
export const getUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").order("desc").collect();
    
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        const employee = await ctx.db.get(user.employeeId);
        const role = await ctx.db.get(user.roleId);
        
        return {
          ...user,
          employee,
          role,
        };
      })
    );

    return usersWithDetails;
  },
});

// Obtener usuario por empleado ID
export const getUserByEmployeeId = query({
  args: { employeeId: v.id("employees") },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_employee", (q) => q.eq("employeeId", args.employeeId))
      .first();
    
    if (!user) return null;
    
    const employee = await ctx.db.get(user.employeeId);
    const role = await ctx.db.get(user.roleId);
    
    return {
      ...user,
      employee,
      role,
    };
  },
});

// Obtener usuarios por rol
export const getUsersByRole = query({
  args: { roleId: v.id("roles") },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("roleId", args.roleId))
      .collect();
    
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        const employee = await ctx.db.get(user.employeeId);
        const role = await ctx.db.get(user.roleId);
        
        return {
          ...user,
          employee,
          role,
        };
      })
    );

    return usersWithDetails;
  },
});

// Obtener usuarios por estado
export const getUsersByStatus = query({
  args: { status: v.union(v.literal("active"), v.literal("inactive")) },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
    
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        const employee = await ctx.db.get(user.employeeId);
        const role = await ctx.db.get(user.roleId);
        
        return {
          ...user,
          employee,
          role,
        };
      })
    );

    return usersWithDetails;
  },
});

// Obtener un usuario por ID
export const getUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) return null;
    
    const employee = await ctx.db.get(user.employeeId);
    const role = await ctx.db.get(user.roleId);
    
    return {
      ...user,
      employee,
      role,
    };
  },
});

// Actualizar un usuario
export const updateUser = mutation({
  args: {
    id: v.id("users"),
    employeeId: v.optional(v.id("employees")),
    roleId: v.optional(v.id("roles")),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
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
