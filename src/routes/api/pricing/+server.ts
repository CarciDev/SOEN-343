import { PricingContext } from './PricingContext';

const pricingContext = new PricingContext();

export async function _calculatePrice(
  originCoords: { lat: number; lng: number },
  destCoords: { lat: number; lng: number },
  dimensions: { length: number; width: number; height: number; weight: number },
  originCountryCode: string,
  destinationCountryCode: string
): Promise<number> {
  return pricingContext.calculatePrice(originCoords, destCoords, dimensions, originCountryCode, destinationCountryCode);
}