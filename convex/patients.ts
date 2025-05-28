
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("patients").collect();
  },
});

export const get = query({
  args: { id: v.id("patients") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    species: v.string(),
    breed: v.string(),
    age: v.number(),
    weight: v.number(),
    owner: v.string(),
    ownerPhone: v.string(),
    ownerEmail: v.optional(v.string()),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const registrationDate = new Date().toISOString();
    return await ctx.db.insert("patients", {
      ...args,
      registrationDate,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("patients"),
    name: v.optional(v.string()),
    species: v.optional(v.string()),
    breed: v.optional(v.string()),
    age: v.optional(v.number()),
    weight: v.optional(v.number()),
    owner: v.optional(v.string()),
    ownerPhone: v.optional(v.string()),
    ownerEmail: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});
