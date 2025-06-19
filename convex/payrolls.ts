
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPayroll = mutation({
  args: {
    employeeId: v.id("employees"),
    periodo: v.number(),
    importeNeto: v.number(),
    fechaEmision: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const payrollId = await ctx.db.insert("payrolls", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    return payrollId;
  },
});

export const getPayrolls = query({
  handler: async (ctx) => {
    return await ctx.db.query("payrolls").order("desc").collect();
  },
});

export const getPayrollsByEmployee = query({
  args: { employeeId: v.id("employees") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payrolls")
      .withIndex("by_employee", (q) => q.eq("employeeId", args.employeeId))
      .order("desc")
      .collect();
  },
});

export const getPayroll = query({
  args: { id: v.id("payrolls") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updatePayroll = mutation({
  args: {
    id: v.id("payrolls"),
    periodo: v.optional(v.number()),
    importeNeto: v.optional(v.number()),
    fechaEmision: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

export const deletePayroll = mutation({
  args: { id: v.id("payrolls") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getPayrollsByPeriod = query({
  args: { periodo: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payrolls")
      .withIndex("by_periodo", (q) => q.eq("periodo", args.periodo))
      .collect();
  },
});

// Utility function to get period name
export const getPeriodName = (periodo: number): string => {
  if (periodo >= 1 && periodo <= 12) {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[periodo - 1];
  } else if (periodo === 13) {
    return 'Paga Extra Verano';
  } else if (periodo === 14) {
    return 'Paga Extra Navidad';
  }
  return 'Periodo desconocido';
};
