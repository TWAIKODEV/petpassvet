
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  patients: defineTable({
    name: v.string(),
    species: v.string(),
    breed: v.string(),
    age: v.number(),
    weight: v.number(),
    owner: v.string(),
    ownerPhone: v.string(),
    ownerEmail: v.optional(v.string()),
    registrationDate: v.string(),
    status: v.string(),
  }),

  prescriptions: defineTable({
    number: v.string(),
    date: v.string(),
    patientId: v.id("patients"),
    veterinarian: v.string(),
    medications: v.array(v.object({
      id: v.string(),
      name: v.string(),
      dosage: v.string(),
      frequency: v.string(),
      duration: v.string(),
      instructions: v.string(),
    })),
    notes: v.string(),
    status: v.string(),
  }),

  threads: defineTable({
    contactId: v.string(),
    title: v.string(),
    lastMessageAt: v.string(),
    isUnread: v.boolean(),
    channel: v.string(),
  }),

  messages: defineTable({
    threadId: v.id("threads"),
    contactId: v.string(),
    content: v.string(),
    timestamp: v.string(),
    direction: v.string(),
    channel: v.string(),
    isRead: v.boolean(),
    attachments: v.optional(v.array(v.object({
      type: v.string(),
      url: v.string(),
      name: v.string(),
    }))),
  }),

  contacts: defineTable({
    handle: v.string(),
    channel: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
    isRegistered: v.boolean(),
    patientId: v.optional(v.id("patients")),
    metadata: v.optional(v.object({})),
  }),
});
