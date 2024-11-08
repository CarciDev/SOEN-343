
export interface PricingStrategy {
    calculatePrice(
      originCoords: { lat: number; lng: number },
      destCoords: { lat: number; lng: number },
      dimensions: { depth: number; width: number; height: number; weight: number },
      originCountryCode: string,
      destinationCountryCode: string
    ): Promise<number>;
  }