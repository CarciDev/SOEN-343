import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { TrackingStatus, UserRole } from "@prisma/client";
import { ShipmentTransactionRepository } from "$lib/domain/ShipmentTransactionRepository";
import { TrackingEventRepository } from "$lib/domain/TrackingEventRepository";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || locals.user.role !== UserRole.ADMIN) {
    return error(401, "Only Admins can access this page.");
  }

  const totalPackages30Days =
    await ShipmentTransactionRepository.getTotalPackages(30);
  const totalRevenue30Days =
    await ShipmentTransactionRepository.getTotalRevenue(30);

  // Get all the packages in 30 days and figure out % delivered, % not picked up
  // at origin, % in system.
  const allPackagesLast30Days =
    await ShipmentTransactionRepository.findByCreatedSince(30);
  let deliveredCount = 0;
  let notPickedUpCount = 0;
  let inSystemCount = 0;
  for (const transaction of allPackagesLast30Days) {
    if (!transaction.id) continue;
    const trackingEvents =
      await TrackingEventRepository.findByShipmentTransactionId(
        transaction.id!,
      );
    if (!trackingEvents || trackingEvents.length == 0) {
      notPickedUpCount++;
      continue;
    }
    if (trackingEvents.find((e) => e.type === TrackingStatus.DELIVERED)) {
      deliveredCount++;
      continue;
    }
    inSystemCount++;
  }
  const totalCount = deliveredCount + notPickedUpCount + inSystemCount;

  const dailyCountData =
    await ShipmentTransactionRepository.getDailyPackageCount(30);
  const dailyRevenueData =
    await ShipmentTransactionRepository.getDailyRevenue(30);
};
