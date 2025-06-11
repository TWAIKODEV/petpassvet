import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Permission system tables
  permissions: defineTable({
    id: v.string(),
    name: v.string(),
    description: v.string(),
    module: v.string(),
    action: v.union(
      v.literal("view"),
      v.literal("create"),
      v.literal("edit"),
      v.literal("delete"),
      v.literal("manage"),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_module", ["module"])
    .index("by_action", ["action"]),

  userRoles: defineTable({
    id: v.string(),
    name: v.union(
      v.literal("admin"),
      v.literal("manager"),
      v.literal("veterinarian"),
      v.literal("vet_assistant"),
      v.literal("receptionist"),
      v.literal("groomer"),
    ),
    displayName: v.string(),
    permissionIds: v.array(v.string()), // References to permission IDs
    isEditable: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_name", ["name"]),

  // Updated users table to match the User interface
  users: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    roleId: v.string(), // Reference to userRoles
    department: v.string(),
    position: v.string(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    lastLogin: v.optional(v.string()),
    avatar: v.optional(v.string()),
    customPermissionIds: v.optional(v.array(v.string())), // Custom permissions override
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["roleId"])
    .index("by_status", ["status"]),

  patients: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    birthDate: v.string(),
    address: v.string(),
    preferredContact: v.optional(
      v.union(
        v.literal("phone"),
        v.literal("email"),
        v.literal("whatsapp"),
        v.literal("sms"),
      ),
    ),
    bankAccount: v.optional(v.string()),
    creditCard: v.optional(v.string()),
    marketing: v.object({
      acceptsEmail: v.boolean(),
      acceptsSms: v.boolean(),
      acceptsWhatsApp: v.boolean(),
    }),
    petPass: v.object({
      hasPetPass: v.boolean(),
      plan: v.optional(
        v.union(v.literal("track"), v.literal("protect"), v.literal("vetcare")),
      ),
    }),
    services: v.object({
      wantsGrooming: v.boolean(),
      wantsFoodDelivery: v.boolean(),
      wantsHotelService: v.boolean(),
      wantsTraining: v.boolean(),
    }),
    medicalHistory: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  pets: defineTable({
    patientId: v.id("patients"),
    name: v.string(),
    species: v.string(),
    breed: v.optional(v.string()),
    sex: v.optional(v.union(v.literal("male"), v.literal("female"))),
    birthDate: v.optional(v.string()),
    isNeutered: v.optional(v.boolean()),
    microchipNumber: v.optional(v.string()),
    color: v.optional(v.string()),
    weight: v.optional(v.number()),
    height: v.optional(v.number()),
    furType: v.optional(v.string()),
    observations: v.optional(v.string()),
    vaccines: v.optional(
      v.array(
        v.object({
          name: v.string(),
          date: v.string(),
          nextDue: v.optional(v.string()),
        }),
      ),
    ),
    currentTreatments: v.optional(v.string()),
    allergies: v.optional(v.string()),
    bloodTest: v.optional(
      v.object({
        done: v.boolean(),
        date: v.optional(v.string()),
      }),
    ),
    xrayTest: v.optional(
      v.object({
        done: v.boolean(),
        date: v.optional(v.string()),
      }),
    ),
    ultrasoundTest: v.optional(
      v.object({
        done: v.boolean(),
        date: v.optional(v.string()),
      }),
    ),
    urineTest: v.optional(
      v.object({
        done: v.boolean(),
        date: v.optional(v.string()),
      }),
    ),
    otherTests: v.optional(v.string()),
    hasPetPass: v.optional(v.boolean()),
    hasInsurance: v.optional(v.boolean()),
    insuranceProvider: v.optional(v.string()),
    insuranceNumber: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_patient", ["patientId"]),

  appointments: defineTable({
    petId: v.id("pets"),
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
      v.literal("procedure"),
    ),
    consultationType: v.union(
      v.literal("normal"),
      v.literal("insurance"),
      v.literal("emergency"),
    ),
    serviceType: v.union(
      v.literal("veterinary"),
      v.literal("grooming"),
      v.literal("rehabilitation"),
      v.literal("hospitalization"),
    ),
    doctorId: v.id("doctors"),
    date: v.string(),
    time: v.string(),
    duration: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("waiting"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("no_show"),
      v.literal("scheduled"),
    ),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_pet", ["petId"])
    .index("by_date", ["date"])
    .index("by_doctor", ["doctorId"]),

  doctors: defineTable({
    name: v.string(),
    specialization: v.string(),
    email: v.string(),
    phone: v.string(),
    schedule: v.object({
      monday: v.optional(
        v.object({
          start: v.string(),
          end: v.string(),
          breaks: v.array(
            v.object({
              start: v.string(),
              end: v.string(),
            }),
          ),
        }),
      ),
      tuesday: v.optional(
        v.object({
          start: v.string(),
          end: v.string(),
          breaks: v.array(
            v.object({
              start: v.string(),
              end: v.string(),
            }),
          ),
        }),
      ),
      wednesday: v.optional(
        v.object({
          start: v.string(),
          end: v.string(),
          breaks: v.array(
            v.object({
              start: v.string(),
              end: v.string(),
            }),
          ),
        }),
      ),
      thursday: v.optional(
        v.object({
          start: v.string(),
          end: v.string(),
          breaks: v.array(
            v.object({
              start: v.string(),
              end: v.string(),
            }),
          ),
        }),
      ),
      friday: v.optional(
        v.object({
          start: v.string(),
          end: v.string(),
          breaks: v.array(
            v.object({
              start: v.string(),
              end: v.string(),
            }),
          ),
        }),
      ),
      saturday: v.optional(
        v.object({
          start: v.string(),
          end: v.string(),
          breaks: v.array(
            v.object({
              start: v.string(),
              end: v.string(),
            }),
          ),
        }),
      ),
      sunday: v.optional(
        v.object({
          start: v.string(),
          end: v.string(),
          breaks: v.array(
            v.object({
              start: v.string(),
              end: v.string(),
            }),
          ),
        }),
      ),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  payments: defineTable({
    appointmentId: v.string(),
    patientId: v.id("patients"),
    amount: v.number(),
    date: v.string(),
    method: v.union(
      v.literal("cash"),
      v.literal("credit"),
      v.literal("debit"),
      v.literal("insurance"),
      v.literal("other"),
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("refunded"),
    ),
    insuranceClaim: v.optional(
      v.object({
        provider: v.string(),
        claimNumber: v.string(),
        status: v.union(
          v.literal("submitted"),
          v.literal("processing"),
          v.literal("approved"),
          v.literal("denied"),
        ),
        approvedAmount: v.optional(v.number()),
      }),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_patient", ["patientId"])
    .index("by_appointment", ["appointmentId"]),

  prescriptions: defineTable({
    patientId: v.id("patients"),
    petId: v.optional(v.id("pets")),
    doctorId: v.string(),
    medicines: v.array(v.id("medicines")),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_patient", ["patientId"]),

  // Categories for products
  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    parentCategoryId: v.optional(v.id("categories")),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_parent", ["parentCategoryId"]),

  // Updated products table with category references
  products: defineTable({
    name: v.string(),
    categoryId: v.id("categories"),
    subcategoryId: v.optional(v.id("categories")),
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
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["categoryId"])
    .index("by_sku", ["sku"]),

  // Campaigns with proper enums
  campaigns: defineTable({
    name: v.string(),
    type: v.union(
      v.literal("email"),
      v.literal("social"),
      v.literal("web"),
      v.literal("event"),
      v.literal("referral"),
      v.literal("sem"),
    ),
    status: v.union(
      v.literal("active"),
      v.literal("scheduled"),
      v.literal("completed"),
      v.literal("draft"),
    ),
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
  })
    .index("by_status", ["status"])
    .index("by_type", ["type"]),

  threads: defineTable({
    channel: v.union(
      v.literal("whatsapp"),
      v.literal("facebook"),
      v.literal("instagram"),
      v.literal("email"),
      v.literal("sms"),
    ),
    contact: v.object({
      id: v.string(),
      name: v.string(),
      handle: v.string(),
      avatar: v.optional(v.string()),
      isRegistered: v.boolean(),
      clientDetails: v.optional(
        v.object({
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
          insurance: v.optional(
            v.object({
              provider: v.string(),
              number: v.string(),
            }),
          ),
          billing: v.object({
            totalSpent: v.number(),
            lastPayment: v.object({
              amount: v.number(),
              date: v.string(),
              method: v.string(),
            }),
          }),
          prescriptions: v.array(
            v.object({
              date: v.string(),
              medication: v.string(),
              duration: v.string(),
            }),
          ),
        }),
      ),
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
    channel: v.union(
      v.literal("whatsapp"),
      v.literal("facebook"),
      v.literal("instagram"),
      v.literal("email"),
      v.literal("sms"),
    ),
    threadId: v.id("threads"),
    from: v.object({
      id: v.string(),
      name: v.string(),
      handle: v.string(),
    }),
    to: v.array(v.string()),
    timestamp: v.string(),
    type: v.union(
      v.literal("text"),
      v.literal("image"),
      v.literal("file"),
      v.literal("voice"),
    ),
    content: v.object({
      text: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
      fileUrl: v.optional(v.string()),
      fileName: v.optional(v.string()),
      voiceUrl: v.optional(v.string()),
    }),
    status: v.union(
      v.literal("sent"),
      v.literal("delivered"),
      v.literal("read"),
      v.literal("unread"),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_thread", ["threadId"])
    .index("by_channel", ["channel"]),

  // From Invoices.tsx
  invoices: defineTable({
    number: v.string(),
    date: v.string(),
    client: v.object({
      name: v.string(),
      nif: v.string(),
    }),
    pet: v.object({
      name: v.string(),
      species: v.string(),
      breed: v.string(),
      age: v.number(),
    }),
    area: v.string(),
    concept: v.string(),
    professional: v.string(),
    amount: v.number(),
    paymentMethod: v.string(),
    status: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // From ContaPlus.tsx
  accountGroups: defineTable({
    name: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  accounts: defineTable({
    code: v.string(),
    name: v.string(),
    groupId: v.id("accountGroups"),
    type: v.string(),
    balance: v.number(),
    status: v.string(),
    color: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_group", ["groupId"])
    .index("by_code", ["code"]),

  // Journal entries for ContaPlus
  journalEntries: defineTable({
    entryNumber: v.string(),
    date: v.string(),
    concept: v.string(),
    debitEntries: v.array(
      v.object({
        accountCode: v.string(),
        accountName: v.string(),
        amount: v.number(),
      }),
    ),
    creditEntries: v.array(
      v.object({
        accountCode: v.string(),
        accountName: v.string(),
        amount: v.number(),
      }),
    ),
    reference: v.string(),
    status: v.string(),
    type: v.string(),
    document: v.optional(v.string()),
    tags: v.array(v.string()),
    checked: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_date", ["date"])
    .index("by_type", ["type"]),

  // Balance sheet for ContaPlus
  balanceSheet: defineTable({
    period: v.string(),
    year: v.number(),
    assets: v.array(
      v.object({
        accountCode: v.string(),
        accountName: v.string(),
        amount: v.number(),
        category: v.string(),
      }),
    ),
    liabilities: v.array(
      v.object({
        accountCode: v.string(),
        accountName: v.string(),
        amount: v.number(),
        category: v.string(),
      }),
    ),
    equity: v.array(
      v.object({
        accountCode: v.string(),
        accountName: v.string(),
        amount: v.number(),
        category: v.string(),
      }),
    ),
    totalAssets: v.number(),
    totalLiabilitiesEquity: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_period", ["period", "year"]),

  profitAndLoss: defineTable({
    account: v.string(),
    name: v.string(),
    amount: v.number(),
    type: v.string(), // 'income' or 'expense'
    period: v.string(),
    year: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_period", ["period", "year"])
    .index("by_type", ["type"]),

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
    status: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // From Impuestos.tsx
  taxModels: defineTable({
    model: v.string(),
    name: v.string(),
    description: v.string(),
    frequency: v.string(),
    dueDates: v.string(),
    lastFiled: v.optional(v.string()),
    nextDue: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  taxDeclarations: defineTable({
    model: v.string(),
    name: v.string(),
    period: v.string(),
    dueDate: v.string(),
    amount: v.number(),
    status: v.string(),
    result: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Tax calendar for Impuestos
  taxCalendar: defineTable({
    date: v.string(),
    models: v.array(v.string()),
    description: v.string(),
    status: v.union(
      v.literal("upcoming"),
      v.literal("completed"),
      v.literal("future"),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_date", ["date"])
    .index("by_status", ["status"]),

  // Updated keyword suggestions with missing fields for WebDashboard
  keywordSuggestions: defineTable({
    keyword: v.string(),
    volume: v.number(),
    difficulty: v.number(),
    relevance: v.number(),
    position: v.optional(v.number()),
    change: v.optional(v.number()),
    isPositive: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Form definitions for WebDashboard
  formData: defineTable({
    name: v.string(),
    location: v.string(),
    fields: v.array(
      v.object({
        name: v.string(),
        type: v.string(),
        required: v.boolean(),
        label: v.string(),
      }),
    ),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Form submissions for WebDashboard
  formSubmissions: defineTable({
    formDataId: v.id("formData"),
    submissionData: v.any(), // Dynamic object based on form fields
    submitterInfo: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      ipAddress: v.optional(v.string()),
      userAgent: v.optional(v.string()),
    }),
    status: v.union(
      v.literal("new"),
      v.literal("processed"),
      v.literal("archived"),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_form", ["formDataId"])
    .index("by_status", ["status"]),

  competitors: defineTable({
    name: v.string(),
    distance: v.string(),
    rating: v.number(),
    reviews: v.number(),
    website: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  demographics: defineTable({
    population: v.number(),
    petOwners: v.number(),
    averageIncome: v.string(),
    ageGroups: v.array(
      v.object({
        group: v.string(),
        percentage: v.number(),
      }),
    ),
    area: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Updated grooming appointments without services and price fields
  groomingAppointments: defineTable({
    petName: v.string(),
    breed: v.string(),
    age: v.number(),
    sex: v.string(),
    petProfileUrl: v.string(),
    serviceType: v.string(),
    patientId: v.string(),
    groomerId: v.string(),
    date: v.string(),
    time: v.string(),
    duration: v.number(),
    status: v.string(),
    notes: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_date", ["date"])
    .index("by_groomer", ["groomerId"]),

  // Medicines table
  medicines: defineTable({
    name: v.string(),
    activeIngredient: v.string(),
    manufacturer: v.string(),
    type: v.string(),
    dosageForm: v.string(),
    species: v.array(v.string()),
    recommendedDosage: v.string(),
    duration: v.string(),
    registrationNumber: v.optional(v.string()),
    reference: v.optional(v.string()),
    stock: v.number(),
    minStock: v.number(),
    price: v.number(),
    conditions: v.array(v.string()),
    contraindications: v.array(v.string()),
    sideEffects: v.array(v.string()),
    interactions: v.array(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    atcVetCode: v.optional(v.string()),
    prescriptionRequired: v.optional(v.boolean()),
    psychotropic: v.optional(v.boolean()),
    antibiotic: v.optional(v.boolean()),
    administrationRoutes: v.optional(v.array(v.string())),
    excipients: v.optional(v.array(v.string())),
    withdrawalPeriod: v.optional(v.string()),
    aiScore: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_manufacturer", ["manufacturer"])
    .index("by_status", ["status"]),

  // Treatments table
  treatments: defineTable({
    name: v.string(),
    category: v.string(),
    description: v.string(),
    duration: v.number(),
    followUpPeriod: v.optional(v.number()),
    price: v.number(),
    status: v.union(v.literal("active"), v.literal("inactive")),
    species: v.array(v.string()),
    sex: v.union(v.literal("male"), v.literal("female"), v.literal("both")),
    clinicArea: v.optional(v.string()),
    conditions: v.array(v.string()),
    associatedMedicines: v.array(v.id("medicines")),
    procedures: v.array(v.string()),
    contraindications: v.array(v.string()),
    sideEffects: v.array(v.string()),
    notes: v.optional(v.string()),
    minAge: v.optional(v.number()),
    maxAge: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_clinic_area", ["clinicArea"]),
});
