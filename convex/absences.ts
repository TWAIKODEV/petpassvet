
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new absence
export const createAbsence = mutation({
  args: {
    employeeId: v.id("employees"),
    type: v.union(
      v.literal("vacation"),
      v.literal("sick_leave"),
      v.literal("personal"),
      v.literal("half_day"),
      v.literal("training"),
      v.literal("maternity"),
      v.literal("paternity"),
      v.literal("other")
    ),
    description: v.string(),
    startDate: v.string(),
    endDate: v.optional(v.string()),
    approved: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const absenceId = await ctx.db.insert("absences", {
      employeeId: args.employeeId,
      type: args.type,
      description: args.description,
      startDate: args.startDate,
      endDate: args.endDate,
      approved: args.approved ?? false, // Default to false (pending)
      createdAt: now,
      updatedAt: now,
    });

    return absenceId;
  },
});

// Get all absences with employee information
export const getAbsences = query({
  handler: async (ctx) => {
    const absences = await ctx.db.query("absences").order("desc").collect();

    // Get employee information for each absence
    const absencesWithEmployees = await Promise.all(
      absences.map(async (absence) => {
        const employee = await ctx.db.get(absence.employeeId);
        return {
          ...absence,
          employee: employee ? {
            firstName: employee.firstName,
            lastName: employee.lastName,
            department: employee.department,
            position: employee.position,
          } : null,
        };
      })
    );

    return absencesWithEmployees;
  },
});

// Get absences by employee
export const getAbsencesByEmployee = query({
  args: { employeeId: v.id("employees") },
  handler: async (ctx, args) => {
    const absences = await ctx.db
      .query("absences")
      .withIndex("by_employee", (q) => q.eq("employeeId", args.employeeId))
      .order("desc")
      .collect();

    return absences;
  },
});

// Update an absence
export const updateAbsence = mutation({
  args: {
    id: v.id("absences"),
    type: v.optional(v.union(
      v.literal("vacation"),
      v.literal("sick_leave"),
      v.literal("personal"),
      v.literal("half_day"),
      v.literal("training"),
      v.literal("maternity"),
      v.literal("paternity"),
      v.literal("other")
    )),
    description: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    approved: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Delete an absence
export const deleteAbsence = mutation({
  args: { id: v.id("absences") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Approve/reject an absence
export const updateAbsenceApproval = mutation({
  args: {
    id: v.id("absences"),
    approved: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      approved: args.approved,
      updatedAt: Date.now(),
    });
  },
});
