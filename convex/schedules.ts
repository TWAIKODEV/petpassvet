
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createSchedule = mutation({
  args: {
    startTime: v.string(),
    endTime: v.string(),
    weekdayMask: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const scheduleId = await ctx.db.insert("schedules", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    return scheduleId;
  },
});

export const getSchedules = query({
  handler: async (ctx) => {
    return await ctx.db.query("schedules").order("desc").collect();
  },
});

export const getSchedule = query({
  args: { id: v.id("schedules") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateSchedule = mutation({
  args: {
    id: v.id("schedules"),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    weekdayMask: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

export const deleteSchedule = mutation({
  args: { id: v.id("schedules") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Utility function to get weekday names from mask
export const getWeekdayNames = (mask: number): string[] => {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const activeDays: string[] = [];
  
  for (let i = 0; i < 7; i++) {
    if (mask & (1 << i)) {
      activeDays.push(days[i]);
    }
  }
  
  return activeDays;
};
