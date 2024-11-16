import { ShipmentTransaction } from "./ShipmentTransaction";
import type { TransactionType } from "./TransactionType";

export class ShipmentTransactionFactory {
  static create(params: {
    id?: number;
    quotationId: number;
    transactionType: TransactionType;
    transactionDetail?: string;
    shipperId: number;
    trackingNumber?: string;
  }): ShipmentTransaction {
    return new ShipmentTransaction({
      quotationId: params.quotationId,
      transactionType: params.transactionType,
      transactionDetail: params.transactionDetail,
      shipperId: params.shipperId,
      trackingNumber:
        params.trackingNumber || ShipmentTransaction.generateTrackingNumber(),
    });
  }

  static createWithStripeTransactionType(params: {
    quotationId: number;
    shipperId: number;
    transactionDetail?: string;
  }): ShipmentTransaction {
    const stripeTransactionType: TransactionType = "STRIPE";

    return this.create({
      quotationId: params.quotationId,
      transactionType: stripeTransactionType,
      transactionDetail: params.transactionDetail,
      shipperId: params.shipperId,
    });
  }
}
