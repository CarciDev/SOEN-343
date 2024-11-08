import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type Stripe from "stripe";
import { stripe } from "$lib/server/stripeService";
import { ShipmentTransactionFactory } from "$lib/domain/ShipmentTransactionFactory";
import { ShipmentTransactionRepository } from "$lib/domain/ShipmentTransactionRepository";
import { toBuffer } from "$lib/utils";

export const POST: RequestHandler = async ({ request }) => {
  // Check if Stripe is initialized
  if (!stripe) {
    console.warn(
      "Stripe is not initialized. Returning a success response anyways for Stripe.",
    );
    return json({ success: true }, { status: 200 });
  }

  // the stripe-signature header to ensure requests are coming from Stripe, not another 3rd party.
  const stripeSignature = request.headers.get("stripe-signature");

  // If the signature IS missing, just return a HTTP 401 code.
  if (!stripeSignature) {
    return json("Unauthorized", { status: 401 });
  }

  const _rawBody = await request.arrayBuffer(); // Get the raw request body
  // Converting the body ensures that the raw binary data format matches Stripe’s expectations / SDK functions.
  const payload = toBuffer(_rawBody);

  const endpointSecret = process.env.STRIPE_SIGNING_SECRET;
  if (!endpointSecret) {
    console.warn(
      "Missing Stripe endpoint secret. Returning a success response anyways for Stripe.",
    );
    return json({ success: true }, { status: 200 });
  }

  let stripeEvent: Stripe.DiscriminatedEvent;

  try {
    // Verify the Stripe event using the secret, signature, and payload / request body
    stripeEvent = stripe.webhooks.constructEvent(
      payload,
      stripeSignature,
      endpointSecret,
    ) as Stripe.DiscriminatedEvent;
  } catch (e) {
    return json("Invalid signature", { status: 401 });
  }

  try {
    switch (
      stripeEvent.type // the only event our webhook cares about right now is checkout.session.completed
    ) {
      case "checkout.session.completed":
        // We've reached the point where customer has paid for their order,
        // and now by listening for that event we can create a corresponding ShipmentTransaction.
        console.log("Checkout session completed", stripeEvent);

        const sessionWithCustomer = await stripe.checkout.sessions.retrieve(
          stripeEvent.data.object.id,
        );

        if (sessionWithCustomer.metadata) {
          const quotationId = Number(sessionWithCustomer.metadata.quotation_id);
          const shipperId = Number(sessionWithCustomer.metadata.shipper_id);

          // Create a ShipmentTransaction with the GOF Factory pattern for the Stripe transaction
          const StripeShipmentTransaction =
            ShipmentTransactionFactory.createWithStripeTransactionType({
              quotationId: quotationId,
              transactionDetail: "", // Include transaction details eventually, ex. Stripe invoice details.
              shipperId: shipperId,
            });

          // for the time being, please seed some quotation objects for this to work.
          // just a temporary fix until the quotation objects themselves are passed to checkout,
          // rather than dummy object parameters.
          await ShipmentTransactionRepository.save(StripeShipmentTransaction);
        }

        break;
      default:
        console.warn(`Unhandled event type: ${stripeEvent.type}`);
        return json({ success: true }, { status: 200 });
    }
    // For more information, see the Stripe Docs on Webhook Events: https://stripe.com/docs/webhooks/stripe-events
    // ... and the Stripe API docs on event types we can work with: https://docs.stripe.com/api/events/types
  } catch (e) {
    console.log(e);
    return json(`Error processing event ${stripeEvent.type}`, { status: 500 });
  }

  return json({ success: true }, { status: 200 }); // Stripe expects a 200 response code.
};
