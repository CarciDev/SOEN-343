import cryptoRandomString from "crypto-random-string";
import type { TransactionType } from "./TransactionType";

export class ShipmentTransaction {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  trackingNumber: string;
  quotationId: number;
  transactionType: TransactionType;
  transactionDetail?: string;
  shipperId: number;

  static generateTrackingNumber() {
    return cryptoRandomString({ length: 12, type: "numeric" });
  }

  constructor(params: {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    trackingNumber?: string;
    quotationId: number;
    transactionType: TransactionType;
    transactionDetail?: string;
    shipperId: number;
  }) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.trackingNumber =
      params.trackingNumber ?? ShipmentTransaction.generateTrackingNumber();
    this.quotationId = params.quotationId;
    this.transactionType = params.transactionType;
    this.transactionDetail = params.transactionDetail;
    this.shipperId = params.shipperId;
  }
}
