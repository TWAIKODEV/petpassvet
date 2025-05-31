
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  patients: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    birthDate: v.optional(v.string()),
    gender: v.optional(v.string()),
    emergencyContact: v.optional(v.object({
      name: v.string(),
      phone: v.string(),
      relationship: v.string(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  pets: defineTable({
    patientId: v.id("patients"),
    name: v.string(),
    species: v.string(),
    breed: v.optional(v.string()),
    age: v.optional(v.number()),
    weight: v.optional(v.number()),
    color: v.optional(v.string()),
    microchip: v.optional(v.string()),
    vaccinations: v.optional(v.array(v.object({
      vaccine: v.string(),
      date: v.string(),
      nextDue: v.string(),
    }))),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_patient", ["patientId"]),

  appointments: defineTable({
    patientId: v.id("patients"),
    petId: v.optional(v.id("pets")),
    date: v.string(),
    time: v.string(),
    service: v.string(),
    veterinarian: v.string(),
    status: v.string(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_patient", ["patientId"]).index("by_date", ["date"]),

  prescriptions: defineTable({
    patientId: v.id("patients"),
    petId: v.optional(v.id("pets")),
    veterinarian: v.string(),
    medications: v.array(v.object({
      name: v.string(),
      dosage: v.string(),
      frequency: v.string(),
      duration: v.string(),
      instructions: v.optional(v.string()),
    })),
    diagnosis: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_patient", ["patientId"]),
});
