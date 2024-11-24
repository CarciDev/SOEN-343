import { prisma } from "$lib/db/client";
import { TrackingEvent } from "./TrackingEvent";
import type { TrackingStatus } from "./TrackingStatus";

export class TrackingEventRepository {
  static async save(trackingEvent: TrackingEvent) {
    const dataFields = {
      type: trackingEvent.type,
      locationId: trackingEvent.locationId,
      shipmentTransactionId: trackingEvent.shipmentTransactionId,
    };

    let savedTrackingEvent;
    if (trackingEvent.id) {
      savedTrackingEvent = await prisma.trackingEvent.upsert({
        where: { id: trackingEvent.id },
        update: dataFields,
        create: dataFields,
      });
    } else {
      savedTrackingEvent = await prisma.trackingEvent.create({
        data: dataFields,
      });
    }

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

  static formatTrackingStatus(ts: TrackingStatus | string): string {
    switch (ts) {
      case "PICKED_UP_AT_ORIGIN":
        return "Picked up at origin";
      case "FACILITY_TRANSIT":
        return "Transit through facility";
      case "OUT_FOR_DELIVERY":
        return "On delivery vehicle";
      case "DELIVERED":
        return "Delivered";
      default:
        return "Other status";
    }
  }
}
