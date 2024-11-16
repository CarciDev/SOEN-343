import { ShipmentTransactionRepository } from "$lib/domain/ShipmentTransactionRepository";
import { TrackingEventRepository } from "$lib/domain/TrackingEventRepository";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { EarthLocationRepository } from "$lib/domain/EarthLocationRepository";
import { QuotationRepository } from "$lib/domain/QuotationRepository";
import type { EarthLocation } from "$lib/domain/EarthLocation";
import type { TrackingEvent } from "$lib/domain/TrackingEvent";

export const load: PageServerLoad = async ({ params, locals }) => {
  const transaction = await ShipmentTransactionRepository.findByTrackingNumber(
    params.trackingNumber,
  );

  if (!transaction) error(404, "Parcel not found");

  console.log(params.trackingNumber);

  const quotation = await QuotationRepository.findById(transaction.id!);

  console.log(quotation);

  const origin = await EarthLocationRepository.findById(quotation!.originId);
  const destination = await EarthLocationRepository.findById(
    quotation!.destinationId,
  );

  const events: (TrackingEvent & { location?: EarthLocation })[] =
    (await TrackingEventRepository.findByShipmentTransactionId(
      transaction.id!,
    )) || [];
  events.sort((a, b) => b.createdAt!.getDate() - a.createdAt!.getDate());

  // Resolve the locations for each tracking event, in order, and attach it to the
  // event
  for (const event of events) {
    const location = await EarthLocationRepository.findById(event.locationId);
    if (location) event.location = location;
  }

  // Find the pickup date and ETA
  const pickupEvents = events.filter((e) => e.type === "PICKED_UP_AT_ORIGIN");
  let eta: Date | undefined;
  if (pickupEvents && pickupEvents.length > 0) {
    const quotation = await QuotationRepository.findById(
      transaction.quotationId,
    );
    if (quotation) {
      eta = new Date(pickupEvents[0].createdAt!.valueOf());
      eta.setDate(eta.getDate() + quotation.etaDays);
    }
  }

  return {
    user: locals.user,
    // Can only return POJO
    transaction: structuredClone(transaction),
    quotation: structuredClone(quotation),
    origin: structuredClone(origin),
    destination: structuredClone(destination),
    events: structuredClone(events),
    eta: eta,
  };
};
