import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { UserRole } from "@prisma/client";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || locals.user.role !== UserRole.ADMIN) {
    return error(401, "Only Admins can access this page.");
  }
};
