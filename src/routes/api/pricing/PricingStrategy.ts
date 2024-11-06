
export interface PricingStrategy {
    calculatePrice(
      originCoords: { lat: number; lng: number },
      destCoords: { lat: number; lng: number },
      dimensions: { length: number; width: number; height: number; weight: number },
      originCountryCode: string,
      destinationCountryCode: string
    ): Promise<number>;
  }