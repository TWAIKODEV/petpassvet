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
import type * as appointments from "../appointments.js";
import type * as campaigns from "../campaigns.js";
import type * as categories from "../categories.js";
import type * as doctors from "../doctors.js";
import type * as groomingAppointments from "../groomingAppointments.js";
import type * as invoices from "../invoices.js";
import type * as messages from "../messages.js";
import type * as patients from "../patients.js";
import type * as payments from "../payments.js";
import type * as permissions from "../permissions.js";
import type * as pets from "../pets.js";
import type * as prescriptions from "../prescriptions.js";
import type * as products from "../products.js";
import type * as threads from "../threads.js";
import type * as userRoles from "../userRoles.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  appointments: typeof appointments;
  campaigns: typeof campaigns;
  categories: typeof categories;
  doctors: typeof doctors;
  groomingAppointments: typeof groomingAppointments;
  invoices: typeof invoices;
  messages: typeof messages;
  patients: typeof patients;
  payments: typeof payments;
  permissions: typeof permissions;
  pets: typeof pets;
  prescriptions: typeof prescriptions;
  products: typeof products;
  threads: typeof threads;
  userRoles: typeof userRoles;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
