import { error, fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { TrackingStatus, UserRole } from "@prisma/client";
import { z } from "zod";
import { ShipmentTransactionRepository } from "$lib/domain/ShipmentTransactionRepository";
import { TrackingEvent } from "$lib/domain/TrackingEvent";
import { EarthLocationRepository } from "$lib/domain/EarthLocationRepository";
import { QuotationRepository } from "$lib/domain/QuotationRepository";
import { EarthLocation } from "$lib/domain/EarthLocation";
import { TrackingEventRepository } from "$lib/domain/TrackingEventRepository";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || locals.user.role !== UserRole.ADMIN) {
    return error(401, "Only Admins can access this page.");
  }
};

const UpdateTrackingSchema = z.object({
  trackingNumber: z.string(),
  status: z.nativeEnum(TrackingStatus),
  locationInputType: z.enum(["origin", "destination", "input"]),
  coords: z.string().optional(),
});

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const result = UpdateTrackingSchema.safeParse(Object.fromEntries(formData));
    if (!result.success)
      return fail(400, { errorMessage: "Invalid form data" });

    // Get the transaction
    const transaction =
      await ShipmentTransactionRepository.findByTrackingNumber(
        result.data?.trackingNumber,
      );
    if (!transaction || !transaction.id)
      return fail(400, { errorMessage: "Transaction not found" });
    const quotation = await QuotationRepository.findById(transaction.id);
    if (!quotation || !quotation.id)
      return fail(400, { errorMessage: "Inconsistent transaction" });

    // Get the location
    let location;
    if (result.data?.locationInputType === "origin") {
      location = await EarthLocationRepository.findById(quotation.originId);
    } else if (result.data?.locationInputType === "destination") {
      location = await EarthLocationRepository.findById(
        quotation.destinationId,
      );
    } else {
      const splitCoords = result.data?.coords?.split(",");
      if (!splitCoords || splitCoords.length !== 2)
        return fail(400, { errorMessage: "Invalid coordinates" });
      location = new EarthLocation({
        lat: Number(splitCoords[0]),
        lng: Number(splitCoords[1]),
      });
      await EarthLocationRepository.save(location);
    }
    if (!location || !location.id)
      return fail(400, { errorMessage: "Could not save location to db" });

    // Create a new tracking event
    const trackingEvent = new TrackingEvent({
      type: result.data?.status,
      locationId: location.id,
      shipmentTransactionId: transaction.id,
    });
    await TrackingEventRepository.save(trackingEvent);
    return redirect(302, `/track/${transaction.trackingNumber}`);
  },
};
