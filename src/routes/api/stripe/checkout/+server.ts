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

  // Extract values from URL search parameters
  const quotationId = event.url.searchParams.get("quotationId");
  const amountQuotedCents = parseInt(
    event.url.searchParams.get("amountQuotedCents") || "0",
    10,
  );
  const originId = parseInt(event.url.searchParams.get("originId") || "0", 10);
  const destinationId = parseInt(
    event.url.searchParams.get("destinationId") || "0",
    10,
  );
  const etaDays = parseInt(event.url.searchParams.get("etaDays") || "0", 10);
  const boxId = parseInt(event.url.searchParams.get("boxId") || "0", 10);

  // Create a Quotation object using values from the URL
  const quotation = new Quotation({
    id: Number(quotationId),
    originId,
    destinationId,
    amountQuotedCents,
    etaDays,
    boxId,
  });

  // Use the Adapter to transform the Quotation into checkout data
  const adapter = new CheckoutPaymentAdapter(quotation);
  const checkoutData = adapter.toPaymentCheckoutData(Number(userId));

  let checkoutUrl: string;

  try {
    // Validate the checkout data against the Zod schema before sending to Stripe
    const validatedStripeCheckoutData = checkoutDataSchema.parse(checkoutData);
    // Call the StripeService to create a checkout session
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
