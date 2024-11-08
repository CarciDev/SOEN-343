import Stripe from "stripe";
import type { CheckoutData } from "$lib/domain/CheckoutPaymentAdapter";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2024-10-28.acacia",
    })
  : null;

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
  try {
    // Ensure Stripe is initialized before attempting to create a session
    if (!stripe) {
      console.warn("Stripe is not initialized. Redirecting to the homepage.");
      return `${process.env.PUBLIC_BASE_URL}/`; // Redirect to the homepage
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      //@ts-expect-error
      payment_method_types: ["card"],
      mode: "payment",
      allow_promotion_codes: true,

      line_items: [
        {
          price_data: {
            unit_amount: checkoutData.checkout_price_cents,
            currency: "cad",
            product_data: {
              name: checkoutData.checkout_name,
              description: checkoutData.checkout_description,
            },
          },
          quantity: 1,
        },
      ],

      metadata: {
        shipper_id: checkoutData.checkout_metadata.shipper_id,
        quotation_id: checkoutData.checkout_metadata.quotation_id,
      },

      success_url: `${process.env.PUBLIC_BASE_URL}/dashboard`,
      cancel_url: `${process.env.PUBLIC_BASE_URL}/`,
    });

    if (!checkoutSession.url) {
      console.warn(
        "Failed to create a checkout session URL. Redirecting to the homepage.",
      );
      return `${process.env.PUBLIC_BASE_URL}/`; // Redirect to the homepage
    }

    return checkoutSession.url;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return `${process.env.PUBLIC_BASE_URL}/`; // Redirect to the homepage on error
  }
}
