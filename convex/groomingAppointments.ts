
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear una nueva cita de peluquería
export const createGroomingAppointment = mutation({
  args: {
    petName: v.string(),
    breed: v.string(),
    age: v.number(),
    sex: v.string(),
    petProfileUrl: v.string(),
    serviceType: v.string(),
    patientId: v.string(),
    groomerId: v.string(),
    date: v.string(),
    time: v.string(),
    duration: v.number(),
    status: v.string(),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const appointmentId = await ctx.db.insert("groomingAppointments", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return appointmentId;
  },
});

// Obtener todas las citas de peluquería
export const getGroomingAppointments = query({
  handler: async (ctx) => {
    return await ctx.db.query("groomingAppointments").order("desc").collect();
  },
});

// Obtener citas de peluquería por fecha
export const getGroomingAppointmentsByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("groomingAppointments")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
  },
});

// Obtener citas de peluquería por peluquero
export const getGroomingAppointmentsByGroomer = query({
  args: { groomerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("groomingAppointments")
      .withIndex("by_groomer", (q) => q.eq("groomerId", args.groomerId))
      .collect();
  },
});

// Obtener una cita de peluquería por ID
export const getGroomingAppointment = query({
  args: { id: v.id("groomingAppointments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Actualizar una cita de peluquería
export const updateGroomingAppointment = mutation({
  args: {
    id: v.id("groomingAppointments"),
    petName: v.optional(v.string()),
    breed: v.optional(v.string()),
    age: v.optional(v.number()),
    sex: v.optional(v.string()),
    petProfileUrl: v.optional(v.string()),
    serviceType: v.optional(v.string()),
    patientId: v.optional(v.string()),
    groomerId: v.optional(v.string()),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    duration: v.optional(v.number()),
    status: v.optional(v.string()),
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

// Eliminar una cita de peluquería
export const deleteGroomingAppointment = mutation({
  args: { id: v.id("groomingAppointments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
