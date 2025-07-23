/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as absences from "../absences.js";
import type * as appointments from "../appointments.js";
import type * as budgets from "../budgets.js";
import type * as campaigns from "../campaigns.js";
import type * as categories from "../categories.js";
import type * as doctors from "../doctors.js";
import type * as employees from "../employees.js";
import type * as google from "../google.js";
import type * as groomingAppointments from "../groomingAppointments.js";
import type * as invoices from "../invoices.js";
import type * as linkedin from "../linkedin.js";
import type * as medicalHistory from "../medicalHistory.js";
import type * as medicines from "../medicines.js";
import type * as messages from "../messages.js";
import type * as orders from "../orders.js";
import type * as patients from "../patients.js";
import type * as payments from "../payments.js";
import type * as payrolls from "../payrolls.js";
import type * as permissions from "../permissions.js";
import type * as pets from "../pets.js";
import type * as prescriptions from "../prescriptions.js";
import type * as products from "../products.js";
import type * as providers from "../providers.js";
import type * as roles from "../roles.js";
import type * as schedules from "../schedules.js";
import type * as services from "../services.js";
import type * as threads from "../threads.js";
import type * as tiktok from "../tiktok.js";
import type * as timeRecording from "../timeRecording.js";
import type * as treatments from "../treatments.js";
import type * as twitter from "../twitter.js";
import type * as userRoles from "../userRoles.js";
import type * as users from "../users.js";
import type * as youtube from "../youtube.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  absences: typeof absences;
  appointments: typeof appointments;
  budgets: typeof budgets;
  campaigns: typeof campaigns;
  categories: typeof categories;
  doctors: typeof doctors;
  employees: typeof employees;
  google: typeof google;
  groomingAppointments: typeof groomingAppointments;
  invoices: typeof invoices;
  linkedin: typeof linkedin;
  medicalHistory: typeof medicalHistory;
  medicines: typeof medicines;
  messages: typeof messages;
  orders: typeof orders;
  patients: typeof patients;
  payments: typeof payments;
  payrolls: typeof payrolls;
  permissions: typeof permissions;
  pets: typeof pets;
  prescriptions: typeof prescriptions;
  products: typeof products;
  providers: typeof providers;
  roles: typeof roles;
  schedules: typeof schedules;
  services: typeof services;
  threads: typeof threads;
  tiktok: typeof tiktok;
  timeRecording: typeof timeRecording;
  treatments: typeof treatments;
  twitter: typeof twitter;
  userRoles: typeof userRoles;
  users: typeof users;
  youtube: typeof youtube;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
