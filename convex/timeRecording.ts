
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createTimeRecord = mutation({
  args: {
    employeeId: v.id("employees"),
    entryDate: v.optional(v.string()),
    departureDate: v.optional(v.string()),
    recordDate: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const timeRecordId = await ctx.db.insert("timeRecording", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    return timeRecordId;
  },
});

export const getTimeRecords = query({
  handler: async (ctx) => {
    const records = await ctx.db.query("timeRecording").order("desc").collect();
    
    // Get employee info for each record
    const recordsWithEmployees = await Promise.all(
      records.map(async (record) => {
        const employee = await ctx.db.get(record.employeeId);
        return {
          ...record,
          employee,
        };
      })
    );

    return recordsWithEmployees;
  },
});

export const getTimeRecordsByEmployee = query({
  args: { employeeId: v.id("employees") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("timeRecording")
      .withIndex("by_employee", (q) => q.eq("employeeId", args.employeeId))
      .order("desc")
      .collect();
  },
});

export const getTimeRecordsByDate = query({
  args: { recordDate: v.string() },
  handler: async (ctx, args) => {
    const records = await ctx.db
      .query("timeRecording")
      .withIndex("by_record_date", (q) => q.eq("recordDate", args.recordDate))
      .collect();

    // Get employee info for each record
    const recordsWithEmployees = await Promise.all(
      records.map(async (record) => {
        const employee = await ctx.db.get(record.employeeId);
        return {
          ...record,
          employee,
        };
      })
    );

    return recordsWithEmployees;
  },
});

export const getTodayTimeRecord = query({
  args: { 
    employeeId: v.id("employees"),
    recordDate: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("timeRecording")
      .withIndex("by_employee_and_date", (q) => 
        q.eq("employeeId", args.employeeId).eq("recordDate", args.recordDate)
      )
      .first();
  },
});

export const updateTimeRecord = mutation({
  args: {
    id: v.id("timeRecording"),
    entryDate: v.optional(v.string()),
    departureDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

export const recordEntry = mutation({
  args: {
    employeeId: v.id("employees"),
    entryTime: v.string(),
    recordDate: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if there's already a record for today
    const existingRecord = await ctx.db
      .query("timeRecording")
      .withIndex("by_employee_and_date", (q) => 
        q.eq("employeeId", args.employeeId).eq("recordDate", args.recordDate)
      )
      .first();

    if (existingRecord) {
      // Update existing record with entry time
      await ctx.db.patch(existingRecord._id, {
        entryDate: args.entryTime,
        updatedAt: now,
      });
      return existingRecord._id;
    } else {
      // Create new record
      return await ctx.db.insert("timeRecording", {
        employeeId: args.employeeId,
        entryDate: args.entryTime,
        departureDate: undefined,
        recordDate: args.recordDate,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

export const recordDeparture = mutation({
  args: {
    employeeId: v.id("employees"),
    departureTime: v.string(),
    recordDate: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if there's already a record for today
    const existingRecord = await ctx.db
      .query("timeRecording")
      .withIndex("by_employee_and_date", (q) => 
        q.eq("employeeId", args.employeeId).eq("recordDate", args.recordDate)
      )
      .first();

    if (existingRecord) {
      // Update existing record with departure time
      await ctx.db.patch(existingRecord._id, {
        departureDate: args.departureTime,
        updatedAt: now,
      });
      return existingRecord._id;
    } else {
      // Create new record (departure without entry)
      return await ctx.db.insert("timeRecording", {
        employeeId: args.employeeId,
        entryDate: undefined,
        departureDate: args.departureTime,
        recordDate: args.recordDate,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

export const deleteTimeRecord = mutation({
  args: { id: v.id("timeRecording") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getTimeRecordsByDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
    employeeId: v.optional(v.id("employees")),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("timeRecording");
    
    if (args.employeeId) {
      query = query.withIndex("by_employee", (q) => q.eq("employeeId", args.employeeId));
    }
    
    const records = await query.collect();
    
    // Filter by date range
    const filteredRecords = records.filter(record => 
      record.recordDate >= args.startDate && record.recordDate <= args.endDate
    );

    // Get employee info for each record
    const recordsWithEmployees = await Promise.all(
      filteredRecords.map(async (record) => {
        const employee = await ctx.db.get(record.employeeId);
        return {
          ...record,
          employee,
        };
      })
    );

    return recordsWithEmployees;
  },
});
