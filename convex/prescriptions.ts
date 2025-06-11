
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear una nueva prescripción
export const createPrescription = mutation({
  args: {
    patientId: v.id("patients"),
    petId: v.optional(v.id("pets")),
    doctorId: v.string(),
    medicines: v.array(v.id("medicines")),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const prescriptionId = await ctx.db.insert("prescriptions", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return prescriptionId;
  },
});

// Obtener todas las prescripciones con información relacionada
export const getPrescriptions = query({
  handler: async (ctx) => {
    const prescriptions = await ctx.db.query("prescriptions").order("desc").collect();
    
    // Get related data for each prescription
    const prescriptionsWithData = await Promise.all(
      prescriptions.map(async (prescription) => {
        // Get patient data
        const patient = await ctx.db.get(prescription.patientId);
        
        // Get pet data if petId exists
        let pet = null;
        if (prescription.petId) {
          pet = await ctx.db.get(prescription.petId);
        }
        
        // Get medicines data
        const medicines = await Promise.all(
          prescription.medicines.map(async (medicineId) => {
            return await ctx.db.get(medicineId);
          })
        );
        
        return {
          ...prescription,
          patient,
          pet,
          medicines: medicines.filter(Boolean), // Remove any null medicines
        };
      })
    );
    
    return prescriptionsWithData;
  },
});

// Obtener prescripciones por paciente
export const getPrescriptionsByPatient = query({
  args: { patientId: v.id("patients") },
  handler: async (ctx, args) => {
    const prescriptions = await ctx.db
      .query("prescriptions")
      .withIndex("by_patient", (q) => q.eq("patientId", args.patientId))
      .collect();
      
    // Get related data for each prescription
    const prescriptionsWithData = await Promise.all(
      prescriptions.map(async (prescription) => {
        // Get patient data
        const patient = await ctx.db.get(prescription.patientId);
        
        // Get pet data if petId exists
        let pet = null;
        if (prescription.petId) {
          pet = await ctx.db.get(prescription.petId);
        }
        
        // Get medicines data
        const medicines = await Promise.all(
          prescription.medicines.map(async (medicineId) => {
            return await ctx.db.get(medicineId);
          })
        );
        
        return {
          ...prescription,
          patient,
          pet,
          medicines: medicines.filter(Boolean),
        };
      })
    );
    
    return prescriptionsWithData;
  },
});

// Obtener una prescripción por ID
export const getPrescription = query({
  args: { id: v.id("prescriptions") },
  handler: async (ctx, args) => {
    const prescription = await ctx.db.get(args.id);
    if (!prescription) return null;
    
    // Get patient data
    const patient = await ctx.db.get(prescription.patientId);
    
    // Get pet data if petId exists
    let pet = null;
    if (prescription.petId) {
      pet = await ctx.db.get(prescription.petId);
    }
    
    // Get medicines data
    const medicines = await Promise.all(
      prescription.medicines.map(async (medicineId) => {
        return await ctx.db.get(medicineId);
      })
    );
    
    return {
      ...prescription,
      patient,
      pet,
      medicines: medicines.filter(Boolean),
    };
  },
});

// Actualizar una prescripción
export const updatePrescription = mutation({
  args: {
    id: v.id("prescriptions"),
    patientId: v.optional(v.id("patients")),
    petId: v.optional(v.id("pets")),
    doctorId: v.optional(v.string()),
    medicines: v.optional(v.array(v.id("medicines"))),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Eliminar una prescripción
export const deletePrescription = mutation({
  args: { id: v.id("prescriptions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
