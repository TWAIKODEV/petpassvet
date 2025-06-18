
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createOrder = mutation({
  args: {
    providerId: v.id("providers"),
    orderDate: v.string(),
    items: v.array(
      v.object({
        itemId: v.string(),
        itemType: v.union(v.literal("product"), v.literal("medicine")),
        name: v.string(),
        quantity: v.number(),
        price: v.number(),
        vat: v.number(),
      })
    ),
    estimatedDeliveryDate: v.string(),
    paymentMethod: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const orderId = await ctx.db.insert("orders", {
      ...args,
      status: "pending",
      isPaid: false,
      createdAt: now,
      updatedAt: now,
    });

    return orderId;
  },
});

export const getOrders = query({
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").order("desc").collect();
    
    // Get provider information for each order
    const ordersWithProviders = await Promise.all(
      orders.map(async (order) => {
        const provider = await ctx.db.get(order.providerId);
        return {
          ...order,
          provider: provider ? {
            name: provider.name,
            area: provider.area,
          } : null,
        };
      })
    );

    return ordersWithProviders;
  },
});

export const getOrder = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) return null;

    const provider = await ctx.db.get(order.providerId);
    
    return {
      ...order,
      provider: provider ? {
        name: provider.name,
        area: provider.area,
        email: provider.email,
        phone: provider.phone,
        address: provider.address,
        city: provider.city,
        province: provider.province,
      } : null,
    };
  },
});

export const updateOrder = mutation({
  args: {
    id: v.id("orders"),
    providerId: v.optional(v.id("providers")),
    orderDate: v.optional(v.string()),
    items: v.optional(
      v.array(
        v.object({
          itemId: v.string(),
          itemType: v.union(v.literal("product"), v.literal("medicine")),
          name: v.string(),
          quantity: v.number(),
          price: v.number(),
          vat: v.number(),
        })
      )
    ),
    estimatedDeliveryDate: v.optional(v.string()),
    paymentMethod: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("delivered"),
        v.literal("cancelled")
      )
    ),
    isPaid: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

export const deleteOrder = mutation({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getOrdersByProvider = query({
  args: { providerId: v.id("providers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_provider", (q) => q.eq("providerId", args.providerId))
      .order("desc")
      .collect();
  },
});

export const getOrdersByStatus = query({
  args: { 
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("delivered"),
      v.literal("cancelled")
    )
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();
  },
});
