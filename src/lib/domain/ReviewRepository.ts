import { prisma } from "$lib/db/client";
import { Review } from "./Review";

export class ReviewRepository {
  static async save(review: Review): Promise<Review> {
    const dataFields = {
      userId: review.userId,
      rating: review.rating,
      deliveryRating: review.deliveryRating,
      wasDeliveryOnTime: review.wasDeliveryOnTime,
      comment: review.comment ?? undefined, // Normalize null to undefined
      transactionId: review.transactionId,
    };

    const savedReview = await prisma.review.upsert({
      where: { transactionId: review.transactionId },
      update: dataFields,
      create: dataFields,
    });

    review.id = savedReview.id;
    review.createdAt = savedReview.createdAt;
    review.updatedAt = savedReview.updatedAt;

    return review;
  }

  static async findById(id: number): Promise<Review | null> {
    const dbResult = await prisma.review.findUnique({
      where: { id },
    });

    if (dbResult) {
      return new Review({
        id: dbResult.id,
        createdAt: dbResult.createdAt,
        updatedAt: dbResult.updatedAt,
        userId: dbResult.userId,
        rating: dbResult.rating,
        deliveryRating: dbResult.deliveryRating,
        wasDeliveryOnTime: dbResult.wasDeliveryOnTime,
        comment: dbResult.comment,
        transactionId: dbResult.transactionId,
      });
    }
    return null;
  }

  static async findByTransactionId(
    transactionId: number,
  ): Promise<Review | null> {
    const dbResult = await prisma.review.findUnique({
      where: { transactionId },
    });

    if (dbResult) {
      return new Review({
        id: dbResult.id,
        createdAt: dbResult.createdAt,
        updatedAt: dbResult.updatedAt,
        userId: dbResult.userId,
        rating: dbResult.rating,
        deliveryRating: dbResult.deliveryRating,
        wasDeliveryOnTime: dbResult.wasDeliveryOnTime,
        comment: dbResult.comment,
        transactionId: dbResult.transactionId,
      });
    }
    return null;
  }

  static async findByUserId(userId: number): Promise<Review[]> {
    const dbResults = await prisma.review.findMany({
      where: { userId },
    });

    return dbResults.map(
      (dbResult) =>
        new Review({
          id: dbResult.id,
          createdAt: dbResult.createdAt,
          updatedAt: dbResult.updatedAt,
          userId: dbResult.userId,
          rating: dbResult.rating,
          deliveryRating: dbResult.deliveryRating,
          wasDeliveryOnTime: dbResult.wasDeliveryOnTime,
          comment: dbResult.comment,
          transactionId: dbResult.transactionId,
        }),
    );
  }
}
