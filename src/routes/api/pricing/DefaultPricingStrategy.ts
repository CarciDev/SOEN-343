import type { PricingStrategy } from './PricingStrategy';
import { geocodingService } from "$lib/config/GeocodingConfig";

export class DefaultPricingStrategy implements PricingStrategy {
  async calculatePrice(
    originCoords: { lat: number; lng: number },
    destCoords: { lat: number; lng: number },
    dimensions: { depth: number; width: number; height: number; weight: number },
    originCountryCode: string,
    destinationCountryCode: string
  ): Promise<number> {
    const baseRate = 1000; // $10.00 base rate
    const volumeMultiplier = 0.01;
    const weightMultiplier = 100;

    // Calculate distance between origin and destination
    let distance = await geocodingService.calculateDistance(
      originCoords.lat,
      originCoords.lng,
      destCoords.lat,
      destCoords.lng
    );
    distance = distance/1000; // Convert distance from meters to kilometers

    const distanceFee = distance * .05; //Example: $0.00050 per km

    const volume = dimensions.depth * dimensions.width * dimensions.height;
    const weightFee = dimensions.weight * weightMultiplier;
    const volumeFee = volume * volumeMultiplier;

    return baseRate + weightFee + volumeFee + distanceFee;
  }
}