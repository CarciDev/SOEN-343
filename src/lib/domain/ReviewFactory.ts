import { Review } from "./Review";

export class ReviewFactory {
  static create(params: {
    userId: number;
    rating: number;
    deliveryRating: number;
    wasDeliveryOnTime: boolean;
    comment?: string;
    transactionId: number;
  }): Review {
    return new Review({
      userId: params.userId,
      rating: params.rating,
      deliveryRating: params.deliveryRating,
      wasDeliveryOnTime: params.wasDeliveryOnTime,
      comment: params.comment ?? undefined,
      transactionId: params.transactionId,
    });
  }
}
