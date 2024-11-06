
import { geocodingService } from "$lib/config/GeocodingConfig";

export async function _calculatePrice(
  originCoords: { lat: number; lng: number },
  destCoords: { lat: number; lng: number },
  dimensions: { length: number; width: number; height: number; weight: number },
  originCountryCode: string,
  destinationCountryCode: string,

): Promise<number> {
  const baseRate = 1000; // $10.00 base rate
  const volumeMultiplier = 0.01;
  const weightMultiplier = 100;
  //Calculate distance between origin and destination
  const distance =await geocodingService.calculateDistance(
    originCoords.lat,
    originCoords.lng,
    destCoords.lat,
    destCoords.lng,
  );
  //if shipping to a different country, add an additional fee
  const internationalFee = originCountryCode !== destinationCountryCode ? 500 : 0; 
  //if box is too big, add additional fee
  const volume = dimensions.length * dimensions.width * dimensions.height;
  const volumeFee = volume > 100000 ? volumeMultiplier * volume : 0;
  //if box is too heavy, add additional fee
  const weightFee = dimensions.weight > 100 ? weightMultiplier * dimensions.weight : 0;
  //calculate total cost (this formula is fucked)
  const totalCost = baseRate + internationalFee + volumeFee + weightFee;
  return totalCost;
}
