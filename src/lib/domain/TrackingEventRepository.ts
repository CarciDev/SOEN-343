import { prisma } from "$lib/db/client";
import { TrackingEvent } from "./TrackingEvent";

export class TrackingEventRepository {
  static async save(trackingEvent: TrackingEvent) {
    const dataFields = {
      type: trackingEvent.type,
      locationId: trackingEvent.locationId,
      shipmentTransactionId: trackingEvent.shipmentTransactionId,
    };

    const savedTrackingEvent = await prisma.trackingEvent.upsert({
      where: { id: trackingEvent.id },
      update: dataFields,
      create: dataFields,
    });

    trackingEvent.id = savedTrackingEvent.id;
    trackingEvent.createdAt = savedTrackingEvent.createdAt;
    trackingEvent.updatedAt = savedTrackingEvent.updatedAt;
  }

  static async findById(id: number): Promise<TrackingEvent | null> {
    const dbResult = await prisma.trackingEvent.findUnique({
      where: { id: id },
    });
    if (dbResult) {
      return new TrackingEvent(dbResult);
    }
    return null;
  }

  static async findByShipmentTransactionId(
    shipmentTransactionId: number,
  ): Promise<TrackingEvent[] | null> {
    const shipment = await prisma.shipmentTransaction.findUnique({
      select: { trackingEvents: true },
      where: { id: shipmentTransactionId },
    });
    if (shipment) {
      const trackingEvents: TrackingEvent[] = [];
      for (const result of shipment.trackingEvents) {
        trackingEvents.push(new TrackingEvent(result));
      }
      return trackingEvents;
    }
    return null;
  }
}
