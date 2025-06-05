
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear un nuevo mensaje
export const createMessage = mutation({
  args: {
    channel: v.union(v.literal("whatsapp"), v.literal("facebook"), v.literal("instagram"), v.literal("email"), v.literal("sms")),
    threadId: v.id("threads"),
    from: v.object({
      id: v.string(),
      name: v.string(),
      handle: v.string(),
    }),
    to: v.array(v.string()),
    timestamp: v.string(),
    type: v.union(v.literal("text"), v.literal("image"), v.literal("file"), v.literal("voice")),
    content: v.object({
      text: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
      fileUrl: v.optional(v.string()),
      fileName: v.optional(v.string()),
      voiceUrl: v.optional(v.string()),
    }),
    status: v.union(v.literal("sent"), v.literal("delivered"), v.literal("read"), v.literal("unread")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const messageId = await ctx.db.insert("messages", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return messageId;
  },
});

// Obtener todos los mensajes
export const getMessages = query({
  handler: async (ctx) => {
    return await ctx.db.query("messages").order("desc").collect();
  },
});

// Obtener mensajes por hilo
export const getMessagesByThread = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .order("desc")
      .collect();
  },
});

// Obtener mensajes por canal
export const getMessagesByChannel = query({
  args: { channel: v.union(v.literal("whatsapp"), v.literal("facebook"), v.literal("instagram"), v.literal("email"), v.literal("sms")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_channel", (q) => q.eq("channel", args.channel))
      .collect();
  },
});

// Obtener un mensaje por ID
export const getMessage = query({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Actualizar estado del mensaje
export const updateMessageStatus = mutation({
  args: {
    id: v.id("messages"),
    status: v.union(v.literal("sent"), v.literal("delivered"), v.literal("read"), v.literal("unread")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

// Eliminar un mensaje
export const deleteMessage = mutation({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
