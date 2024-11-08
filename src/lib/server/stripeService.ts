import Stripe from "stripe";
import { getEnvVar } from "./env";
import type { CheckoutData } from "$lib/domain/CheckoutPaymentAdapter";

export const stripe = new Stripe(getEnvVar("STRIPE_SECRET_KEY"), {
  apiVersion: "2024-10-28.acacia",
  // Major Stripe API releases introduce non-backwards-compatible changes.
  // Read more: https://docs.stripe.com/api/versioning
});

/**
 * Creates a Stripe Checkout session for an adapted quotation payment.
 *
 * @param {CheckoutData} checkoutData - The data required to create the checkout session.
 * @returns {Promise<string>} - The URL for the Stripe Checkout session.
 * @throws {Error} - Throws an error if the checkout session URL is not created.
 */
export async function createQuotationCheckoutSession(
  checkoutData: CheckoutData,
) {
  const checkoutSession = await stripe.checkout.sessions.create({
    //@ts-ignore
    payment_method_types: ["card"], // Explicitly setting the payment method to 'card'

    mode: "payment", // 'payment' mode is for one-time payments, suitable for this use case
    allow_promotion_codes: true, // Allow customers to apply promotion codes if available

    line_items: [
      {
        // Stripe incorporates a subordinate object creation design pattern (indicated by '_data').
        // This means you can create a new/variable price object ad hoc, rather than use fixed prices.
        price_data: {
          unit_amount: checkoutData.checkout_price_cents,
          currency: "cad",

          product_data: {
            name: checkoutData.checkout_name,
            description: checkoutData.checkout_description,
          },
          // Like price_data, we'll make use of the product_data attribute to create a product on the fly.
        },
        quantity: 1,
      },
    ],

    // Pass metadata for quotation tracking, retrievable from Stripe's webhook events
    metadata: {
      shipper_id: checkoutData.checkout_metadata.shipper_id,
      quotation_id: checkoutData.checkout_metadata.quotation_id,
    },

    // URLs for redirecting the user after a successful or canceled payment
    success_url: `${process.env.PUBLIC_BASE_URL}/dashboard`,
    cancel_url: `${process.env.PUBLIC_BASE_URL}/`,
  });

  if (!checkoutSession.url) {
    throw new Error("Error creating checkout session");
  }

  return checkoutSession.url; // Return the checkout session URL for redirecting the user
}
