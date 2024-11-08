import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { createQuotationCheckoutSession } from "$lib/server/stripeService";
import { z } from "zod";
import { Quotation } from "$lib/domain/Quotation";
import {
  checkoutDataSchema,
  CheckoutPaymentAdapter,
} from "$lib/domain/CheckoutPaymentAdapter";

export const GET: RequestHandler = async (event) => {
  const userId = String(event.locals.user?.id);

  // Implementation of the Adapter Pattern
  // In practice, you would use a Quotation instance from a validated form submission (e.g., Superforms).
  // This example uses a dummy Quotation object purely for illustration purposes.
  const quotationId = event.url.searchParams.get("dummyQuotationId");
  const quotationPriceInCents = parseInt(
    event.url.searchParams.get("amountQuotedCents") || "0",
    10,
  );

  // Create a dummy Quotation object to demonstrate the Adapter Pattern.
  const dummyQuotation = new Quotation({
    id: Number(quotationId),
    originId: 1,
    destinationId: 2,
    amountQuotedCents: quotationPriceInCents,
    boxId: 3,
  });

  // Use the Adapter to transform the Quotation into checkout data
  const adapter = new CheckoutPaymentAdapter(dummyQuotation);
  const checkoutData = adapter.toPaymentCheckoutData(Number(userId));
  // end of adapter design pattern example. The last 2 lines are what's really important in this file.

  let checkoutUrl: string;

  try {
    // Validate the checkout data against the Zod schema before sending to Stripe...
    const validatedStripeCheckoutData = checkoutDataSchema.parse(checkoutData);
    // And if it's successful, call the StripeService message to create a checkout session.
    checkoutUrl = await createQuotationCheckoutSession(
      validatedStripeCheckoutData,
    );
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.error("Validation failed:", e.errors);
      throw new Error("Invalid parameters");
    }
    console.log(e);
    throw error(500, "An error occurred while creating the checkout session.");
  }

  throw redirect(302, checkoutUrl);
};
