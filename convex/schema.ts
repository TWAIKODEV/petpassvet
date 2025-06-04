import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  patients: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    birthDate: v.string(),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
    address: v.string(),
    preferredContact: v.union(v.literal("phone"), v.literal("email"), v.literal("whatsapp"), v.literal("sms")),
    bankAccount: v.optional(v.string()),
    creditCard: v.optional(v.string()),
    marketing: v.object({
      acceptsDataProtection: v.boolean(),
      acceptsEmailMarketing: v.boolean(),
      acceptsWhatsAppComm: v.boolean(),
    }),
    petPass: v.object({
      hasPetPass: v.boolean(),
      plan: v.optional(v.union(v.literal("track"), v.literal("protect"), v.literal("vetcare"))),
    }),
    services: v.object({
      wantsGrooming: v.boolean(),
      wantsFoodDelivery: v.boolean(),
      wantsHotelService: v.boolean(),
      wantsTraining: v.boolean(),
    }),
    pet: v.object({
      name: v.string(),
      species: v.string(),
      sex: v.union(v.literal("male"), v.literal("female")),
      birthDate: v.string(),
      breed: v.string(),
      isNeutered: v.boolean(),
      microchipNumber: v.optional(v.string()),
      vaccines: v.array(v.object({
        name: v.string(),
        date: v.string(),
        nextDue: v.optional(v.string()),
      })),
      healthPlans: v.array(v.object({
        name: v.string(),
        startDate: v.string(),
        endDate: v.string(),
      })),
      accidents: v.array(v.object({
        date: v.string(),
        description: v.string(),
        treatment: v.string(),
      })),
      surgeries: v.array(v.object({
        date: v.string(),
        type: v.string(),
        notes: v.string(),
      })),
      otherTests: v.array(v.object({
        date: v.string(),
        type: v.string(),
        result: v.string(),
      })),
    }),
    insuranceProvider: v.optional(v.string()),
    insuranceNumber: v.optional(v.string()),
    medicalHistory: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  pets: defineTable({
    patientId: v.id("patients"),
    name: v.string(),
    species: v.string(),
    breed: v.optional(v.string()),
    age: v.optional(v.number()),
    weight: v.optional(v.number()),
    color: v.optional(v.string()),
    microchip: v.optional(v.string()),
    vaccinations: v.optional(v.array(v.object({
      vaccine: v.string(),
      date: v.string(),
      nextDue: v.string(),
    }))),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_patient", ["patientId"]),

  appointments: defineTable({
    petName: v.string(),
    breed: v.string(),
    age: v.number(),
    sex: v.union(v.literal("male"), v.literal("female")),
    petProfileUrl: v.string(),
    consultationKind: v.union(
      v.literal("annualReview"),
      v.literal("followUp"),
      v.literal("checkUp"),
      v.literal("emergency"),
      v.literal("vaccination"),
      v.literal("surgery"),
      v.literal("dental"),
      v.literal("grooming"),
      v.literal("firstVisit"),
      v.literal("procedure")
    ),
    consultationType: v.union(v.literal("normal"), v.literal("insurance"), v.literal("emergency")),
    serviceType: v.union(v.literal("veterinary"), v.literal("grooming"), v.literal("rehabilitation"), v.literal("hospitalization")),
    patientId: v.id("patients"),
    doctorId: v.string(),
    date: v.string(),
    time: v.string(),
    duration: v.number(),
    status: v.union(v.literal("pending"), v.literal("confirmed"), v.literal("waiting"), v.literal("in_progress"), v.literal("completed"), v.literal("no_show"), v.literal("scheduled")),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_patient", ["patientId"]).index("by_date", ["date"]),

  doctors: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  payments: defineTable({
    appointmentId: v.string(),
    patientId: v.id("patients"),
    amount: v.number(),
    date: v.string(),
    method: v.union(v.literal("cash"), v.literal("credit"), v.literal("debit"), v.literal("insurance"), v.literal("other")),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("refunded")),
    insuranceClaim: v.optional(v.object({
      provider: v.string(),
      claimNumber: v.string(),
      status: v.union(v.literal("submitted"), v.literal("processing"), v.literal("approved"), v.literal("denied")),
      approvedAmount: v.optional(v.number()),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_patient", ["patientId"]).index("by_appointment", ["appointmentId"]),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    role: v.object({
      id: v.string(),
      name: v.union(v.literal("admin"), v.literal("manager"), v.literal("veterinarian"), v.literal("vet_assistant"), v.literal("receptionist"), v.literal("groomer")),
      displayName: v.string(),
      permissions: v.array(v.object({
        id: v.string(),
        name: v.string(),
        description: v.string(),
        module: v.string(),
        action: v.union(v.literal("view"), v.literal("create"), v.literal("edit"), v.literal("delete"), v.literal("manage")),
      })),
      isEditable: v.boolean(),
    }),
    department: v.string(),
    position: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    lastLogin: v.optional(v.string()),
    avatar: v.optional(v.string()),
    customPermissions: v.optional(v.array(v.object({
      id: v.string(),
      name: v.string(),
      description: v.string(),
      module: v.string(),
      action: v.union(v.literal("view"), v.literal("create"), v.literal("edit"), v.literal("delete"), v.literal("manage")),
    }))),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  prescriptions: defineTable({
    patientId: v.id("patients"),
    petId: v.optional(v.id("pets")),
    veterinarian: v.string(),
    medications: v.array(v.object({
      name: v.string(),
      dosage: v.string(),
      frequency: v.string(),
      duration: v.string(),
      instructions: v.optional(v.string()),
    })),
    diagnosis: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_patient", ["patientId"]),

  products: defineTable({
    name: v.string(),
    category: v.string(),
    subcategory: v.string(),
    description: v.string(),
    price: v.number(),
    stock: v.number(),
    featured: v.boolean(),
    image: v.string(),
    brand: v.optional(v.string()),
    weight: v.optional(v.string()),
    dimensions: v.optional(v.string()),
    sku: v.string(),
    barcode: v.optional(v.string()),
    minStock: v.number(),
    supplier: v.optional(v.string()),
    tags: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_category", ["category"]).index("by_sku", ["sku"]),

  campaigns: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_status", ["status"]).index("by_type", ["type"]),

  threads: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_channel", ["channel"]),

  messages: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_thread", ["threadId"]).index("by_channel", ["channel"]),

  // From Invoices.tsx
  invoices: defineTable({
    number: v.string(),
    date: v.string(),
    client: v.object({
      name: v.string(),
      nif: v.string()
    }),
    pet: v.object({
      name: v.string(),
      species: v.string(),
      breed: v.string(),
      age: v.number()
    }),
    area: v.string(),
    concept: v.string(),
    professional: v.string(),
    amount: v.number(),
    paymentMethod: v.string(),
    status: v.string()
  }),

  // From inboxService.ts

  // From ContaPlus.tsx
  accountGroups: defineTable({
    name: v.string()
  }),

  accounts: defineTable({
    code: v.string(),
    name: v.string(),
    groupId: v.string(),
    type: v.string(),
    balance: v.number(),
    status: v.string()
  }),

  profitAndLoss: defineTable({
    account: v.string(),
    name: v.string(),
    amount: v.number(),
    type: v.string() // 'income' or 'expense'
  }),

  assets: defineTable({
    purchaseDate: v.string(),
    amortizationStartDate: v.string(),
    account: v.string(),
    accountName: v.string(),
    tags: v.array(v.string()),
    serialNumber: v.string(),
    contact: v.string(),
    concept: v.string(),
    document: v.string(),
    initialValue: v.number(),
    amortized: v.number(),
    currentValue: v.number(),
    status: v.string()
  }),

  // From Impuestos.tsx
  taxModels: defineTable({
    model: v.string(),
    name: v.string(),
    description: v.string(),
    frequency: v.string(),
    dueDates: v.string(),
    lastFiled: v.optional(v.string()),
    nextDue: v.string()
  }),

  taxDeclarations: defineTable({
    model: v.string(),
    name: v.string(),
    period: v.string(),
    dueDate: v.string(),
    amount: v.number(),
    status: v.string(),
    result: v.string()
  }),

  // From tienda/Dashboard.tsx and Products.tsx
  products: defineTable({
    name: v.string(),
    category: v.string(),
    subcategory: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.number(),
    cost: v.optional(v.number()),
    discountPrice: v.optional(v.number()),
    stock: v.optional(v.number()),
    minStock: v.optional(v.number()),
    sku: v.optional(v.string()),
    barcode: v.optional(v.string()),
    brand: v.optional(v.string()),
    supplier: v.optional(v.string()),
    location: v.optional(v.string()),
    lastUpdated: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    rating: v.optional(v.number()),
    reviews: v.optional(v.number()),
    images: v.optional(v.array(v.string())),
    status: v.string(),
    area: v.optional(v.string()),
    tags: v.optional(v.array(v.string()))
  }),

  salesByCategory: defineTable({
    category: v.string(),
    amount: v.number(),
    percentage: v.number()
  }),

  // From WebDashboard.tsx
  keywordSuggestions: defineTable({
    keyword: v.string(),
    volume: v.number(),
    difficulty: v.number(),
    relevance: v.number()
  }),

  competitors: defineTable({
    name: v.string(),
    distance: v.string(),
    rating: v.number(),
    reviews: v.number(),
    website: v.string()
  }),

  demographics: defineTable({
    population: v.number(),
    petOwners: v.number(),
    averageIncome: v.string(),
    ageGroups: v.array(v.object({
      group: v.string(),
      percentage: v.number()
    }))
  }),

  // From CampañasMK.tsx
  campaigns: defineTable({
    name: v.string(),
    type: v.string(),
    status: v.string(),
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
    tags: v.optional(v.array(v.string()))
  }),

  // From GroomingAppointments.tsx
  groomingAppointments: defineTable({
    petName: v.string(),
    breed: v.string(),
    age: v.number(),
    sex: v.string(),
    petProfileUrl: v.string(),
    serviceType: v.string(),
    services: v.array(v.string()),
    patientId: v.string(),
    groomerId: v.string(),
    date: v.string(),
    time: v.string(),
    duration: v.number(),
    status: v.string(),
    notes: v.string(),
    price: v.number()
  }),

  // Dashboard summary
  dashboardSummary: defineTable({
    appointmentsToday: v.number(),
    appointmentsWeek: v.number(),
    patientsTotal: v.number(),
    revenueToday: v.number(),
    revenueWeek: v.number(),
    revenueMonth: v.number()
  })
});