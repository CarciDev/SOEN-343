export class Review {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  userId: number;
  rating: number;
  deliveryRating: number;
  wasDeliveryOnTime: boolean;
  comment?: string;
  transactionId: number;

  constructor(params: {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    userId: number;
    rating: number;
    deliveryRating: number;
    wasDeliveryOnTime: boolean;
    comment?: string | null;
    transactionId: number;
  }) {
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.userId = params.userId;
    this.rating = params.rating;
    this.deliveryRating = params.deliveryRating;
    this.wasDeliveryOnTime = params.wasDeliveryOnTime;
    this.comment = params.comment ?? undefined;
    this.transactionId = params.transactionId;
  }
}
