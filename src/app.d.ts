// See https://kit.svelte.dev/docs/types#app

import type { UserRole } from "@prisma/client";

// for information about these interfaces
declare global {
  /// <reference types="stripe-event-types" />
  namespace App {
    // interface Error {}
    interface Locals {
      user?: {
        id: number;
        name: string;
        email: string;
        role: UserRole;
      };
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
