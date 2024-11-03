import { prisma } from "$lib/db/client";
import { ShipmentTransaction } from "./ShipmentTransaction";

export class ShipmentTransactionRepository {
  static async save(shipmentTransaction: ShipmentTransaction) {
    const dataFields = {
      trackingNumber: shipmentTransaction.trackingNumber,
      quotationId: shipmentTransaction.quotationId,
      transactionType: shipmentTransaction.transactionType,
      transactionDetail: shipmentTransaction.transactionDetail,
      shipperId: shipmentTransaction.shipperId,
    };

    const savedTransaction = await prisma.shipmentTransaction.upsert({
      where: { id: shipmentTransaction.id },
      update: dataFields,
      create: dataFields,
    });

    shipmentTransaction.id = savedTransaction.id;
    shipmentTransaction.createdAt = savedTransaction.createdAt;
    shipmentTransaction.updatedAt = savedTransaction.updatedAt;
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
    // Piggy back of object-build in find by id
    const dbResult = await prisma.shipmentTransaction.findUnique({
      select: { id: true },
      where: { trackingNumber: trackingNumber },
    });
    if (dbResult) return await this.findById(dbResult.id);
    return null;
  }
}
