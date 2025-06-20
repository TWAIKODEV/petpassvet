
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPayroll = mutation({
  args: {
    employeeId: v.id("employees"),
    period: v.number(),
    netAmount: v.number(),
    issueDate: v.string(),
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
    period: v.optional(v.number()),
    netAmount: v.optional(v.number()),
    issueDate: v.optional(v.string()),
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
  args: { period: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payrolls")
      .withIndex("by_period", (q) => q.eq("period", args.period))
      .collect();
  },
});

// Utility function to get period name
export const getPeriodName = (period: number): string => {
  if (period >= 1 && period <= 12) {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[period - 1];
  } else if (period === 13) {
    return 'Paga Extra Verano';
  } else if (period === 14) {
    return 'Paga Extra Navidad';
  }
  return 'Periodo desconocido';
};
