import type{ PricingStrategy } from './PricingStrategy';
import { geocodingService } from "$lib/config/GeocodingConfig";

export class InternationalPricingStrategy implements PricingStrategy {
  async calculatePrice(
    originCoords: { lat: number; lng: number },
    destCoords: { lat: number; lng: number },
    dimensions: { depth: number; width: number; height: number; weight: number },
    originCountryCode: string,
    destinationCountryCode: string
  ): Promise<number> {
    const baseRate = 1500; // $15.00 base rate for international
    const volumeMultiplier = 0.015;
    const weightMultiplier = 150;
    const internationalFee = 500; // Additional fee for international shipping

    // Calculate distance between origin and destination
    let distance = await geocodingService.calculateDistance(
      originCoords.lat,
      originCoords.lng,
      destCoords.lat,
      destCoords.lng
    );
    distance = distance/1000; // Convert distance from meters to kilometers

    const distanceFee = distance * .060; // Example: $0.00060 per km

    const volume = dimensions.depth * dimensions.width * dimensions.height;
    const weightFee = dimensions.weight * weightMultiplier;
    const volumeFee = volume * volumeMultiplier;

    return baseRate + weightFee + volumeFee + distanceFee + internationalFee;
  }
}