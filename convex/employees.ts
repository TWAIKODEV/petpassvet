
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createEmployee = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    birthDate: v.string(),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
    email: v.string(),
    documentId: v.string(),
    socialSecurityNumber: v.string(),
    phone: v.string(),
    academicEducation: v.array(v.string()),
    degrees: v.array(v.string()),
    contractType: v.string(),
    workSchedule: v.string(),
    scheduleIds: v.array(v.id("schedules")),
    weekendWork: v.boolean(),
    nightShift: v.boolean(),
    position: v.string(),
    department: v.union(v.literal("veterinary"), v.literal("grooming"), v.literal("administration")),
    baseSalary: v.number(),
    paymentPeriods: v.number(),
    vacationDays: v.number(),
    collectiveAgreement: v.string(),
    probationPeriod: v.string(),
    workCenter: v.string(),
    workMode: v.union(v.literal("onsite"), v.literal("remote"), v.literal("hybrid")),
    startDate: v.string(),
    notes: v.optional(v.string()),
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
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    birthDate: v.optional(v.string()),
    gender: v.optional(v.union(v.literal("male"), v.literal("female"), v.literal("other"))),
    email: v.optional(v.string()),
    documentId: v.optional(v.string()),
    socialSecurityNumber: v.optional(v.string()),
    phone: v.optional(v.string()),
    academicEducation: v.optional(v.array(v.string())),
    degrees: v.optional(v.array(v.string())),
    contractType: v.optional(v.string()),
    workSchedule: v.optional(v.string()),
    scheduleIds: v.optional(v.array(v.id("schedules"))),
    weekendWork: v.optional(v.boolean()),
    nightShift: v.optional(v.boolean()),
    position: v.optional(v.string()),
    department: v.optional(v.union(v.literal("veterinary"), v.literal("grooming"), v.literal("administration"))),
    baseSalary: v.optional(v.number()),
    paymentPeriods: v.optional(v.number()),
    vacationDays: v.optional(v.number()),
    collectiveAgreement: v.optional(v.string()),
    probationPeriod: v.optional(v.string()),
    workCenter: v.optional(v.string()),
    workMode: v.optional(v.union(v.literal("onsite"), v.literal("remote"), v.literal("hybrid"))),
    startDate: v.optional(v.string()),
    notes: v.optional(v.string()),
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
  args: { department: v.union(v.literal("veterinary"), v.literal("grooming"), v.literal("administration")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("employees")
      .withIndex("by_department", (q) => q.eq("department", args.department))
      .collect();
  },
});
