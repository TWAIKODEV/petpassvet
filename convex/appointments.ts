
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new appointment
export const createAppointment = mutation({
  args: {
    petName: v.string(),
    breed: v.string(),
    age: v.number(),
    sex: v.union(v.literal("male"), v.literal("female")),
    petProfileUrl: v.string(),
    consultationKind: v.union(
      v.literal("annualReview"),
      v.literal("followUp"),
      v.literal("checkUp"),
      v.literal("emergency"),
      v.literal("vaccination"),
      v.literal("surgery"),
      v.literal("dental"),
      v.literal("grooming"),
      v.literal("firstVisit"),
      v.literal("procedure")
    ),
    consultationType: v.union(v.literal("normal"), v.literal("insurance"), v.literal("emergency")),
    serviceType: v.union(v.literal("veterinary"), v.literal("grooming"), v.literal("rehabilitation"), v.literal("hospitalization")),
    patientId: v.id("patients"),
    doctorId: v.string(),
    date: v.string(),
    time: v.string(),
    duration: v.number(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("waiting"), v.literal("in_progress"), v.literal("completed"), v.literal("no_show"), v.literal("scheduled")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const appointmentId = await ctx.db.insert("appointments", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return appointmentId;
  },
});

// Get all appointments
export const getAppointments = query({
  handler: async (ctx) => {
    return await ctx.db.query("appointments").order("desc").collect();
  },
});

// Get appointment by ID
export const getAppointment = query({
  args: { id: v.id("appointments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get appointments by patient
export const getAppointmentsByPatient = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .collect();
  },
});

// Get appointments by date
export const getAppointmentsByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
  },
});

// Get appointments by status
export const getAppointmentsByStatus = query({
  args: { status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("waiting"), v.literal("in_progress"), v.literal("completed"), v.literal("no_show"), v.literal("scheduled")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appointments")
      .filter((q) => q.eq(q.field("status"), args.status))
      .collect();
  },
});

// Get today's appointments
export const getTodaysAppointments = query({
  handler: async (ctx) => {
    const today = new Date().toISOString().split('T')[0];
    return await ctx.db
      .query("appointments")
      .withIndex("by_date", (q) => q.eq("date", today))
      .collect();
  },
});

// Update appointment
export const updateAppointment = mutation({
  args: {
    id: v.id("appointments"),
    petName: v.optional(v.string()),
    breed: v.optional(v.string()),
    age: v.optional(v.number()),
    sex: v.optional(v.union(v.literal("male"), v.literal("female"))),
    petProfileUrl: v.optional(v.string()),
    consultationKind: v.optional(v.union(
      v.literal("annualReview"),
      v.literal("followUp"),
      v.literal("checkUp"),
      v.literal("emergency"),
      v.literal("vaccination"),
      v.literal("surgery"),
      v.literal("dental"),
      v.literal("grooming"),
      v.literal("firstVisit"),
      v.literal("procedure")
    )),
    consultationType: v.optional(v.union(v.literal("normal"), v.literal("insurance"), v.literal("emergency"))),
    serviceType: v.optional(v.union(v.literal("veterinary"), v.literal("grooming"), v.literal("rehabilitation"), v.literal("hospitalization"))),
    doctorId: v.optional(v.string()),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    duration: v.optional(v.number()),
    status: v.optional(v.union(v.literal("pending"), v.literal("confirmed"), v.literal("waiting"), v.literal("in_progress"), v.literal("completed"), v.literal("no_show"), v.literal("scheduled"))),
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

// Delete appointment
export const deleteAppointment = mutation({
  args: { id: v.id("appointments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
