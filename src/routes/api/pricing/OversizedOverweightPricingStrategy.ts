import type { PricingStrategy } from "./PricingStrategy";
import { geocodingService } from "$lib/config/GeocodingConfig";

export class OversizedOverweightPricingStrategy implements PricingStrategy {
  async calculatePrice(
    originCoords: { lat: number; lng: number },
    destCoords: { lat: number; lng: number },
    dimensions: {
      depth: number;
      width: number;
      height: number;
      weight: number;
    },
  ): Promise<number> {
    const baseRate = 2000; // $20.00 base rate for oversized/overweight
    const volumeMultiplier = 0.02;
    const weightMultiplier = 200;

    // Calculate distance between origin and destination
    let distance = await geocodingService.calculateDistance(
      originCoords.lat,
      originCoords.lng,
      destCoords.lat,
      destCoords.lng,
    );
    distance = distance / 1000; // Convert distance from meters to kilometers

    const distanceFee = distance * 0.075; // Example: $0.00075 per km

    const volume = dimensions.depth * dimensions.width * dimensions.height;
    const weightFee = dimensions.weight * weightMultiplier;
    const volumeFee = volume * volumeMultiplier;

    return baseRate + weightFee + volumeFee + distanceFee;
  }
}
