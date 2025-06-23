
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new role
export const createRole = mutation({
  args: {
    name: v.string(),
    displayName: v.string(),
    description: v.string(),
    isEditable: v.boolean(),
    permissions: v.object({
      dashboard: v.object({
        view: v.boolean(),
      }),
      inbox: v.object({
        view: v.boolean(),
        reply: v.boolean(),
      }),
      agenda: v.object({
        view: v.boolean(),
        create: v.boolean(),
        edit: v.boolean(),
        delete: v.boolean(),
      }),
      clientes: v.object({
        view: v.boolean(),
        create: v.boolean(),
        edit: v.boolean(),
        delete: v.boolean(),
      }),
      oportunidades: v.object({
        view: v.boolean(),
        create: v.boolean(),
        edit: v.boolean(),
      }),
      consultorio: v.object({
        view: v.boolean(),
        create: v.boolean(),
        edit: v.boolean(),
      }),
      peluqueria: v.object({
        view: v.boolean(),
        create: v.boolean(),
        edit: v.boolean(),
      }),
      tienda: v.object({
        view: v.boolean(),
        create: v.boolean(),
        edit: v.boolean(),
      }),
      ventas: v.object({
        view: v.boolean(),
        create: v.boolean(),
      }),
      compras: v.object({
        view: v.boolean(),
        create: v.boolean(),
      }),
      marketing: v.object({
        view: v.boolean(),
        edit: v.boolean(),
      }),
      rrhh: v.object({
        view: v.boolean(),
        edit: v.boolean(),
      }),
      erp: v.object({
        view: v.boolean(),
        edit: v.boolean(),
      }),
      informes: v.object({
        view: v.boolean(),
      }),
      administracion: v.object({
        view: v.boolean(),
        edit: v.boolean(),
      }),
    }),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const roleId = await ctx.db.insert("roles", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return roleId;
  },
});

// Get all roles
export const getRoles = query({
  handler: async (ctx) => {
    return await ctx.db.query("roles").order("desc").collect();
  },
});

// Get role by ID
export const getRole = query({
  args: { id: v.id("roles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get role by name
export const getRoleByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("roles")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
  },
});

// Update a role
export const updateRole = mutation({
  args: {
    id: v.id("roles"),
    name: v.optional(v.string()),
    displayName: v.optional(v.string()),
    description: v.optional(v.string()),
    isEditable: v.optional(v.boolean()),
    permissions: v.optional(v.object({
      dashboard: v.object({
        view: v.boolean(),
      }),
      inbox: v.object({
        view: v.boolean(),
        reply: v.boolean(),
      }),
      agenda: v.object({
        view: v.boolean(),
        create: v.boolean(),
        edit: v.boolean(),
        delete: v.boolean(),
      }),
      clientes: v.object({
        view: v.boolean(),
        create: v.boolean(),
        edit: v.boolean(),
        delete: v.boolean(),
      }),
      oportunidades: v.object({
        view: v.boolean(),
        create: v.boolean(),
        edit: v.boolean(),
      }),
      consultorio: v.object({
        view: v.boolean(),
        create: v.boolean(),
        edit: v.boolean(),
      }),
      peluqueria: v.object({
        view: v.boolean(),
        create: v.boolean(),
        edit: v.boolean(),
      }),
      tienda: v.object({
        view: v.boolean(),
        create: v.boolean(),
        edit: v.boolean(),
      }),
      ventas: v.object({
        view: v.boolean(),
        create: v.boolean(),
      }),
      compras: v.object({
        view: v.boolean(),
        create: v.boolean(),
      }),
      marketing: v.object({
        view: v.boolean(),
        edit: v.boolean(),
      }),
      rrhh: v.object({
        view: v.boolean(),
        edit: v.boolean(),
      }),
      erp: v.object({
        view: v.boolean(),
        edit: v.boolean(),
      }),
      informes: v.object({
        view: v.boolean(),
      }),
      administracion: v.object({
        view: v.boolean(),
        edit: v.boolean(),
      }),
    })),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Delete a role
export const deleteRole = mutation({
  args: { id: v.id("roles") },
  handler: async (ctx, args) => {
    const role = await ctx.db.get(args.id);
    if (!role || !role.isEditable) {
      throw new Error("Cannot delete system roles");
    }
    await ctx.db.delete(args.id);
  },
});

// Initialize default roles
export const initializeDefaultRoles = mutation({
  handler: async (ctx) => {
    const existingRoles = await ctx.db.query("roles").collect();
    if (existingRoles.length > 0) {
      return; // Roles already initialized
    }

    const now = Date.now();
    
    // Admin role
    await ctx.db.insert("roles", {
      name: "admin",
      displayName: "Administrador",
      description: "Acceso completo a todas las funcionalidades del sistema",
      isEditable: false,
      permissions: {
        dashboard: { view: true },
        inbox: { view: true, reply: true },
        agenda: { view: true, create: true, edit: true, delete: true },
        clientes: { view: true, create: true, edit: true, delete: true },
        oportunidades: { view: true, create: true, edit: true },
        consultorio: { view: true, create: true, edit: true },
        peluqueria: { view: true, create: true, edit: true },
        tienda: { view: true, create: true, edit: true },
        ventas: { view: true, create: true },
        compras: { view: true, create: true },
        marketing: { view: true, edit: true },
        rrhh: { view: true, edit: true },
        erp: { view: true, edit: true },
        informes: { view: true },
        administracion: { view: true, edit: true },
      },
      createdAt: now,
      updatedAt: now,
    });

    // Manager role
    await ctx.db.insert("roles", {
      name: "manager",
      displayName: "Manager",
      description: "Gestión de la clínica sin acceso a configuración avanzada",
      isEditable: true,
      permissions: {
        dashboard: { view: true },
        inbox: { view: true, reply: true },
        agenda: { view: true, create: true, edit: true, delete: true },
        clientes: { view: true, create: true, edit: true, delete: true },
        oportunidades: { view: true, create: true, edit: true },
        consultorio: { view: true, create: true, edit: true },
        peluqueria: { view: true, create: true, edit: true },
        tienda: { view: true, create: true, edit: true },
        ventas: { view: true, create: true },
        compras: { view: true, create: true },
        marketing: { view: true, edit: true },
        rrhh: { view: true, edit: true },
        erp: { view: true, edit: true },
        informes: { view: true },
        administracion: { view: true, edit: false },
      },
      createdAt: now,
      updatedAt: now,
    });

    // Veterinarian role
    await ctx.db.insert("roles", {
      name: "veterinarian",
      displayName: "Veterinario",
      description: "Acceso a historiales médicos y gestión de citas",
      isEditable: true,
      permissions: {
        dashboard: { view: true },
        inbox: { view: true, reply: true },
        agenda: { view: true, create: true, edit: true, delete: false },
        clientes: { view: true, create: true, edit: true, delete: false },
        oportunidades: { view: false, create: false, edit: false },
        consultorio: { view: true, create: true, edit: true },
        peluqueria: { view: true, create: false, edit: false },
        tienda: { view: true, create: false, edit: false },
        ventas: { view: false, create: false },
        compras: { view: false, create: false },
        marketing: { view: false, edit: false },
        rrhh: { view: true, edit: false },
        erp: { view: false, edit: false },
        informes: { view: true },
        administracion: { view: false, edit: false },
      },
      createdAt: now,
      updatedAt: now,
    });

    // Vet Assistant role
    await ctx.db.insert("roles", {
      name: "vet_assistant",
      displayName: "Asistente Veterinario",
      description: "Apoyo a veterinarios con acceso limitado",
      isEditable: true,
      permissions: {
        dashboard: { view: true },
        inbox: { view: true, reply: false },
        agenda: { view: true, create: true, edit: true, delete: false },
        clientes: { view: true, create: true, edit: false, delete: false },
        oportunidades: { view: false, create: false, edit: false },
        consultorio: { view: true, create: false, edit: false },
        peluqueria: { view: true, create: false, edit: false },
        tienda: { view: true, create: false, edit: false },
        ventas: { view: false, create: false },
        compras: { view: false, create: false },
        marketing: { view: false, edit: false },
        rrhh: { view: true, edit: false },
        erp: { view: false, edit: false },
        informes: { view: false },
        administracion: { view: false, edit: false },
      },
      createdAt: now,
      updatedAt: now,
    });

    // Receptionist role
    await ctx.db.insert("roles", {
      name: "receptionist",
      displayName: "Auxiliar Oficina",
      description: "Gestión de citas y atención al cliente",
      isEditable: true,
      permissions: {
        dashboard: { view: true },
        inbox: { view: true, reply: true },
        agenda: { view: true, create: true, edit: true, delete: false },
        clientes: { view: true, create: true, edit: true, delete: false },
        oportunidades: { view: true, create: true, edit: true },
        consultorio: { view: false, create: false, edit: false },
        peluqueria: { view: true, create: true, edit: true },
        tienda: { view: true, create: true, edit: true },
        ventas: { view: true, create: true },
        compras: { view: false, create: false },
        marketing: { view: false, edit: false },
        rrhh: { view: true, edit: false },
        erp: { view: false, edit: false },
        informes: { view: false },
        administracion: { view: false, edit: false },
      },
      createdAt: now,
      updatedAt: now,
    });

    // Groomer role
    await ctx.db.insert("roles", {
      name: "groomer",
      displayName: "Peluquero",
      description: "Gestión de servicios de peluquería",
      isEditable: true,
      permissions: {
        dashboard: { view: true },
        inbox: { view: false, reply: false },
        agenda: { view: true, create: true, edit: false, delete: false },
        clientes: { view: true, create: false, edit: false, delete: false },
        oportunidades: { view: false, create: false, edit: false },
        consultorio: { view: false, create: false, edit: false },
        peluqueria: { view: true, create: true, edit: true },
        tienda: { view: false, create: false, edit: false },
        ventas: { view: false, create: false },
        compras: { view: false, create: false },
        marketing: { view: false, edit: false },
        rrhh: { view: true, edit: false },
        erp: { view: false, edit: false },
        informes: { view: false },
        administracion: { view: false, edit: false },
      },
      createdAt: now,
      updatedAt: now,
    });
  },
});
