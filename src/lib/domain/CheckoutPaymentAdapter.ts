import { Quotation } from "./Quotation";
import { z } from "zod";

// Zod Schema for validating the structure of checkout data
export const checkoutDataSchema = z.object({
  checkout_name: z.string().min(1),
  checkout_price_cents: z.number().positive().int(),
  checkout_description: z.string(),
  checkout_metadata: z.record(z.union([z.string(), z.number(), z.undefined()])),
});
// Corresponding TypeScript type for checkoutData Zod Schema
export type CheckoutData = z.infer<typeof checkoutDataSchema>;

// G.O.F Adapter class to bridge the gap between the incompatible Quotation data and Stripe checkout data
export class CheckoutPaymentAdapter {
  private quotation: Quotation;

  constructor(quotation: Quotation) {
    this.quotation = quotation;
  }

  /**
   * Converts the Quotation instance into the CheckoutData format required for Stripe.
   *
   * @param {number} shipperId - The ID of the shipper, to be included in metadata.
   * @returns {CheckoutData} - The data formatted for Stripe checkout.
   * @throws {ZodError} - Throws an error if the resulting data doesn't match the schema.
   */
  public toPaymentCheckoutData(shipperId: number): CheckoutData {
    const paymentData = {
      checkout_name: `Product from Quotation-${this.quotation.id}`,
      checkout_price_cents: this.quotation.amountQuotedCents,
      checkout_description: "Product was created during checkout.",
      checkout_metadata: {
        shipper_id: shipperId,
        quotation_id: this.quotation.id,
      },
    };

    // Validate the payment data against the Zod schema
    checkoutDataSchema.parse(paymentData);

    return paymentData;
  }
}
