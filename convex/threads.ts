
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("threads").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    contactId: v.string(),
    title: v.string(),
    channel: v.string(),
  },
  handler: async (ctx, args) => {
    const lastMessageAt = new Date().toISOString();
    return await ctx.db.insert("threads", {
      ...args,
      lastMessageAt,
      isUnread: true,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("threads"),
    lastMessageAt: v.optional(v.string()),
    isUnread: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});
