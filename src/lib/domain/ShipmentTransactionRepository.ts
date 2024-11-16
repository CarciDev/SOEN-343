import { prisma } from "$lib/db/client";
import { ShipmentTransaction } from "./ShipmentTransaction";

export class ShipmentTransactionRepository {
  static async save(shipmentTransaction: ShipmentTransaction) {
    // Fetch the Quotation to ensure it exists and get the originId
    const quotation = await prisma.quotation.findUnique({
      where: { id: shipmentTransaction.quotationId },
      select: { originId: true }, // Only select the originId to use as the locationId
    });

    if (!quotation) {
      throw new Error(
        `Quotation with id ${shipmentTransaction.quotationId} does not exist.`,
      );
    }

    const dataFields = {
      trackingNumber: shipmentTransaction.trackingNumber,
      quotationId: shipmentTransaction.quotationId,
      transactionType: shipmentTransaction.transactionType,
      transactionDetail: shipmentTransaction.transactionDetail,
      shipperId: shipmentTransaction.shipperId,
    };

    const savedTransaction = await prisma.shipmentTransaction.upsert({
      where: {
        trackingNumber: shipmentTransaction.trackingNumber || undefined,
      },
      update: dataFields,
      create: dataFields,
    });

    shipmentTransaction.id = savedTransaction.id;
    shipmentTransaction.createdAt = savedTransaction.createdAt;
    shipmentTransaction.updatedAt = savedTransaction.updatedAt;

    // Create an initial `TrackingEvent` using the Quotation + ShipmentTransaction ID.
    await prisma.trackingEvent.create({
      data: {
        type: "PICKED_UP_AT_ORIGIN",
        locationId: quotation.originId,
        shipmentTransactionId: savedTransaction.id,
      },
    });
  }

  static async findById(id: number): Promise<ShipmentTransaction | null> {
    const dbResult = await prisma.shipmentTransaction.findUnique({
      where: { id: id },
    });
    if (dbResult) {
      return new ShipmentTransaction({
        id: dbResult.id,
        createdAt: dbResult.createdAt,
        updatedAt: dbResult.updatedAt,
        trackingNumber: dbResult.trackingNumber,
        quotationId: dbResult.quotationId,
        transactionType: dbResult.transactionType,
        transactionDetail: dbResult.transactionDetail
          ? dbResult.transactionDetail
          : undefined,
        shipperId: dbResult.shipperId,
      });
    }
    return null;
  }

  static async findByTrackingNumber(
    trackingNumber: string,
  ): Promise<ShipmentTransaction | null> {
    // Piggyback off object-build in find by id
    const dbResult = await prisma.shipmentTransaction.findUnique({
      select: { id: true },
      where: { trackingNumber: trackingNumber },
    });
    if (dbResult) return await this.findById(dbResult.id);
    return null;
  }

  static async findByShipperId(id: number): Promise<ShipmentTransaction[]> {
    const dbResult = await prisma.shipmentTransaction.findMany({
      select: { id: true },
      where: { shipperId: id },
    });
    if (dbResult) {
      const returnData: ShipmentTransaction[] = [];
      for (const resultItem of dbResult) {
        if (!resultItem.id) continue;
        const shipmentTransaction = await this.findById(resultItem.id);
        if (shipmentTransaction) returnData.push(shipmentTransaction);
      }
      return returnData;
    }
    return [];
  }
}
