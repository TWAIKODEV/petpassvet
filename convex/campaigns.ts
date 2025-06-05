
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new campaign
export const createCampaign = mutation({
  args: {
    name: v.string(),
    type: v.union(v.literal("email"), v.literal("social"), v.literal("web"), v.literal("event"), v.literal("referral"), v.literal("sem")),
    status: v.union(v.literal("active"), v.literal("scheduled"), v.literal("completed"), v.literal("draft")),
    startDate: v.string(),
    endDate: v.string(),
    budget: v.number(),
    spent: v.number(),
    leads: v.number(),
    conversions: v.number(),
    roi: v.number(),
    channels: v.array(v.string()),
    owner: v.string(),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const campaignId = await ctx.db.insert("campaigns", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return campaignId;
  },
});

// Get all campaigns
export const getCampaigns = query({
  handler: async (ctx) => {
    return await ctx.db.query("campaigns").order("desc").collect();
  },
});

// Get campaign by ID
export const getCampaign = query({
  args: { id: v.id("campaigns") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get campaigns by status
export const getCampaignsByStatus = query({
  args: { status: v.union(v.literal("active"), v.literal("scheduled"), v.literal("completed"), v.literal("draft")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("campaigns")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Get campaigns by type
export const getCampaignsByType = query({
  args: { type: v.union(v.literal("email"), v.literal("social"), v.literal("web"), v.literal("event"), v.literal("referral"), v.literal("sem")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("campaigns")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .collect();
  },
});

// Update campaign
export const updateCampaign = mutation({
  args: {
    id: v.id("campaigns"),
    name: v.optional(v.string()),
    type: v.optional(v.union(v.literal("email"), v.literal("social"), v.literal("web"), v.literal("event"), v.literal("referral"), v.literal("sem"))),
    status: v.optional(v.union(v.literal("active"), v.literal("scheduled"), v.literal("completed"), v.literal("draft"))),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    budget: v.optional(v.number()),
    spent: v.optional(v.number()),
    leads: v.optional(v.number()),
    conversions: v.optional(v.number()),
    roi: v.optional(v.number()),
    channels: v.optional(v.array(v.string())),
    owner: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Delete campaign
export const deleteCampaign = mutation({
  args: { id: v.id("campaigns") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get active campaigns
export const getActiveCampaigns = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("campaigns")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
  },
});
