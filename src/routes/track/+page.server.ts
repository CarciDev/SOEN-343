import { QuotationRepository } from "$lib/domain/QuotationRepository";
import { ShipmentTransactionRepository } from "$lib/domain/ShipmentTransactionRepository";
import { TrackingEventRepository } from "$lib/domain/TrackingEventRepository";
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const trackingOverview: {
    trackingNumber: string;
    lastUpdated: Date | undefined;
    eta: Date | undefined;
    status: string;
  }[] = [];

  if (locals.user) {
    const shipmentTransactions =
      await ShipmentTransactionRepository.findByShipperId(locals.user.id);

    for (const transaction of shipmentTransactions) {
      const trackingEvents =
        await TrackingEventRepository.findByShipmentTransactionId(
          transaction.id!,
        );

      // Sort oldest to newest (if my logic is right)
      trackingEvents?.sort(
        (a, b) => b.createdAt!.getDate() - a.createdAt!.getDate(),
      );

      // Find the last event's createdAt
      let lastUpdated: Date | undefined;
      let status = "Not yet picked up";
      if (trackingEvents && trackingEvents.length > 0) {
        const lastEvent = trackingEvents.findLast(() => true);
        lastUpdated = lastEvent?.createdAt;
        status = lastEvent
          ? TrackingEventRepository.formatTrackingStatus(lastEvent.type)
          : "Not yet picked up";
      }

      // Find the pickup date and ETA
      const pickupEvents = trackingEvents?.filter(
        (e) => e.type === "PICKED_UP_AT_ORIGIN",
      );
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

      trackingOverview.push({
        trackingNumber: transaction.trackingNumber,
        lastUpdated: lastUpdated,
        status: status,
        eta: eta,
      });
    }
  }

  return {
    user: locals.user,
    overview: trackingOverview,
  };
};

export const actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const searchTrackingNumber = formData.get("searchTrackingNumber");
    return redirect(302, `/track/${searchTrackingNumber}`);
  },
} satisfies Actions;
