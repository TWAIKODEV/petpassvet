
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createEmployee = mutation({
  args: {
    nombre: v.string(),
    apellidos: v.string(),
    fechaNacimiento: v.string(),
    genero: v.union(v.literal("masculino"), v.literal("femenino"), v.literal("otro")),
    email: v.string(),
    dni: v.string(),
    numeroSeguridadSocial: v.string(),
    telefono: v.string(),
    formacionAcademica: v.array(v.string()),
    titulos: v.array(v.string()),
    tipoContrato: v.string(),
    jornadaLaboral: v.string(),
    scheduleIds: v.array(v.id("schedules")),
    trabajoFinesSemana: v.boolean(),
    turnoNoche: v.boolean(),
    puesto: v.string(),
    departamento: v.union(v.literal("veterinaria"), v.literal("peluqueria"), v.literal("administracion")),
    salarioBase: v.number(),
    pagas: v.number(),
    diasVacaciones: v.number(),
    convenioColectivo: v.string(),
    periodoPrueba: v.string(),
    centroTrabajo: v.string(),
    modalidad: v.union(v.literal("presencial"), v.literal("teletrabajo"), v.literal("hibrida")),
    fechaInicio: v.string(),
    notas: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const employeeId = await ctx.db.insert("employees", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    return employeeId;
  },
});

export const getEmployees = query({
  handler: async (ctx) => {
    const employees = await ctx.db.query("employees").order("desc").collect();
    
    // Get schedules for each employee
    const employeesWithSchedules = await Promise.all(
      employees.map(async (employee) => {
        const schedules = await Promise.all(
          employee.scheduleIds.map(async (scheduleId) => {
            return await ctx.db.get(scheduleId);
          })
        );
        
        return {
          ...employee,
          schedules: schedules.filter(schedule => schedule !== null),
        };
      })
    );

    return employeesWithSchedules;
  },
});

export const getEmployee = query({
  args: { id: v.id("employees") },
  handler: async (ctx, args) => {
    const employee = await ctx.db.get(args.id);
    if (!employee) return null;

    // Get schedules
    const schedules = await Promise.all(
      employee.scheduleIds.map(async (scheduleId) => {
        return await ctx.db.get(scheduleId);
      })
    );

    return {
      ...employee,
      schedules: schedules.filter(schedule => schedule !== null),
    };
  },
});

export const updateEmployee = mutation({
  args: {
    id: v.id("employees"),
    nombre: v.optional(v.string()),
    apellidos: v.optional(v.string()),
    fechaNacimiento: v.optional(v.string()),
    genero: v.optional(v.union(v.literal("masculino"), v.literal("femenino"), v.literal("otro"))),
    email: v.optional(v.string()),
    dni: v.optional(v.string()),
    numeroSeguridadSocial: v.optional(v.string()),
    telefono: v.optional(v.string()),
    formacionAcademica: v.optional(v.array(v.string())),
    titulos: v.optional(v.array(v.string())),
    tipoContrato: v.optional(v.string()),
    jornadaLaboral: v.optional(v.string()),
    scheduleIds: v.optional(v.array(v.id("schedules"))),
    trabajoFinesSemana: v.optional(v.boolean()),
    turnoNoche: v.optional(v.boolean()),
    puesto: v.optional(v.string()),
    departamento: v.optional(v.union(v.literal("veterinaria"), v.literal("peluqueria"), v.literal("administracion"))),
    salarioBase: v.optional(v.number()),
    pagas: v.optional(v.number()),
    diasVacaciones: v.optional(v.number()),
    convenioColectivo: v.optional(v.string()),
    periodoPrueba: v.optional(v.string()),
    centroTrabajo: v.optional(v.string()),
    modalidad: v.optional(v.union(v.literal("presencial"), v.literal("teletrabajo"), v.literal("hibrida"))),
    fechaInicio: v.optional(v.string()),
    notas: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

export const deleteEmployee = mutation({
  args: { id: v.id("employees") },
  handler: async (ctx, args) => {
    // Delete associated payrolls first
    const payrolls = await ctx.db
      .query("payrolls")
      .withIndex("by_employee", (q) => q.eq("employeeId", args.id))
      .collect();

    for (const payroll of payrolls) {
      await ctx.db.delete(payroll._id);
    }

    // Delete employee
    await ctx.db.delete(args.id);
  },
});

export const getEmployeeByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("employees")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const getEmployeesByDepartment = query({
  args: { departamento: v.union(v.literal("veterinaria"), v.literal("peluqueria"), v.literal("administracion")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("employees")
      .withIndex("by_departamento", (q) => q.eq("departamento", args.departamento))
      .collect();
  },
});
