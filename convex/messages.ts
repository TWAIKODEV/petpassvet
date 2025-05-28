
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("threadId"), args.threadId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    threadId: v.id("threads"),
    contactId: v.string(),
    content: v.string(),
    direction: v.string(),
    channel: v.string(),
    attachments: v.optional(v.array(v.object({
      type: v.string(),
      url: v.string(),
      name: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    const timestamp = new Date().toISOString();
    return await ctx.db.insert("messages", {
      ...args,
      timestamp,
      isRead: false,
    });
  },
});

export const markAsRead = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { isRead: true });
  },
});
