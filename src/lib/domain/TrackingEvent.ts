import type { TrackingStatus } from "./TrackingStatus";

export class TrackingEvent {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  type: TrackingStatus;
  locationId: number;
  shipmentTransactionId: number;

  constructor(params: {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    type: TrackingStatus;
    locationId: number;
    shipmentTransactionId: number;
  }) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.type = params.type;
    this.locationId = params.locationId;
    this.shipmentTransactionId = params.shipmentTransactionId;
  }
}
