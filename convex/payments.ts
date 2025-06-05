
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new payment
export const createPayment = mutation({
  args: {
    appointmentId: v.string(),
    patientId: v.id("patients"),
    amount: v.number(),
    date: v.string(),
    method: v.union(v.literal("cash"), v.literal("credit"), v.literal("debit"), v.literal("insurance"), v.literal("other")),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("refunded")),
    insuranceClaim: v.optional(v.object({
      provider: v.string(),
      claimNumber: v.string(),
      status: v.union(v.literal("submitted"), v.literal("processing"), v.literal("approved"), v.literal("denied")),
      approvedAmount: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const paymentId = await ctx.db.insert("payments", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return paymentId;
  },
});

// Get all payments
export const getPayments = query({
  handler: async (ctx) => {
    return await ctx.db.query("payments").order("desc").collect();
  },
});

// Get payment by ID
export const getPayment = query({
  args: { id: v.id("payments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get payments by patient
export const getPaymentsByPatient = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .collect();
  },
});

// Get payments by appointment
export const getPaymentsByAppointment = query({
  args: { appointmentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_appointment", (q) => q.eq("appointmentId", args.appointmentId))
      .collect();
  },
});

// Update payment
export const updatePayment = mutation({
  args: {
    id: v.id("payments"),
    appointmentId: v.optional(v.string()),
    patientId: v.optional(v.id("patients")),
    amount: v.optional(v.number()),
    date: v.optional(v.string()),
    method: v.optional(v.union(v.literal("cash"), v.literal("credit"), v.literal("debit"), v.literal("insurance"), v.literal("other"))),
    status: v.optional(v.union(v.literal("pending"), v.literal("completed"), v.literal("refunded"))),
    insuranceClaim: v.optional(v.object({
      provider: v.string(),
      claimNumber: v.string(),
      status: v.union(v.literal("submitted"), v.literal("processing"), v.literal("approved"), v.literal("denied")),
      approvedAmount: v.optional(v.number()),
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

// Delete payment
export const deletePayment = mutation({
  args: { id: v.id("payments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
