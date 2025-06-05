
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear un nuevo hilo
export const createThread = mutation({
  args: {
    channel: v.union(v.literal("whatsapp"), v.literal("facebook"), v.literal("instagram"), v.literal("email"), v.literal("sms")),
    contact: v.object({
      id: v.string(),
      name: v.string(),
      handle: v.string(),
      avatar: v.optional(v.string()),
      isRegistered: v.boolean(),
      clientDetails: v.optional(v.object({
        id: v.string(),
        pet: v.object({
          name: v.string(),
          species: v.string(),
          breed: v.string(),
          age: v.number(),
          sex: v.union(v.literal("male"), v.literal("female")),
        }),
        lastVisit: v.string(),
        nextVisit: v.optional(v.string()),
        visits: v.number(),
        petPass: v.boolean(),
        healthPlan: v.optional(v.string()),
        insurance: v.optional(v.object({
          provider: v.string(),
          number: v.string(),
        })),
        billing: v.object({
          totalSpent: v.number(),
          lastPayment: v.object({
            amount: v.number(),
            date: v.string(),
            method: v.string(),
          }),
        }),
        prescriptions: v.array(v.object({
          date: v.string(),
          medication: v.string(),
          duration: v.string(),
        })),
      })),
    }),
    lastMessage: v.object({
      content: v.string(),
      timestamp: v.string(),
      isOutbound: v.boolean(),
    }),
    unreadCount: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const threadId = await ctx.db.insert("threads", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return threadId;
  },
});

// Obtener todos los hilos
export const getThreads = query({
  handler: async (ctx) => {
    return await ctx.db.query("threads").order("desc").collect();
  },
});

// Obtener hilos por canal
export const getThreadsByChannel = query({
  args: { channel: v.union(v.literal("whatsapp"), v.literal("facebook"), v.literal("instagram"), v.literal("email"), v.literal("sms")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("threads")
      .withIndex("by_channel", (q) => q.eq("channel", args.channel))
      .collect();
  },
});

// Obtener un hilo por ID
export const getThread = query({
  args: { id: v.id("threads") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Actualizar un hilo
export const updateThread = mutation({
  args: {
    id: v.id("threads"),
    lastMessage: v.optional(v.object({
      content: v.string(),
      timestamp: v.string(),
      isOutbound: v.boolean(),
    })),
    unreadCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Marcar hilo como leído
export const markThreadAsRead = mutation({
  args: { id: v.id("threads") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      unreadCount: 0,
      updatedAt: Date.now(),
    });
  },
});

// Eliminar un hilo
export const deleteThread = mutation({
  args: { id: v.id("threads") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
