
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new doctor
export const createDoctor = mutation({
  args: {
    name: v.string(),
    specialization: v.string(),
    email: v.string(),
    phone: v.string(),
    schedule: v.object({
      monday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
        breaks: v.array(v.object({
          start: v.string(),
          end: v.string(),
        })),
      })),
      tuesday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
        breaks: v.array(v.object({
          start: v.string(),
          end: v.string(),
        })),
      })),
      wednesday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
        breaks: v.array(v.object({
          start: v.string(),
          end: v.string(),
        })),
      })),
      thursday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
        breaks: v.array(v.object({
          start: v.string(),
          end: v.string(),
        })),
      })),
      friday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
        breaks: v.array(v.object({
          start: v.string(),
          end: v.string(),
        })),
      })),
      saturday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
        breaks: v.array(v.object({
          start: v.string(),
          end: v.string(),
        })),
      })),
      sunday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
        breaks: v.array(v.object({
          start: v.string(),
          end: v.string(),
        })),
      })),
    }),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const doctorId = await ctx.db.insert("doctors", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return doctorId;
  },
});

// Get all doctors
export const getDoctors = query({
  handler: async (ctx) => {
    return await ctx.db.query("doctors").order("desc").collect();
  },
});

// Get doctor by ID
export const getDoctor = query({
  args: { id: v.id("doctors") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Update doctor
export const updateDoctor = mutation({
  args: {
    id: v.id("doctors"),
    name: v.optional(v.string()),
    specialization: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    schedule: v.optional(v.object({
      monday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
        breaks: v.array(v.object({
          start: v.string(),
          end: v.string(),
        })),
      })),
      tuesday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
        breaks: v.array(v.object({
          start: v.string(),
          end: v.string(),
        })),
      })),
      wednesday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
        breaks: v.array(v.object({
          start: v.string(),
          end: v.string(),
        })),
      })),
      thursday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
        breaks: v.array(v.object({
          start: v.string(),
          end: v.string(),
        })),
      })),
      friday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
        breaks: v.array(v.object({
          start: v.string(),
          end: v.string(),
        })),
      })),
      saturday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
        breaks: v.array(v.object({
          start: v.string(),
          end: v.string(),
        })),
      })),
      sunday: v.optional(v.object({
        start: v.string(),
        end: v.string(),
        breaks: v.array(v.object({
          start: v.string(),
          end: v.string(),
        })),
      })),
    })),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Delete doctor
export const deleteDoctor = mutation({
  args: { id: v.id("doctors") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
