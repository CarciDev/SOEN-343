import { fail } from "@sveltejs/kit";
import { z } from "zod";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad, Actions } from "./$types.js";
import { ShipmentTransactionRepository } from "$lib/domain/ShipmentTransactionRepository.js";
import { ReviewRepository } from "$lib/domain/ReviewRepository.js";
import { ReviewFactory } from "$lib/domain/ReviewFactory.js";

const ReviewSchema = z.object({
  userId: z.number().int().min(1, "User ID must be a positive integer"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  deliveryRating: z
    .number()
    .int()
    .min(1, "Delivery Rating must be at least 1")
    .max(5, "Delivery Rating cannot exceed 5"),
  wasDeliveryOnTime: z.boolean(),
  comment: z.string().optional().nullable(),
  transactionId: z
    .number()
    .int()
    .min(1, "Transaction ID must be a positive integer"),
});

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user) {
    return {
      form: await superValidate(zod(ReviewSchema)),
      deliveredTrackingNumbers: [],
      userId: 0,
    };
  }

  const deliveredTrackingNumbers =
    await ShipmentTransactionRepository.findDeliveredTransactionsWithoutReview(
      event.locals.user.id,
    );

  const form = await superValidate(zod(ReviewSchema));

  return { form, deliveredTrackingNumbers, userId: event.locals.user.id };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(ReviewSchema));

    if (!form.valid) {
      console.error("Form validation failed:", form.errors, form.data);
      return fail(400, { form });
    }

    try {
      const normalizedData = {
        ...form.data,
        comment: form.data.comment ?? undefined, // Normalize null to undefined
      };

      const review = ReviewFactory.create(normalizedData);
      await ReviewRepository.save(review);

      return { success: true, form };
    } catch (error) {
      console.error("Database error:", error);
      return fail(500, { form, error: "Internal Server Error" });
    }
  },
};
